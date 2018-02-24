## CPU0 完整版 -- cpu0s

CPU0 是一個簡易的 32 位元單匯流排處理器，其架構如下圖所示，包含R0..R15, IR, MAR, MDR 等暫存器，其中 IR是指令暫存器，
R0 是一個永遠為常數 0 的唯讀暫存器，R15 是程式計數器 (Program Counter : PC)，R14 是連結暫存器 (Link Register : LR)，
R13 是堆疊指標暫存器 (Stack Pointer : SP)，而 R12 是狀態暫存器 (Status Word : SW)。

![圖、CPU0 的架構圖](../img/cpu0architecture.jpg)

### CPU0 的指令集

CPU0 包含『載入儲存』、『運算指令』、『跳躍指令』、『堆疊指令』等四大類指令，以下表格是 CPU0 的指令編碼表，記載了 CPU0 的指令集與每個指令的編碼。

格式    指令        OP      說明                     語法                       語意
-----   ---------   ------  ---------------------    --------------------       ---------------------
L       LD          00      載入word                 LD  Ra, [Rb+Cx]             Ra=[Rb+Cx]
L       ST          01      儲存word                 ST  Ra, [Rb+Cx]             Ra=[Rb+Cx]
L       LDB         02      載入 byte                LDB Ra, [Rb+Cx]             Ra=(byte)[Rb+Cx]
L       STB         03      儲存 byte                STB Ra, [Rb+Cx]             Ra=(byte)[Rb+Cx]
A       LDR         04      LD的暫存器版             LDR Ra, [Rb+Rc]             Ra=[Rb+Rc]
A       STR         05      ST的暫存器版             STR Ra, [Rb+Rc]             Ra=[Rb+Rc]
A       LBR         06      LDB的暫存器版            LBR Ra, [Rb+Rc]             Ra=(byte)[Rb+Rc]
A       SBR         07      STB的暫存器版            SBR Ra, [Rb+Rc]             Ra=(byte)[Rb+Rc]
L       LDI         08      載入常數                 LDI Ra, Cx                  Ra=Cx
A       CMP         10      比較                     CMP Ra, Rb                  SW=Ra >=< Rb
A       MOV         12      移動                     MOV Ra, Rb                  Ra=Rb
A       ADD         13      加法                     ADD Ra, Rb, Rc              Ra=Rb+Rc
A       SUB         14      減法                     SUB Ra, Rb, Rc              Ra=Rb-Rc
A       MUL         15      乘法                     MUL Ra, Rb, Rc              Ra=Rb*Rc
A       DIV         16      除法                     DIV Ra, Rb, Rc              Ra=Rb/Rc
A       AND         18      邏輯 AND                 AND Ra, Rb, Rc              Ra=Rb and Rc
A       OR          19      邏輯 OR                  OR Ra, Rb, Rc               Ra=Rb or Rc
A       XOR         1A      邏輯 XOR                 XOR Ra, Rb, Rc              Ra=Rb xor Rc
A       ADDI        1B      常數加法                 ADDI Ra, Rb, Cx             Ra=Rb + Cx
A       ROL         1C      向左旋轉                 ROL Ra, Rb, Cx              Ra=Rb rol Cx
A       ROR         1D      向右旋轉                 ROR Ra, Rb, Cx              Ra=Rb ror Cx
A       SHL         1E      向左移位                 SHL Ra, Rb, Cx              Ra=Rb << Cx
A       SHR         1F      向右移位                 SHR Ra, Rb, Cx              Ra=Rb >> Cx
J       JEQ         20      跳躍 (相等)              JEQ Cx                      if SW(=)  PC=PC+Cx
J       JNE         21      跳躍 (不相等)            JNE Cx                      if SW(!=) PC=PC+Cx
J       JLT         22      跳躍 (<)                 JLT Cx                      if SW(<)  PC=PC+Cx
J       JGT         23      跳躍 (>)                 JGT Cx                      if SW(>)  PC=PC+Cx
J       JLE         24      跳躍 (<=)                JLE Cx                      if SW(<=) PC=PC+Cx
J       JGE         25      跳躍 (>=)                JGE Cx                      if SW(>=) PC=PC+Cx
J       JMP         26      跳躍 (無條件)            JMP Cx                      PC=PC+Cx
J       SWI         2A      軟體中斷                 SWI Cx                      LR=PC; PC=Cx; INT=1
J       CALL        2B      跳到副程式               CALL Cx                     LR=PC; PC=PC+Cx
J       RET         2C      返回                     RET                         PC=LR
J       IRET        2D      中斷返回                 IRET                        PC=LR; INT=0
A       PUSH        30      推入word                 PUSH Ra                     SP-=4; [SP]=Ra;
A       POP         31      彈出 word                POP Ra                      Ra=[SP]; SP+=4;
A       PUSHB       32      推入 byte                PUSHB Ra                    SP--; [SP]=Ra; (byte)
A       POPB        33      彈出 byte                POPB Ra                     Ra=[SP]; SP++; (byte)

