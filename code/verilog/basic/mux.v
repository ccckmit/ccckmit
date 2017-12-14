module mux4(input[1:0]  select, input[3:0] d, output reg q );
always @( select or d )
begin
   case( select )
       0 : q = d[0];
       1 : q = d[1];
       2 : q = d[2];
       3 : q = d[3];
   endcase
end
endmodule

module main;
reg [3:0] d;
reg [1:0] s;
wire q;

mux4 DUT (s, d, q);

initial
begin
  s = 0;
  d = 4'b0110;
end

always #50 begin
  s=s+1;
  $monitor("%4dns monitor: s=%d d=%d q=%d", $stime, s, d, q);
end

initial #1000 $finish;

endmodule
