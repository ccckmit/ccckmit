module not1(input i1, output o1);
  reg o1;
  always @(i1) begin
    o1 = !i1;
  end
endmodule