### CPU0 指令格式

CPU0 所有指令長度均為 32 位元，這些指令也可根據編碼方式分成三種不同的格式，分別是 A 型、J 型與 L 型。

大部分的運算指令屬於A (Arithmatic) 型，而載入儲存指令通常屬於 L (Load & Store) 型，跳躍指令則通常屬於 J (Jump) 型，
這三種型態的指令格式如下圖所示。

![圖、CPU0的指令格式](../img/cpu0format.jpg)

### 狀態暫存器

R12 狀態暫存器 (Status Word : SW) 是用來儲存 CPU 的狀態值，這些狀態是許多旗標的組合。例如，零旗標 (Zero，簡寫為Z) 
代表比較的結果為 0，負旗標 (Negative ，簡寫為N) 代表比較的結果為負值，另外常見的旗標還有進位旗標 (Carry ，簡寫為 C)，
溢位旗標 (Overflow，簡寫為 V) 等等。下圖顯示了 CPU0 的狀態暫存器格式，最前面的四個位元 N、Z、C、V所代表的，
正是上述的幾個旗標值。

![圖、CPU0 中狀態暫存器 SW 的結構](../img/cpu0sw.jpg)

條件旗標的 N、Z 旗標值可以用來代表比較結果是大於 (>)、等於 (=) 還是小於 (<)，當執行 CMP Ra, Rb 動作後，會有下列三種可能的情形。

1. 若 Ra > Rb，則 N=0, Z=0。
2. 若 Ra < Rb，則 N=1, Z=0。
3. 若 Ra = Rb，則 N=0, Z=1。

如此，用來進行條件跳躍的 JGT、JGE、JLT、JLE、JEQ、JNE指令，就可以根據 SW 暫存器當中的 N、Z 等旗標決定是否進行跳躍。

SW 中還包含中斷控制旗標 I (Interrupt) 與 T (Trap)，用以控制中斷的啟動與禁止等行為，假如將 I 旗標設定為 0，則CPU0將禁止所有種類的中斷，也就是對任何中斷都不會起反應。但如果只是將 T 旗標設定為0，則只會禁止軟體
中斷指令 SWI (Software Interrupt)，不會禁止由硬體觸發的中斷。

SW 中還儲存有『處理器模式』的欄位，M=0 時為『使用者模式』 (user mode) 與 M=1 時為『特權模式』(super mode) 等，
這在作業系統的設計上經常被用來製作安全保護功能。在使用者模式當中，任何設定狀態暫存器 R12 的動作都會被視為是非法的，
這是為了進行保護功能的緣故。但是在特權模式中，允許進行任何動作，包含設定中斷旗標與處理器模式等位元，
通常作業系統會使用特權模式 (M=1)，而一般程式只能處於使用者模式 (M=0)。

### CPU0 處理器的 Verilog 實作 -- cpu0s.v

檔案：cpu0s.v

```verilog
`define PC   R[15]   // 程式計數器
`define LR   R[14]   // 連結暫存器
`define SP   R[13]   // 堆疊暫存器
`define SW   R[12]   // 狀態暫存器
// 狀態暫存器旗標位元
`define N    `SW[31] // 負號旗標
`define Z    `SW[30] // 零旗標
`define C    `SW[29] // 進位旗標
`define V    `SW[28] // 溢位旗標
`define I    `SW[7]  // 硬體中斷許可
`define T    `SW[6]  // 軟體中斷許可
`define M    `SW[0]  // 模式位元
// IR 欄位
`define OP   IR[31:24]
`define Ra   IR[23:20]
`define Rb   IR[19:16]
`define Rc   IR[15:12]
`define C5   IR[4:0]
`define C16  $signed(IR[15:0])
`define C24  $signed(IR[23:0])

