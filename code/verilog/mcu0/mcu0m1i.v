`define N    SW[15] // 負號旗標
`define Z    SW[14] // 零旗標
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define M    {m[`C], m[`C+1]}

module cpu(input clock, input interrupt, input[2:0] irq); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5, SWI=4'h6, IRET=4'h7;
  reg signed [15:0] A, iA;   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg [15:0] IR;  // 指令暫存器 IR
  reg [15:0] SW;  // 指令暫存器 IR
  reg [15:0] PC;  // 程式計數器
  reg [15:0] LR;  // 連結暫存器 LR
  reg [15:0] pc0;
  reg [7:0]  m [0:128];    // 內部的快取記憶體
  reg isInterrupt;
  integer i;  
  initial  // 初始化
  begin
    PC = 0; // 將 PC 設為起動位址 0
    SW = 0;
    isInterrupt = 0;
    $readmemh("mcu0m1i.hex", m);
    for (i=0; i < 32; i=i+2) begin
       $display("%8x: %8x", i, {m[i], m[i+1]});
    end
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
    IR = {m[PC], m[PC+1]};  // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
    pc0= PC;                // 儲存舊的 PC 值在 pc0 中。
    PC = PC+2;              // 擷取完成，PC 前進到下一個指令位址
    case (`OP)              // 解碼、根據 OP 執行動作
      LD: A = `M; 		  // LD C
      ST: `M = A;			  // ST C
      CMP: begin `N=(A < `M); `Z=(A==`M); end // CMP C
      ADD: A = A + `M;	  // ADD C
      JMP: PC = `C;		  // JMP C
      JEQ: if (`Z) PC=`C;	  // JEQ C
      SWI: $display("SWI C=%d A=%d", `C, A);
      IRET: begin PC = LR; A = iA; isInterrupt = 0; end
    endcase
    if (!isInterrupt && interrupt) begin
      isInterrupt = 1;
      iA = A;
      LR = PC;
      PC = irq << 1;
    end
    // 印出 PC, IR, SW, A 等暫存器值以供觀察
    $display("%4dns PC=%x IR=%x, SW=%x, A=%d", $stime, pc0, IR, SW, A); 
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
initial #2500 $finish;      // 在 2000 奈秒的時候停止測試。
endmodule
