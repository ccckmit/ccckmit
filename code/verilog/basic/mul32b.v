module multiplier(output reg [63:0] z, output ready, input [31:0] x, y, input start, clk); 
   reg [5:0] bit; 
   reg [31:0] a;
   
   wire ready = !bit;
   
   initial bit = 0;

   always @( posedge clk ) begin
     if( ready && start ) begin
        bit = 32;
		z = 0;
		a = x;
     end else begin
        bit = bit - 1;
		z = z << 1;
	    if (y[bit])
		  z = z + a;
     end
	 $display("%dns : x=%d y=%d z=%d ready=%d bit=%d", $stime, x, y, z, ready, bit);
   end 
endmodule

module main; 
reg [31:0] a, b; 
wire [63:0] c; 
reg clk, start;
wire ready;

multiplier m(c, ready, a, b, start, clk); 

initial begin 
  a = 17;
  b = 7; 
  start = 1;
  clk = 0;
  #200;
  start = 0;
  #200;
  $finish;
end 

always #5 clk = !clk;
// always @(posedge clk) $strobe("%dns : a=%d b=%d c=%d ready=%d", $stime, a, b, c, ready);

endmodule 
