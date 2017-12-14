`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define A    R[0]      // 累積器
`define PC   R[1]      // 程式計數器
`define SW   R[2]      // 狀態暫存器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標

module memory(input w, input [11:0] addr, inout [15:0] data);
  integer i;  
  reg [7:0] m[0:2**12-1];  // 內部的快取記憶體
  initial begin // 初始化
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign data = (!w)?{m[addr], m[addr+1]} : 16'hz;
  always @(w) begin
    if (w) begin
      {m[addr], m[addr+1]} = data;
       $display("write %x to addr=%x", data, addr);
    end
  end
endmodule

module mcu(input reset, clock, output reg mw, output reg [11:0] maddr, inout [15:0] mdata);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  parameter [1:0] start=2'b00, fetch=2'b01, decode=2'b10, execute=2'b11;
  reg [1:0] pstate, nstate;
  reg [15:0] IR;    // 指令暫存器
  reg [15:0] R[0:2];
  reg [15:0] pc0;
  reg [15:0] mdr;
  
  always @(pstate) begin :combinatorial // 在 clock 時脈的正邊緣時觸發
    mdr=16'hz;
    case (pstate)
      start: begin
		`PC = 0;
		`SW = 0;
		nstate = fetch;
        mw = 0;
	  end
      fetch: begin
        mw = 0; 
        maddr = `PC;
        pc0 = `PC;              // 儲存舊的 PC 值在 pc0 中。
        `PC = `PC+2;            // 擷取完成，PC 前進到下一個指令位址
        nstate = decode;
      end
      decode: begin
        mdr= mdata;
		IR = mdr;
        maddr=`C;
        nstate = fetch;
        case (`OP) // 解碼、根據 OP 執行動作
          ST: begin mdr=`A; mw=1; end   // ST C
          JMP: `PC = `C;                // JMP C
          JEQ: if (`Z) `PC=`C;          // JEQ C
          default: nstate = execute;
        endcase
      end
      execute: begin 
        case (`OP) // 解碼、根據 OP 執行動作
          ST: mw=0;               // ST C
          LD:  begin mdr = mdata; `A = mdata; end // LD C
          CMP: begin `N=(`A < mdata); `Z=(`A==mdata); end // CMP C
          ADD: `A = `A + mdata;         // ADD C
        endcase
        nstate = fetch;
      end
    endcase
    // 印出 PC, IR, SW, A 等暫存器值以供觀察
    $display("%4dns PC=%x IR=%x, SW=%x, A=%d mdr=%x", $stime, pc0, IR, `SW, `A, mdr);
  end
  always @(posedge clock or reset) begin : sequential // 在 clock 時脈的正邊緣時觸發
    if (reset) 
	  pstate <= start;
	else 
      pstate <= nstate;
  end
//  assign mdata = mdr;
  assign mdata = (mdr!=16'hz)?mdr:16'hz;
endmodule

module main;                // 測試程式開始
reg clock, reset;           // 時脈 clock 變數
wire w;
wire [11:0] addr;
wire [15:0] data;

mcu mcu0(reset, clock, w, addr, data); // 宣告處理器
memory mem0(w, addr, data);            // 宣告記憶體

initial begin
  $monitor("%5dns: reset=%x, pstate=%x w=%x", $stime, reset, mcu0.pstate, w);
  
  clock = 0;
  reset = 1;          // 一開始先重置
  #50 reset = 0;
  #5000 $finish;
end
always #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
endmodule
