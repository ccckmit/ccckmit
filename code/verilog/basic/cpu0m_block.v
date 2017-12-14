module computer(input clock, reset, output [2:0] tick, 
                  output [31:0] ir, pc, mar, mdr, 
                  inout [31:0] dbus, output m_en, m_rw);

cpu cpu0(.clock(clock), .reset(reset), .pc(pc), .tick(tick), .ir(ir), 
.mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw));

memory mem0(.clock(clock), .reset(reset), .en(m_en), .rw(m_rw), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus));

endmodule         

module alu(input [31:0] a, input [31:0] b, input [3:0] op, output reg [31:0] y);
// ALU 運算碼
parameter [3:0] PASS=4'h2, ADD=4'h3, SUB=4'h4, MUL=4'h5, DIV=4'h6, AND=4'h8, OR=4'h9, XOR=4'hA, SHL=4'hE, SHR=4'hF;
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

module cpu(input clock, reset, output reg [2:0] tick, 
             output reg [31:0] ir, pc, mar, mdr,
             inout [31:0] dbus, output reg m_en, m_rw);
    reg signed [31:0] R [0:15];
    reg [7:0] op;
    reg [3:0] ra, rb, rc;
    reg signed [11:0] cx12;
    reg signed [15:0] cx16;
    reg signed [23:0] cx24;
    reg signed [31:0] addr32, A, B, C, ipc; // ipc:instruction PC
    
    wire [31:0] alu_a, alu_b, alu_out;
    wire [3:0]  alu_op;

    parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26;

    `define PC  R[15]

    alu alu0(alu_a, alu_b, alu_op, alu_out);
    
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
                1:    begin  // Tick 1：將 PC 丟到位址匯流排上
                    mar = `PC; // MAR = PC
                    m_rw = 1; // m_rw=1 is read mode, read(m[MAR]) => read(m[PC])
                    m_en = 1;
                    ipc  = `PC;
                    `PC = `PC+4; // PC = PC + 4
                end
                2:    begin  // Tick 2：ir = m[PC]
                    mdr = dbus;
                    ir = mdr; // IR = dbus = m[PC]
                    {op,ra,rb,rc,cx12} = ir;
                    cx24 = ir[23:0];
                    cx16 = ir[15:0];
                    case (op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            alu_a = R[rb];
                            alu_b = cx16; // mar = 讀取位址 = R[rb]+cx
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            alu_a = R[rb];
                            alu_b = cx16; // mar = 讀取位址 = R[rb]+cx
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            alu_a = R[rb];
                            alu_b = R[rc]; // 執行加法
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            alu_a = `PC;
                            alu_b = cx24; // 取出 cx 並轉為 32 位元有號數
                        end
                    endcase
                end
                3:    begin  // Tick 3：取出暫存器 R[ra], R[rb], R[rc] 內容
                    m_en = 0;
                    A = R[ra];
                    B = R[rb];
                    C = R[rc];
                    case (op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            mar = alu_out; // mar = 讀取位址 = R[rb]+cx
                            m_rw = 1; // 讀取模式：read 
                            m_en = 1;
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            mar = alu_out;  // 寫入位址 = R[rb]+cx
                            mdr = A; // 寫入資料：R[ra]
                            m_rw = 0; // 寫入模式：write
                            m_en = 1;
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            alu_out = B+C; // 執行加法
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            `PC = alu_out; // 跳躍目標位址=PC+cx
                        end
                    endcase
                end
            // 指令執行階段 Tick 4..6 ： execute(IR)
                4:    begin 
                    case (op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            mar = B + cx16; // mar = 讀取位址 = R[rb]+cx
                            m_rw = 1; // 讀取模式：read 
                            m_en = 1;
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            mar = B + cx16;  // 寫入位址 = R[rb]+cx
                            mdr = A; // 寫入資料：R[ra]
                            m_rw = 0; // 寫入模式：write
                            m_en = 1;
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            aluOut = B+C; // 執行加法
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            addr32 = cx24; // 取出 cx 並轉為 32 位元有號數
                            `PC = `PC+addr32; // 跳躍目標位址=PC+cx
                        end
                    endcase
                end
                5:    begin // 解讀 OP: Tick 5
                    case (op) // LD ra, rb, cx ; R[ra] = R[rb+cx] ; mdr = R[rb+cx]
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            mdr = dbus; // 取得記憶體傳回的 dbus = m[rb+cx]
                            R[ra] = mdr; // 存入到目標暫存器 R[ra] 中
                            A = mdr;
                            m_en = 0; // 讀取完畢
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            m_en = 0; // 寫入完畢
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            R[ra] = aluOut;
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                        end
                    endcase
                end                
                6:    begin
                    case (op) // 解讀 OP: Tick 6; 列印
                        LD: $display("%4dns %8x : LD  %2x,%2x,%4x; R[%x]=%4d", 
                                        $stime, ipc, ra, rb, cx16, ra, R[ra]);
                        ST: $display("%4dns %8x : ST  %2x,%2x,%4x; R[%x]=%4d", 
                                        $stime, ipc, ra, rb, cx16, ra, R[ra]);
                        ADD:$display("%4dns %8x : ADD %2x,%2x,%4x; R[%x]=%4d, B=%4d, C=%4d", 
                                        $stime, ipc, ra, rb, rc, ra, R[ra], B, C);
                        JMP:$display("%4dns %8x : JMP %10d; PC=%8x", 
                                        $stime, ipc, cx24, R[15]);
                    endcase
                    tick = 0;
                end
            endcase
        end
        pc = `PC;
    end
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
