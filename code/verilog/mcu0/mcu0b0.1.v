module memory(input w, input [11:0] addr, inout [15:0] data);
  integer i;  
  reg [7:0] m[0:2**12-1];  // 內部的快取記憶體
  initial begin // 初始化
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign data = (!w)?{m[addr], m[addr+1]} : 16'hz;
  always @(w) begin
    if (w) begin
      {m[addr], m[addr+1]} = data;
       $display("write %x to addr=%x", data, addr);
    end
  end
endmodule

module register(input w, input [15:0] ri, output [15:0] ro);
reg r;
  always @(w) begin
    if (w) r = ri;
  end
  assign ro=r;
endmodule

module mcu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  parameter mw=0;
  parameter [15:0] pci = 16'h0;
  wire [15:0] pco, ir;
  register pc(mw, pci, pco);
  memory mem(mw, pco[11:0], ir);
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數
wire w;
wire [11:0] addr;
wire [15:0] data;

mcu mcu0(clock); // 宣告 cpu0mc 處理器
// memory mem0(w, addr, data);

initial mcu0.pc.r = 0;       // 一開始 clock 設定為 0
always #10 mcu0.pc.r=mcu0.pc.r+1;    // 每隔 10ns 反相，時脈週期為 20ns
initial #500 $finish;      // 停止測試。
endmodule

/*
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define A    R[0]      // 累積器
`define PC   R[1]      // 程式計數器
`define SW   R[2]      // 狀態暫存器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標
`define M    {mem0.m[`C], mem0.m[`C+1]} // 存取的記憶體

module adder(input [15:0] a, input [15:0] b, output reg [15:0] c)
  assign c = a + b;
endmodule

module alu(input [3:0] op, input [15:0] a, input [15:0] b, output reg [15:0] c)
parameter [3:0] ADD=4'h0, CMP=4'hf;
  always @(op) begin
    case (op)
      ADD: c = a+b;
      CMP: begin c[15]=(a < b); c[14]=(a==b); end
    endcase
  end
endmodule

module regbank(input clock, input w, input [3:0] wi,ri1, ri2, input [15:0] wd, output reg [15:0] ro1, ro2)
reg [15:0] r[0:15];
  assign ro1 = r[ri1];
  assign ro2 = r[ri2];
  always @(clock) begin
    if (w) begin
      r[wi] = wd;
      $display("write %x to reg=%x", wd, wi);
    end
  end
endmodule

module mux(input a, input b, output c)
reg [15:0] r[0:15];
  assign ro1 = r[ri1];
  assign ro2 = r[ri2];
  always @(clock) begin
    if (w) begin
      r[wi] = wd;
      $display("write %x to reg=%x", wd, wi);
    end
  end
endmodule
*/
