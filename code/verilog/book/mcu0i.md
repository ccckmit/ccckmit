## MCU0 的中斷處理

現代的處理器通常會用中斷的方式來處理「輸出入請求」，或者進行「行程切換」，
在本節中我們將透過微控制器 MCU0 來示範中斷的處理方式。

### MCU0 的中斷位元

在 MCU0 中，狀態暫存器裏有個中斷位元，用來代表目前是否正處於中斷狀態中，以下是其定義：

```
`define SW   R[2]      // 狀態暫存器
`define I    `SW[3]    // 是否中斷中
```

當 MCU0 處於中斷狀態時，就無法在接受任何的中斷請求，換言之、MCU0 採用不可重入的中斷機制。

### MCU0 的中斷處理

當中斷 interrupt 發生時，會透過 irq 線路傳入中斷代號，此時 MCU0 會檢查是否已經處於中斷狀態，
如果是則忽略此一中斷請求。否則就會進入中斷狀態，將返回位址記錄到 LR 中，然後執行 PC = irq 指令
跳到中斷位址，開始執行中斷處理程式。其主要程式碼如下所示：

```verilog
module cpu(input clock, input interrupt, input[2:0] irq); 
...
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
    IR = m[`PC];                // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
    pc0= `PC;                   // 儲存舊的 PC 值在 pc0 中。
    `PC = `PC+1;                // 擷取完成，PC 前進到下一個指令位址
    case (`OP)                  // 解碼、根據 OP 執行動作
      LD: `A = `M;              // LD C
      ...
      OP8: case (IR[11:8])      // OP8: 加長運算碼
        ...
        IRET: begin `PC = `LR; `I = 0; end          // IRET
	...
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
```

### 完整的 MCU0 中斷測試程式

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

module cpu(input clock, input interrupt, input[2:0] irq); 
  parameter [3:0] LD=4'h0,ST=4'h1,ADD=4'h2,SUB=4'h3,MUL=4'h4,DIV=4'h5,AND=4'h6,OR=4'h7,XOR=4'h8,CMP=4'h9,JMP=4'hA,JEQ=4'hB, JLT=4'hC, JLE=4'hD, JSUB=4'hE, OP8=4'hF;
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
    $readmemh("mcu0i.hex", m);
    for (i=0; i < 32; i=i+2) begin
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
      JSUB:begin `LR = `PC; `PC = `C; end // JSUB C
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

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數
reg interrupt;
reg [2:0] irq;

cpu cpux(clock, interrupt, irq);            // 宣告 cpu0mc 處理器

initial begin
  clock = 0;          // 一開始 clock 設定為 0
  interrupt = 0;
  irq = 2;
end
always #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns

always #500 begin 
  interrupt=1;
  #30;
  interrupt=0;
end

initial #4000 $finish;      // 停止測試。

endmodule
```

### 輸入機器碼與組合語言

```
A00F  // 00    	       JMP   RESET
A003  // 01    	       JMP   ERROR
A004  // 02    	       JMP   IRQ
A006  // 03    ERROR:  JMP   ERROR
F300  // 04    IRQ:    PUSH  A
F301  // 05            PUSH  LR
F302  // 06            PUSH  SW
001E  // 07            LD    TIMER
F701  // 08            ADDI  1
FA01  // 09            SWI   1
101E  // 0A            ST    TIMER
F402  // 0B            POP   SW
F401  // 0C            POP   LR
F400  // 0D            POP   A
FF00  // 0E            IRET
001F  // 0F    RESET:  LD    STACKEND
F230  // 10            MOV   SP, A
001C  // 11    LOOP:   LD    I
901D  // 12            CMP   N
B01A  // 13            JEQ   EXIT
F701  // 14            ADDI  1
101C  // 15            ST    I
001B  // 16            LD    SUM
201C  // 17            ADD   I
101B  // 18            ST    SUM
A011  // 19            JMP   LOOP
A01A  // 1A    EXIT:   JMP   EXIT
0000  // 1B    SUM:    WORD  0
0000  // 1C    I:      WORD  0
000A  // 1D    N:      WORD  10
0000  // 1E    TIMER:  WORD  0
007F  // 1F    STACKEND: WORD 127
```

### 執行結果

```
D:\Dropbox\Public\web\oc\code\mcu0>iverilog -o mcu0i mcu0i.v

D:\Dropbox\Public\web\oc\code\mcu0>vvp mcu0i
WARNING: mcu0i.v:29: $readmemh(mcu0i.hex): Not enough words in the file for the
requested range [0:4095].
00000000 a00f
00000002 a004
00000004 f300
00000006 f302
00000008 f701
0000000a 101e
0000000c f401
0000000e ff00
00000010 f230
00000012 901d
00000014 f701
00000016 001b
00000018 101b
0000001a a01a
0000001c 0000
0000001e 0000
  10ns PC=0000 IR=a00f, SW=0000, A=    x SP=xxxx LR=xxxx
  30ns PC=000f IR=001f, SW=0000, A=  127 SP=xxxx LR=xxxx
  50ns PC=0010 IR=f230, SW=0000, A=  127 SP=007f LR=xxxx
  70ns PC=0011 IR=001c, SW=0000, A=    0 SP=007f LR=xxxx
  90ns PC=0012 IR=901d, SW=8000, A=    0 SP=007f LR=xxxx
 110ns PC=0013 IR=b01a, SW=8000, A=    0 SP=007f LR=xxxx
 130ns PC=0014 IR=f701, SW=8000, A=    1 SP=007f LR=xxxx
 150ns PC=0015 IR=101c, SW=8000, A=    1 SP=007f LR=xxxx
 170ns PC=0016 IR=001b, SW=8000, A=    0 SP=007f LR=xxxx
 190ns PC=0017 IR=201c, SW=8000, A=    1 SP=007f LR=xxxx
 210ns PC=0018 IR=101b, SW=8000, A=    1 SP=007f LR=xxxx
 230ns PC=0019 IR=a011, SW=8000, A=    1 SP=007f LR=xxxx
 250ns PC=0011 IR=001c, SW=8000, A=    1 SP=007f LR=xxxx
 270ns PC=0012 IR=901d, SW=8000, A=    1 SP=007f LR=xxxx
 290ns PC=0013 IR=b01a, SW=8000, A=    1 SP=007f LR=xxxx
 310ns PC=0014 IR=f701, SW=8000, A=    2 SP=007f LR=xxxx
 330ns PC=0015 IR=101c, SW=8000, A=    2 SP=007f LR=xxxx
 350ns PC=0016 IR=001b, SW=8000, A=    1 SP=007f LR=xxxx
 370ns PC=0017 IR=201c, SW=8000, A=    3 SP=007f LR=xxxx
 390ns PC=0018 IR=101b, SW=8000, A=    3 SP=007f LR=xxxx
 410ns PC=0019 IR=a011, SW=8000, A=    3 SP=007f LR=xxxx
 430ns PC=0011 IR=001c, SW=8000, A=    2 SP=007f LR=xxxx
 450ns PC=0012 IR=901d, SW=8000, A=    2 SP=007f LR=xxxx
 470ns PC=0013 IR=b01a, SW=8000, A=    2 SP=007f LR=xxxx
 490ns PC=0014 IR=f701, SW=8000, A=    3 SP=007f LR=xxxx
 510ns PC=0015 IR=101c, SW=8000, A=    3 SP=007f LR=xxxx
 530ns PC=0002 IR=a004, SW=8008, A=    3 SP=007f LR=0016
 550ns PC=0004 IR=f300, SW=8008, A=    3 SP=007e LR=0016
 570ns PC=0005 IR=f301, SW=8008, A=    3 SP=007d LR=0016
 590ns PC=0006 IR=f302, SW=8008, A=    3 SP=007c LR=0016
 610ns PC=0007 IR=001e, SW=8008, A=    0 SP=007c LR=0016
 630ns PC=0008 IR=f701, SW=8008, A=    1 SP=007c LR=0016
SWI C8=   1 A=    1
 650ns PC=0009 IR=fa01, SW=8008, A=    1 SP=007c LR=0016
 670ns PC=000a IR=101e, SW=8008, A=    1 SP=007c LR=0016
 690ns PC=000b IR=f402, SW=8008, A=    3 SP=007d LR=0016
 710ns PC=000c IR=f401, SW=8008, A=    3 SP=007e LR=0016
 730ns PC=000d IR=f400, SW=8008, A=    3 SP=007f LR=0016
 750ns PC=000e IR=ff00, SW=8000, A=    3 SP=007f LR=0016
 770ns PC=0016 IR=001b, SW=8000, A=    3 SP=007f LR=0016
 790ns PC=0017 IR=201c, SW=8000, A=    6 SP=007f LR=0016
 810ns PC=0018 IR=101b, SW=8000, A=    6 SP=007f LR=0016
 830ns PC=0019 IR=a011, SW=8000, A=    6 SP=007f LR=0016
 850ns PC=0011 IR=001c, SW=8000, A=    3 SP=007f LR=0016
 870ns PC=0012 IR=901d, SW=8000, A=    3 SP=007f LR=0016
 890ns PC=0013 IR=b01a, SW=8000, A=    3 SP=007f LR=0016
 910ns PC=0014 IR=f701, SW=8000, A=    4 SP=007f LR=0016
 930ns PC=0015 IR=101c, SW=8000, A=    4 SP=007f LR=0016
 950ns PC=0016 IR=001b, SW=8000, A=    6 SP=007f LR=0016
 970ns PC=0017 IR=201c, SW=8000, A=   10 SP=007f LR=0016
 990ns PC=0018 IR=101b, SW=8000, A=   10 SP=007f LR=0016
1010ns PC=0019 IR=a011, SW=8000, A=   10 SP=007f LR=0016
1030ns PC=0011 IR=001c, SW=8000, A=    4 SP=007f LR=0016
1050ns PC=0002 IR=a004, SW=8008, A=    4 SP=007f LR=0012
1070ns PC=0004 IR=f300, SW=8008, A=    4 SP=007e LR=0012
1090ns PC=0005 IR=f301, SW=8008, A=    4 SP=007d LR=0012
1110ns PC=0006 IR=f302, SW=8008, A=    4 SP=007c LR=0012
1130ns PC=0007 IR=001e, SW=8008, A=    1 SP=007c LR=0012
1150ns PC=0008 IR=f701, SW=8008, A=    2 SP=007c LR=0012
SWI C8=   1 A=    2
1170ns PC=0009 IR=fa01, SW=8008, A=    2 SP=007c LR=0012
1190ns PC=000a IR=101e, SW=8008, A=    2 SP=007c LR=0012
1210ns PC=000b IR=f402, SW=8008, A=    4 SP=007d LR=0012
1230ns PC=000c IR=f401, SW=8008, A=    4 SP=007e LR=0012
1250ns PC=000d IR=f400, SW=8008, A=    4 SP=007f LR=0012
1270ns PC=000e IR=ff00, SW=8000, A=    4 SP=007f LR=0012
1290ns PC=0012 IR=901d, SW=8000, A=    4 SP=007f LR=0012
1310ns PC=0013 IR=b01a, SW=8000, A=    4 SP=007f LR=0012
1330ns PC=0014 IR=f701, SW=8000, A=    5 SP=007f LR=0012
1350ns PC=0015 IR=101c, SW=8000, A=    5 SP=007f LR=0012
1370ns PC=0016 IR=001b, SW=8000, A=   10 SP=007f LR=0012
1390ns PC=0017 IR=201c, SW=8000, A=   15 SP=007f LR=0012
1410ns PC=0018 IR=101b, SW=8000, A=   15 SP=007f LR=0012
1430ns PC=0019 IR=a011, SW=8000, A=   15 SP=007f LR=0012
1450ns PC=0011 IR=001c, SW=8000, A=    5 SP=007f LR=0012
1470ns PC=0012 IR=901d, SW=8000, A=    5 SP=007f LR=0012
1490ns PC=0013 IR=b01a, SW=8000, A=    5 SP=007f LR=0012
1510ns PC=0014 IR=f701, SW=8000, A=    6 SP=007f LR=0012
1530ns PC=0015 IR=101c, SW=8000, A=    6 SP=007f LR=0012
1550ns PC=0016 IR=001b, SW=8000, A=   15 SP=007f LR=0012
1570ns PC=0017 IR=201c, SW=8000, A=   21 SP=007f LR=0012
1590ns PC=0002 IR=a004, SW=8008, A=   21 SP=007f LR=0018
1610ns PC=0004 IR=f300, SW=8008, A=   21 SP=007e LR=0018
1630ns PC=0005 IR=f301, SW=8008, A=   21 SP=007d LR=0018
1650ns PC=0006 IR=f302, SW=8008, A=   21 SP=007c LR=0018
1670ns PC=0007 IR=001e, SW=8008, A=    2 SP=007c LR=0018
1690ns PC=0008 IR=f701, SW=8008, A=    3 SP=007c LR=0018
SWI C8=   1 A=    3
1710ns PC=0009 IR=fa01, SW=8008, A=    3 SP=007c LR=0018
1730ns PC=000a IR=101e, SW=8008, A=    3 SP=007c LR=0018
1750ns PC=000b IR=f402, SW=8008, A=   21 SP=007d LR=0018
1770ns PC=000c IR=f401, SW=8008, A=   21 SP=007e LR=0018
1790ns PC=000d IR=f400, SW=8008, A=   21 SP=007f LR=0018
1810ns PC=000e IR=ff00, SW=8000, A=   21 SP=007f LR=0018
1830ns PC=0018 IR=101b, SW=8000, A=   21 SP=007f LR=0018
1850ns PC=0019 IR=a011, SW=8000, A=   21 SP=007f LR=0018
1870ns PC=0011 IR=001c, SW=8000, A=    6 SP=007f LR=0018
1890ns PC=0012 IR=901d, SW=8000, A=    6 SP=007f LR=0018
1910ns PC=0013 IR=b01a, SW=8000, A=    6 SP=007f LR=0018
1930ns PC=0014 IR=f701, SW=8000, A=    7 SP=007f LR=0018
1950ns PC=0015 IR=101c, SW=8000, A=    7 SP=007f LR=0018
1970ns PC=0016 IR=001b, SW=8000, A=   21 SP=007f LR=0018
1990ns PC=0017 IR=201c, SW=8000, A=   28 SP=007f LR=0018
2010ns PC=0018 IR=101b, SW=8000, A=   28 SP=007f LR=0018
2030ns PC=0019 IR=a011, SW=8000, A=   28 SP=007f LR=0018
2050ns PC=0011 IR=001c, SW=8000, A=    7 SP=007f LR=0018
2070ns PC=0012 IR=901d, SW=8000, A=    7 SP=007f LR=0018
2090ns PC=0013 IR=b01a, SW=8000, A=    7 SP=007f LR=0018
2110ns PC=0002 IR=a004, SW=8008, A=    7 SP=007f LR=0014
2130ns PC=0004 IR=f300, SW=8008, A=    7 SP=007e LR=0014
2150ns PC=0005 IR=f301, SW=8008, A=    7 SP=007d LR=0014
2170ns PC=0006 IR=f302, SW=8008, A=    7 SP=007c LR=0014
2190ns PC=0007 IR=001e, SW=8008, A=    3 SP=007c LR=0014
2210ns PC=0008 IR=f701, SW=8008, A=    4 SP=007c LR=0014
SWI C8=   1 A=    4
2230ns PC=0009 IR=fa01, SW=8008, A=    4 SP=007c LR=0014
2250ns PC=000a IR=101e, SW=8008, A=    4 SP=007c LR=0014
2270ns PC=000b IR=f402, SW=8008, A=    7 SP=007d LR=0014
2290ns PC=000c IR=f401, SW=8008, A=    7 SP=007e LR=0014
2310ns PC=000d IR=f400, SW=8008, A=    7 SP=007f LR=0014
2330ns PC=000e IR=ff00, SW=8000, A=    7 SP=007f LR=0014
2350ns PC=0014 IR=f701, SW=8000, A=    8 SP=007f LR=0014
2370ns PC=0015 IR=101c, SW=8000, A=    8 SP=007f LR=0014
2390ns PC=0016 IR=001b, SW=8000, A=   28 SP=007f LR=0014
2410ns PC=0017 IR=201c, SW=8000, A=   36 SP=007f LR=0014
2430ns PC=0018 IR=101b, SW=8000, A=   36 SP=007f LR=0014
2450ns PC=0019 IR=a011, SW=8000, A=   36 SP=007f LR=0014
2470ns PC=0011 IR=001c, SW=8000, A=    8 SP=007f LR=0014
2490ns PC=0012 IR=901d, SW=8000, A=    8 SP=007f LR=0014
2510ns PC=0013 IR=b01a, SW=8000, A=    8 SP=007f LR=0014
2530ns PC=0014 IR=f701, SW=8000, A=    9 SP=007f LR=0014
2550ns PC=0015 IR=101c, SW=8000, A=    9 SP=007f LR=0014
2570ns PC=0016 IR=001b, SW=8000, A=   36 SP=007f LR=0014
2590ns PC=0017 IR=201c, SW=8000, A=   45 SP=007f LR=0014
2610ns PC=0018 IR=101b, SW=8000, A=   45 SP=007f LR=0014
2630ns PC=0019 IR=a011, SW=8000, A=   45 SP=007f LR=0014
2650ns PC=0002 IR=a004, SW=8008, A=   45 SP=007f LR=0011
2670ns PC=0004 IR=f300, SW=8008, A=   45 SP=007e LR=0011
2690ns PC=0005 IR=f301, SW=8008, A=   45 SP=007d LR=0011
2710ns PC=0006 IR=f302, SW=8008, A=   45 SP=007c LR=0011
2730ns PC=0007 IR=001e, SW=8008, A=    4 SP=007c LR=0011
2750ns PC=0008 IR=f701, SW=8008, A=    5 SP=007c LR=0011
SWI C8=   1 A=    5
2770ns PC=0009 IR=fa01, SW=8008, A=    5 SP=007c LR=0011
2790ns PC=000a IR=101e, SW=8008, A=    5 SP=007c LR=0011
2810ns PC=000b IR=f402, SW=8008, A=   45 SP=007d LR=0011
2830ns PC=000c IR=f401, SW=8008, A=   45 SP=007e LR=0011
2850ns PC=000d IR=f400, SW=8008, A=   45 SP=007f LR=0011
2870ns PC=000e IR=ff00, SW=8000, A=   45 SP=007f LR=0011
2890ns PC=0011 IR=001c, SW=8000, A=    9 SP=007f LR=0011
2910ns PC=0012 IR=901d, SW=8000, A=    9 SP=007f LR=0011
2930ns PC=0013 IR=b01a, SW=8000, A=    9 SP=007f LR=0011
2950ns PC=0014 IR=f701, SW=8000, A=   10 SP=007f LR=0011
2970ns PC=0015 IR=101c, SW=8000, A=   10 SP=007f LR=0011
2990ns PC=0016 IR=001b, SW=8000, A=   45 SP=007f LR=0011
3010ns PC=0017 IR=201c, SW=8000, A=   55 SP=007f LR=0011
3030ns PC=0018 IR=101b, SW=8000, A=   55 SP=007f LR=0011
3050ns PC=0019 IR=a011, SW=8000, A=   55 SP=007f LR=0011
3070ns PC=0011 IR=001c, SW=8000, A=   10 SP=007f LR=0011
3090ns PC=0012 IR=901d, SW=4000, A=   10 SP=007f LR=0011
3110ns PC=0013 IR=b01a, SW=4000, A=   10 SP=007f LR=0011
3130ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=0011
3150ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=0011
3170ns PC=0002 IR=a004, SW=4008, A=   10 SP=007f LR=001a
3190ns PC=0004 IR=f300, SW=4008, A=   10 SP=007e LR=001a
3210ns PC=0005 IR=f301, SW=4008, A=   10 SP=007d LR=001a
3230ns PC=0006 IR=f302, SW=4008, A=   10 SP=007c LR=001a
3250ns PC=0007 IR=001e, SW=4008, A=    5 SP=007c LR=001a
3270ns PC=0008 IR=f701, SW=4008, A=    6 SP=007c LR=001a
SWI C8=   1 A=    6
3290ns PC=0009 IR=fa01, SW=4008, A=    6 SP=007c LR=001a
3310ns PC=000a IR=101e, SW=4008, A=    6 SP=007c LR=001a
3330ns PC=000b IR=f402, SW=4008, A=   10 SP=007d LR=001a
3350ns PC=000c IR=f401, SW=4008, A=   10 SP=007e LR=001a
3370ns PC=000d IR=f400, SW=4008, A=   10 SP=007f LR=001a
3390ns PC=000e IR=ff00, SW=4000, A=   10 SP=007f LR=001a
3410ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3430ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3450ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3470ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3490ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3510ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3530ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3550ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3570ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3590ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3610ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3630ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3650ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3670ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3690ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3710ns PC=0002 IR=a004, SW=4008, A=   10 SP=007f LR=001a
3730ns PC=0004 IR=f300, SW=4008, A=   10 SP=007e LR=001a
3750ns PC=0005 IR=f301, SW=4008, A=   10 SP=007d LR=001a
3770ns PC=0006 IR=f302, SW=4008, A=   10 SP=007c LR=001a
3790ns PC=0007 IR=001e, SW=4008, A=    6 SP=007c LR=001a
3810ns PC=0008 IR=f701, SW=4008, A=    7 SP=007c LR=001a
SWI C8=   1 A=    7
3830ns PC=0009 IR=fa01, SW=4008, A=    7 SP=007c LR=001a
3850ns PC=000a IR=101e, SW=4008, A=    7 SP=007c LR=001a
3870ns PC=000b IR=f402, SW=4008, A=   10 SP=007d LR=001a
3890ns PC=000c IR=f401, SW=4008, A=   10 SP=007e LR=001a
3910ns PC=000d IR=f400, SW=4008, A=   10 SP=007f LR=001a
3930ns PC=000e IR=ff00, SW=4000, A=   10 SP=007f LR=001a
3950ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3970ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
3990ns PC=001a IR=a01a, SW=4000, A=   10 SP=007f LR=001a
```


您可以看到上述執行過程中，每隔一小段時間就會印出 SWI 指令，那就是下列中斷處理常式的 `SWI 1` 這個指令所印出來的，
當 2 號中斷發生時，程式會跳到 02 位址的指令，也就是 JMP IRQ，接著跳到 04 位址的 IRQ 標記上，開始執行中斷常式，
於是在 09 的 SWI 1 這行當中，我們會利用 `SWI:  $display("SWI C8=%d A=%d", `SC8, `A);` 這行程式印出累積器 A 的値
以便觀察到中斷的發生，以下是測試程式中斷部份得機器碼與組合語言。

```
A00F  // 00    	       JMP   RESET
A003  // 01    	       JMP   ERROR
A004  // 02    	       JMP   IRQ
A006  // 03    ERROR:  JMP   ERROR
F300  // 04    IRQ:    PUSH  A
F301  // 05            PUSH  LR
F302  // 06            PUSH  SW
001E  // 07            LD    TIMER
F701  // 08            ADDI  1
FA01  // 09            SWI   1
101E  // 0A            ST    TIMER
F402  // 0B            POP   SW
F401  // 0C            POP   LR
F400  // 0D            POP   A
FF00  // 0E            IRET
...
```

以上片段中 IRQ 到 IRET 指令之間為中斷常式，每次中斷時該常式就會將 TIMER 加一，因此就可以用來計算中斷發生的次數，
雖然這樣的程式並沒有太大的用途，但還蠻適合用來說明中斷原理的。

### 結語

中斷向量裏通常存放一堆跳躍指令，在中斷的時候可以可以透過這些指令跳到中斷處理程式，
以便判別中斷類型並進行對應的處理，後續我們將介紹如何使用中斷機制進行輸出入處理
與行程切換的動作。
