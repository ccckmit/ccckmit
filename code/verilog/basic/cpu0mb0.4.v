`define PC rb0.R[15]

module computer(input clock, reset, output [2:0] tick, 
                  output [31:0] ir, pc, mar, mdr, 
                  inout [31:0] dbus, output m_en, m_rw);

cpu cpu0(.clock(clock), .reset(reset), .pc(pc), .tick(tick), .ir(ir), 
.mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw));

memory mem0(.clock(clock), .reset(reset), .en(m_en), .rw(m_rw), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus));

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

module regBank(input clock, input w_en, 
               output [3:0] ra1, ra2, wa, 
               output signed [31:0] rd1, rd2, input signed [31:0] wd);

 reg signed [31:0] R[15:0]; // 宣告 16 個 32 位元的暫存器
 always @(posedge clock) begin
  if (w_en) R[wa] <= wd; // w_en=1 時寫入到暫存器 (將 wd 寫入到索引值為 wa 的暫存器)
 end
 assign rd1 = R[ra1]; // 讀取索引值為 ra1 的暫存器
 assign rd2 = R[ra2]; // 讀取索引值為 ra2 的暫存器
endmodule

module controlUnit(input clock, reset, output reg [2:0] tick, 
                   inout [31:0] dbus, output reg m_en, m_rw, 
                   output reg signed [31:0] alu_a, alu_b, output reg [3:0] alu_op, input signed [31:0] alu_out, 
                   output r_wen, output [3:0] ra1, ra2, wa, output [31:0] rd1, rd2, wd);
    parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26;
    parameter [3:0] PC = 15;
    reg [7:0] op;
    reg [3:0] ra, rb, rc;
    reg signed [11:0] cx12;
    reg signed [15:0] cx16;
    reg signed [23:0] cx24;

    always @(posedge clock) begin
        if (reset) begin
            `PC = 0;
            tick = 0;
          end
        else begin
            tick = tick+1;
            m_en = 0;
            case (tick)
            // 指令擷取階段 Tick 1..3 ： memory.read(m[PC])
                1: begin  // Tick 1：將 PC 丟到位址匯流排上
                    cpu0.mar = `PC; // MAR = PC
                    m_rw = 1; // m_rw=1 is read mode, read(m[MAR]) => read(m[PC])
                    m_en = 1;
                    alu_a = `PC; alu_b = 4; alu_op = alu0.ADD;
                end
            // 指令解碼階段
                2: begin  // Tick 2：ir = m[PC], 
                    cpu0.mdr = dbus;
                    m_en = 0;
                    cpu0.ir = cpu0.mdr; // IR = dbus = m[PC]
                    {op,ra,rb,rc,cx12} = cpu0.ir;
                    cx24 = cpu0.ir[23:0];
                    cx16 = cpu0.ir[15:0];
                    case (op) // 解讀指令並列印
                        LD: $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
                        ST: $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
                        ADD:$write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, ra, rb, rc);
                        JMP:$write("%4dns %8x : JMP %-8x", $stime, `PC, cx24);
                    endcase
                    `PC = alu0.out;
                    
                    case (op)
                        LD: begin alu_a = rb0.R[rb]; alu_b = cx16;  alu_op = alu0.ADD; end
                        ST: begin alu_a = rb0.R[rb]; alu_b = cx16;  alu_op = alu0.ADD; end
                        ADD:begin alu_a = rb0.R[rb]; alu_b = rb0.R[rc]; alu_op = alu0.ADD; end
                        JMP:begin alu_a = rb0.R[rb]; alu_b = cx24;  alu_op = alu0.ADD; end
                    endcase
                end
            // 指令執行階段 Tick 4..6 ： execute(IR)
                3: begin 
                    case (op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            cpu0.mar = alu0.out; // mar = 讀取位址 = R[rb]+cx
                            m_rw = 1; // 讀取模式：read
                            m_en = 1;
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            cpu0.mar = alu0.out;  // 寫入位址 = R[rb]+cx
                            cpu0.mdr = rb0.R[ra]; // 寫入資料：R[ra]
                            m_rw = 0; // 寫入模式：write
                            m_en = 1;
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            rb0.R[ra] = alu0.out; // 執行加法
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            `PC = alu0.out; // 跳躍目標位址=PC+cx
                        end
                    endcase
                end
                4: begin // 解讀 OP: Tick 5
                    case (op) // LD ra, rb, cx ; R[ra] = R[rb+cx] ; mdr = R[rb+cx]
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            cpu0.mdr = dbus;  // 取得記憶體傳回的 dbus = m[rb+cx]
                            rb0.R[ra] = cpu0.mdr; // 存入到目標暫存器 R[ra] 中
                            m_en = 0; // 讀取完畢
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            m_en = 0; // 寫入完畢
                        end
                    endcase
                    $display(" R[%2d]=%4d", ra, rb0.R[ra]);
                    tick = 0;
                end
            endcase
        end
    end
endmodule

module cpu(input clock, reset, output [2:0] tick, 
           output [31:0] ir, pc, mar, mdr,
           inout [31:0] dbus, output m_en, m_rw);
           
    wire signed [31:0] alu_a, alu_b;
    wire signed [31:0] alu_out;
    reg [31:0] ir, pc, mar, mdr;
    wire [3:0] alu_op;
    wire [3:0] r_a1, r_a2, r_wa;
    wire signed [31:0] r_d1, r_d2, r_wd;
    wire r_wen;

    alu alu0(alu_a, alu_b, alu_op, alu_out);
    regBank rb0(clock, r_wen, r_a1, r_a2, r_wa, r_d1, r_d2, r_wd);
    controlUnit cu0(clock, reset, tick, dbus, m_en, m_rw, alu_a, alu_b, alu_op, alu_out, r_wen, r_a1, r_a2, r_wa, r_d1, r_d2, r_wd);
endmodule

module memory(input clock, reset, en, rw, 
            input [31:0] abus, dbus_in, output [31:0] dbus_out);
reg [7:0] m [0:128];
reg [31:0] data;

    always @(clock or reset or abus or en or rw or dbus_in) 
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
                data = dbus_in;
                {m[abus], m[abus+1], m[abus+2], m[abus+3]} = dbus_in;
            end
            else if (en == 1 && rw == 1) // r_w==1:read
                data = {m[abus], m[abus+1], m[abus+2], m[abus+3]};
            else
                data = 32'hZZZZZZZZ;
        end else
            data = 32'hZZZZZZZZ;
    end
    assign dbus_out = data;
endmodule

module main;
reg clock;
reg reset;
wire [2:0] tick;
wire [31:0] pc, ir, mar, mdr, dbus;
wire m_en, m_rw;

computer computer0(.clock(clock), .reset(reset), .pc(pc), .tick(tick), 
.ir(ir), .mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw));

initial
begin
  clock = 0;
  reset = 1;
end

initial #20 reset = 0;

always #10 clock=clock+1;

initial #5000 $finish;

endmodule
