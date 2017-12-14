module main;
real x, y, x2, y2, xyadd, xysub, xymul, xydiv;
reg [63:0] x1, y1;

initial 
begin
  x=7.0;
  y=-400;
  x1 = $realtobits(x);
  x2 = $bitstoreal(x1);
  y1 = $realtobits(y);
  y2 = $bitstoreal(y1);
  xyadd = x+y;
  xysub = x-y;
  xymul = x*y;
  xydiv = x/y;
  $display("x=%f x1=%b x2=%f", x, x1, x2);
  $display("y=%f y1=%b y2=%f", y, y1, y2);
  $display("x+y=%f xyadd=%f", x+y, xyadd);
  $display("x-y=%f xysub=%f", x-y, xysub);
  $display("x*y=%f xymul=%f", x*y, xymul);
  $display("x/y=%f xydiv=%f", x/y, xydiv);
end

endmodule


