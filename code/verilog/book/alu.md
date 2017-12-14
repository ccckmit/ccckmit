# 算術邏輯單元 ALU 的設計

在上一章中，我們探討了「組合邏輯電路」的設計方式，採用閘級的拉線方式設計了「多工器」與「加法器」等元件，
在本章當中，我們將從加法器再度往上，探討如何設計一個 ALU 單元。

## 加減器

我們只要把加法器，加上一組控制的互斥或閘，並控制輸入進位與否，就可以成為加減器了，這是因為我們採用了二補數的關係。

二補數讓我們可以很容易的延伸加法器電路就能做出減法器。我們可以在運算元 B 之前加上 2 選 1 多工器或 XOR 閘來控制 B 是否應該取補數，並且
運用 OP 控制線路來進行控制，以下是採用 2 選 1 多工器的電路做法圖。

![圖、採用 2 選 1 多工器控制的加減器電路](../img/addsub4-mux.png)

另一種更簡單的做法是採用 XOR 閘去控制 B 是否要取補數，如下圖所示：

![圖、採用 XOR 控制的加減器電路](../img/addsub4-xor.png)

清楚了電路圖的布局之後，讓我們來看看如何用 Verilog 實做加減器吧！關鍵部分的程式如下所示，這個模組就對應到上述的
「採用 XOR 控制的加減器電路」之圖形。

```Verilog
module addSub4(input op, input signed [3:0] a, input signed [3:0] b, 
               output signed [3:0] sum, output c_out);

wire [3:0] bop;

xor4 x1(b, {op,op,op,op}, bop);
adder4 a1(a, bop, op, sum, c_out);

endmodule
```

接著讓我們來看看完整的加減器程式與測試結果。

檔案：[addsub4.v](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/addsub4.v)

```Verilog
module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
xor g5(c_out, c2, c1) ;

endmodule

module adder4(input signed [3:0] a, input signed [3:0] b, input c_in, 
              output signed [3:0] sum, output c_out);
wire [3:0] c;

fulladder fa1(a[0],b[0], c_in, sum[0], c[1]) ;
fulladder fa2(a[1],b[1], c[1], sum[1], c[2]) ;
fulladder fa3(a[2],b[2], c[2], sum[2], c[3]) ;
fulladder fa4(a[3],b[3], c[3], sum[3], c_out) ;

endmodule

module xor4(input [3:0] a, input [3:0] b, output [3:0] y);
  assign y = a ^ b;
endmodule

module addSub4(input op, input signed [3:0] a, input signed [3:0] b, 
               output signed [3:0] sum, output c_out);

wire [3:0] bop;

xor4 x1(b, {op,op,op,op}, bop);
adder4 a1(a, bop, op, sum, c_out);

endmodule

module main;
reg signed [3:0] a;
reg signed [3:0] b;
wire signed [3:0] sum;
reg op;
wire c_out;

addSub4 DUT (op, a, b, sum, c_out);

initial
begin
  a = 4'b0101;
  b = 4'b0000;
  op = 1'b0;
end

always #50 begin
  op=op+1;
  $monitor("%dns monitor: op=%d a=%d b=%d sum=%d", $stime, op, a, b, sum);
end

always #100 begin
  b=b+1;
end

initial #2000 $finish;

endmodule
```

執行結果：

