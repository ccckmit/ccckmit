module not1(input i1, output o1);
  reg r;
  always @(i1) begin
    r = !i1;
  end
  assign o1=r;
endmodule
