# 組合邏輯 (Combinatorial Logic)

## 簡介

在數位電路當中，邏輯電路通常被分為兩類，一類是沒有「回饋線路」(No feedback) 的組合邏輯電路 (Combinatorial Logic)，
另一類是有「回饋線路」的循序邏輯電路 (Sequential Logic)。

組合邏輯的線路只是將輸入訊號轉換成輸出訊號，像是加法器、多工器等都是組合邏輯電路的範例，由於中間不會暫存，因此無法記憶位元。
而循序邏輯由於有回饋線路，所以可以製作出像 Flip-Flop，Latch 等記憶單元，可以記憶位元。

在本文中，我們將先專注在組合邏輯上，看看如何用基本的閘級寫法，寫出像多工器、加法器、減法器等組成 CPU 的基礎
電路元件。

## 加法器

接著、讓我們用先前已經示範過的全加器範例，一個一個連接成四位元的加法器，電路圖如下所示

![圖、用 4 個全加器組成 4 位元加法器](../img/adder4.png)

上圖寫成 Verilog 就變成以下 adder4 模組的程式內容。

```Verilog
module adder4(input signed [3:0] a, input signed [3:0] b, input c_in, output signed [3:0] sum, output c_out);
wire [3:0] c;

fulladder fa1(a[0],b[0], c_in, sum[0], c[1]) ;
fulladder fa2(a[1],b[1], c[1], sum[1], c[2]) ;
fulladder fa3(a[2],b[2], c[2], sum[2], c[3]) ;
fulladder fa4(a[3],b[3], c[3], sum[3], c_out) ;

endmodule
```

以下是完整的 4 位元加法器之 Verilog 程式。

檔案：[adder4.v](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/adder4.v)

```Verilog
module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
xor g5(c_out, c2, c1) ;

endmodule

module adder4(input signed [3:0] a, input signed [3:0] b, input c_in, output signed [3:0] sum, output c_out);
wire [3:0] c;

fulladder fa1(a[0],b[0], c_in, sum[0], c[1]) ;
fulladder fa2(a[1],b[1], c[1], sum[1], c[2]) ;
fulladder fa3(a[2],b[2], c[2], sum[2], c[3]) ;
fulladder fa4(a[3],b[3], c[3], sum[3], c_out) ;

endmodule

module main;
reg signed [3:0] a;
reg signed [3:0] b;
wire signed [3:0] sum;
wire c_out;

adder4 DUT (a, b, 1'b0, sum, c_out);

initial
begin
  a = 4'b0101;
  b = 4'b0000;
end

always #50 begin
  b=b+1;
  $monitor("%dns monitor: a=%d b=%d sum=%d", $stime, a, b, sum);
end

initial #2000 $finish;

endmodule
```

執行結果

```
D:\ccc101\icarus\ccc>iverilog -o sadd4 sadd4.v

D:\ccc101\icarus\ccc>vvp sadd4
        50ns monitor: a= 5 b= 1 sum= 6
       100ns monitor: a= 5 b= 2 sum= 7
       150ns monitor: a= 5 b= 3 sum=-8
       200ns monitor: a= 5 b= 4 sum=-7
       250ns monitor: a= 5 b= 5 sum=-6
       300ns monitor: a= 5 b= 6 sum=-5
       350ns monitor: a= 5 b= 7 sum=-4
       400ns monitor: a= 5 b=-8 sum=-3
       450ns monitor: a= 5 b=-7 sum=-2
       500ns monitor: a= 5 b=-6 sum=-1
       550ns monitor: a= 5 b=-5 sum= 0
       600ns monitor: a= 5 b=-4 sum= 1
       650ns monitor: a= 5 b=-3 sum= 2
       700ns monitor: a= 5 b=-2 sum= 3
       750ns monitor: a= 5 b=-1 sum= 4
       800ns monitor: a= 5 b= 0 sum= 5
       850ns monitor: a= 5 b= 1 sum= 6
       900ns monitor: a= 5 b= 2 sum= 7
       950ns monitor: a= 5 b= 3 sum=-8
      1000ns monitor: a= 5 b= 4 sum=-7
      1050ns monitor: a= 5 b= 5 sum=-6
      1100ns monitor: a= 5 b= 6 sum=-5
      1150ns monitor: a= 5 b= 7 sum=-4
      1200ns monitor: a= 5 b=-8 sum=-3
      1250ns monitor: a= 5 b=-7 sum=-2
      1300ns monitor: a= 5 b=-6 sum=-1
      1350ns monitor: a= 5 b=-5 sum= 0
      1400ns monitor: a= 5 b=-4 sum= 1
      1450ns monitor: a= 5 b=-3 sum= 2
      1500ns monitor: a= 5 b=-2 sum= 3
      1550ns monitor: a= 5 b=-1 sum= 4
      1600ns monitor: a= 5 b= 0 sum= 5
      1650ns monitor: a= 5 b= 1 sum= 6
      1700ns monitor: a= 5 b= 2 sum= 7
      1750ns monitor: a= 5 b= 3 sum=-8
      1800ns monitor: a= 5 b= 4 sum=-7
      1850ns monitor: a= 5 b= 5 sum=-6
      1900ns monitor: a= 5 b= 6 sum=-5
      1950ns monitor: a= 5 b= 7 sum=-4
      2000ns monitor: a= 5 b=-8 sum=-3
```

