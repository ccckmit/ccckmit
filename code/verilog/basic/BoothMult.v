// °Ñ¦Ò¤åÄm¡Ghttp://www.docstoc.com/docs/68290539/verilog-code-for-module-multiplier

module BoothMult(output reg [15:0] ab, output [15:0] prod, output busy, input [7:0] mc, mp, input clk, start);
reg [7:0] A, Q, M;
reg Q_1;
reg [3:0] count;
wire [7:0] sum, diff;

always @(posedge clk) begin
   if (start) begin
      A <= 8'b0;      
      M <= mc;
      Q <= mp;
      Q_1 <= 1'b0;      
      count <= 4'b0;
   end
   else begin
      case ({Q[0], Q_1})
         2'b0_1 : {A, Q, Q_1} <= {sum[7], sum, Q};
         2'b1_0 : {A, Q, Q_1} <= {diff[7], diff, Q};
         default: {A, Q, Q_1} <= {A[7], A, Q};
      endcase
      count <= count + 1'b1;
	  if (count == 8)
	    ab = {A, Q};
   end
end

alu adder(sum, A, M, 1'b0);
alu suber(diff, A, ~M, 1'b1);
assign prod = {A, Q};
assign busy = (count < 8);

endmodule

module alu(out, a, b, cin);
output [7:0] out;
input [7:0] a;
input [7:0] b;
input cin;
assign out = a + b + cin;
endmodule

module testbench;
reg clk, start;
reg [7:0] a, b;
wire [15:0] ab, prod;
wire busy;

BoothMult mult(ab, prod, busy, a, b, clk, start);

initial begin
  clk = 0;
  a = 30; b = 13; start = 1; 
  #100;
  start = 0;
  #100;
  $finish;
end

always #5 clk = !clk;
always @(posedge clk) $strobe("%dns : ab=%d prod=%d busy=%d", $stime, ab, prod, busy);

endmodule
