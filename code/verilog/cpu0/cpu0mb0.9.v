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
  reg signed [31:0] R[15:0], data2; // 宣告 16 個 32 位元的暫存器
  always @(posedge clock) begin
    if (w_en==1) R[wa] = wd; // w2=1 時寫入到暫存器 (將 wd 寫入到索引值為 wa 的暫存器)
  end
  assign d1 = R[a1]; // 讀取索引值為 a1 的暫存器
  assign d2 = R[a2]; // 讀取索引值為 a2 的暫存器
endmodule

module controlUnit(input clock, reset, inout [31:0] dbus, output reg m_en, m_rw, 
                   output reg signed [31:0] alu_a, alu_b, output reg [3:0] alu_op, input signed [31:0] alu_out, 
                   output reg r_w, output reg [3:0] r_a1, r_a2, r_wa, input [31:0] r_d1, r_d2, output reg [31:0] r_wd);
    parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26;
    parameter [3:0] PC = 15;
    reg [2:0] tick;
    
    `define PC rb0.R[15]
    `define op cpu0.ir[31:24]
    `define ra cpu0.ir[23:20]
    `define rb cpu0.ir[19:16]
    `define rc cpu0.ir[15:12]
    `define cx12 $signed(cpu0.ir[11:0])
    `define cx16 $signed(cpu0.ir[15:0])
    `define cx24 $signed(cpu0.ir[23:0])

    task aluStart(input [31:0] a, b, input [3:0] op); begin // 開始用 alu 計算 a op b
      alu_a = a; alu_b = b; alu_op = op;
    end endtask
    
    task aluEnd(output [31:0] data); begin // 開始用 alu 計算 a op b
      data = alu_out;
    end endtask
    
    task regReadStart(input [3:0] i); begin // 準備取得暫存器 r_d1 = R[i] = R[r_a1]
      r_a1 = i;
    end endtask
    
    task regReadEnd(output [31:0] data); begin // 已經取得暫存器 data = R[i] = r_d1
      data = r_d1;
    end endtask
    
    task regWriteStart(input [3:0] i, input [31:0] data); begin // 準備寫入暫存器 R[i] = data
      r_w = 1; r_wa = i; r_wd = data;
    end endtask
    
    task regWriteEnd; begin // 已經寫入暫存器 R[i] = data
      r_w = 0;
    end endtask
    
    task memReadStart(input [31:0] addr); begin // 讀取記憶體 Word
       cpu0.mar = addr;     // read(m[addr])
       m_rw = 1;     // 讀取模式：read 
       m_en = 1;     // 啟動讀取
    end endtask
    
    task memReadEnd(output [31:0] data); begin // 讀取記憶體完成，取得資料
       cpu0.mdr = dbus; // 取得記憶體傳回的 dbus = m[addr]
       data = cpu0.mdr; // 傳回資料
       m_en = 0; // 讀取完畢
    end endtask

    task memWriteStart(input [31:0] addr, input [31:0] data); begin // 寫入記憶體 -- addr:寫入位址, data:寫入資料
       cpu0.mar = addr;    // write(m[addr], data)
       cpu0.mdr = data;
       m_rw = 0;    // 寫入模式：write
       m_en = 1;     // 啟動寫入
    end endtask

    task memWriteEnd; begin // 寫入記憶體完成
       m_en = 0; // 寫入完畢
    end endtask

    always @(posedge clock) begin
        if (reset) begin
            regWriteStart(PC, 0);
            tick = 0;
          end
        else begin
            tick = tick+1;
            m_en = 0;
            case (tick)
                1: begin // 取得 PC = R[15]
                    regWriteEnd();
                    regReadStart(PC);
                end
                2: begin  // 指令擷取 
                    regReadEnd(cpu0.mar); // MAR = PC
                    memReadStart(cpu0.mar); // read m[PC]
                    aluStart(r_d1, 4, alu0.ADD); // alu.out=PC+4
                end
                3: begin  // 解碼並讀取運算元 R[rb], R[rc]
                    memReadEnd(cpu0.ir); // ir = m[PC];
                    case (`op) // 解讀指令並列印
                        LD: $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, `ra, `rb, `cx16);
                        ST: $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, `ra, `rb, `cx16);
                        ADD:$write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, `ra, `rb, `rc);
                        JMP:$write("%4dns %8x : JMP %-8x", $stime, `PC, `cx24);
                    endcase
                    regWriteStart(PC, alu_out); // PC = alu.out = PC+4
                    r_a1 = `rb; r_a2=`rc; // reg R[rb] , R[rc]
                    case (`op)
                        JMP:r_a1=PC; // read R[PC]
                    endcase
                   end   
                4: begin  // 運算：ALU
                    regWriteEnd(); // finish PC=PC+4
                    case (`op)
                        LD: aluStart(r_d1, `cx16, alu0.ADD); // alu.out = R[rb]+cx
                        ST: begin aluStart(r_d1, `cx16, alu0.ADD);  regReadStart(`ra); end // alu.out = R[rb]+cx;
                        ADD:aluStart(r_d1, r_d2, alu0.ADD); // alu.out = R[rb]+R[rc];
                        JMP:aluStart(r_d1, `cx24, alu0.ADD); // alu.out = PC+cx
                    endcase
                end
                5: begin // 記憶體讀取
                    case (`op) // 解讀 OP: Tick 4
                        LD: begin // 指令：LD ra, rb, cx ; 語意：mar = rb+cx, start mdr=m[mar];
                            aluEnd(cpu0.mar);
                            memReadStart(cpu0.mar);
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            aluEnd(cpu0.mar);
                            memWriteStart(cpu0.mar, r_d1);
                        end
                    endcase
                end
                6: begin // 寫回: WriteBack
                    r_w = 0;
                    m_en = 0;
                    case (`op) // LD ra, rb, cx ; R[ra] = R[rb+cx] ; mdr = R[rb+cx]
                        LD: begin // 指令：LD ra, rb, cx ; 語意：R[ra] = m[rb+cx]
                            memReadEnd(cpu0.mdr);
                            regWriteStart(`ra, cpu0.mdr);
                        end
                        ST: begin // 指令：ST ra, rb, cx ; 語意：m[rb+cx]=R[ra]
                            memWriteEnd();
                        end
                        ADD: begin // 指令：ADD ra, rb, rc ; 語意：R[ra]=R[rb]+R[rc]
                            regWriteStart(`ra, alu_out);
                        end
                        JMP: begin // 指令：JMP cx ; 語意：PC = PC+cx
                            regWriteStart(PC, alu_out);
                        end
                    endcase
                end
                7: begin // 顯示執行結果
                    $display(" R[%2d]=%4d", `ra, rb0.R[`ra]);
                    tick = 0;
                end
            endcase
        end
    end
