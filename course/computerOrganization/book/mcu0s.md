## MCU0 完整版

### MCU0 的架構

MCU0 是一顆 16 位元的 CPU，所有暫存器都是 16 位元的，總共有 (IR, SP, LR, SW, PC, A) 等暫存器，如下所示：

```
`define A    R[0]      // 累積器
`define LR   R[1]      // 連結暫存器
`define SW   R[2]      // 狀態暫存器
`define SP   R[3]      // 堆疊暫存器
`define PC   R[4]      // 程式計數器
```

這些暫存器的功能與說明如下：

暫存器名稱    功能          說明
-----------   ----------    --------------------------------------------------------------------------------------
IR            指令暫存器    用來儲存從記憶體載入的機器碼指令
A =R[0]       累積器        用來儲存計算的結果，像是加減法的結果。
LR=R[1]       連結暫存器    用來儲存函數呼叫的返回位址
SW=R[2]       狀態暫存器    用來儲存 CMP 比較指令的結果旗標，像是負旗標 N 與零旗標 Z 等。作為條件跳躍 JEQ 等指令是否跳躍的判斷依據。
SP=R[3]       堆疊暫存器    堆疊指標，PUSH, POP 指令會用到。
PC=R[4]       程式計數器    用來儲存指令的位址 (也就是目前執行到哪個指令的記憶體位址)

### MCU0 的指令表

指令暫存器 IR 的前 4 個位元是指令代碼 OP，由於 4 位元只能表達 16 種指令，這數量太少不敷使用，因此當 OP=0xF 時，
我們繼續用後面的位元作為延伸代碼，以便有更多的指令可以使用，以下是 MCU0 微控制器的完整指令表。

代碼 名稱       格式                 說明              語意
---- ------     --------             ------------      ----------------
0    LD         LD  C                載入              A = [C]
1    ST         ST  C                儲存              [C] = A
2    ADD        ADD C                加法              A = A + [C]
3    SUB        SUB C                減法              A = A - [C]
4    MUL        MUL C                乘法              A = A * [C]
5    DIV        DIV C                除法              A = A / [C]
6    AND        AND C                位元 AND 運算     A = A & [C]
7    OR         OR  C                位元 OR  運算     A = A | [C]
8    XOR        XOR C                位元 XOR 運算     A = A ^ [C]
9    CMP        CMP C                比較              SW = A CMP [C] ; N=(A<[C]), Z=(A==[C])
A    JMP        JMP C                跳躍              PC = C
B    JEQ        JEQ C                相等時跳躍        if Z then PC = C
C    JLT        JLT C                小於時跳躍        if N then PC = C
D    JLE        JLE C                小於或等於時跳躍  if Z or N then PC = C
E    CALL       CALL C               呼叫副程式        LR=PC; PC = C
F    OP8                             OP為8位元的運算
F0   LDI        LDI Ra,C4            載入常數          Ra=C4
F2   MOV        MOV Ra,Rb            暫存器移動        Ra=Rb
F3   PUSH       PUSH Ra              堆疊推入          SP--; [SP] = Ra
F4   POP        POP  Ra              堆疊取出          Ra=[SP]; SP++;
F5   SHL        SHL Ra,C4            左移              Ra = Ra << C4
F6   SHR        SHL Ra,C4            右移              Ra = Ra >> C4
F7   ADDI       ADDI Ra,C4           常數加法          Ra = Ra + C4
F8   SUBI       SUBI Ra,C4           常數減法          Ra = Ra - C4
F9   NEG        NEG Ra               反相              Ra = ~Ra
FA   SWI        SWI C                軟體中斷          BIOS 中斷呼叫
FD   NSW        NSW                  狀態反相          N=~N, Z=~Z; 由於沒有 JGE, JGT, JNE，因此可用此指令將 SW 反相，再用 JLE, JLT, JEQ 完成跳躍動作
FE   RET        RET                  返回              PC = LR
FF   IRET       IRET                 從中斷返回        PC = LR; I=0;

### mcu0 程式碼

檔案：mcu0s.v

```verilog
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define SC8  $signed(IR[7:0]) // 常數欄位
`define C4   IR[3:0]   // 常數欄位
`define Ra   IR[7:4]   // Ra
`define Rb   IR[3:0]   // Rb
`define A    R[0]      // 累積器
`define LR   R[1]      // 連結暫存器
`define SW   R[2]      // 狀態暫存器
`define SP   R[3]      // 堆疊暫存器
`define PC   R[4]      // 程式計數器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標
`define I    `SW[3]    // 是否中斷中
`define M    m[`C]     // 存取記憶體

