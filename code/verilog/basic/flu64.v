// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module falu(input [63:0] ia, input [63:0] ib, input [1:0] op, output reg [63:0] oy);
real a, b, y;

always @(a or b or op) begin
  a = $bitstoreal(ia);
  b = $bitstoreal(ib); 
  case (op)
    2'b00: y = a + b;
    2'b01: y = a - b;
    2'b10: y = a * b;
    2'b11: y = a / b;
  endcase
  $display("falu32:op=%d a=%f b=%f y=%f", op, a, b, y);
  oy = $realtobits(y);
end
endmodule

module main;                // 測試程式開始
  reg  [63:0] a64, b64;
  wire [63:0] y64;
  reg  [1:0] op;
  real a, b;

  falu falu1(a64, b64, op, y64);     // 建立一個 alu 單元，名稱為 alu1

  initial begin              // 測試程式的初始化動作
    a = 3.14159;  a64 = $realtobits(a);
    b = 2.71818;  b64 = $realtobits(b);
	op = 0;
  end

  always #50 begin           // 每個 50 奈秒就作下列動作
    op = op + 1;             // 讓 op 的值加 1
  end

  initial #1000 $finish;      // 時間到 1000 奈秒就結束

endmodule
