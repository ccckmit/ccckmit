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
  assign #1 ro=r;
endmodule

module alu(input [3:0] op, input [15:0] a, input [15:0] b, output reg [15:0] c);
parameter [3:0] ZERO=4'h0, ADD=4'h1, CMP=4'he, APASS=4'hf;
  always @(*) begin
    case (op)
      ADD: c = a+b;
      CMP: begin c[15]=(a < b); c[14]=(a==b); c[13:0]=14'h0; end
      APASS: c = a;
      default: c = 16'hz;
    endcase
  end
endmodule

module mux#(parameter W=16)(input sel, input [W-1:0] i0, i1, output [W-1:0] o);
  assign o=(sel)?i1:i0;
endmodule

`define OP iro[15:12]
`define C  iro[11:0]
`define N  swo[15]
`define Z  swo[14]

module mcu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  reg  mw, aw, pcmux, sww;
  reg [3:0] aluop;
  wire [11:0] pco, pci, pcnext;
  wire [15:0] aluout, ao, swo, iri, iro, mi, mo;
  mux#(.W(12)) muxpc(pcmux, pcnext, `C, pci);
  adder#(.W(12)) adder0(2, pco, pcnext);
  register#(.W(12)) PC(clock, 1, pci, pco);
  register#(.W(16)) IR(clock, 1, iri, iro);
  register#(.W(16)) M(clock, 1, mi, mo);
  memory mem(mw, `C, ao, pco, iri, `C, mi);
  register#(.W(16)) A(clock, aw, aluout, ao);
  register#(.W(16)) SW(clock, sww, aluout, swo);
  alu alu0(aluop, mo, ao, aluout);

  initial begin 
    PC.r = 0; SW.r = 0; mw = 0; aw = 0; pcmux=0; sww=0; aluop=alu0.ZERO;
  end

  always @(*) begin /*iro or mo or ao or pco or swo*/
    mw = 0;
    aw = 0;
    sww = 0;
    pcmux = 0;
    aluop = alu0.ZERO;
    case (`OP)
      LD: begin aw=1; aluop=alu0.APASS; end     // LD C
      ST: mw=1;                                 // ST C
      JMP: pcmux=1;                             // JMP C
      JEQ: if (`Z) pcmux=1;                     // JEQ C
      CMP: begin sww=1; aluop = alu0.CMP; end   // CMP C
      ADD: begin aw=1; aluop=alu0.ADD; end      // ADD C
    endcase
  end
endmodule

module main;         // 測試程式開始
reg clock;           // 時脈 clock 變數

mcu mcu0(clock);

initial begin 
  clock = 0;
  $monitor("%4dns pc=%x iri=%x iro=%x mi=%x mo=%x sw=%x a=%d mw=%b aluo=%x", $stime, mcu0.pco, mcu0.iri, mcu0.iro, mcu0.mi, mcu0.mo, mcu0.swo, mcu0.ao, mcu0.mw, mcu0.aluout);
  #1000 $finish;
end
always #5 begin 
  clock=~clock;    // 每隔 5ns 反相，時脈週期為 10ns
end  
endmodule
