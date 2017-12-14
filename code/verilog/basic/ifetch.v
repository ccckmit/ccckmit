module computer(input clock, reset);
wire [2:0] tick; 
wire [31:0] mar, mdr;
wire m_en, m_rw;

cpu cpu0(clock, reset, mar, mdr, m_en, m_rw);
memory m(clock, reset, m_en, m_rw, mar, mdr);

endmodule

module memory(input clock, reset, en, rw, input [31:0] abus, inout [31:0] dbus);
reg [7:0] m [0:128];
reg [31:0] data;
    always @(clock or reset or abus or en or rw or dbus) 
    begin
        if (reset == 1) begin        
            {m[0],m[1],m[2],m[3]}    = 32'h001F0018; // 0000       LD   R1, K1
            {m[4],m[5],m[6],m[7]}    = 32'h002F0010; // 0004       LD   R2, K0
            {m[8],m[9],m[10],m[11]}  = 32'h003F0014; // 0008       LD   R3, SUM
            {m[12],m[13],m[14],m[15]}= 32'h13221000; // 000C LOOP: ADD  R2, R2, R1
            {m[16],m[17],m[18],m[19]}= 32'h13332000; // 0010       ADD  R3, R3, R2
            {m[20],m[21],m[22],m[23]}= 32'h26FFFFF4; // 0014       JMP  LOOP
            {m[24],m[25],m[26],m[27]}= 32'h00000000; // 0018 K0:   WORD 0
            {m[28],m[29],m[30],m[31]}= 32'h00000001; // 001C K1:   WORD 1
            {m[32],m[33],m[34],m[35]}= 32'h00000000; // 0020 SUM:  WORD 0
            data = 32'hZZZZZZZZ;                         
        end else if (abus >=0 && abus < 125) begin
            if (en == 1 && rw == 0) begin // r_w==0:write
                {m[abus], m[abus+1], m[abus+2], m[abus+3]} = dbus;
            end
            else if (en == 1 && rw == 1) // r_w==1:read
                data = {m[abus], m[abus+1], m[abus+2], m[abus+3]};
            else
                data = 32'hZZZZZZZZ;
        end else
            data = 32'hZZZZZZZZ;
    end
    assign dbus = data;
endmodule

module cpu(input clock, reset, output [31:0] abus, input [31:0] dbus, output m_en, m_rw);
  wire [31:0] pc_i, pc_o, pcadd4;
  reg [31:0] ir, mar, mdr;
  
  Reg PC(clock, reset, 1, pcadd4, pc_o);
  Adder pcadder(pc_o, 4, pcadd4);

  assign abus = mar;
  always @(negedge clock) begin
	ir = dbus;
	mar = pc_o;
  end
  assign m_en = 1;
  assign m_rw = 1; // read
endmodule


module Adder(input [31:0] i1, i2, output [31:0] o);
  assign o = i1 + i2;
endmodule

module Reg(input clock, reset, w_en, input [31:0] ri, output reg[31:0] ro);
always @(posedge clock) begin
	if(reset==1) ro<=0;
	else if (w_en==1) ro<=ri;
	else ro<=ro;
end
endmodule

module main;
reg clock, reset;

computer computer0(clock, reset);

initial
begin
  clock = 0;
  reset = 1;
  $monitor("%4dns PC=%8x IR=%8x", $stime, computer0.cpu0.PC.ro, computer0.cpu0.ir);
end

initial #20 reset = 0;

always #10 clock=clock+1;

initial #500 $finish;

endmodule
