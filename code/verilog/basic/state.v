module FSM(input reset, clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  parameter [2:0] start=0, fetch=1, decode=2, execute=3;
  reg [2:0] pstate, nstate;
  
  always @(pstate) begin :combinatorial // 在 clock 時脈的正邊緣時觸發
    case (pstate)
      start: begin
	    nstate = fetch;
	  end
      fetch: begin
	    nstate = decode;
      end
      decode: begin
		nstate = execute;
      end
      execute: begin 
	    nstate = fetch;
      end
    endcase
  end
  always @(posedge clock or reset) begin : sequential // 在 clock 時脈的正邊緣時觸發
    if (reset) 
	  pstate <= start;
	else 
      pstate <= nstate;
  end
endmodule

module main;           // 測試程式開始
reg clock, reset;      // 時脈 clock 變數

FSM fsm(reset, clock); // 宣告處理器

initial begin
  clock = 0;
  reset = 1;          // 一開始先重置
  $monitor("%5dns: reset=%x, pstate=%x ", $stime, reset, mcu0.pstate);
  #50 reset = 0;
  #1000 $finish;
end
always #5 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
endmodule
