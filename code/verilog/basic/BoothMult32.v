// °Ñ¦Ò¤åÄm¡Ghttp://www.docstoc.com/docs/68290539/verilog-code-for-module-multiplier

module BoothMult(output reg [63:0] ab, output [63:0] prod, output busy, input [31:0] mc, mp, input clk, start);
reg [31:0] A, Q, M;
reg Q_1;
reg [5:0] count;
wire [31:0] sum, diff;

always @(posedge clk) begin
   if (start) begin
      A <= 0;
      M <= mc;
      Q <= mp;
      Q_1 <= 0;
      count <= 0;
   end
   else begin
      case ({Q[0], Q_1})
         2'b0_1 : {A, Q, Q_1} <= {sum[31], sum, Q};
         2'b1_0 : {A, Q, Q_1} <= {diff[31], diff, Q};
         default: {A, Q, Q_1} <= {A[31], A, Q};
      endcase
      count <= count + 1'b1;
	  if (count == 32)
	    ab = {A, Q};
   end
end

alu adder(sum, A, M, 1);
alu suber(diff, A, ~M, 1);
assign prod = {A, Q};
assign busy = (count < 32);

endmodule

module alu(output [31:0] out, input [31:0] a, b, input cin);
  assign out = a + b + cin;
endmodule

module testbench;
reg clk, start;
reg [31:0] a, b;
wire [63:0] ab, prod;
wire busy;

BoothMult mult(ab, prod, busy, a, b, clk, start);

initial begin
  clk = 0;
  a = 30; b = 13; start = 1; 
  #1500;
  start = 0;
  #1500;
  $finish;
end

always #5 clk = !clk;
always @(posedge clk) $strobe("%dns : ab=%d prod=%d busy=%d", $stime, ab, prod, busy);

endmodule
