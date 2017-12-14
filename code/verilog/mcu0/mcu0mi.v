`define OP   IR[15:12] // 運算碼
`define MOP  IR[11:8]  // 加長運算碼
`define C    IR[11:0]  // 常數欄位
`define C4   IR[3:0]   // 常數欄位
`define C8   IR[7:0]   // 常數欄位
`define A    R[0]      // 累積器
`define LR   R[1]      // 狀態暫存器
`define SW   R[2]      // 狀態暫存器
`define SP   R[3]      // 堆疊暫存器
`define PC   R[4]      // 程式計數器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標
`define M    m[`C]     // 存取記憶體

module cpu(input clock, input interrupt, input[2:0] irq); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [3:0] LD=4'h0,ST=4'h1,ADD=4'h2,SUB=4'h3,MUL=4'h4,DIV=4'h5,AND=4'h6,OR=4'h7,XOR=4'h8,CMP=4'h9,JMP=4'hA,JEQ=4'hB, JNE=4'hC, JLT=4'hD, JGT=4'hE, MORE=4'hF;
  parameter [3:0] LDI=4'h0, PUSH=4'h3, POP=4'h4, SHL=4'h5, SHR=4'h6, SWI=4'hA, IRET=4'hF;
  reg [15:0] IR;    // 指令暫存器
  reg [15:0] R[0:4];
  reg [15:0] pc0;
  reg [15:0] m [0:4095]; // 內部的快取記憶體
  reg isInterrupted;
  integer i;  
  initial  // 初始化
  begin
    `PC = 0; // 將 PC 設為起動位址 0
    `SW = 0;
    `SP = 4096;
    isInterrupted = 0;
    $readmemh("mcu0mi.hex", m);
    for (i=0; i < 32; i=i+2) begin
       $display("%x %x", i, m[i]);
    end
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
    IR = m[`PC];                // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
    pc0= `PC;                   // 儲存舊的 PC 值在 pc0 中。
    `PC = `PC+1;                // 擷取完成，PC 前進到下一個指令位址
    case (`OP)                  // 解碼、根據 OP 執行動作
      LD: `A = `M; 		// LD C
      ST: `M = `A;		// ST C
      ADD: `A = `A + `M;	// ADD C
      SUB: `A = `A - `M;	// SUB C
      MUL: `A = `A * `M;	// MUL C
      DIV: `A = `A / `M;	// DIV C
      AND: `A = `A & `M;	// DIV C
      OR : `A = `A | `M;	// DIV C
      XOR: `A = `A ^ `M;	// DIV C
      CMP: begin `N=(`A < `M); `Z=(`A==`M); end // CMP C
      JMP: `PC = `C;		// JMP C
      JEQ: if ( `Z) `PC=`C;	// JEQ C
      JNE: if (!`Z) `PC=`C;	// JEQ C
      JLT: if ( `N) `PC=`C;	// JEQ C
      JGT: if (!`N) `PC=`C;	// JEQ C
      MORE: case (`MOP)
        LDI:  `A = `C;          // LDI C
        PUSH: begin `SP=`SP-1; m[`SP] = R[`C4]; end // PUSH C
        POP:  begin R[`C4] = m[`SP]; `SP=`SP+1; end // POP  C
        SHL:  `A = `A << `C4;   // SHL C
        SHR:  `A = `A >> `C4;   // SHR C
        SWI:  $display("SWI C=%d A=%d", `C8, `A);  // SWI C
        IRET: begin `PC = `LR; isInterrupted = 0; end  // IRET
        default: $display("mop=%d , not defined!", `MOP);
      endcase
    endcase
    // 印出 PC, IR, SW, A 等暫存器值以供觀察
    $display("%4dns PC=%x IR=%x, SW=%x, A=%d SP=%x LR=%x", $stime, pc0, IR, `SW, `A, `SP, `LR);
    if (!isInterrupted && interrupt) begin
      isInterrupted = 1;
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

initial #4000 $finish;      // 在 3000 奈秒的時候停止測試。

endmodule
