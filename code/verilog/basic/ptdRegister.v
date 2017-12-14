module ptd(input clk, output ppulse);

not #2 g1(nclkd, clk);
nand #2 g2(npulse, nclkd, clk);
not #2 g3(ppulse, npulse);

endmodule

module register(input en, input [31:0] d, output reg [31:0] r);
always @(en) begin
  if (en)
    r <= d;
end
endmodule

module main;
reg [31:0] d;
wire [31:0] r;
reg clk;
wire en;

ptd ptd1(clk, en);
register register1(en, d, r);

initial begin
  clk = 0;
  d = 3;
  $monitor("%4dns monitor: clk=%d en=%d d=%d r=%d", $stime, clk, en, d, r);
end

always #10 begin
  clk = clk + 1;
end

always #20 begin
  d = d + 1;
end

initial #100 $finish;

endmodule
