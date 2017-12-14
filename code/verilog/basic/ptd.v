module ptd(input clk, output ppulse);

not #2 g1(nclkd, clk);
nand #2 g2(npulse, nclkd, clk);
not #2 g3(ppulse, npulse);

endmodule

module main;
 reg clk;
 wire p;

 ptd ptd1(clk, p);

 initial begin
   clk = 0;
   $monitor("%dns monitor: clk=%b p=%d", $stime, clk, p);
   $dumpfile("ptd.vcd"); // 輸出給 GTK wave 顯示波型
   $dumpvars;
 end

 always #10 begin
   clk = clk + 1;
 end

initial #100 $finish;

endmodule
