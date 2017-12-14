// 參考文獻：http://ccckmit.wikidot.com/ocs:cpu0
// 定義：寬度形態常數
`define INT16 2'b01     // 寬度 16 位元
`define BYTE  2'b00     // 寬度  8 位元
// itype 的選項：RESET:重置中斷，ABORT:關機中斷，IRQ:硬體中斷，ERROR:錯誤中斷
`define EXE   3'b000
`define RESET 3'b001
`define ABORT 3'b010
`define IRQ   3'b011
`define ERROR 3'b100

module mcu0(input clock, reset, input [2:0] itype, output reg [2:0] tick, 
            output reg [15:0] ir, pc, mar, mdr, inout [15:0] dbus, 
            output reg m_en, m_rw, output reg [1:0] m_w1);
    reg signed [15:0] R [0:15];
    reg [3:0] op4, a, b, c4;
    reg [7:0] op8;
    reg signed [11:0] cx12;
    reg signed [15:0] c12, Ra, Rb, ipc; // ipc:instruction PC

    // 暫存器簡稱
    `define PC   R[15]   // 程式計數器
    `define LR   R[14]   // 連結暫存器
    `define SP   R[13]   // 堆疊暫存器
    `define SW   R[12]   // 狀態暫存器
    // 狀態暫存器旗標位元
    `define N    `SW[15] // 負號旗標
    `define Z    `SW[14] // 零旗標
    `define C    `SW[13] // 進位旗標
    `define V    `SW[12] // 溢位旗標
    `define I    `SW[7]  // 硬體中斷許可
    `define T    `SW[6]  // 軟體中斷許可
    `define M    `SW[0]  // 模式位元
    // 指令編碼表
    parameter [3:0] LD=4'h0,ST=4'h1,LDB=4'h2,STB=4'h3, JEQ=4'h4, JLT=4'h5,JGT=4'h6, CALL=4'h7, SWI=4'h8;
    parameter [7:0] CMP=8'hF1, MOV=8'hF2, ADD=8'hF3, SUB=8'hF4, MUL=8'hF5, DIV=8'hF6, AND=8'hF7,OR=8'hF8,XOR=8'hF9, 
    SHL=8'hE1,SHR=8'hE2, RET=8'hE3, IRET=8'hE4, PUSH=8'hE5,POP=8'hE6, PUSHB=8'hE7, POPB=8'hE8;

    reg inInt = 0;

    task memReadStart(input [15:0] addr, input [1:0] w1); begin // 讀取記憶體 Word
       mar = addr;     // read(m[addr])
       m_rw = 1;     // 讀取模式：read 
       m_en = 1;     // 啟動讀取
       m_w1 = w1;
    end    endtask

    task memReadEnd(output [15:0] data); begin // 讀取記憶體完成，取得資料
       mdr = dbus; // 取得記憶體傳回的 dbus = m[addr]
       data = mdr; // 傳回資料
       m_en = 0; // 讀取完畢
    end    endtask

    // 寫入記憶體 -- addr:寫入位址, data:寫入資料
    task memWriteStart(input [15:0] addr, input [15:0] data, input [1:0] w1); begin 
       mar = addr;    // write(m[addr], data)
       mdr = data;
       m_rw = 0;    // 寫入模式：write
       m_en = 1;     // 啟動寫入
       m_w1  = w1;
    end    endtask

    task memWriteEnd; begin // 寫入記憶體完成
       m_en = 0; // 寫入完畢
    end endtask

    task regSet(input [3:0] i, input [15:0] data); begin
        if (i!=0) R[i] = data;
    end endtask

    task taskInterrupt(input [2:0] iMode); begin
    if (inInt==0) begin
        case (iMode)
            `RESET: begin `PC = 0; tick = 0; R[0] = 0; `SW = 0; `LR = -1; end
            `ABORT: begin `LR = `PC; `PC = 2; end
            `IRQ:   begin `LR = `PC; `PC = 4; end
            `ERROR: begin `LR = `PC; `PC = 6; end
        endcase
        $display("taskInterrupt(%3b)", iMode);
        inInt = 1;
    end
    end endtask

    task taskExecute; begin
            tick = tick+1;
            m_en = 0;
            case (tick)    
                1: begin  // Tick 1 : 指令擷取，將 PC 丟到位址匯流排上，memory.read(m[PC])
                    memReadStart(`PC, `INT16);
                    ipc  = `PC;
                    `PC = `PC+2;
                end
                2: begin  // Tick 2 : 指令解碼，ir = m[PC]
                    memReadEnd(ir); // IR = dbus = m[PC]
                    {op4,cx12} = ir;
                    {op8,a,b}  = ir;
                    c4  = ir[3:0];
                    c12 = cx12; // 取出 cx12 並轉為 16 位元有號數 c12
                    case (op4)
                        LD:  a=1; // 載入word;    LD Cx;     Ra<=[PC+Cx]
                        ST:  a=1; // 儲存word;    ST Cx;     Ra=>[PC+Cx]
                        LDB: a=1; // 載入byte;    LDB Cx;     Ra<=(byte)[PC+Cx]
                        STB: a=1; // 儲存byte;    STB Ra, [Rb+ Cx];    Ra=>(byte)[Rb+ Cx]
                        // 跳躍指令
                        JEQ: a=15;            // 跳躍 (相等);        JEQ Cx;        if SW(=) PC  PC+Cx
                        JLT: a=15;        // 跳躍 ( < );        JLT Cx;     if SW(<) PC  PC+Cx
                        JGT: a=15; // 跳躍 ( > );        JGT Cx;     if SW(>) PC  PC+Cx
                        SWI: a=15; // 軟中斷;    SWI Cx;         LR <= PC; PC <= Cx; INT<=1
                        CALL:a=15; // 跳到副程式;    CALL Cx;     LR<=PC; PC<=PC+Cx
                    endcase
                    Ra = R[a];
                    Rb = R[b];
                    $display("iPC=%4x IR=%4x op4=%x op8=%2x c4=%x c12=%3x a=%x Ra=%4x Rb = %4x", ipc, ir, op4, op8, c4, c12, a, Ra, Rb);
                end
                3: begin // Tick 3 : 指令執行
                    case (op4)
                        // 載入儲存指令
                        LD:  memReadStart(`PC+c12,  `INT16);         // 載入word;    LD Cx;     Ra<=[PC+Cx]
                        ST:  memWriteStart(`PC+c12, Ra, `INT16);     // 儲存word;    ST Cx;     Ra=>[PC+Cx]
                        LDB: memReadStart(`PC+c12,  `BYTE);          // 載入byte;    LDB Cx;     Ra<=(byte)[PC+Cx]
                        STB: memWriteStart(`PC+c12, Ra, `BYTE);      // 儲存byte;    STB Ra, [Rb+ Cx];    Ra=>(byte)[Rb+ Cx]
                        // 跳躍指令
                        JEQ: if (`Z) `PC=`PC+c12;            // 跳躍 (相等);        JEQ Cx;        if SW(=) PC  PC+Cx
                        JLT: if (`N)`PC=`PC+c12;        // 跳躍 ( < );        JLT Cx;     if SW(<) PC  PC+Cx
                        JGT: if (!`N&&!`Z) `PC=`PC+c12;        // 跳躍 ( > );        JGT Cx;     if SW(>) PC  PC+Cx
                        SWI: begin `LR=`PC;`PC= c12; `I = 1'b1; end // 軟中斷;    SWI Cx;         LR <= PC; PC <= Cx; INT<=1
                        CALL:begin `LR=`PC;`PC=`PC + c12; end // 跳到副程式;    CALL Cx;     LR<=PC; PC<=PC+Cx
                    endcase
                        
                    case (op8)
                        // 運算指令
                        CMP:  begin `N=(Ra-Rb<0);`Z=(Ra-Rb==0); end // 比較;       CMP Ra, Rb;        SW=(Ra >=< Rb)
                        MOV:  regSet(a, Rb);                   // 移動;              MOV Ra, Rb;           Ra<=Rb
                        ADD:  regSet(a, Ra+Rb);                // 加法;            ADD Ra, Rb, Rc;     Ra<=Rb+Rc
                        SUB:  regSet(a, Ra-Rb);                // 減法;            SUB Ra, Rb, Rc;     Ra<=Rb-Rc
                        MUL:  regSet(a, Ra*Rb);                // 乘法;            MUL Ra, Rb, Rc;     Ra<=Rb*Rc
                        DIV:  regSet(a, Ra/Rb);                // 除法;            DIV Ra, Rb, Rc;     Ra<=Rb/Rc
                        AND:  regSet(a, Ra&Rb);                // 位元 AND;        AND Ra, Rb, Rc;     Ra<=Rb and Rc
                        OR:   regSet(a, Ra|Rb);                // 位元 OR;            OR Ra, Rb, Rc;         Ra<=Rb or Rc
                        XOR:  regSet(a, Ra^Rb);                // 位元 XOR;        XOR Ra, Rb, Rc;     Ra<=Rb xor Rc
                        SHL:  regSet(a, Rb<<c4);               // 向左移位;        SHL Ra, Rb, Cx;     Ra<=Rb << Cx
                        SHR:  regSet(a, Rb>>c4);               // 向右移位;        SHR Ra, Rb, Cx;     Ra<=Rb >> Cx
                        RET:  begin `PC=`LR; end                // 返回;            RET;         PC <= LR
                        IRET: begin `PC=`LR;`I = 1'b0; end    // 中斷返回;        IRET;         PC <= LR; INT<=0
                        // 堆疊指令    
                        PUSH: begin `SP = `SP-2; memWriteStart(`SP, Ra, `INT16); end // 推入 word;    PUSH Ra;    SP-=2;[SP]<=Ra;
                        POP:  begin memReadStart(`SP, `INT16); `SP = `SP + 2; end    // 彈出 word;    POP Ra;     Ra=[SP];SP+=2;
                        PUSHB:begin `SP = `SP-1; memWriteStart(`SP, Ra, `BYTE); end    // 推入 byte;    PUSHB Ra;     SP--;[SP]<=Ra;(byte)
                        POPB: begin memReadStart(`SP, `BYTE); `SP = `SP+1; end        // 彈出 byte;    POPB Ra;     Ra<=[SP];SP++;(byte)
                    endcase
                end
                4: begin // 讀取寫入指令完成，關閉記憶體
                    case (op4)
                        LD, LDB : memReadEnd(R[1]); // 讀取記憶體完成
                        ST, STB : memWriteEnd();    // 寫入記憶體完成
                    endcase
                    case (op8)
                        POP,  POPB : if (a!=0) memReadEnd(R[a]); // 讀取記憶體完成
                        PUSH, PUSHB: memWriteEnd();    // 寫入記憶體完成
                    endcase
                    $display("%4dns %8x : %8x R[%02d]=%-8x=%-d SW=%8x", $stime, ipc, ir, a, R[a], R[a], `SW);
                    if (op8==RET && `PC < 0) begin
                        $display("RET to PC < 0, finished!");
                        $finish;
                    end
                    tick = 0;
                end                
            endcase
    end endtask

    always @(posedge clock) begin
        if (reset) begin
            taskInterrupt(`RESET);
        end else if (tick == 0 && itype != `EXE) begin
            taskInterrupt(itype);
        end else begin
            inInt = 0;
            taskExecute();
        end
        pc = `PC;
    end
endmodule

module memory0(input clock, reset, en, rw, input [1:0] m_w1, 
                input [15:0] abus, dbus_in, output [15:0] dbus_out);
reg [7:0] m [0:258];
reg [15:0] data;

integer i;
initial begin
    $readmemh("mcu0i.hex", m);
    for (i=0; i < 255; i=i+2) begin
       $display("%4x: %4x", i, {m[i], m[i+1]});
    end
end

    always @(clock or abus or en or rw or dbus_in) 
    begin
        if (abus >=0 && abus <= 255) begin
            if (en == 1 && rw == 0) begin // r_w==0:write
                data = dbus_in;
                case (m_w1)
                    `BYTE:  {m[abus]} = dbus_in[7:0];
                    `INT16: {m[abus], m[abus+1] } = dbus_in[15:0];
                endcase
            end else if (en == 1 && rw == 1) begin// r_w==1:read
                case (m_w1)
                    `BYTE:  data = {8'h00,   m[abus]   };
                    `INT16: data = {m[abus], m[abus+1] };
                endcase
            end else
                data = 16'hZZZZ;
        end else
            data = 16'hZZZZ;
    end
    assign dbus_out = data;
endmodule

module main;
reg clock, reset;
reg [2:0] itype;
wire [2:0] tick;
wire [15:0] pc, ir, mar, mdr, dbus;
wire m_en, m_rw;
wire [1:0] m_w1;

mcu0 mcu(.clock(clock), .reset(reset), .itype(itype), .pc(pc), .tick(tick), .ir(ir),
.mar(mar), .mdr(mdr), .dbus(dbus), .m_en(m_en), .m_rw(m_rw), .m_w1(m_w1));

memory0 mem(.clock(clock), .reset(reset), .en(m_en), .rw(m_rw), .m_w1(m_w1), 
.abus(mar), .dbus_in(mdr), .dbus_out(dbus));

initial begin
  clock = 0;
  reset = 1;
  #200 reset = 0; itype=`EXE;
//  #100000 $finish;
  #1000 $finish;
end

always #1000 begin
  itype = `IRQ; #200 itype = `EXE;
end

always #10 clock=clock+1;

endmodule
