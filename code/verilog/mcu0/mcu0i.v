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
