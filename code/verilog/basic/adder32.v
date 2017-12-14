module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
xor g5(c_out, c2, c1) ;

endmodule

module adder4(input signed [3:0] a, input signed [3:0] b, input c_in, output signed [3:0] sum, output c_out);
wire [3:0] c;

fulladder fa1(a[0],b[0], c_in, sum[0], c[1]) ;
fulladder fa2(a[1],b[1], c[1], sum[1], c[2]) ;
fulladder fa3(a[2],b[2], c[2], sum[2], c[3]) ;
fulladder fa4(a[3],b[3], c[3], sum[3], c_out) ;

endmodule

module adder32(input signed [31:0] a, input signed [31:0] b, input c_in, output signed [31:0] sum, output c_out);
wire [7:0] c;

adder4 a0(a[3:0]  ,b[3:0],   c_in, sum[3:0],  c[0]) ;
adder4 a1(a[7:4]  ,b[7:4],   c[0], sum[7:4],  c[1]) ;
adder4 a2(a[11:8] ,b[11:8],  c[1], sum[11:8], c[2]) ;
adder4 a3(a[15:12],b[15:12], c[2], sum[15:12],c[3]) ;
adder4 a4(a[19:16],b[19:16], c[3], sum[19:16],c[4]) ;
adder4 a5(a[23:20],b[23:20], c[4], sum[23:20],c[5]) ;
adder4 a6(a[27:24],b[27:24], c[5], sum[27:24],c[6]) ;
adder4 a7(a[31:28],b[31:28], c[6], sum[31:28],c_out);

endmodule


module main;
reg signed [31:0] a;
reg signed [31:0] b;
wire signed [31:0] sum;
wire c_out;

adder32 DUT (a, b, 0, sum, c_out);

initial
begin
  a = 60000000;
  b =  3789621;
  $monitor("%dns monitor: a=%d b=%d sum=%d", $stime, a, b, sum);
end

always #50 begin
  b=b-1000000;
end

initial #500 $finish;

endmodule
