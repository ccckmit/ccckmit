module latch(input Sbar, Rbar, output Q, Qbar);

nand g1(Q, Sbar, Qbar);
nand g2(Qbar, Rbar, Q);

endmodule

module main;
reg Sbar, Rbar;
wire Q, Qbar;

latch DUT(Sbar, Rbar, Q, Qbar);

initial
begin
  Sbar = 0;
  Rbar = 0;
end

always #50 begin
  Sbar = Sbar+1;
  $monitor("%4dns monitor: Sbar=%d Rbar=%d Q=%d Qbar=%d", 
           $stime, Sbar, Rbar, Q, Qbar);
end

always #100 begin
  Rbar = Rbar + 1;
end

initial #1000 $finish;

endmodule
