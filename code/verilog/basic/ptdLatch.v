module ptd(input clk, output ppulse);

not #2 g1(nclkd, clk);
nand #3 g2(npulse, nclkd, clk);
not #2 g3(ppulse, npulse);

endmodule

module enLatch(input S, R, en, output Q, Qbar);

nand #3 gen1(S1, en, S);
nand #3 gen2(R1, en, R);
nand #3 g1(Q, S1, Qbar);
nand #3 g2(Qbar, R1, Q);

endmodule

module main;
reg clk, D;
wire en, Q, Qbar, Dbar;

ptd ptd1(clk, en);
not not1(Dbar, D);
enLatch latch1(D, Dbar, en, Q, Qbar);

initial
begin
  clk = 0;
  D = 0;
  $monitor("%4dns monitor: clk=%d en=%d D=%d Q=%d Qbar=%d", $stime, clk, en, D, Q, Qbar);
  $dumpfile("ptdLatch.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;  
end

always #20 begin
  clk = clk + 1;
end

always #40 begin
  D = D + 1;
end

initial #100 $finish;

endmodule
