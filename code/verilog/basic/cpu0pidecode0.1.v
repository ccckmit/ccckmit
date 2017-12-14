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
    always @(*) 
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

module alu(input signed [31:0] a, input signed [31:0] b, input [3:0] op, output reg signed [31:0] out);
parameter [3:0] PASS=4'h2, ADD=4'h3, SUB=4'h4, MUL=4'h5, DIV=4'h6, AND=4'h8, OR=4'h9, XOR=4'hA, SHL=4'hE, SHR=4'hF; // ALU 運算碼
always@(a or b or op) begin
  case(op)
    PASS:out = a;
    ADD: out = a + b;
    SUB: out = a - b;
    MUL: out = a * b;
    DIV: out = a / b;
    AND: out = a & b;
    OR : out = a | b;
    XOR: out = a ^ b;
    SHL: out = a << b;
    SHR: out = a >> b;
  endcase
end
endmodule

module regBank(input clock, input w_en, output [3:0] a1, a2, wa, 
               output signed [31:0] d1, output signed [31:0] d2, input signed [31:0] wd);
  reg signed [31:0] R[15:0]; // 宣告 16 個 32 位元的暫存器
  always @(posedge clock) begin
    if (w_en==1) R[wa] = wd; // w2=1 時寫入到暫存器 (將 wd 寫入到索引值為 wa 的暫存器)
  end
  assign d1 = R[a1]; // 讀取索引值為 a1 的暫存器
  assign d2 = R[a2]; // 讀取索引值為 a2 的暫存器
endmodule

module decode(input [31:0] ir, output [7:0] op, output [3:0] ra, rb, rc, output [11:0] cx12);
  assign op=ir[31:24];
  assign ra=ir[23:20];
  assign rb=ir[19:16];
  assign rc=ir[15:12];
  assign cx12=$signed(ir[11:0]);
endmodule

module control(input [31:0] pc, input [7:0] op, input [3:0] ra, rb, rc, input [11:0] cx12, input [15:0] cx16, input [23:0] cx24, 
               output reg [3:0] alu_op, output reg reg_w, output reg mem_rw, mem_en);
  parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26;
  always @(op) begin
    case (op) // 解讀指令並列印
      LD: begin 
        $write("%4dns %8x : LD  %x,%x,%-4x\n", $stime, pc, ra, rb, cx16);
        alu_op = alu.PASS;
        reg_w = 1;  // write to R[ra]
        mem_en = 1; // access memory
        mem_rw = 1; // read
      end
      ST: begin
        $write("%4dns %8x : ST  %x,%x,%-4x\n", $stime, pc, ra, rb, cx16);
        alu_op = alu.PASS;
        reg_w = 0;  
        mem_en = 1; // access memory
        mem_rw = 0; // write
      end
      ADD: begin 
        $write("%4dns %8x : ADD %x,%x,%-4x\n", $stime, pc, ra, rb, rc);
        alu_op = alu.ADD;
        reg_w = 1;  // R[ra] <= ...
        mem_en = 0; // access memory
      end
      JMP: begin
        $write("%4dns %8x : JMP %-8x\n", $stime, pc, cx24);
        alu_op = alu.ADD;
        reg_w = 1;  // R[ra] <= ...
        mem_en = 0; // access memory
      end
    endcase    
  end
endmodule

`define PC computer0.cpu0.PC.ro

module cpu(input clock, reset, output [31:0] abus, input [31:0] dbus, output m_en, m_rw);
  wire [31:0] pc_i, pc_o, pcadd4, rb_data1, rb_data2, rb_wdata;
  reg [31:0] ir, mar, mdr;
  wire [7:0] op;
  wire [3:0] ra, rb, rc, alu_op, rb_src1, rb_src2, rb_dst;
  wire [11:0] cx12;
  wire [15:0] cx16;
  wire [23:0] cx24;
  wire mem_rw, mem_en, reg_w, rb_write;
  
  register PC(clock, reset, 1 /*w_en*/, pcadd4, pc_o);
  regBank rb0(clock, rb_write, rb_src1, rb_src2, rb_dst, rb_data1, rb_data2, rb_wdata);
  adder adder0(pc_o, 4, pcadd4);
  decode decode0(ir, op, ra, rb, rc, cx12);
  control control0(pc_o, op, ra, rb, rc, cx12, cx16, cx24, alu_op, reg_w, mem_rw, mem_en);
 
  always @(negedge clock) begin
	ir = dbus;
	mar = pc_o;
  end
  assign abus = mar;
  assign m_en = 1;
  assign m_rw = 1; // read
  assign rb_dst = ra;
  assign rb_src1 = rb;
  assign rb_src2 = rc;
endmodule


module adder(input [31:0] i1, i2, output [31:0] o);
  assign o = i1 + i2;
endmodule

module register(input clock, reset, w_en, input [31:0] ri, output reg[31:0] ro);
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
  $monitor("%4dns PC=%8x IR=%8x", $stime, `PC, computer0.cpu0.ir);
end

initial #20 reset = 0;

always #10 clock=clock+1;

initial #500 $finish;

endmodule

/*
`define PC computer0.cpu0.PC.ro
`define IR computer0.cpu0.ir
`define op computer0.cpu0.ir[31:24]
`define ra computer0.cpu0.ir[23:20]
`define rb computer0.cpu0.ir[19:16]
`define rc computer0.cpu0.ir[15:12]
`define cx12 $signed(computer0.cpu0.ir[11:0])
`define cx16 $signed(computer0.cpu0.ir[15:0])
`define cx24 $signed(computer0.cpu0.ir[23:0])
*/
