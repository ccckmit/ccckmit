module main;
 reg clk;

 not #2 n1(nclk1, clk);
 not #(1:3:5) n2(nclk2, clk);

 initial begin
   clk = 0;
   $monitor("%dns monitor: clk=%b nclk1=%d nclk2=%d", $stime, clk, nclk1, nclk2);
   $dumpfile("delay.vcd"); // 輸出給 GTK wave 顯示波型
   $dumpvars;
 end

 always #10 begin
   clk = clk + 1;
 end

initial #100 $finish;

endmodule