endmodule

module cpu(input clock, reset, output [31:0] abus, input [31:0] dbus, output m_en, m_rw);
  wire signed [31:0] alu_a, alu_b, alu_out, r_d1, r_d2, r_wd;
  reg [31:0] ir, mar, mdr;
  wire [3:0] alu_op, r_a1, r_a2, r_wa;
  wire r_w;

  alu alu0(alu_a, alu_b, alu_op, alu_out);
  regBank rb0(!clock, r_w, r_a1, r_a2, r_wa, r_d1, r_d2, r_wd);
  controlUnit cu0(clock, reset, dbus, m_en, m_rw, alu_a, alu_b, alu_op, alu_out, r_w, r_a1, r_a2, r_wa, r_d1, r_d2, r_wd);
    
  assign abus = mar;
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

module computer(input clock, reset);
wire [2:0] tick; 
wire [31:0] mar, mdr;
wire m_en, m_rw;

cpu cpu0(clock, reset, mar, mdr, m_en, m_rw);
memory mem0(clock, reset, m_en, m_rw, mar, mdr);

endmodule

module main;
reg clock;
reg reset;

computer computer0(clock, reset);

initial
begin
  clock = 0;
  reset = 1;
  #20 reset = 0;
  #5000 $finish;
end

always #10 clock=clock+1;

endmodule
