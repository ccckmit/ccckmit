// 參考：http://www.ece.lsu.edu/ee3755/2002/l07.html
// 參考：http://answers.google.com/answers/threadview/id/109219.html
// a/b = q ; a%b = r;
module divider(output reg [15:0] q, output [15:0] r, output ready, input [15:0]  a,b, input start, clk);
//  """"""""|
//     1011 |  <----  ta
// -0011    |  <----  tb
//  """"""""|    0  Diff is negative: copy a and put 0 in q.
//     1011 |  <----  ta
//  -0011   |  <----  tb
//  """"""""|   00  Diff is negative: copy b and put 0 in q.
//     1011 |  <----  ta
//   -0011  |  <----  tb
//  """"""""|  001  Diff is positive: use diff and put 1 in q.
//            q (numbers above)   
   reg [31:0]    ta, tb, diff;
   reg [4:0]     bit; 
   wire          ready = !bit;
   
   initial bit = 0;

   assign r = ta[15:0];
   
   always @( posedge clk ) 
     if( ready && start ) begin
        bit = 16;
        q = 0;
        ta = {16'd0, a};
        tb = {1'b0, b,15'd0};
     end else begin
        diff = ta - tb;
        q = q << 1;
        if( !diff[31] ) begin
           ta = diff;
           q[0] = 1'd1;
        end
        tb = tb >> 1;
        bit = bit - 1;
     end
endmodule

module main;
reg clk, start;
reg [15:0] a, b;
wire [15:0] q, r;
wire ready;

divider div(q,r,ready,a,b,start,clk);

initial begin
  clk = 0;
  a = 90; b = 13; start = 1; 
  #200;
  start = 0;
  #200;
  $finish;
end

always #5 clk = !clk;
always @(posedge clk) $strobe("%dns : a=%d b=%d q=%d r=%d ready=%d", $stime, a, b, q, r, ready);

endmodule
