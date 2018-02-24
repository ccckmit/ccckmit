## MCU0 的輸出入 -- 輪詢篇

在本文中，我們利用輪詢的方式實作了 MCU0 的鍵盤與文字輸出的函數。

### MCU0 的中斷位元

在電腦中，進行輸出入所採用的方式，在指令上可分為「專用輸出入指令」與「記憶體映射輸出入」兩種，
在本文中我們將用「記憶體映射輸出入」進行輸出入。



另外、進行輸出入的驅動方式，可分為「輪詢」與「中斷」兩種方式，本文將採用「輪詢」的方式實作。

### MCU0 的輸出入實作方式

```verilog
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define SC8  $signed(IR[7:0]) // 常數欄位
`define C4   IR[3:0]   // 常數欄位
`define Ra   IR[7:4]   // Ra
`define Rb   IR[3:0]   // Rb
`define A    R[0]      // 累積器
`define LR   R[1]      // 狀態暫存器
`define SW   R[2]      // 狀態暫存器
`define SP   R[3]      // 堆疊暫存器
`define PC   R[4]      // 程式計數器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標
`define I    `SW[3]    // 是否中斷中
`define M    m[`C]     // 存取記憶體

module mcu(input clock, input interrupt, input[2:0] irq);
  parameter [3:0] LD=4'h0,ST=4'h1,ADD=4'h2,SUB=4'h3,MUL=4'h4,DIV=4'h5,AND=4'h6,OR=4'h7,XOR=4'h8,CMP=4'h9,JMP=4'hA,JEQ=4'hB, JLT=4'hC, JLE=4'hD, CALL=4'hE, OP8=4'hF;
  parameter [3:0] LDI=4'h0, MOV=4'h2, PUSH=4'h3, POP=4'h4, SHL=4'h5, SHR=4'h6, ADDI=4'h7, SUBI=4'h8, NEG=4'h9, SWI=4'hA, NSW=4'hD, RET=4'hE, IRET=4'hF;
  reg [15:0] IR;    // 指令暫存器
  reg signed [15:0] R[0:4];
  reg signed [15:0] pc0;
  reg signed [15:0] m [0:4095]; // 內部的快取記憶體
  integer i;
  initial  // 初始化
  begin
    `PC = 0; // 將 PC 設為起動位址 0
    `SW = 0;
    $readmemh("mcu0io.hex", m);
    for (i=0; i < 32; i=i+1) begin
       $display("%x %x", i, m[i]);
    end
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
    IR = m[`PC];                // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
    pc0= `PC;                   // 儲存舊的 PC 值在 pc0 中。
    `PC = `PC+1;                // 擷取完成，PC 前進到下一個指令位址
    case (`OP)                  // 解碼、根據 OP 執行動作
      LD: `A = `M;              // LD C
      ST: `M = `A;              // ST C
      ADD: `A = `A + `M;        // ADD C
      SUB: `A = `A - `M;        // SUB C
      MUL: `A = `A * `M;        // MUL C
      DIV: `A = `A / `M;        // DIV C
      AND: `A = `A & `M;        // AND C
      OR : `A = `A | `M;        // OR  C
      XOR: `A = `A ^ `M;        // XOR C
      CMP: begin `N=(`A < `M); `Z=(`A==`M); end // CMP C
      JMP: `PC = `C;            // JSUB C
      JEQ: if (`Z) `PC=`C;      // JEQ C
      JLT: if (`N) `PC=`C;      // JLT C
      JLE: if (`N || `Z) `PC=`C;// JLE C
      CALL:begin `LR = `PC; `PC = `C; end // CALL C
      OP8: case (IR[11:8])      // OP8: 加長運算碼
        LDI:  R[`Ra] = `C4;                         // LDI C
        ADDI: R[`Ra] = R[`Ra] + `C4;                // ADDI C
        SUBI: R[`Ra] = R[`Ra] - `C4;                // ADDI C
        MOV:  R[`Ra] = R[`Rb];                      // MOV Ra, Rb
        PUSH: begin `SP=`SP-1; m[`SP] = R[`Ra]; end // PUSH Ra
        POP:  begin R[`Ra] = m[`SP]; `SP=`SP+1; end // POP  Ra
        SHL:  R[`Ra] = R[`Ra] << `C4;               // SHL C
        SHR:  R[`Ra] = R[`Ra] >> `C4;               // SHR C
        SWI:  $display("SWI C8=%d A=%d", `SC8, `A); // SWI C
        NEG:  R[`Ra] = ~R[`Ra];                     // NEG Ra
        NSW:  begin `N=~`N; `Z=~`Z; end             // NSW  (negate N, Z)
        RET:  `PC = `LR;                            // RET
        IRET: begin `PC = `LR; `I = 0; end          // IRET
        default: $display("op8=%d , not defined!", IR[11:8]);
      endcase
    endcase
    // 印出 PC, IR, SW, A 等暫存器值以供觀察
    $display("%4dns PC=%x IR=%x, SW=%x, A=%d SP=%x LR=%x", $stime, pc0, IR, `SW, `A, `SP, `LR);
    if (!`I && interrupt) begin
      `I = 1;
      `LR = `PC;
      `PC = irq;
    end    
  end
endmodule

module keyboard;
reg [7:0] ch[0:20];
reg [7:0] i;
initial begin
  i=0;
  {ch[0],ch[1],ch[2],ch[3],ch[4],ch[5],ch[6],ch[7],ch[8],ch[9],ch[10],ch[11],ch[12],ch[13]} = "hello verilog!";
  main.mcu0.m[16'h07F0] = 0;
  main.mcu0.m[16'h07F1] = 0;
end

always #20 begin 
  if (main.mcu0.m[16'h07F0] == 0) begin
    main.mcu0.m[16'h07F1] = {8'h0, ch[i]};
    main.mcu0.m[16'h07F0] = 1;
    $display("key = %c", ch[i]);
    i = i+1;
  end
end 

endmodule

module screen;
reg [7:0] ch;
initial begin
  main.mcu0.m[16'h07F2] = 0;
  main.mcu0.m[16'h07F3] = 0;
end
always #10 begin
  if (main.mcu0.m[16'h07F2] == 1) begin
    ch = main.mcu0.m[16'h07F3][7:0];
    $display("screen %c", ch);
    main.mcu0.m[16'h07F2] = 0;
  end
end 
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數
reg interrupt;
reg [2:0] irq;

mcu mcu0(clock, interrupt, irq); // 宣告 cpu0mc 處理器
keyboard kb0();
screen   sc0();

initial begin
  clock = 0;          // 一開始 clock 設定為 0
  interrupt = 0;
  irq = 2;
end
always #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns

initial #4000 $finish;      // 停止測試。

endmodule
```

### 輸入機器碼與組合語言

```
07F0  // 00    WAITK:  LD    0x7F0   ; wait keyboard
9010  // 01            CMP   K0
B000  // 02            JEQ   WAIT
07F1  // 03            LD    0x7F1   ; read key
1011  // 04            ST    KEY
0010  // 05            LD    K0
17F0  // 06            ST    0x7F0   ; release keyboard
07F2  // 07    WAITS:  LD    0x7F2   ; wait screen
0010  // 08            CMP   K0
B007  // 09            JEQ   WAITS
0011  // 0A            LD    KEY     ; print key
17F3  // 0B            ST    0x7F3
F001  // 0C            LDI   1
17F2  // 0D            ST    0x7F2   ; eanble screen
A000  // 0E            JMP   WAIT
0000  // 0F
0000  // 10    K0:     WORD  0
0000  // 11    KEY:    WORD  0
```

### 執行結果

```
D:\Dropbox\Public\web\oc\code\mcu0>iverilog -o mcu0io mcu0io.v

D:\Dropbox\Public\web\oc\code\mcu0>vvp mcu0io
WARNING: mcu0io.v:29: $readmemh(mcu0io.hex): Not enough words in the file for th
e requested range [0:4095].
00000000 07f0
00000001 9010
00000002 b000
00000003 07f1
00000004 1011
00000005 0010
00000006 17f0
00000007 07f2
00000008 0010
00000009 b007
0000000a 0011
0000000b 17f3
0000000c f001
0000000d 17f2
0000000e a000
0000000f 0000
00000010 0000
00000011 0000
00000012 xxxx
00000013 xxxx
00000014 xxxx
00000015 xxxx
00000016 xxxx
00000017 xxxx
00000018 xxxx
00000019 xxxx
0000001a xxxx
0000001b xxxx
0000001c xxxx
0000001d xxxx
0000001e xxxx
0000001f xxxx
  10ns PC=0000 IR=07f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = h
  30ns PC=0001 IR=9010, SW=4000, A=    0 SP=xxxx LR=xxxx
  50ns PC=0002 IR=b000, SW=4000, A=    0 SP=xxxx LR=xxxx
  70ns PC=0000 IR=07f0, SW=4000, A=    1 SP=xxxx LR=xxxx
  90ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
 110ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
 130ns PC=0003 IR=07f1, SW=0000, A=  104 SP=xxxx LR=xxxx
 150ns PC=0004 IR=1011, SW=0000, A=  104 SP=xxxx LR=xxxx
 170ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 190ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = e
 210ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
 230ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 250ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
 270ns PC=000a IR=0011, SW=0000, A=  104 SP=xxxx LR=xxxx
 290ns PC=000b IR=17f3, SW=0000, A=  104 SP=xxxx LR=xxxx
 310ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
 330ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen h
 350ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
 370ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
 390ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
 410ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
 430ns PC=0003 IR=07f1, SW=0000, A=  101 SP=xxxx LR=xxxx
 450ns PC=0004 IR=1011, SW=0000, A=  101 SP=xxxx LR=xxxx
 470ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 490ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = l
 510ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
 530ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 550ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
 570ns PC=000a IR=0011, SW=0000, A=  101 SP=xxxx LR=xxxx
 590ns PC=000b IR=17f3, SW=0000, A=  101 SP=xxxx LR=xxxx
 610ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
 630ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen e
 650ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
 670ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
 690ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
 710ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
 730ns PC=0003 IR=07f1, SW=0000, A=  108 SP=xxxx LR=xxxx
 750ns PC=0004 IR=1011, SW=0000, A=  108 SP=xxxx LR=xxxx
 770ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 790ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = l
 810ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
 830ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
 850ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
 870ns PC=000a IR=0011, SW=0000, A=  108 SP=xxxx LR=xxxx
 890ns PC=000b IR=17f3, SW=0000, A=  108 SP=xxxx LR=xxxx
 910ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
 930ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen l
 950ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
 970ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
 990ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
1010ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
1030ns PC=0003 IR=07f1, SW=0000, A=  108 SP=xxxx LR=xxxx
1050ns PC=0004 IR=1011, SW=0000, A=  108 SP=xxxx LR=xxxx
1070ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1090ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = o
1110ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
1130ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1150ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
1170ns PC=000a IR=0011, SW=0000, A=  108 SP=xxxx LR=xxxx
1190ns PC=000b IR=17f3, SW=0000, A=  108 SP=xxxx LR=xxxx
1210ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
1230ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen l
1250ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
1270ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
1290ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
1310ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
1330ns PC=0003 IR=07f1, SW=0000, A=  111 SP=xxxx LR=xxxx
1350ns PC=0004 IR=1011, SW=0000, A=  111 SP=xxxx LR=xxxx
1370ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1390ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key =
1410ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
1430ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1450ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
1470ns PC=000a IR=0011, SW=0000, A=  111 SP=xxxx LR=xxxx
1490ns PC=000b IR=17f3, SW=0000, A=  111 SP=xxxx LR=xxxx
1510ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
1530ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen o
1550ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
1570ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
1590ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
1610ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
1630ns PC=0003 IR=07f1, SW=0000, A=   32 SP=xxxx LR=xxxx
1650ns PC=0004 IR=1011, SW=0000, A=   32 SP=xxxx LR=xxxx
1670ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1690ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = v
1710ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
1730ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1750ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
1770ns PC=000a IR=0011, SW=0000, A=   32 SP=xxxx LR=xxxx
1790ns PC=000b IR=17f3, SW=0000, A=   32 SP=xxxx LR=xxxx
1810ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
1830ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen
1850ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
1870ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
1890ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
1910ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
1930ns PC=0003 IR=07f1, SW=0000, A=  118 SP=xxxx LR=xxxx
1950ns PC=0004 IR=1011, SW=0000, A=  118 SP=xxxx LR=xxxx
1970ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
1990ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = e
2010ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
2030ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2050ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
2070ns PC=000a IR=0011, SW=0000, A=  118 SP=xxxx LR=xxxx
2090ns PC=000b IR=17f3, SW=0000, A=  118 SP=xxxx LR=xxxx
2110ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
2130ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen v
2150ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
2170ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
2190ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
2210ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
2230ns PC=0003 IR=07f1, SW=0000, A=  101 SP=xxxx LR=xxxx
2250ns PC=0004 IR=1011, SW=0000, A=  101 SP=xxxx LR=xxxx
2270ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2290ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = r
2310ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
2330ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2350ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
2370ns PC=000a IR=0011, SW=0000, A=  101 SP=xxxx LR=xxxx
2390ns PC=000b IR=17f3, SW=0000, A=  101 SP=xxxx LR=xxxx
2410ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
2430ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen e
2450ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
2470ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
2490ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
2510ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
2530ns PC=0003 IR=07f1, SW=0000, A=  114 SP=xxxx LR=xxxx
2550ns PC=0004 IR=1011, SW=0000, A=  114 SP=xxxx LR=xxxx
2570ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2590ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = i
2610ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
2630ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2650ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
2670ns PC=000a IR=0011, SW=0000, A=  114 SP=xxxx LR=xxxx
2690ns PC=000b IR=17f3, SW=0000, A=  114 SP=xxxx LR=xxxx
2710ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
2730ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen r
2750ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
2770ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
2790ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
2810ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
2830ns PC=0003 IR=07f1, SW=0000, A=  105 SP=xxxx LR=xxxx
2850ns PC=0004 IR=1011, SW=0000, A=  105 SP=xxxx LR=xxxx
2870ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2890ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = l
2910ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
2930ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
2950ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
2970ns PC=000a IR=0011, SW=0000, A=  105 SP=xxxx LR=xxxx
2990ns PC=000b IR=17f3, SW=0000, A=  105 SP=xxxx LR=xxxx
3010ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
3030ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen i
3050ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
3070ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
3090ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
3110ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
3130ns PC=0003 IR=07f1, SW=0000, A=  108 SP=xxxx LR=xxxx
3150ns PC=0004 IR=1011, SW=0000, A=  108 SP=xxxx LR=xxxx
3170ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3190ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = o
3210ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
3230ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3250ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
3270ns PC=000a IR=0011, SW=0000, A=  108 SP=xxxx LR=xxxx
3290ns PC=000b IR=17f3, SW=0000, A=  108 SP=xxxx LR=xxxx
3310ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
3330ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen l
3350ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
3370ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
3390ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
3410ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
3430ns PC=0003 IR=07f1, SW=0000, A=  111 SP=xxxx LR=xxxx
3450ns PC=0004 IR=1011, SW=0000, A=  111 SP=xxxx LR=xxxx
3470ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3490ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = g
3510ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
3530ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3550ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
3570ns PC=000a IR=0011, SW=0000, A=  111 SP=xxxx LR=xxxx
3590ns PC=000b IR=17f3, SW=0000, A=  111 SP=xxxx LR=xxxx
3610ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
3630ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen o
3650ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
3670ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
3690ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
3710ns PC=0002 IR=b000, SW=0000, A=    1 SP=xxxx LR=xxxx
3730ns PC=0003 IR=07f1, SW=0000, A=  103 SP=xxxx LR=xxxx
3750ns PC=0004 IR=1011, SW=0000, A=  103 SP=xxxx LR=xxxx
3770ns PC=0005 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3790ns PC=0006 IR=17f0, SW=0000, A=    0 SP=xxxx LR=xxxx
key = !
3810ns PC=0007 IR=07f2, SW=0000, A=    0 SP=xxxx LR=xxxx
3830ns PC=0008 IR=0010, SW=0000, A=    0 SP=xxxx LR=xxxx
3850ns PC=0009 IR=b007, SW=0000, A=    0 SP=xxxx LR=xxxx
3870ns PC=000a IR=0011, SW=0000, A=  103 SP=xxxx LR=xxxx
3890ns PC=000b IR=17f3, SW=0000, A=  103 SP=xxxx LR=xxxx
3910ns PC=000c IR=f001, SW=0000, A=    1 SP=xxxx LR=xxxx
3930ns PC=000d IR=17f2, SW=0000, A=    1 SP=xxxx LR=xxxx
screen g
3950ns PC=000e IR=a000, SW=0000, A=    1 SP=xxxx LR=xxxx
3970ns PC=0000 IR=07f0, SW=0000, A=    1 SP=xxxx LR=xxxx
3990ns PC=0001 IR=9010, SW=0000, A=    1 SP=xxxx LR=xxxx
```

### 結語

以上的輸出入方式，並非典型的設計，而是屬於「系統單晶片」(SOC) 的設計方式，因此直接將「鍵盤」與「螢幕」的
輸出入暫存器直接內建在 MCU0 的記憶體之內，這樣的設計會比將「輸出入控制卡」與「CPU」分開的方式更容易一些，
但是由於這種 ASIC 的量產費用昂貴，所以目前還很少有這種設計方式。

不過、就簡單性而言，這樣的設計確實非常簡單，因此符合「開放電腦計畫」的 Keep it Simple and Stupid (KISS) 原則，
所以我們先介紹這樣一個簡易的輸出入設計方式，以便讓讀者能從最簡單的架構入手。 

