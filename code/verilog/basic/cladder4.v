module cladder4(output [3:0] S, output Cout,PG,GG, input [3:0] A,B, input Cin);
  wire [3:0] G,P,C;

  assign G = A & B; //Generate
  assign P = A ^ B; //Propagate
  assign C[0] = Cin;
  assign C[1] = G[0] | (P[0]&C[0]);
  assign C[2] = G[1] | (P[1]&G[0]) | (P[1]&P[0]&C[0]);
  assign C[3] = G[2] | (P[2]&G[1]) | (P[2]&P[1]&G[0]) | (P[2]&P[1]&P[0]&C[0]);
  assign Cout = G[3] | (P[3]&G[2]) | (P[3]&P[2]&G[1]) | (P[3]&P[2]&P[1]&G[0]) |(P[3]&P[2]&P[1]&P[0]&C[0]);
  assign S = P ^ C;
  assign PG = P[3] & P[2] & P[1] & P[0];
  assign GG = G[3] | (P[3]&G[2]) | (P[3]&P[2]&G[1]) | (P[3]&P[2]&P[1]&G[0]);
endmodule


module main;
reg signed [3:0] a;
reg signed [3:0] b;
wire signed [3:0] sum;
wire c_out;

cladder4 DUT (sum, cout, pg, gg, a, b, 0);

initial
begin
  a = 5;
  b = -3;
  $monitor("%dns monitor: a=%d b=%d sum=%d", $stime, a, b, sum);
end

endmodule