module cpu0(input clock); // CPU0 處理器
  parameter [7:0] LD=8'h00,ST=8'h01,LDB=8'h02,STB=8'h03,LDR=8'h04,STR=8'h05,
    LBR=8'h06,SBR=8'h07,ADDI=8'h08,CMP=8'h10,MOV=8'h12,ADD=8'h13,SUB=8'h14,
    MUL=8'h15,DIV=8'h16,AND=8'h18,OR=8'h19,XOR=8'h1A,ROL=8'h1C,ROR=8'h1D,
    SHL=8'h1E,SHR=8'h1F,JEQ=8'h20,JNE=8'h21,JLT=8'h22,JGT=8'h23,JLE=8'h24,
    JGE=8'h25,JMP=8'h26,SWI=8'h2A,CALL=8'h2B,RET=8'h2C,IRET=8'h2D,
    PUSH=8'h30,POP=8'h31,PUSHB=8'h32,POPB=8'h33;
  reg signed [31:0] R [0:15];   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg signed [31:0] IR;         // 指令暫存器 IR
  reg signed [31:0] laddr, raddr;
  reg signed [31:0] pc;
  reg [7:0] m [0:256];          // 內部的快取記憶體  
  
  integer i;  
  initial begin // 初始化
    `PC = 0;                    // 將 PC 設為起動位址 0
    `SW = 0;
    R[0] = 0;                   // 將 R[0] 暫存器強制設定為 0
    $readmemh("cpu0s.hex", m);
    for (i=0; i < 255; i=i+4) begin
       $display("%8x: %8x", i, {m[i], m[i+1], m[i+2], m[i+3]});
    end
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      pc = `PC;
      IR = {m[`PC], m[`PC+1], m[`PC+2], m[`PC+3]};  // 指令擷取階段：IR=m[PC], 4 個 Byte 的記憶體
      `PC = `PC+4;                                  // 擷取完成，PC 前進到下一個指令位址
      laddr = R[`Rb]+`C16;
      raddr = R[`Rb]+R[`Rc];
      case (`OP) // 根據 OP 執行對應的動作
        LD: begin   // 載入指令： R[`Ra] = m[addr]
          R[`Ra] = {m[laddr], m[laddr+1], m[laddr+2], m[laddr+3]};
          $display("%4dns %8x : LD    R%-d R%-d 0x%x ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C16, `Ra, R[`Ra], R[`Ra]);
          end
        ST: begin   // 儲存指令： m[addr] = R[`Ra]
          {m[laddr], m[laddr+1], m[laddr+2], m[laddr+3]} = R[`Ra];
          $display("%4dns %8x : ST    R%-d R%-d 0x%x ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C16, `Ra, R[`Ra], R[`Ra]);
          end
        LDB:begin   // 載入byte;     LDB Ra, [Rb+ Cx];   Ra<=(byte)[Rb+ Cx]
          R[`Ra] = { 24'b0, m[laddr] };
          $display("%4dns %8x : LDB   R%-d R%-d 0x%x ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C16, `Ra, R[`Ra], R[`Ra]);
          end
        STB:begin   // 儲存byte;     STB Ra, [Rb+ Cx];   Ra=>(byte)[Rb+ Cx]
          m[laddr] = R[`Ra][7:0];
          $display("%4dns %8x : STB   R%-d R%-d 0x%x ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C16, `Ra, R[`Ra], R[`Ra]);
          end
        LDR:begin   // LD 的 Rc 版;  LDR Ra, [Rb+Rc];    Ra<=[Rb+ Rc]
          R[`Ra] = {m[raddr], m[raddr+1], m[raddr+2], m[raddr+3]};
          $display("%4dns %8x : LDR   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        STR:begin   // ST 的 Rc 版;  STR Ra, [Rb+Rc];    Ra=>[Rb+ Rc]
          {m[raddr], m[raddr+1], m[raddr+2], m[raddr+3]} = R[`Ra];
          $display("%4dns %8x : STR   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        LBR:begin   // LDB 的 Rc 版; LBR Ra, [Rb+Rc];    Ra<=(byte)[Rb+ Rc]
          R[`Ra] = { 24'b0, m[raddr] };
          $display("%4dns %8x : LBR   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        SBR:begin   // STB 的 Rc 版; SBR Ra, [Rb+Rc];    Ra=>(byte)[Rb+ Rc]
          m[raddr] = R[`Ra][7:0];
          $display("%4dns %8x : SBR   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        MOV:begin   // 移動;        MOV Ra, Rb;         Ra<=Rb
          R[`Ra] = R[`Rb];
          $display("%4dns %8x : MOV   R%-d R%-d        ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Ra, R[`Ra], R[`Ra]);
          end
        CMP:begin   // 比較;        CMP Ra, Rb;         SW=(Ra >=< Rb)
          `N=(R[`Ra]-R[`Rb]<0);`Z=(R[`Ra]-R[`Rb]==0);
          $display("%4dns %8x : CMP   R%-d R%-d        ; SW=0x%x", $stime, pc, `Ra, `Rb, `SW);
          end
        ADDI:begin  // R[a] = Rb+`C16;  // 立即值加法;   LDI Ra, Rb+Cx; Ra<=Rb + Cx
          R[`Ra] = R[`Rb]+`C16;
          $display("%4dns %8x : ADDI  R%-d R%-d %-d ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C16, `Ra, R[`Ra], R[`Ra]);
          end
        ADD: begin  // 加法指令： R[`Ra] = R[`Rb]+R[`Rc]
          R[`Ra] = R[`Rb]+R[`Rc];
          $display("%4dns %8x : ADD   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        SUB:begin   // 減法;        SUB Ra, Rb, Rc;     Ra<=Rb-Rc
          R[`Ra] = R[`Rb]-R[`Rc];
          $display("%4dns %8x : SUB   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        MUL:begin   // 乘法;        MUL Ra, Rb, Rc;     Ra<=Rb*Rc
          R[`Ra] = R[`Rb]*R[`Rc];
          $display("%4dns %8x : MUL   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        DIV:begin   // 除法;        DIV Ra, Rb, Rc;     Ra<=Rb/Rc
          R[`Ra] = R[`Rb]/R[`Rc];
          $display("%4dns %8x : DIV   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        AND:begin   // 位元 AND;    AND Ra, Rb, Rc;     Ra<=Rb and Rc
          R[`Ra] = R[`Rb]&R[`Rc];
          $display("%4dns %8x : AND   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        OR:begin    // 位元 OR;     OR Ra, Rb, Rc;         Ra<=Rb or Rc
          R[`Ra] = R[`Rb]|R[`Rc];
          $display("%4dns %8x : OR    R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        XOR:begin   // 位元 XOR;    XOR Ra, Rb, Rc;     Ra<=Rb xor Rc
          R[`Ra] = R[`Rb]^R[`Rc];
          $display("%4dns %8x : XOR   R%-d R%-d R%-d    ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `Rc, `Ra, R[`Ra], R[`Ra]);
          end
        SHL:begin   // 向左移位;    SHL Ra, Rb, Cx;     Ra<=Rb << Cx
          R[`Ra] = R[`Rb]<<`C5;
          $display("%4dns %8x : SHL   R%-d R%-d %-d     ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C5, `Ra, R[`Ra], R[`Ra]);
          end
        SHR:begin   // 向右移位;        SHR Ra, Rb, Cx;     Ra<=Rb >> Cx
          R[`Ra] = R[`Rb]>>`C5;
          $display("%4dns %8x : SHR   R%-d R%-d %-d     ; R%-2d=0x%8x=%-d", $stime, pc, `Ra, `Rb, `C5, `Ra, R[`Ra], R[`Ra]);
          end          
        JMP:begin   // 跳躍指令： PC = PC + cx24
          `PC = `PC + `C24;
          $display("%4dns %8x : JMP   0x%x       ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JEQ:begin   // 跳躍 (相等);        JEQ Cx;        if SW(=) PC  PC+Cx
          if (`Z) `PC=`PC+`C24;
          $display("%4dns %8x : JEQ   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JNE:begin   // 跳躍 (不相等);    JNE Cx;     if SW(!=) PC  PC+Cx
          if (!`Z) `PC=`PC+`C24;
          $display("%4dns %8x : JNE   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JLT:begin   // 跳躍 ( < );        JLT Cx;     if SW(<) PC  PC+Cx
          if (`N) `PC=`PC+`C24;
          $display("%4dns %8x : JLT   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JGT:begin   // 跳躍 ( > );        JGT Cx;     if SW(>) PC  PC+Cx
          if (!`N&&!`Z) `PC=`PC+`C24;
          $display("%4dns %8x : JGT   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JLE:begin   // 跳躍 ( <= );        JLE Cx;     if SW(<=) PC  PC+Cx  
          if (`N || `Z) `PC=`PC+`C24;
          $display("%4dns %8x : JLE   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        JGE:begin   // 跳躍 ( >= );        JGE Cx;     if SW(>=) PC  PC+Cx
          if (!`N || `Z) `PC=`PC+`C24;
          $display("%4dns %8x : JGE   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        SWI:begin   // 軟中斷;    SWI Cx;         LR <= PC; PC <= Cx; INT<=1
          `LR=`PC;`PC= `C24; `I = 1'b1;
          $display("%4dns %8x : SWI   0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        CALL:begin  // 跳到副程式;    CALL Cx;     LR<=PC; PC<=PC+Cx
          `LR=`PC;`PC=`PC + `C24;
          $display("%4dns %8x : CALL  0x%08x     ; PC=0x%x", $stime, pc, `C24, `PC);
          end
        RET:begin   // 返回;            RET;         PC <= LR
          `PC=`LR;
          $display("%4dns %8x : RET                  ; PC=0x%x", $stime, pc, `PC);
          if (`PC<0) $finish;
          end
        IRET:begin  // 中斷返回;        IRET;         PC <= LR; INT<=0
          `PC=`LR;`I = 1'b0;
          $display("%4dns %8x : IRET             ; PC=0x%x", $stime, pc, `PC);
          end
        PUSH:begin  // 推入 word;    PUSH Ra;    SP-=4;[SP]<=Ra;
          `SP = `SP-4; {m[`SP], m[`SP+1], m[`SP+2], m[`SP+3]} = R[`Ra];
          $display("%4dns %8x : PUSH  R%-d            ; R%-2d=0x%8x, SP=0x%x", $stime, pc, `Ra, `Ra, R[`Ra], `SP);
          end
        POP:begin   // 彈出 word;    POP Ra;     Ra=[SP];SP+=4;
          R[`Ra]={m[`SP], m[`SP+1], m[`SP+2], m[`SP+3]}; `SP = `SP+4;
          $display("%4dns %8x : POP   R%-d            ; R%-2d=0x%8x, SP=0x%x", $stime, pc, `Ra, `Ra, R[`Ra], `SP);
          end
        PUSHB:begin // 推入 byte;    PUSHB Ra;   SP--;[SP]<=Ra;(byte)
          `SP = `SP-1; m[`SP] = R[`Ra];
          $display("%4dns %8x : PUSHB R%-d            ; R[%-d]=0x%8x, SP=0x%x", $stime, pc, `Ra, `Ra, R[`Ra], `SP);
          end
        POPB:begin  // 彈出 byte;    POPB Ra;  Ra<=[SP];SP++;(byte)
          `SP = `SP+1; R[`Ra]=m[`SP];
          $display("%4dns %8x : POPB  R%-d            ; R[%-d]=0x%8x, SP=0x%x", $stime, pc, `Ra, `Ra, R[`Ra], `SP);
          end
      endcase
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu0 cpu(clock);            // 宣告 CPU

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10 奈秒將 clock 反相，產生週期為 20 奈秒的時脈
initial #2000 $finish;      // 停止測試。(因為這時的 R[1] 恰好是 1+2+...+10=55 的結果)
endmodule
```

### 程式碼解析與執行

在上一章的 CPU0mc.v 當中，我們直接使用下列程式將「機器碼」塞入到記憶體當中，但是這樣做顯然彈性不太夠。

```verilog
    {m[0],m[1],m[2],m[3]}    = 32'h001F0018; // 0000       LD   R1, K1
    {m[4],m[5],m[6],m[7]}    = 32'h002F0010; // 0004       LD   R2, K0
    {m[8],m[9],m[10],m[11]}  = 32'h003F0014; // 0008       LD   R3, SUM
    {m[12],m[13],m[14],m[15]}= 32'h13221000; // 000C LOOP: ADD  R2, R2, R1
    {m[16],m[17],m[18],m[19]}= 32'h13332000; // 0010       ADD  R3, R3, R2
    {m[20],m[21],m[22],m[23]}= 32'h26FFFFF4; // 0014       JMP  LOOP
    {m[24],m[25],m[26],m[27]}= 32'h00000000; // 0018 K0:   WORD 0
    {m[28],m[29],m[30],m[31]}= 32'h00000001; // 001C K1:   WORD 1
    {m[32],m[33],m[34],m[35]}= 32'h00000000; // 0020 SUM:  WORD 0
```

因此，在本章的 cpu0s.v 這個程式中，我們採用讀取外部檔案的方式，將機器碼寫在 「cpu0s.hex」這個檔案中，
然後再用下列指令將該 16 進位的機器碼檔案讀入。

```verilog
    $readmemh("cpu0s.hex", m);
```

其中的 readmemh 是一個可以讀取 16 進位的文字檔的函數，上述指令會將 cpu0s.hex 這個檔案內的 16 進位字串
讀入到「記憶體變數」 m 當中。

以下是 cpu0s.hex 的完整內容。

輸入檔：cpu0s.hex

```
00 DF 00 B6  //  0           LD   R13, StackEnd
08 40 00 04  //  4           ADDI R4, 4
08 50 00 08  //  8           ADDI R5, 8
05 4D 50 00  //  c           STR  R4, [R13+R5]
04 6D 50 00  // 10           LDR  R6, [R13+R5]
07 5D 40 00  // 14           SBR  R5, [R13+R4]
06 6D 40 00  // 18           LBR  R6, [R13+R4]
08 E0 FF FF  // 1C           ADDI R14,R0,-1
30 E0 00 00  // 20           PUSH R14
13 85 40 00  // 24           ADD  R8, R5, R4
14 85 40 00  // 28           SUB  R8, R5, R4
15 85 40 00  // 2c           MUL  R8, R5, R4
16 85 40 00  // 30           DIV  R8, R5, R4
18 85 40 00  // 34           AND  R8, R5, R4
19 85 40 00  // 38           OR   R8, R5, R4
1A 85 40 00  // 3c           XOR  R8, R5, R4
1E 85 00 03  // 40           SHL  R8, R5, 3
1F 85 00 02  // 44           SHR  R8, R5, 2
10 45 00 00  // 48           CMP  R4, R5
20 00 00 18  // 4c           JEQ  L1
23 00 00 14  // 50           JGT  L1
25 00 00 10  // 54           JGE  L1
22 00 00 0C  // 58           JLT  L1
24 00 00 08  // 5c           JLE  L1
21 00 00 04  // 60           JNE  L1
26 00 00 00  // 64           JMP  L1
08 10 00 0A  // 68   L1:     ADDI R1, R0, 10
2B 00 00 08  // 6c           CALL SUM
31 E0 00 00  // 70           POP  R14
2C 00 00 00  // 74           RET
30 E0 00 00  // 78   SUM:    PUSH R14
12 30 00 00  // 7c           MOV  R3, R0     // R3 = i = 0
02 4F 00 24  // 80           LDB  R4, k1     // R4 = 1
08 20 00 00  // 84           ADDI R2, 0      // SUM = R2 = 0
13 22 30 00  // 88   LOOP:   ADD  R2, R2, R3 // SUM = SUM + i
13 33 40 00  // 8c           ADD  R3, R3, R4 // i = i + 1
10 31 00 00  // 90           CMP  R3, R1     // if (i < R1)
24 FF FF F0  // 94           JLE  LOOP       //   goto LOOP
01 2F 00 0D  // 98           ST   R2, s
03 3F 00 0D  // 9c           STB  R3, i
31 E0 00 00  // a0           POP  R14
2C 00 00 00  // a4           RET                   // return
01           // a8   k1:     BYTE 1                // char K1=1
00 00 00 00  // a9   s:      WORD 0                // int s
00           // ad   i:      BYTE 0                // char i=1
00 01 02 03  // ae   Stack:  BYTE  0, 1, 2, 3, 4, 5, 6, 7, 8, 9 , 10, 11
04 05 06 07  // b2
08 09 0A 0B  // b6
00 00 00 BA  // ba   StackEnd: WORD StackEnd
01 02 03 04  // be   Data:   BYTE 0, 1, 2, 3, 4, 5, 6, 7, 8
05 06 07 08  // c2
```

上述程式的內容，大致是先準備好堆疊，然後就開始測試 ADDI, STR, LDR, ADD, SUB, ... 等指令。
接著在呼叫 CMP R4, R5 之後進行跳躍測試動作，由於 R4=4, R5=8，所以 CMP 的結果會是「小於」，
因此在後面的 JEQ, JGT, JGE 等指令都不會真的跳躍，直到執行 JLT  L1 時就會真的跳到 L1 去。

接著用 ADDI R1, R0, 10 將 R1 設為 10，然後就用 CALL SUM 這個指令呼叫 SUM 這個副程式，於是跳到
位於 0x78 的 SUM: PUSH R14 這一行，並開始執行副程式，該副程式會計算 1+2+...+R1 的結果，放在 R2 當中，
並在最後用 STB R2, s 這個指令存入變數 s 當中，然後在執行完 RET 指令後返回上一層，也就是 0x70 行的
POP  R14 指令，接著在執行 RET 指令時，由於此時 R14 為 -1，因此 Verilog 程式就在完成 RET 指令時發現
`PC 已經小於 0 了，因此執行 `$finish` 指令停止整個程式。

```verilog
        RET:begin   // 返回;            RET;         PC <= LR
          `PC=`LR;
          $display("%4dns %8x : RET                  ; PC=0x%x", $stime, pc, `PC);
          if (`PC<0) $finish;
          end
```

### 執行結果

有了上述的程式 cpu0s.v 與輸入的機器碼 cpu0s.hex 檔案之後，我們就可以用下列指令進行編譯與執行，
以下是該程式編譯與執行的結果。

```
D:\Dropbox\Public\web\co2\code\cpu0>iverilog cpu0s.v -o cpu0s

D:\Dropbox\Public\web\co2\code\cpu0>vvp cpu0s
WARNING: cpu0s.v:40: $readmemh(cpu0s.hex): Not enough words in the file for the
requested range [0:256].
00000000: 00df00b6
00000004: 08400004
00000008: 08500008
0000000c: 054d5000
00000010: 046d5000
00000014: 075d4000
00000018: 066d4000
0000001c: 08e0ffff
00000020: 30e00000
00000024: 13854000
00000028: 14854000
0000002c: 15854000
00000030: 16854000
00000034: 18854000
00000038: 19854000
0000003c: 1a854000
00000040: 1e850003
00000044: 1f850002
00000048: 10450000
0000004c: 20000018
00000050: 23000014
00000054: 25000010
00000058: 2200000c
0000005c: 24000008
00000060: 21000004
00000064: 26000000
00000068: 0810000a
0000006c: 2b000008
00000070: 31e00000
00000074: 2c000000
00000078: 30e00000
0000007c: 12300000
00000080: 024f0024
00000084: 08200000
00000088: 13223000
0000008c: 13334000
00000090: 10310000
00000094: 24fffff0
00000098: 012f000d
0000009c: 033f000d
000000a0: 31e00000
000000a4: 2c000000
000000a8: 01000000
000000ac: 00000001
000000b0: 02030405
000000b4: 06070809
000000b8: 0a0b0000
000000bc: 00ba0102
000000c0: 03040506
000000c4: 0708xxxx
000000c8: xxxxxxxx
000000cc: xxxxxxxx
000000d0: xxxxxxxx
000000d4: xxxxxxxx
000000d8: xxxxxxxx
000000dc: xxxxxxxx
000000e0: xxxxxxxx
000000e4: xxxxxxxx
000000e8: xxxxxxxx
000000ec: xxxxxxxx
000000f0: xxxxxxxx
000000f4: xxxxxxxx
000000f8: xxxxxxxx
000000fc: xxxxxxxx
  10ns 00000000 : LD    R13 R15 0x00b6 ; R13=0x000000ba=186
  30ns 00000004 : ADDI  R4  R0  4      ; R4 =0x00000004=4
  50ns 00000008 : ADDI  R5  R0  8      ; R5 =0x00000008=8
  70ns 0000000c : STR   R4  R13 R5     ; R4 =0x00000004=4
  90ns 00000010 : LDR   R6  R13 R5     ; R6 =0x00000004=4
 110ns 00000014 : SBR   R5  R13 R4     ; R5 =0x00000008=8
 130ns 00000018 : LBR   R6  R13 R4     ; R6 =0x00000008=8
 150ns 0000001c : ADDI  R14 R0  -1     ; R14=0xffffffff=-1
 170ns 00000020 : PUSH  R14            ; R14=0xffffffff, SP=0x000000b6
 190ns 00000024 : ADD   R8  R5  R4     ; R8 =0x0000000c=12
 210ns 00000028 : SUB   R8  R5  R4     ; R8 =0x00000004=4
 230ns 0000002c : MUL   R8  R5  R4     ; R8 =0x00000020=32
 250ns 00000030 : DIV   R8  R5  R4     ; R8 =0x00000002=2
 270ns 00000034 : AND   R8  R5  R4     ; R8 =0x00000000=0
 290ns 00000038 : OR    R8  R5  R4     ; R8 =0x0000000c=12
 310ns 0000003c : XOR   R8  R5  R4     ; R8 =0x0000000c=12
 330ns 00000040 : SHL   R8  R5  3      ; R8 =0x00000040=64
 350ns 00000044 : SHR   R8  R5  2      ; R8 =0x00000002=2
 370ns 00000048 : CMP   R4  R5         ; SW=0x80000000
 390ns 0000004c : JEQ   0x00000018     ; PC=0x00000050
 410ns 00000050 : JGT   0x00000014     ; PC=0x00000054
 430ns 00000054 : JGE   0x00000010     ; PC=0x00000058
 450ns 00000058 : JLT   0x0000000c     ; PC=0x00000068
 470ns 00000068 : ADDI  R1  R0  10     ; R1 =0x0000000a=10
 490ns 0000006c : CALL  0x00000008     ; PC=0x00000078
 510ns 00000078 : PUSH  R14            ; R14=0x00000070, SP=0x000000b2
 530ns 0000007c : MOV   R3  R0         ; R3 =0x00000000=0
 550ns 00000080 : LDB   R4  R15 0x0024 ; R4 =0x00000001=1
 570ns 00000084 : ADDI  R2  R0  0      ; R2 =0x00000000=0
 590ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000000=0
 610ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000001=1
 630ns 00000090 : CMP   R3  R1         ; SW=0x80000000
 650ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
 670ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000001=1
 690ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000002=2
 710ns 00000090 : CMP   R3  R1         ; SW=0x80000000
 730ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
 750ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000003=3
 770ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000003=3
 790ns 00000090 : CMP   R3  R1         ; SW=0x80000000
 810ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
 830ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000006=6
 850ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000004=4
 870ns 00000090 : CMP   R3  R1         ; SW=0x80000000
 890ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
 910ns 00000088 : ADD   R2  R2  R3     ; R2 =0x0000000a=10
 930ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000005=5
 950ns 00000090 : CMP   R3  R1         ; SW=0x80000000
 970ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
 990ns 00000088 : ADD   R2  R2  R3     ; R2 =0x0000000f=15
1010ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000006=6
1030ns 00000090 : CMP   R3  R1         ; SW=0x80000000
1050ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
1070ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000015=21
1090ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000007=7
1110ns 00000090 : CMP   R3  R1         ; SW=0x80000000
1130ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
1150ns 00000088 : ADD   R2  R2  R3     ; R2 =0x0000001c=28
1170ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000008=8
1190ns 00000090 : CMP   R3  R1         ; SW=0x80000000
1210ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
1230ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000024=36
1250ns 0000008c : ADD   R3  R3  R4     ; R3 =0x00000009=9
1270ns 00000090 : CMP   R3  R1         ; SW=0x80000000
1290ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
1310ns 00000088 : ADD   R2  R2  R3     ; R2 =0x0000002d=45
1330ns 0000008c : ADD   R3  R3  R4     ; R3 =0x0000000a=10
1350ns 00000090 : CMP   R3  R1         ; SW=0x40000000
1370ns 00000094 : JLE   0x00fffff0     ; PC=0x00000088
1390ns 00000088 : ADD   R2  R2  R3     ; R2 =0x00000037=55
1410ns 0000008c : ADD   R3  R3  R4     ; R3 =0x0000000b=11
1430ns 00000090 : CMP   R3  R1         ; SW=0x00000000
1450ns 00000094 : JLE   0x00fffff0     ; PC=0x00000098
1470ns 00000098 : ST    R2  R15 0x000d ; R2 =0x00000037=55
1490ns 0000009c : STB   R3  R15 0x000d ; R3 =0x0000000b=11
1510ns 000000a0 : POP   R14            ; R14=0x00000070, SP=0x000000b6
1530ns 000000a4 : RET                  ; PC=0x00000070
1550ns 00000070 : POP   R14            ; R14=0xffffffff, SP=0x000000ba
1570ns 00000074 : RET                  ; PC=0xffffffff
```

### 結語

從本章的內容中，您應該可以瞭解到直接使用高階的 Verilog 流程式語法來設計處理器，像是 cpu0mc.v 與 cpu0s.v ，
都是相當容易的事，這完全是因為 verilog 支援了相當高階的運算，像是 「+, -, *, /, &, |, ^, <<, >>」等運算的原故。

不過、在上述程式當中，我們並沒有支援「硬體中斷」的功能，也沒有實作「軟體中斷」SWI 的函數呼叫，這樣  cpu0s.v 就
只能是一顆單工 (Single Task) 的處理器，而無法支援多工 (Multi Task) 的功能了。

在下一章當中，我們將繼續擴充 cpu0s.v 這個程式，加入支援「軟硬體中斷」的功能，以及支援「浮點運算」的功能，
該程式稱為 cpu0i.v (i 代表 Interrupt, c 代表 cache memory)。

然後我們將再度用 16 進位的方式，寫出一個機器語言的程式，可以同時執行兩個「行程」(Task) ，並且每隔一小段時間就利用
硬體中斷進行「行程切換」，以示範如何設計一個可以支援「多工」能力的 CPU 處理器。

### 參考文獻
* [陳鍾誠的網站：使用 Verilog 設計 CPU0 處理器](http://ccckmit.wikidot.com/ve:cpu0s)
* [陳鍾誠的網站：CPU0-Mini 處理器設計](http://ccckmit.wikidot.com/ve:cpu0m)

