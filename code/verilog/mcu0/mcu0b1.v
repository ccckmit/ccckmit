module memory(input w, input [11:0] wi, input [15:0] wd, input [11:0] i1, output [15:0] d1, input [11:0] i2, output [15:0] d2);
  integer i;  
  reg [7:0] m[0:2**12-1];  // 內部的快取記憶體
  initial begin // 初始化
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign d1 = {m[i1], m[i1+1]};
  assign d2 = {m[i2], m[i2+1]};
  always @(w) begin
    if (w) begin
      {m[wi], m[wi+1]} = wd;
       $display("%dns write %x to m[%x]", $time, wd, wi);
    end
  end
endmodule

module adder#(parameter W=16)(input [W-1:0] a, input [W-1:0] b, output [W-1:0] c);
  assign c = a + b;
endmodule

module register#(parameter W=16)(input clock, w, input [W-1:0] ri, output [W-1:0] ro);
reg [W-1:0] r;
  always @(posedge clock) begin
    if (w) r = ri;
  end
  assign ro=r;
endmodule
/*
module register#(parameter W=16)(input w, input [W-1:0] ri, output [W-1:0] ro);
reg [W-1:0] r;
  always @(w) begin
    if (w==1) r = ri;
  end
  assign ro=r;
endmodule
*/
module alu(input [3:0] op, input [15:0] a, input [15:0] b, output reg [15:0] c);
parameter [3:0] ZERO=4'h0, ADD=4'h1, CMP=4'he, APASS=4'hf;
  always @(*) begin
    case (op)
      ADD: c = a+b;
      CMP: begin c[15]=(a < b); c[14]=(a==b); c[13:0]=14'h0; end
      APASS: c = a;
      default: c = 0;
    endcase
  end
endmodule

module mux#(parameter W=16)(input sel, input [W-1:0] i0, i1, output [W-1:0] o);
  assign o=(sel)?i1:i0;
endmodule

`define OP ir[15:12]
`define C  ir[11:0]
`define N  SW.r[15]
`define Z  SW.r[14]

module mcu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  reg  mw, aw, pcmux, sww;
  reg [3:0] aluop;
  wire [11:0] pco, pci, pcnext;
  wire [15:0] aluout, ao, swo, ir, mo;
  register#(.W(12)) PC(clock, 1, pci, pco);
  adder#(.W(12)) adder0(2, pco, pcnext);
  memory mem(mw, `C, ao, pco[11:0], ir, `C, mo);
  register#(.W(16)) A(~clock, aw, aluout, ao);
  register#(.W(16)) SW(~clock, sww, aluout, swo);
  alu alu0(aluop, mo, ao, aluout);
  mux#(.W(12)) muxpc(pcmux, pcnext, `C, pci);

  initial begin 
    PC.r = 0; SW.r = 0; mw = 0; aw = 0; pcmux=0; sww=0; aluop=alu0.ZERO;
  end

  always @(ir or mo or A.r) begin
    mw = 0;
    aw = 0;
    sww = 0;
    pcmux = 0;
    aluop = alu0.ZERO;
    case (`OP)
      LD: begin aw=1; aluop=alu0.APASS; end      // LD C
      ST: begin mw=1; end      // ST C
      JMP: begin pcmux=1; end  // JMP C
      JEQ: begin               // JEQ C
        if (`Z) pcmux=1; 
      end
      CMP: begin               // CMP C
        sww=1; aluop = alu0.CMP;
        $display("   A=%x mo=%x", A.r, mo);
      end
      ADD: begin aw=1; aluop=alu0.ADD; end      // ADD C
    endcase
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

mcu mcu0(clock); // 處理器

initial begin 
  clock = 0;
  $monitor("%4dns pc=%x ir=%x mo=%x sw=%x a=%d mw=%b aluout=%x", $stime, mcu0.PC.r, mcu0.ir, mcu0.mo, mcu0.SW.r, mcu0.A.r, mcu0.mw, mcu0.aluout);
end
always #10 begin 
  clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
  #5;
  clock=~clock;
  #5;
end  

initial #3000 $finish;      // 停止測試。
endmodule

//  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
// always #10 mcu0.pc.r=mcu0.pc.r+1;    // 每隔 10ns 反相，時脈週期為 20ns
/*
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define A    R[0]      // 累積器
`define PC   R[1]      // 程式計數器
`define SW   R[2]      // 狀態暫存器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標
`define M    {mem0.m[`C], mem0.m[`C+1]} // 存取的記憶體

module adder(input [15:0] a, input [15:0] b, output reg [15:0] c)
  assign c = a + b;
endmodule

module alu(input [3:0] op, input [15:0] a, input [15:0] b, output reg [15:0] c)
parameter [3:0] ADD=4'h0, CMP=4'hf;
  always @(op) begin
    case (op)
      ADD: c = a+b;
      CMP: begin c[15]=(a < b); c[14]=(a==b); end
    endcase
  end
endmodule

module regbank(input clock, input w, input [3:0] wi,ri1, ri2, input [15:0] wd, output reg [15:0] ro1, ro2)
reg [15:0] r[0:15];
  assign ro1 = r[ri1];
  assign ro2 = r[ri2];
  always @(clock) begin
    if (w) begin
      r[wi] = wd;
      $display("write %x to reg=%x", wd, wi);
    end
  end
endmodule

module mux(input sel, input [15:0] i0, i1, output o)
  assign o=(sel)?i1:i0;
endmodule
*/
