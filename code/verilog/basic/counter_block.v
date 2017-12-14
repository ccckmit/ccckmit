module inc(input [2:0] i, output [2:0] o);
  assign o = i + 1;
endmodule

module register(input clk, rst, input [2:0] r_in, output [2:0] r_out);
  reg [2:0] r;
  always @(posedge clk) begin
    if (rst)
      r = 3'b000;
    else
      r = r_in;
  end
  assign r_out = r;
endmodule

module counter;
reg clk;
reg rst;
wire [2:0] c_in, c_out;

register c(clk, rst, c_in, c_out);
inc inc1(c_out, c_in);

initial
begin
  $monitor("%4dns monitor: c.r=%d", $stime, c.r);
  clk = 0;
  rst = 1;
  #100 rst = 0;
  #1000 $finish;
end

always #50 begin
  clk=clk+1; 
end

endmodule
