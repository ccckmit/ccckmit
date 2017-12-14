module pcTick(input clock, reset, output reg [31:0] pc, 
             output reg [2:0] tick);
    always @(posedge clock) begin
        if (reset) 
          begin
            pc = 0;
            tick = 0;
          end
        else begin
            tick = tick+1;
            if (tick == 6) begin
                tick = 0;
                pc = pc+4;
            end
            $monitor("%4dns %8x %1x", $stime, pc, tick);
        end
    end
endmodule

module main;
reg clock;
reg reset;
wire [2:0] tick;
wire [31:0] pc;

pcTick DUT (.clock(clock), .reset(reset), .pc(pc), .tick(tick));

initial
begin
  clock = 0;
  reset = 1;
  #100 reset=0;
  #2000 $finish;
end

always #50 clock=clock+1;
endmodule