```
D:\ccc101\icarus\ccc>iverilog -o addSub4 addSub4.v

D:\ccc101\icarus\ccc>vvp addSub4
        50ns monitor: op=1 a= 5 b= 0 sum= 5
       100ns monitor: op=0 a= 5 b= 1 sum= 6
       150ns monitor: op=1 a= 5 b= 1 sum= 4
       200ns monitor: op=0 a= 5 b= 2 sum= 7
       250ns monitor: op=1 a= 5 b= 2 sum= 3
       300ns monitor: op=0 a= 5 b= 3 sum=-8
       350ns monitor: op=1 a= 5 b= 3 sum= 2
       400ns monitor: op=0 a= 5 b= 4 sum=-7
       450ns monitor: op=1 a= 5 b= 4 sum= 1
       500ns monitor: op=0 a= 5 b= 5 sum=-6
       550ns monitor: op=1 a= 5 b= 5 sum= 0
       600ns monitor: op=0 a= 5 b= 6 sum=-5
       650ns monitor: op=1 a= 5 b= 6 sum=-1
       700ns monitor: op=0 a= 5 b= 7 sum=-4
       750ns monitor: op=1 a= 5 b= 7 sum=-2
       800ns monitor: op=0 a= 5 b=-8 sum=-3
       850ns monitor: op=1 a= 5 b=-8 sum=-3
       900ns monitor: op=0 a= 5 b=-7 sum=-2
       950ns monitor: op=1 a= 5 b=-7 sum=-4
      1000ns monitor: op=0 a= 5 b=-6 sum=-1
      1050ns monitor: op=1 a= 5 b=-6 sum=-5
      1100ns monitor: op=0 a= 5 b=-5 sum= 0
      1150ns monitor: op=1 a= 5 b=-5 sum=-6
      1200ns monitor: op=0 a= 5 b=-4 sum= 1
      1250ns monitor: op=1 a= 5 b=-4 sum=-7
      1300ns monitor: op=0 a= 5 b=-3 sum= 2
      1350ns monitor: op=1 a= 5 b=-3 sum=-8
      1400ns monitor: op=0 a= 5 b=-2 sum= 3
      1450ns monitor: op=1 a= 5 b=-2 sum= 7
      1500ns monitor: op=0 a= 5 b=-1 sum= 4
      1550ns monitor: op=1 a= 5 b=-1 sum= 6
      1600ns monitor: op=0 a= 5 b= 0 sum= 5
      1650ns monitor: op=1 a= 5 b= 0 sum= 5
      1700ns monitor: op=0 a= 5 b= 1 sum= 6
      1750ns monitor: op=1 a= 5 b= 1 sum= 4
      1800ns monitor: op=0 a= 5 b= 2 sum= 7
      1850ns monitor: op=1 a= 5 b= 2 sum= 3
      1900ns monitor: op=0 a= 5 b= 3 sum=-8
      1950ns monitor: op=1 a= 5 b= 3 sum= 2
      2000ns monitor: op=0 a= 5 b= 4 sum=-7
```

在上述結果中，您可以看到當 op=0 時，電路所作的是加法運算，例如：200ns monitor: op=0 a= 5 b= 2 sum= 7。而當 op=1 時，
電路所做的是減法運算，例如：250ns monitor: op=1 a= 5 b= 2 sum= 3。

## 採用 CASE 語法設計 ALU 模組

其實、在 Verilog 當中，我們並不需要自行設計加法器，因為 Verilog 提供了高階的 「+, -, *, /」等基本運算，可以讓我們
直接使用，更方便的是，只要搭配 case 語句，我們就可以很輕易的設計出一個 ALU 單元了。

以下是一個簡易的 ALU 單元之程式碼，

```verilog
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
end
endmodule
```

### Verilog 語法的注意事項

上述這種寫法感覺就好像在用高階寫程式一樣，這讓 ALU 的設計變得非常簡單。但是仍然需要注意以下幾點與高階語言不同之處：

### 注意事項 1. always 語句的用法

case 等陳述句的外面一定要有 always 或 initial 語句，因為這是硬體線路，所以是採用連線 wiring 的方式，always 語句
只有在 @(trigger) 中間的 trigger 觸發條件符合時才會被觸發。

當 trigger 中的變數有任何改變的時候，always 語句就會被觸發，像是 always@(a or b or op) 就代表當 (a, b, op) 當中任何一個
有改變的時候，該語句就會被觸發。

有時我們可以在 always 語句當中加上 posedge 的條件，指定只有在「正邊緣」(上昇邊緣) 時觸發。或者加上 negedge 的條件，指定
只有在「負邊緣」(下降邊緣) 的時候觸發，例如我們可以常常在 Verilog 當中看到下列語句：

```verilog
always @(posedge clock) begin
....
end
```

上述語句就只有在 clock 這一條線路的電波上昇邊緣會被觸發，如此我們就能更精細的控制觸發的動作，採用正邊緣或負邊緣觸發的方式。

### 注意事項 2. 指定陳述的左項之限制

在上述程式中，a, b, op 被宣告為 input (輸入線路), 而 y 則宣告為 output reg (輸出暫存器), 在這裏必須注意的是 y 不能只宣告為 output 
而不加上 reg，因為只有 reg 型態的變數才能被放在 always 區塊裡的等號左方，進行指定的動作。

