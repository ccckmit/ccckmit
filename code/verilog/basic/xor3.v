module xor3(input a, b, c, output abc);
wire ab;
xor g1(ab, a, b);
xor g2(abc, c, ab);
endmodule

module xor3test;
reg a, b, c;
wire abc;

xor3 g(a,b,c, abc);

initial
begin
  a = 0;
  b = 0;
  c = 0;
end

always #50 begin
  a = a+1;
  $monitor("%4dns monitor: a=%d b=%d c=%d a^b^c=%d", $stime, a, b, c, abc);
end

always #100 begin
  b = b+1;
end

always #200 begin
  c = c+1;
end

initial #2000 $finish;

endmodule
