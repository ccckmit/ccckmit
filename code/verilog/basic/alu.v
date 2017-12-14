// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module alu(input [7:0] a, input [7:0] b, input [2:0] op, output reg [7:0] y);
always@(a or b or op) begin // 當 a, b 或 op 有改變時，就進入此區塊執行。
  case(op)                  // 根據 op 決定要執行何種運算
    3'b000: y = a + b;      // op=000, 執行加法
    3'b001: y = a - b;      // op=000, 執行減法
    3'b010: y = a * b;      // op=000, 執行乘法
    3'b011: y = a / b;      // op=000, 執行除法
    3'b100: y = a & b;      // op=000, 執行 AND
    3'b101: y = a | b;      // op=000, 執行 OR
    3'b110: y = ~a;         // op=000, 執行 NOT
    3'b111: y = a ^ b;      // op=000, 執行 XOR
  endcase
  $display("base 10 : %dns : op=%d a=%d b=%d y=%d", $stime, op, a, b, y); // 印出 op, a, b, y 的 10 進位值。
  $display("base  2 : %dns : op=%b a=%b b=%b y=%b", $stime, op, a, b, y); // 印出 op, a, b, y 的  2 進位值。
end
endmodule

module main;                // 測試程式開始
 reg  [7:0] a, b;           // 宣告 a, b 為 8 位元暫存器
 wire  [7:0] y;             // 宣告 y 為 8 位元線路
 reg  [2:0] op;             // 宣告 op 為 3 位元暫存器

 alu alu1(a, b, op, y);     // 建立一個 alu 單元，名稱為 alu1

 initial begin              // 測試程式的初始化動作
  a = 8'h07;                // 設定 a 為數值 7
  b = 8'h03;                // 設定 b 為數值 3
  op = 3'b000;              // 設定 op 的初始值為 000
  $dumpfile("alu.vcd");
  $dumpvars;
 end

 always #50 begin           // 每個 50 奈秒就作下列動作
   op = op + 1;             // 讓 op 的值加 1
 end

initial #1000 $finish;      // 時間到 1000 奈秒就結束

endmodule
