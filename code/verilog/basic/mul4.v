module mult4(a,b, ab);
input [3:0] a,b;
output [7:0] ab;

wire [3:0] t0,t1,t2,t3;

assign t0 = (b[0]==1) ? a : 4'h0;
assign t1 = (b[1]==1) ? a : 4'h0;
assign t2 = (b[2]==1) ? a : 4'h0;
assign t3 = (b[3]==1) ? a : 4'h0;

assign ab=t0+(t1<<1)+(t2<<2)+(t3<<3);

endmodule