事實上、在 Verilog 當中，像 `output reg [7:0] y` 這樣的宣告，其實也可以用比較繁雜的兩次宣告方式，一次宣告 output，
另一次則宣告 reg，如下所示：

```verilog
module alu(input [7:0] a, input [7:0] b, input [2:0] op, output [7:0] y);
reg y;
always@(a or b or op) begin
....
```

甚至，您也可以將該變數分開為兩個不同名稱，然後再利用 assign 的方式指定，如下所示：

```verilog
// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module alu(input [7:0] a, input [7:0] b, input [2:0] op, output [7:0] y);
reg ty;
always@(a or b or op) begin // 當 a, b 或 op 有改變時，就進入此區塊執行。
  case(op)                  // 根據 op 決定要執行何種運算
    3'b000: ty = a + b;      // op=000, 執行加法
    3'b001: ty = a - b;      // op=000, 執行減法
    3'b010: ty = a * b;      // op=000, 執行乘法
    3'b011: ty = a / b;      // op=000, 執行除法
    3'b100: ty = a & b;      // op=000, 執行 AND
    3'b101: ty = a | b;      // op=000, 執行 OR
    3'b110: ty = ~a;         // op=000, 執行 NOT
    3'b111: ty = a ^ b;      // op=000, 執行 XOR
  endcase
  $display("base 10 : %dns : op=%d a=%d b=%d y=%d", $stime, op, a, b, y); // 印出 op, a, b, y 的 10 進位值。
  $display("base  2 : %dns : op=%b a=%b b=%b y=%b", $stime, op, a, b, y); // 印出 op, a, b, y 的  2 進位值。
end
assign y=ty;
endmodule
```

在上述程式中，由於只有 reg 型態的變數可以放在 always 區塊內的等號左邊，因此我們必須用 reg 型態的 ty 去儲存
運算結果。

但是在 assign 指令的等號左邊，則不需要是暫存器型態的變數，也可以是線路型態的變數，因此我們可以用 assign y=ty 
這樣一個指令去將 ty 的暫存器內容輸出。

事實上，assign 語句代表的是一種「不需儲存的立即輸出接線」，因此我們才能將 output 型態的變數寫在等號左邊啊！

## 完整的 ALU 設計 (含測試程式)

瞭解了這些 Verilog 語法特性之後，我們就可以搭配測試程式，對這個　ALU 模組進行測試，以下是完整的程式碼：

檔案：[alu.v](../code/alu.v)

```verilog
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
 end

 always #50 begin           // 每個 50 奈秒就作下列動作
   op = op + 1;             // 讓 op 的值加 1
 end

initial #1000 $finish;      // 時間到 1000 奈秒就結束

endmodule
```

在上述程式中，為了更清楚的印出 ALU 的輸出結果，我們在 ALU 模組的結尾放入以下的兩行 `$display()` 指令，
以便同時顯示 (op, a, b, y) 等變數的 10 進位與 2 進位結果值，方便讀者觀察。

```verilog
  $display("base 10 : %dns : op=%d a=%d b=%d y=%d", $stime, op, a, b, y); // 印出 op, a, b, y 的 10 進位值。
  $display("base  2 : %dns : op=%b a=%b b=%b y=%b", $stime, op, a, b, y); // 印出 op, a, b, y 的  2 進位值。
```

### 測試執行結果

上述程式的執行測試結果如下：

