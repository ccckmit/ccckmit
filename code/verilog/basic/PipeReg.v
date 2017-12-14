module pipeReg(input clock, reset, zero, stall, input [size-1:0] data_i, output reg [size-1:0] data_o);
parameter size = 0;	  
always @(posedge clk_i) begin
	 if(~reset) data_o<=0;
	 else if(zero==1) data_o<=0;
	 else if(stall==1) data_o<=data_o;
    else data_o <= data_i;
end
endmodule
/*
Pipe_Reg #(.size(64)) IF_ID(       //N is the total length of input/output
clk_i,rst_i,IF_ID_i,IF_ID_o,isBranch,stall
		);*/
module main;
reg clock;
reg reset;
wire isBranch, stall;	

pipeReg #(.size(64)) IF_ID(clock, reset, isBranch, stall, IF_ID_i, IF_ID_o);
pipeReg #(.size(153)) ID_EX(clock, reset, isBranch, stall, ID_EX_i, ID_EX_o);
pipeReg #(.size(107)) EX_MEM(clock, reset, isBranch, stall, EX_MEM_i, EX_MEM_o);
pipeReg #(.size(71)) MEM_WB(clock, reset, 0, 0, MEM_WB_i, MEM_WB_o);
// Hazerd hazard(pcsrc,rs,rt,Mux2_o,MemRead_EX,isBranch,stall);

initial
begin
  clock = 0;
  reset = 1;
end

initial #20 reset = 0;

always #10 clock=clock+1;

initial #5000 $finish;

endmodule