module cpu(input clock); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [3:0] LD=4'h0,ST=4'h1,ADD=4'h2,SUB=4'h3,MUL=4'h4,DIV=4'h5,AND=4'h6,OR=4'h7,XOR=4'h8,CMP=4'h9,JMP=4'hA,JEQ=4'hB, JLT=4'hC, JLE=4'hD, JSUB=4'hE, OP8=4'hF;
  parameter [3:0] LDI=4'h0, MOV=4'h2, PUSH=4'h3, POP=4'h4, SHL=4'h5, SHR=4'h6, ADDI=4'h7, SUBI=4'h8, NEG=4'h9, SWI=4'hA, NSW=4'hD, RET=4'hE, IRET=4'hF;
  reg [15:0] IR;    // 指令暫存器
  reg signed [15:0] R[0:4];
  reg signed [15:0] pc0;
  reg signed [15:0] m [0:4096]; // 內部的快取記憶體
  integer i;
  initial  // 初始化
  begin
    `PC = 0; // 將 PC 設為起動位址 0
    `SW = 0;
    $readmemh("mcu0s.hex", m);
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
    IR = m[`PC];                // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
    pc0= `PC;                   // 儲存舊的 PC 值在 pc0 中。
    `PC = `PC+1;                // 擷取完成，PC 前進到下一個指令位址
    case (`OP)                  // 解碼、根據 OP 執行動作
      LD: `A = `M;                 // LD C
      ST: `M = `A;                // ST C
      ADD: `A = `A + `M;        // ADD C
      SUB: `A = `A - `M;        // SUB C
      MUL: `A = `A * `M;        // MUL C
      DIV: `A = `A / `M;        // DIV C
      AND: `A = `A & `M;        // AND C
      OR : `A = `A | `M;        // OR  C
      XOR: `A = `A ^ `M;        // XOR C
      CMP: begin `N=(`A < `M); `Z=(`A==`M); end // CMP C
      JMP: `PC = `C; // JSUB C
      JEQ: if (`Z) `PC=`C;        // JEQ C
      JLT: if (`N) `PC=`C;        // JLT C
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
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu mcu0(clock);            // 宣告 mcu0 處理器

initial clock = 0;          // 一開始 clock 設定為 0
always  #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
initial #1000 $finish;      // 停止測試。

endmodule

```

### 組合語言

檔案：mcu0s.hex

```
0020  // 00    RESET:  LD    X   
2021  // 01            ADD   Y
3021  // 02            SUB   Y
4021  // 03            MUL   Y
5021  // 04            DIV   Y
7021  // 05            OR    Y		       
6021  // 06            AND   Y
8021  // 07            XOR   Y
0020  // 08            LD    X
F503  // 09            SHL   A, 3
F603  // 0A            SHR   A, 3
F701  // 0B            ADDI  1
0023  // 0C            LD    STACKEND
F230  // 0D            MOV   SP, A
E011  // 0E            JSUB  MIN
0022  // 0F            LD    Z
A010  // 10    HALT:   JMP   HALT        
F301  // 11    MIN:    PUSH  LR
0020  // 12            LD    X
9021  // 13            CMP   Y
FD00  // 14            NSW
C018  // 15            JLT   ELSE
1022  // 16            ST    Z
A019  // 17            JMP   NEXT
0021  // 18    ELSE:   LD    Y
1022  // 19    NEXT:   ST    Z
F401  // 1A            POP   LR
FE00  // 1B            RET
0000  // 1C    
0000  // 1D    
0000  // 1E
0000  // 1F
0003  // 20    X:      WORD  3
0005  // 21    Y:      WORD  5
0000  // 22    Z:      WORD  0 
007F  // 23    STACKEND: WORD 127
```

### 執行結果

```
D:\Dropbox\Public\web\oc\code\mcu0>iverilog -o mcu0s mcu0s.v

D:\Dropbox\Public\web\oc\code\mcu0>vvp mcu0s
WARNING: mcu0s.v:29: $readmemh(mcu0s.hex): Not enough words in the file for the
requested range [0:4096].
  10ns PC=0000 IR=0020, SW=0000, A=    3 SP=xxxx LR=xxxx
  30ns PC=0001 IR=2021, SW=0000, A=    8 SP=xxxx LR=xxxx
  50ns PC=0002 IR=3021, SW=0000, A=    3 SP=xxxx LR=xxxx
  70ns PC=0003 IR=4021, SW=0000, A=   15 SP=xxxx LR=xxxx
  90ns PC=0004 IR=5021, SW=0000, A=    3 SP=xxxx LR=xxxx
 110ns PC=0005 IR=7021, SW=0000, A=    7 SP=xxxx LR=xxxx
 130ns PC=0006 IR=6021, SW=0000, A=    5 SP=xxxx LR=xxxx
 150ns PC=0007 IR=8021, SW=0000, A=    0 SP=xxxx LR=xxxx
 170ns PC=0008 IR=0020, SW=0000, A=    3 SP=xxxx LR=xxxx
 190ns PC=0009 IR=f503, SW=0000, A=   24 SP=xxxx LR=xxxx
 210ns PC=000a IR=f603, SW=0000, A=    3 SP=xxxx LR=xxxx
 230ns PC=000b IR=f701, SW=0000, A=    4 SP=xxxx LR=xxxx
 250ns PC=000c IR=0023, SW=0000, A=  127 SP=xxxx LR=xxxx
 270ns PC=000d IR=f230, SW=0000, A=  127 SP=007f LR=xxxx
 290ns PC=000e IR=e011, SW=0000, A=  127 SP=007f LR=000f
 310ns PC=0011 IR=f301, SW=0000, A=  127 SP=007e LR=000f
 330ns PC=0012 IR=0020, SW=0000, A=    3 SP=007e LR=000f
 350ns PC=0013 IR=9021, SW=8000, A=    3 SP=007e LR=000f
 370ns PC=0014 IR=fd00, SW=4000, A=    3 SP=007e LR=000f
 390ns PC=0015 IR=c018, SW=4000, A=    3 SP=007e LR=000f
 410ns PC=0016 IR=1022, SW=4000, A=    3 SP=007e LR=000f
 430ns PC=0017 IR=a019, SW=4000, A=    3 SP=007e LR=000f
 450ns PC=0019 IR=1022, SW=4000, A=    3 SP=007e LR=000f
 470ns PC=001a IR=f401, SW=4000, A=  127 SP=007f LR=000f
 490ns PC=001b IR=fe00, SW=4000, A=  127 SP=007f LR=000f
 510ns PC=000f IR=0022, SW=4000, A=    3 SP=007f LR=000f
 530ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 550ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 570ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 590ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 610ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 630ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 650ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 670ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 690ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 710ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 730ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 750ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 770ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 790ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 810ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 830ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 850ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 870ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 890ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 910ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 930ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 950ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 970ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
 990ns PC=0010 IR=a010, SW=4000, A=    3 SP=007f LR=000f
```

### 結語

由於 16 位元處理器的指令長度很短，因此空間必須有效利用，所以我們將一些不包含記憶體位址的指令，
編到最後的 `0xF` 的 OP 代碼當中，這樣就可以再度延伸出一大群指令空間，於是讓指令數可以不受限於
4 位元 OP 碼的 16 個指令，而能延伸為 30 個左右的指令。

在使用 Verilog 這種硬體描述語言設計處理器時，位元數越少，往往處理器的指令長度越少，這時處理器
不見得會更好設計，往往反而會更難設計，指令集的編碼相對會困難一些。

