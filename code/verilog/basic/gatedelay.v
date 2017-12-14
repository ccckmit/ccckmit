module main;
 reg clk;
 wire o;

 not #5 not1(o, clk);

 initial begin
   clk = 0;
   $monitor("%dns monitor: clk=%b o=%d", $stime, clk, o);
 end

 always #10 begin
   clk = clk + 1;
 end

initial #100 $finish;

endmodule