```
D:\Dropbox\Public\pmag\201310\code>iverilog -o alu alu.v

D:\Dropbox\Public\pmag\201310\code>vvp alu
base 10 :          0ns : op=0 a=  7 b=  3 y= 10
base  2 :          0ns : op=000 a=00000111 b=00000011 y=00001010
base 10 :         50ns : op=1 a=  7 b=  3 y=  4
base  2 :         50ns : op=001 a=00000111 b=00000011 y=00000100
base 10 :        100ns : op=2 a=  7 b=  3 y= 21
base  2 :        100ns : op=010 a=00000111 b=00000011 y=00010101
base 10 :        150ns : op=3 a=  7 b=  3 y=  2
base  2 :        150ns : op=011 a=00000111 b=00000011 y=00000010
base 10 :        200ns : op=4 a=  7 b=  3 y=  3
base  2 :        200ns : op=100 a=00000111 b=00000011 y=00000011
base 10 :        250ns : op=5 a=  7 b=  3 y=  7
base  2 :        250ns : op=101 a=00000111 b=00000011 y=00000111
base 10 :        300ns : op=6 a=  7 b=  3 y=248
base  2 :        300ns : op=110 a=00000111 b=00000011 y=11111000
base 10 :        350ns : op=7 a=  7 b=  3 y=  4
base  2 :        350ns : op=111 a=00000111 b=00000011 y=00000100
base 10 :        400ns : op=0 a=  7 b=  3 y= 10
base  2 :        400ns : op=000 a=00000111 b=00000011 y=00001010
base 10 :        450ns : op=1 a=  7 b=  3 y=  4
base  2 :        450ns : op=001 a=00000111 b=00000011 y=00000100
base 10 :        500ns : op=2 a=  7 b=  3 y= 21
base  2 :        500ns : op=010 a=00000111 b=00000011 y=00010101
base 10 :        550ns : op=3 a=  7 b=  3 y=  2
base  2 :        550ns : op=011 a=00000111 b=00000011 y=00000010
base 10 :        600ns : op=4 a=  7 b=  3 y=  3
base  2 :        600ns : op=100 a=00000111 b=00000011 y=00000011
base 10 :        650ns : op=5 a=  7 b=  3 y=  7
base  2 :        650ns : op=101 a=00000111 b=00000011 y=00000111
base 10 :        700ns : op=6 a=  7 b=  3 y=248
base  2 :        700ns : op=110 a=00000111 b=00000011 y=11111000
base 10 :        750ns : op=7 a=  7 b=  3 y=  4
base  2 :        750ns : op=111 a=00000111 b=00000011 y=00000100
base 10 :        800ns : op=0 a=  7 b=  3 y= 10
base  2 :        800ns : op=000 a=00000111 b=00000011 y=00001010
base 10 :        850ns : op=1 a=  7 b=  3 y=  4
base  2 :        850ns : op=001 a=00000111 b=00000011 y=00000100
base 10 :        900ns : op=2 a=  7 b=  3 y= 21
base  2 :        900ns : op=010 a=00000111 b=00000011 y=00010101
base 10 :        950ns : op=3 a=  7 b=  3 y=  2
base  2 :        950ns : op=011 a=00000111 b=00000011 y=00000010
base 10 :       1000ns : op=4 a=  7 b=  3 y=  3
```

### 執行結果分析

您可以看到一開始 0ns 時，op=0，所以執行加法，得到 y=a+b=7+3=10，然後 50ns 時 op=1，所以執行減法，
以下是整個執行結果的簡化列表：

a             b                 op       y
------------  ---------------   -----    ------------------
7             3                 0 (+)    10
7             3                 1 (-)    4
7             3                 2 (*)    21
7             3                 3 (/)    2
00000111      00000011          4 (AND)  00000011
00000111      00000011          5 (OR)   00000111
00000111      00000011          6 (NOT)  11111000
00000111      00000011          6 (XOR)  00000100

透過上述的測試，我們知道整個 ALU 的設計方式是正確的。

## 結語

對於沒有學過「硬體描述語言」的人來說，通常會認為要設計一個 ALU 單元，應該是很複雜的。但是從上述的程式當中，您可以看到
在 Verilog 當中設計 ALU 其實是很簡單的，只要用 10 行左右的程式碼，甚至不需要自己設計「加法器」就能完成。

這是因為 Verilog 將 `「+, -, *, /」` 等運算內建在語言當中了，所以讓整個程式的撰寫只要透過一個 case 語句就能做完了，
這種設計方式非常的像「高階語言」，讓硬體的設計變得更加的容易了。

事實上，在使用 Verilog 設計像 CPU 這樣的複雜元件時，ALU 或暫存器等單元都變得非常的容易。真正複雜的其實是控制單元，
而這也是 CPU 設計的精髓之所在，我們會在「開放電腦計劃」系列的文章中，完成 CPU 與控制單元的設計。

## 參考文獻
* [陳鍾誠的網站：用 Verilog 設計 ALU](http://ccckmit.wikidot.com/ve:alu)