在上述執行結果中，您可以看到在沒有溢位的情況下，sum = a+b，但是一但加總值超過 7 之後，那就會變成負值，這也正是有號二補數表示法
溢位時會產生的結果。

## 32 位元加法器

當然、上述的四位元加法器的範圍，只能從 -8 到 +7，這個範圍實在太小了，並不具備任何實用性，但是萬事起頭難，只要您能夠做出
四位元加法器，那麼就可以利用這個元件進行串接，將 8 個四位元加法器串接起來，立刻得到了一組 32 位元的加法器，以下是
這個 32 位元加法器的模組定義。

```verilog
module adder32(input signed [31:0] a, input signed [31:0] b, input c_in, output signed [31:0] sum, output c_out);
wire [7:0] c;

adder4 a0(a[3:0]  ,b[3:0],   c_in, sum[3:0],  c[0]) ;
adder4 a1(a[7:4]  ,b[7:4],   c[0], sum[7:4],  c[1]) ;
adder4 a2(a[11:8] ,b[11:8],  c[1], sum[11:8], c[2]) ;
adder4 a3(a[15:12],b[15:12], c[2], sum[15:12],c[3]) ;
adder4 a4(a[19:16],b[19:16], c[3], sum[19:16],c[4]) ;
adder4 a5(a[23:20],b[23:20], c[4], sum[23:20],c[5]) ;
adder4 a6(a[27:24],b[27:24], c[5], sum[27:24],c[6]) ;
adder4 a7(a[31:28],b[31:28], c[6], sum[31:28],c_out);

endmodule
```

有了這個模組之後，您就可以寫出下列完整的程式，以測試驗證該 32 位元加法器是否正確了。

```verilog
module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
xor g5(c_out, c2, c1) ;

endmodule

module adder4(input signed [3:0] a, input signed [3:0] b, input c_in, output signed [3:0] sum, output c_out);
wire [3:0] c;

fulladder fa1(a[0],b[0], c_in, sum[0], c[1]) ;
fulladder fa2(a[1],b[1], c[1], sum[1], c[2]) ;
fulladder fa3(a[2],b[2], c[2], sum[2], c[3]) ;
fulladder fa4(a[3],b[3], c[3], sum[3], c_out) ;

endmodule

module adder32(input signed [31:0] a, input signed [31:0] b, input c_in, output signed [31:0] sum, output c_out);
wire [7:0] c;

adder4 a0(a[3:0]  ,b[3:0],   c_in, sum[3:0],  c[0]) ;
adder4 a1(a[7:4]  ,b[7:4],   c[0], sum[7:4],  c[1]) ;
adder4 a2(a[11:8] ,b[11:8],  c[1], sum[11:8], c[2]) ;
adder4 a3(a[15:12],b[15:12], c[2], sum[15:12],c[3]) ;
adder4 a4(a[19:16],b[19:16], c[3], sum[19:16],c[4]) ;
adder4 a5(a[23:20],b[23:20], c[4], sum[23:20],c[5]) ;
adder4 a6(a[27:24],b[27:24], c[5], sum[27:24],c[6]) ;
adder4 a7(a[31:28],b[31:28], c[6], sum[31:28],c_out);

endmodule


module main;
reg signed [31:0] a;
reg signed [31:0] b;
wire signed [31:0] sum;
wire c_out;

adder32 DUT (a, b, 0, sum, c_out);

initial
begin
  a = 60000000;
  b =  3789621;
  $monitor("%dns monitor: a=%d b=%d sum=%d", $stime, a, b, sum);
end

always #50 begin
  b=b-1000000;
end

initial #500 $finish;

endmodule
```

