`define W 16

module register(input load, input [`W:0] idata, output [`W:0] odata);
  reg [`W:0] data;
  always @(posedge load) begin
    data = idata;
  end
  assign odata = data;
endmodule

module memory(input load, input [`W:0] addr, input [`W:0] idata, output [`W:0] odata);
    reg [7:0] m [0:128];
    always @(posedge load) begin
        if (addr >=0 && addr < 128)
           {m[abus], m[abus+1], m[abus+2], m[abus+3]} = idata;
    end
    assign odata = {m[abus], m[abus+1], m[abus+2], m[abus+3];
endmodule

module adder(input [`W:0] a, input [`W:0] b, output [`W:0] y);
  assign y = a+b;
endmodule

// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module alu(input [`W:0] a, input [`W:0] b, input [2:0] op, output reg [`W:0] y);
always@(a or b or op) begin // 當 a, b 或 op 有改變時，就進入此區塊執行。
  case(op)                  // 根據 op 決定要執行何種運算
    3'b000: y = a + b;      // op=000, 執行加法
    3'b001: y = a - b;      // op=000, 執行減法
    3'b010: y = a * b;      // op=000, 執行乘法
    3'b011: y = a / b;      // op=000, 執行除法
    3'b100: y = a & b;      // op=000, 執行 AND
    3'b101: y = a | b;      // op=000, 執行 OR
    3'b110: y = ~a;         // op=000, 執行 NOT
    3'b111: y = a ^ b;      // op=000, 執行 XOR
  endcase
  $display("base 10 : %dns : op=%d a=%d b=%d y=%d", $stime, op, a, b, y); // 印出 op, a, b, y 的 10 進位值。
  $display("base  2 : %dns : op=%b a=%b b=%b y=%b", $stime, op, a, b, y); // 印出 op, a, b, y 的  2 進位值。
end
endmodule


/*
`define N    SW[15] // 負號旗標
`define Z    SW[14] // 零旗標
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define M    {m[`C], m[`C+1]}

module cpu(input clock); // CPU0-Mini 的快取版：cpu0mc 模組
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  reg signed [15:0] A;   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg [15:0] IR;  // 指令暫存器 IR
  reg [15:0] SW;  // 指令暫存器 IR
  reg [15:0] PC;  // 程式計數器
  reg [15:0] pc;
  reg [7:0]  m [0:32];    // 內部的快取記憶體
  reg signed [15:0] M;
  integer i;  
  initial  // 初始化
  begin
    PC = 0; // 將 PC 設為起動位址 0
	SW = 0;
    $readmemh("cpu16m.hex", m);
    for (i=0; i < 32; i=i+2) begin
       $display("%8x: %8x", i, {m[i], m[i+1]});
    end
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      IR = {m[PC], m[PC+1]};  // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
	  pc = PC;
      PC = PC+2;              // 擷取完成，PC 前進到下一個指令位址
	  M = {m[`C], m[`C+1]};
      case (`OP)
        LD: A = M; 
        ST: {m[`C], m[`C+1]} = A;
        CMP: begin `N=(A < M); `Z=(A==M); end
        ADD: A = A + M;
        JMP: PC = `C;
        JEQ: if (`Z) PC=`C;
      endcase
      $display("%4dns PC=%x IR=%x, SW=%x, A=%d", $stime, pc, IR, SW, A);
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu cpux(clock);            // 宣告 cpu0mc 處理器

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10 奈秒將 clock 反相，產生週期為 20 奈秒的時脈
initial #2000 $finish;      // 在 640 奈秒的時候停止測試。(因為這時的 R[1] 恰好是 1+2+...+10=55 的結果)
endmodule
*/