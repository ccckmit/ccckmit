// 參考：http://www.ece.lsu.edu/ee3755/2002/l07.html
// 參考：http://answers.google.com/answers/threadview/id/109219.html
// a/b = q ; a%b = r;
module divider(output reg [31:0] q, output [31:0] r, output ready, input [31:0]  a,b, input start, clk);
   reg [63:0]    ta, tb, diff;
   reg [5:0]     bit; 
   wire          ready = !bit;
   
   initial bit = 0;

   assign r = ta[31:0];
   
   always @( posedge clk ) 
     if( ready && start ) begin
        bit = 32;
        q = 0;
        ta = {32'd0, a};
        tb = {1'b0, b,31'd0};
     end else begin
        diff = ta - tb;
        q = q << 1;
        if( !diff[63] ) begin
           ta = diff;
           q[0] = 1'd1;
        end
        tb = tb >> 1;
        bit = bit - 1;
     end
endmodule

module main;
reg clk, start;
reg [31:0] a, b;
wire [31:0] q, r;
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
