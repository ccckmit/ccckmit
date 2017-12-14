// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module alu(input [31:0] a, input [31:0] b, input [1:0] op, output reg [31:0] y);

    task f32to64(input [31:0] x32, output [63:0] x64); 
    reg [10:0] e;
    begin
        e = {3'b0, x32[30:23]};
        e = e + (1023 - 127);
        x64 = {x32[31], e, x32[22:0], 29'b0};
    end endtask

    task f64to32(input [63:0] x64, output [31:0] x32); 
    reg [10:0] e;
    begin
        e = {x64[62:52]};
        e = e + (127-1023);
        x32 = {x64[63], e[7:0], x64[51-:23]};
    end endtask
	
    task falu32(input [31:0] a32, input [31:0] b32, input [1:0] op, output [31:0] y32);
    reg [63:0] a64, b64, y64;
    real a, b, y;
    begin
        f32to64(a32, a64); a = $bitstoreal(a64);
        f32to64(b32, b64); b = $bitstoreal(b64); 
        case (op)
            2'b00: y = a + b;
            2'b01: y = a - b;
            2'b10: y = a * b;
            2'b11: y = a / b;
        endcase
         $display("falu32:op=%d a=%f b=%f y=%f", op, a, b, y);
        y64 = $realtobits(y);
        f64to32(y64, y32);
    end
    endtask
	
	always @(a or b or op) begin
	  flu32(a, b, op, y);
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
 end

 always #50 begin           // 每個 50 奈秒就作下列動作
   op = op + 1;             // 讓 op 的值加 1
 end

initial #1000 $finish;      // 時間到 1000 奈秒就結束

endmodule
