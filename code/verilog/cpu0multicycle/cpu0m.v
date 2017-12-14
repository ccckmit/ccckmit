module computer(input clock, reset, output [2:0] tick, 
                  output [31:0] ir, pc, mar, mdr, 
                  inout [31:0] dbus, output m_en, m_rw);

cpu cpu0(.clock(clock), .reset(reset), .pc(pc), .tick(tick), .ir(ir), 
.mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw));

memory mem0(.clock(clock), .reset(reset), .en(m_en), .rw(m_rw), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus));

endmodule         

module cpu(input clock, reset, output reg [2:0] tick, 
           output reg [31:0] ir, pc, mar, mdr,
           inout [31:0] dbus, output reg m_en, m_rw);
    `define PC R[15]
    parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26;
    reg signed [31:0] R [0:15];
    reg [7:0] op;
    reg [3:0] ra, rb, rc;
    reg signed [11:0] cx12;
    reg signed [15:0] cx16;
    reg signed [23:0] cx24;
    reg signed [31:0] addr32;

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
                    mar = `PC; // MAR = PC
                    m_rw = 1; // m_rw=1 is read mode, read(m[MAR]) => read(m[PC])
                    m_en = 1;
                end
            // 指令解碼階段
                2: begin  // Tick 2：ir = m[PC], 
                    mdr = dbus;
                    m_en = 0;
                    ir = mdr; // IR = dbus = m[PC]
                    {op,ra,rb,rc,cx12} = ir;
                    cx24 = ir[23:0];
                    cx16 = ir[15:0];
                    case (op) // 解讀 OP: Tick 6; 列印
                        LD: $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
                        ST: $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
                        ADD:$write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, ra, rb, rc);
                        JMP:$write("%4dns %8x : JMP %-8x", $stime, `PC, cx24);
                    endcase
                    `PC = `PC+4; // PC = PC + 4
                end
            // 指令執行階段 Tick 4..6 ： execute(IR)
                3: begin 
                    case (op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            mar = R[rb] + cx16; // mar = 讀取位址 = R[rb]+cx
                            m_rw = 1; // 讀取模式：read
                            m_en = 1;
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            mar = R[rb] + cx16;  // 寫入位址 = R[rb]+cx
                            mdr = R[ra]; // 寫入資料：R[ra]
                            m_rw = 0; // 寫入模式：write
                            m_en = 1;
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            R[ra] = R[rb]+R[rc]; // 執行加法
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            addr32 = cx24; // 取出 cx 並轉為 32 位元有號數
                            `PC = `PC+addr32; // 跳躍目標位址=PC+cx
                        end
                    endcase
                end
                4: begin // 解讀 OP: Tick 5
                    case (op) // LD ra, rb, cx ; R[ra] = R[rb+cx] ; mdr = R[rb+cx]
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            mdr = dbus; // 取得記憶體傳回的 dbus = m[rb+cx]
                            R[ra] = mdr; // 存入到目標暫存器 R[ra] 中
                            m_en = 0; // 讀取完畢
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            m_en = 0; // 寫入完畢
                        end
                    endcase
                    $display(" R[%2d]=%4d", ra, R[ra]);
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
