module pcTick(input clock, reset, input [31:0] pc_in, output [31:0] pc_out, output reg [2:0] tick);
  reg [31:0] pc;
  always @(posedge clock) begin
    if (reset) begin
      pc = 0;
      tick = 0;
    end else begin
      tick = tick+1;
      if (tick == 6) begin
        tick = 0;
        pc = pc_in;
      end
      $monitor("%4dns %8x %1x", $stime, pc, tick);
    end
  end
  assign pc_out = pc;
endmodule

module alu(input [31:0] a, input [31:0] b, input [3:0] op, output reg [31:0] y);
parameter [3:0] PASS=4'h2, ADD=4'h3, SUB=4'h4, MUL=4'h5, DIV=4'h6, AND=4'h8, OR=4'h9, XOR=4'hA, SHL=4'hE, SHR=4'hF; // ALU ¹Bºâ½X
always@(a or b or op) begin
  case(op)
    PASS:y = a;
    ADD: y = a + b;
    SUB: y = a - b;
    MUL: y = a * b;
    DIV: y = a / b;
    AND: y = a & b;
    OR : y = a | b;
    XOR: y = a ^ b;
    SHL: y = a << b;
    SHR: y = a >> b;
  endcase
end
endmodule

module main;
reg clock;
reg reset;
wire [2:0] tick;
wire [31:0] pc_in, pc_out;

pcTick DUT (clock, reset, pc_in, pc_out, tick);
alu alu0(pc_out, 4, alu0.ADD, pc_in);

initial
begin
  clock = 0;
  reset = 1;
  #100 reset=0;
  #2000 $finish;
end

always #50 clock=clock+1;
endmodule
