module memory(input w, input [11:0] wi, input [15:0] wd, input [11:0] i1, output [15:0] d1, input [11:0] i2, output [15:0] d2);
  integer i;  
  reg [7:0] m[0:2**12-1];
  initial begin
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign d1 = {m[i1], m[i1+1]};
  assign d2 = {m[i2], m[i2+1]};
  always @(w) begin
    if (w) {m[wi], m[wi+1]} = wd;
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

module control(input [3:0] op, input z, output mw, aw, pcmux, sww, output [3:0] aluop);
  reg mw, aw, pcmux, sww;
  reg [3:0] aluop;
  always @(op) begin
    mw = 0;
    aw = 0;
    sww = 0;
    pcmux = 0;
    aluop = alu0.ZERO;
    case (op)
      mcu0.LD: begin aw=1; aluop=alu0.APASS; end     // LD C
      mcu0.ST: mw=1;                                 // ST C
      mcu0.JMP: pcmux=1;                             // JMP C
      mcu0.JEQ: if (`Z) pcmux=1;                     // JEQ C
      mcu0.CMP: begin sww=1; aluop = alu0.CMP; end   // CMP C
      mcu0.ADD: begin aw=1; aluop=alu0.ADD; end      // ADD C
    endcase
  end  
endmodule

module mcu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  wire mw, aw, pcmux, sww;
  wire [3:0] aluop;
  wire [11:0] pco, pci, pcnext;
  wire [15:0] aluout, ao, swo, ir, mo;
  
  register#(.W(12)) PC(clock, 1, pci, pco);
  adder#(.W(12)) adder0(2, pco, pcnext);
  memory mem(mw, `C, ao, pco, ir, `C, mo);
  register#(.W(16)) A(~clock, aw, aluout, ao);
  register#(.W(16)) SW(~clock, sww, aluout, swo);
  alu alu0(aluop, mo, ao, aluout);
  mux#(.W(12)) muxpc(pcmux, pcnext, `C, pci);
  control cu(`OP, `Z, mw, aw, pcmux, sww, aluop);
  
  initial begin 
    PC.r = 0; SW.r = 0; // mw = 0; aw = 0; pcmux=0; sww=0; aluop=alu0.ZERO;
  end
endmodule

module main;         // 測試程式開始
reg clock;           // 時脈 clock 變數

mcu mcu0(clock);

initial begin 
  clock = 0;
  $monitor("%4dns pc=%x ir=%x mo=%x sw=%x a=%d mw=%b aluout=%x", $stime, mcu0.PC.r, mcu0.ir, mcu0.mo, mcu0.SW.r, mcu0.A.r, mcu0.mw, mcu0.aluout);
  #1000 $finish;
end
always #5 begin 
  clock=~clock;    // 每隔 5ns 反相，時脈週期為 10ns
end  
endmodule
