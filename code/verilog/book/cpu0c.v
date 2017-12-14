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

module cpu0c(input clock); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [7:0] LD=8'h00,ST=8'h01,LDB=8'h02,STB=8'h03,LDR=8'h04,STR=8'h05,
    LBR=8'h06,SBR=8'h07,ADDI=8'h08,CMP=8'h10,MOV=8'h12,ADD=8'h13,SUB=8'h14,
    MUL=8'h15,DIV=8'h16,AND=8'h18,OR=8'h19,XOR=8'h1A,ROL=8'h1C,ROR=8'h1D,
    SHL=8'h1E,SHR=8'h1F,JEQ=8'h20,JNE=8'h21,JLT=8'h22,JGT=8'h23,JLE=8'h24,
    JGE=8'h25,JMP=8'h26,SWI=8'h2A,CALL=8'h2B,RET=8'h2C,IRET=8'h2D,
    PUSH=8'h30,POP=8'h31,PUSHB=8'h32,POPB=8'h33;
  reg signed [31:0] R [0:15];   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg signed [31:0] IR;         // 指令暫存器 IR
  reg [7:0] m [0:128];          // 內部的快取記憶體
  reg [7:0] op;                 // 變數：運算代碼 op
  reg [3:0] ra, rb, rc;         // 變數：暫存器代號 ra, rb, rc
  reg [4:0] c5;                 // 變數：5 位元常數 c5
  reg signed [11:0] c12;        // 變數：12 位元常數 c12
  reg signed [15:0] c16;        // 變數：16 位元常數 c16
  reg signed [23:0] c24;        // 變數：24 位元常數 c24
  reg signed [31:0] sp, jaddr, laddr, raddr;
  reg signed [31:0] temp;

  initial  // 初始化
  begin
    `PC = 0;                    // 將 PC 設為起動位址 0
    R[0] = 0;                   // 將 R[0] 暫存器強制設定為 0
    {m[0],m[1],m[2],m[3]}    = 32'h001F0018; // 0000       LD   R1, K1
    {m[4],m[5],m[6],m[7]}    = 32'h002F0010; // 0004       LD   R2, K0
    {m[8],m[9],m[10],m[11]}  = 32'h003F0014; // 0008       LD   R3, SUM
    {m[12],m[13],m[14],m[15]}= 32'h13221000; // 000C LOOP: ADD  R2, R2, R1
    {m[16],m[17],m[18],m[19]}= 32'h13332000; // 0010       ADD  R3, R3, R2
    {m[20],m[21],m[22],m[23]}= 32'h26FFFFF4; // 0014       JMP  LOOP
    {m[24],m[25],m[26],m[27]}= 32'h00000000; // 0018 K0:   WORD 0
    {m[28],m[29],m[30],m[31]}= 32'h00000001; // 001C K1:   WORD 1
    {m[32],m[33],m[34],m[35]}= 32'h00000000; // 0020 SUM:  WORD 0
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      IR = {m[`PC], m[`PC+1], m[`PC+2], m[`PC+3]};  // 指令擷取階段：IR=m[PC], 4 個 Byte 的記憶體
      `PC = `PC+4;                                  // 擷取完成，PC 前進到下一個指令位址
      {op,ra,rb,rc,c12} = IR;                      // 解碼階段：將 IR 解為 {op, ra, rb, rc, c12}
      c5  = IR[4:0];
      c24 = IR[23:0];
      c16 = IR[15:0];
      jaddr = `PC+c16;
	  laddr = R[rb]+c16;
	  raddr = R[rb]+R[rc];
//	  $display(" ra=%d, rb=%d, rc=%d, jaddr=%x, laddr=%x, raddr=%x", ra, rb, rc, jaddr, laddr, raddr);
      case (op) // 根據 OP 執行對應的動作
        LD: begin   // 載入指令： R[ra] = m[addr]
          R[ra] = {m[laddr], m[laddr+1], m[laddr+2], m[laddr+3]};
          $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        ST: begin   // 儲存指令： m[addr] = R[ra]
          {m[laddr], m[laddr+1], m[laddr+2], m[laddr+3]} = R[ra];
          $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        LDB:begin   // 載入byte;     LDB Ra, [Rb+ Cx];   Ra<=(byte)[Rb+ Cx]
          R[ra] = { 24'b0, m[laddr] };
          $write("%4dns %8x : LDB %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        STB:begin   // 儲存byte;     STB Ra, [Rb+ Cx];   Ra=>(byte)[Rb+ Cx]
          m[laddr] = R[ra][7:0];
          $write("%4dns %8x : STB %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        LDR:begin   // LD 的 Rc 版;  LDR Ra, [Rb+Rc];    Ra<=[Rb+ Rc]
          R[ra] = {m[raddr], m[raddr+1], m[raddr+2], m[raddr+3]};
          $write("%4dns %8x : LDR %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        STR:begin   // ST 的 Rc 版;  STR Ra, [Rb+Rc];    Ra=>[Rb+ Rc]
          {m[raddr], m[raddr+1], m[raddr+2], m[raddr+3]} = R[ra];
          $write("%4dns %8x : STR %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        LBR:begin   // LDB 的 Rc 版; LBR Ra, [Rb+Rc];    Ra<=(byte)[Rb+ Rc]
          R[ra] = { 24'b0, m[raddr] };
          $write("%4dns %8x : LBR %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        SBR:begin   // STB 的 Rc 版; SBR Ra, [Rb+Rc];    Ra=>(byte)[Rb+ Rc]
          m[raddr] = R[ra][7:0];
          $write("%4dns %8x : SBR %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        MOV:begin   // 移動;        MOV Ra, Rb;         Ra<=Rb
		  R[ra] = R[rb];
          $write("%4dns %8x : MOV %x,%x", $stime, `PC, ra, rb);
          end
        CMP:begin   // 比較;        CMP Ra, Rb;         SW=(Ra >=< Rb)
		  temp = R[ra]-R[rb];
		  `N=(temp<0);`Z=(temp==0);
          $write("%4dns %8x : CMP %x,%x; SW=%x", $stime, `PC, ra, rb, `SW);
          end
        ADDI:begin  // R[a] = Rb+c16;  // 立即值加法;   LDI Ra, Rb+Cx; Ra<=Rb + Cx
		  R[ra] = R[rb]+c16;
          $write("%4dns %8x : ADDI %x,%x,%-4x", $stime, `PC, ra, rb, c16);
          end
        ADD: begin  // 加法指令： R[ra] = R[rb]+R[rc]
          R[ra] = R[rb]+R[rc];
          $write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        SUB:begin   // 減法;        SUB Ra, Rb, Rc;     Ra<=Rb-Rc
          R[ra] = R[rb]-R[rc];
          $write("%4dns %8x : SUB %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        MUL:begin   // 乘法;        MUL Ra, Rb, Rc;     Ra<=Rb*Rc
          R[ra] = R[rb]*R[rc];
          $write("%4dns %8x : MUL %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        DIV:begin   // 除法;        DIV Ra, Rb, Rc;     Ra<=Rb/Rc
          R[ra] = R[rb]/R[rc];
          $write("%4dns %8x : DIV %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        AND:begin   // 位元 AND;    AND Ra, Rb, Rc;     Ra<=Rb and Rc
          R[ra] = R[rb]&R[rc];
          $write("%4dns %8x : AND %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        OR:begin    // 位元 OR;     OR Ra, Rb, Rc;         Ra<=Rb or Rc
          R[ra] = R[rb]|R[rc];
          $write("%4dns %8x : OR  %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        XOR:begin   // 位元 XOR;    XOR Ra, Rb, Rc;     Ra<=Rb xor Rc
          R[ra] = R[rb]^R[rc];
          $write("%4dns %8x : XOR %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        SHL:begin   // 向左移位;    SHL Ra, Rb, Cx;     Ra<=Rb << Cx
          R[ra] = R[rb]<<c5;
          $write("%4dns %8x : SHL %x,%x,%-4x", $stime, `PC, ra, rb, c5);
          end
        SHR:begin   // 向右移位;        SHR Ra, Rb, Cx;     Ra<=Rb >> Cx
          R[ra] = R[rb]+R[rc];
          $write("%4dns %8x : SHR %x,%x,%-4x", $stime, `PC, ra, rb, c5);
          end		  
        JMP:begin   // 跳躍指令： PC = PC + cx24
          `PC = `PC + c24;
          $write("%4dns %8x : JMP %-8x", $stime, `PC, c24);
          end
        JEQ:begin   // 跳躍 (相等);        JEQ Cx;        if SW(=) PC  PC+Cx
		  if (`Z) `PC=`PC+c24;
          $write("%4dns %8x : JEQ %-8x", $stime, `PC, c24);
          end
        JNE:begin   // 跳躍 (不相等);    JNE Cx;     if SW(!=) PC  PC+Cx
		  if (!`Z) `PC=`PC+c24;
          $write("%4dns %8x : JNE %-8x", $stime, `PC, c24);
          end
        JLT:begin   // 跳躍 ( < );        JLT Cx;     if SW(<) PC  PC+Cx
          if (`N) `PC=`PC+c24;
          $write("%4dns %8x : JLT %-8x", $stime, `PC, c24);
          end
        JGT:begin   // 跳躍 ( > );        JGT Cx;     if SW(>) PC  PC+Cx
          if (!`N&&!`Z) `PC=`PC+c24;
          $write("%4dns %8x : JGT %-8x", $stime, `PC, c24);
          end
        JLE:begin   // 跳躍 ( <= );        JLE Cx;     if SW(<=) PC  PC+Cx  
          if (`N || `Z) `PC=`PC+c24;
          $write("%4dns %8x : JLE %-8x", $stime, `PC, c24);
          end
        JGE:begin   // 跳躍 ( >= );        JGE Cx;     if SW(>=) PC  PC+Cx
          if (!`N || `Z) `PC=`PC+c24;
          $write("%4dns %8x : JGE %-8x", $stime, `PC, c24);
          end
        SWI:begin   // 軟中斷;    SWI Cx;         LR <= PC; PC <= Cx; INT<=1
          `LR=`PC;`PC= c24; `I = 1'b1;
          $write("%4dns %8x : SWI %-8x", $stime, `PC, c24);
          end
        CALL:begin  // 跳到副程式;    CALL Cx;     LR<=PC; PC<=PC+Cx
          `LR=`PC;`PC=`PC + c24;
          $write("%4dns %8x : CALL %-8x", $stime, `PC, c24);
          end
        RET:begin   // 返回;            RET;         PC <= LR
          `PC=`LR;
          $write("%4dns %8x : RET, PC=%x", $stime, `PC);
          end
        IRET:begin  // 中斷返回;        IRET;         PC <= LR; INT<=0
          `PC=`LR;`I = 1'b0;
          $write("%4dns %8x : RET, PC=%x", $stime, `PC);
          end
        PUSH:begin  // 推入 word;    PUSH Ra;    SP-=4;[SP]<=Ra;
          sp = `SP-4; `SP = sp; {m[sp], m[sp+1], m[sp+2], m[sp+3]} = R[ra];
          $write("%4dns %8x : PUSH %-x", $stime, `PC, R[ra]);
		  end
        POP:begin   // 彈出 word;    POP Ra;     Ra=[SP];SP+=4;
          sp = `SP+4; `SP = sp; R[ra]={m[sp], m[sp+1], m[sp+2], m[sp+3]};
          $write("%4dns %8x : POP %-x", $stime, `PC, R[ra]);
          end
        PUSHB:begin // 推入 byte;    PUSHB Ra;   SP--;[SP]<=Ra;(byte)
          sp = `SP-1; `SP = sp; m[sp] = R[ra];
          $write("%4dns %8x : PUSHB %-x", $stime, `PC, R[ra]);
          end
        POPB:begin  // 彈出 byte;    POPB Ra;  Ra<=[SP];SP++;(byte)
          sp = `SP+1; `SP = sp; R[ra]=m[sp];
          $write("%4dns %8x : POPB %-x", $stime, `PC, R[ra]);
          end
      endcase
      $display(" R[%2d]=%4d", ra, R[ra]); // 顯示目標暫存器的值
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu0c cpu(clock);          // 宣告 cpu0mc 處理器

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10 奈秒將 clock 反相，產生週期為 20 奈秒的時脈
initial #640 $finish;       // 在 640 奈秒的時候停止測試。(因為這時的 R[1] 恰好是 1+2+...+10=55 的結果)
endmodule
