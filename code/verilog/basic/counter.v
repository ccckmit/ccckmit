module counter(input clk, rst, output reg [2:0] q);
    always @(posedge clk) begin
        if (rst)
            q = 3'b000;
        else
            q = q+1;
    end
endmodule

module main;
reg clk;
reg rst;
wire [2:0] q;

counter DUT (.clk(clk), .rst(rst), .q(q));

initial
begin
  $monitor("%4dns monitor: q=%d", $stime, q);
  clk = 0;
  rst = 1;
  #100 rst = 0;
  #1000 $finish;
end

always #50 begin
  clk=clk+1; 
end

endmodule
