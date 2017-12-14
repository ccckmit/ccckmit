module FSM(input reset, clock);
  parameter [2:0] start=0, fetch=1, decode=2, execute=3;
  reg [2:0] pstate, nstate;
  
  always @(pstate) begin :combinatorial
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
  always @(posedge clock or reset) begin : sequential
    if (reset) 
	  pstate <= start;
	else 
      pstate <= nstate;
  end
endmodule

module main;           // 測試程式開始
reg clock, reset;

FSM fsm(reset, clock); // 宣告處理器

initial begin
  clock = 0;
  reset = 1;          // 一開始先重置
  $monitor("%5dns: reset=%x, pstate=%x ", $stime, reset, fsm.pstate);
  #50 reset = 0;
  #500 $finish;
end
always #5 clock=~clock;// 不斷反相，產生波形
endmodule