然後、我們就可以用 icarus 進行測試，以下是測試結果：

```
D:\Dropbox\Public\web\oc\code>iverilog -o adder32 adder32.v

D:\Dropbox\Public\web\oc\code>vvp adder32
         0ns monitor: a=   60000000 b=    3789621 sum=   63789621
        50ns monitor: a=   60000000 b=    2789621 sum=   62789621
       100ns monitor: a=   60000000 b=    1789621 sum=   61789621
       150ns monitor: a=   60000000 b=     789621 sum=   60789621
       200ns monitor: a=   60000000 b=    -210379 sum=   59789621
       250ns monitor: a=   60000000 b=   -1210379 sum=   58789621
       300ns monitor: a=   60000000 b=   -2210379 sum=   57789621
       350ns monitor: a=   60000000 b=   -3210379 sum=   56789621
       400ns monitor: a=   60000000 b=   -4210379 sum=   55789621
       450ns monitor: a=   60000000 b=   -5210379 sum=   54789621
       500ns monitor: a=   60000000 b=   -6210379 sum=   53789621
```

您可以看到 sum 的確是 a+b 的結果，因此這個 32 位元加法器的初步驗證是正確的。

## 前瞻進位加法器 (Carry Lookahead Adder)

![圖、4 位元前瞻進位加法器<br/>圖片來源： <http://en.wikipedia.org/wiki/File:4-bit_carry_lookahead_adder.svg>](../img/CarryLookaheadAdder.jpg)

檔案：cladder4.v

```verilog
module cladder4(output [3:0] S, output Cout,PG,GG, input [3:0] A,B, input Cin);
  wire [3:0] G,P,C;

  assign G = A & B; //Generate
  assign P = A ^ B; //Propagate
  assign C[0] = Cin;
  assign C[1] = G[0] | (P[0]&C[0]);
  assign C[2] = G[1] | (P[1]&G[0]) | (P[1]&P[0]&C[0]);
  assign C[3] = G[2] | (P[2]&G[1]) | (P[2]&P[1]&G[0]) | (P[2]&P[1]&P[0]&C[0]);
  assign Cout = G[3] | (P[3]&G[2]) | (P[3]&P[2]&G[1]) | (P[3]&P[2]&P[1]&G[0]) |(P[3]&P[2]&P[1]&P[0]&C[0]);
  assign S = P ^ C;
  assign PG = P[3] & P[2] & P[1] & P[0];
  assign GG = G[3] | (P[3]&G[2]) | (P[3]&P[2]&G[1]) | (P[3]&P[2]&P[1]&G[0]);
endmodule


module main;
reg signed [3:0] a;
reg signed [3:0] b;
wire signed [3:0] sum;
wire c_out;

cladder4 DUT (sum, cout, pg, gg, a, b, 0);

initial
begin
  a = 5;
  b = -3;
  $monitor("%dns monitor: a=%d b=%d sum=%d", $stime, a, b, sum);
end

endmodule
```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o cladder4 cladder4.v

D:\Dropbox\Public\web\oc\code>vvp cladder4
         0ns monitor: a= 5 b=-3 sum= 2

```

## 結語

在本文中，我們大致將 CPU 設計當中最重要的組合邏輯電路，也就是「多工器、加法器、減法器」的設計原理說明完畢了，希望透過 Verilog 的實作方式，
能讓讀者更瞭解數位電路的設計原理，並且為接下來所要介紹的「處理器設計」進行鋪路的工作。

## 參考文獻
* [LSU EE 3755 -- Spring 2002 -- Computer Organization : Verilog Notes 7 -- Integer Multiply and Divide](http://www.ece.lsu.edu/ee3755/2002/l07.html)
* [陳鍾誠的網站：Verilog 電路設計 -- 多工器](http://ccckmit.wikidot.com/ve:mux)
* [陳鍾誠的網站：Verilog 電路設計 -- 4 位元加法器](http://ccckmit.wikidot.com/ve:adder4)
* [陳鍾誠的網站：Verilog 電路設計 -- 加減器](http://ccckmit.wikidot.com/ve:addsub4)
* [Wikipedia:Adder](http://en.wikipedia.org/wiki/Adder_(electronics))
* [Wikipedia:Adder–subtractor](http://en.wikipedia.org/wiki/Adder%E2%80%93subtractor)
* [Wikipedia:Multiplexer](http://en.wikipedia.org/wiki/Multiplexer)

【本文由陳鍾誠取材 (主要為圖片) 並修改自維基百科】

