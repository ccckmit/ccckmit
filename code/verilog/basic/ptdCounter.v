module register(input en, input [31:0] d, output reg [31:0] r);
always @(en) begin
  if (en)
    r <= d;
end
endmodule

module ptd(input clk, output ppulse);
  not  #2 P1(nclkd, clk);
  nand #2 P2(npulse, nclkd, clk);
  not  #2 P3(ppulse, npulse);
endmodule

module inc(input [31:0] i, output [31:0] o);
  assign o = i + 4;
endmodule

module main;
wire [31:0] r, ro;
reg clk;
wire en;

ptd ptd1(clk, en);
register r1(en, ro, r);
inc i1(r, ro);

initial begin
  clk = 0;
  r1.r = 0;
  $monitor("%4dns monitor: clk=%d en=%d r=%d", $stime, clk, en, r);
  $dumpfile("ptdCounter.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
end

always #10 begin
  clk = clk + 1;
end

initial #100 $finish;

endmodule
