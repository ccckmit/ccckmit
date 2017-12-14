`define W 16

module register(input load, input [`W:0] idata, output [`W:0] odata);
  reg    [`W:0] data;
  always @(posedge load) begin
    data = idata;
  end
  assign odata = data;
endmodule

module adder(input [`W:0] a, input [`W:0] b, output [`W:0] y);
  assign y = a+b;
endmodule

module main;
reg clock;
wire [`W:0] pc_o, pc_i;

register pc(clock, pc_i, pc_o);
adder a(pc_o, 2, pc_i);

initial begin 
  clock = 0;
  pc.data = 0;
  $monitor("%4dns clock=%d pc_o", $stime, clock, pc_o);
  #500 $finish;
end
always #10 begin
  clock=~clock;
end
endmodule
