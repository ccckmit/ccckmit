## 乘法與除法

### for 迴圈的實作方法

最簡單的乘法器是移位乘法器，這種乘法器基本上只用了一個加法器和一個移位器所組成，
電路上而言相當簡單，但缺點是執行速度不快，以下是一個 32 位元的移位乘法器之程式碼。

參考：http://www.edaboard.com/thread235191.html

檔案：shift_mult.v

```verilog
module multiplier(output reg [63:0] z, input [31:0] x, y); 
reg [31:0] a;
integer i; 

always @(x , y)
begin 
  a=x;
  z=0; // 初始化為 0
  for(i=0;i<31;i=i+1) begin
    if (y[i])
      z = z + a; // 請注意，這是 block assignment =，所以會造成延遲，長度越長延遲越久。
    a=a << 1;
  end
end
endmodule

module main; 
reg [31:0] a, b; 
wire [63:0] c; 

multiplier m(c, a, b); 

initial begin 
  a = 17;
  b = 7; 
  #10;
  $display("a=%d b=%d c=%d", a, b, c); 
end 

endmodule 
```

其編譯執行結果如下：

```
D:\Dropbox\Public\web\oc\code>iverilog -o mul32a mul32a.v

D:\Dropbox\Public\web\oc\code>vvp mul32a
a=        17 b=         7 c=                 119
```

但是、以上的這個程式，採用了 for 迴圈，而且使用 = 這種阻隔式的方式，應該會相當耗費電路資源，
筆者認為上述電路應該會用到 32 組 32 位元的加法器，這樣實在是難以接受的一種情況，所以我們接
下來將採用只有一組加法器，然後用多個時脈的方式來設計乘法器。

參考：http://www.edaboard.com/thread86772.html

1. for loop verilog synthesis

> It is synthesizable but it is always advised that for loops are not to be used in RTL coding. This is because it consumes lot of resources (like area etc.etc) . However u can use it in behavioral coding becuse we do not synthesize behavioral codes.

2. verilog for loop syntax

> In verilog,synthesizable of for loop and while loop depends on which tools you are using . But it is better dont use it in RTL because it reflects replica of hardware.

### 32 個時脈的實作方法

```verilog
module multiplier(output reg [63:0] z, output ready, input [31:0] x, y, input start, clk); 
   reg [5:0] bit; 
   reg [31:0] a;
   
   wire ready = !bit;
   
   initial bit = 0;

   always @( posedge clk ) begin
     if( ready && start ) begin
        bit = 32;
		z = 0;
		a = x;
     end else begin
        bit = bit - 1;
		z = z << 1;
	    if (y[bit])
		  z = z + a;
     end
	 $display("%dns : x=%d y=%d z=%d ready=%d bit=%d", $stime, x, y, z, ready, bit);
   end 
endmodule

module main; 
reg [31:0] a, b; 
wire [63:0] c; 
reg clk, start;
wire ready;

multiplier m(c, ready, a, b, start, clk); 

initial begin 
  a = 17;
  b = 7; 
  start = 1;
  clk = 0;
  #200;
  start = 0;
  #200;
  $finish;
end 

always #5 clk = !clk;
// always @(posedge clk) $strobe("%dns : a=%d b=%d c=%d ready=%d", $stime, a, b, c, ready);

endmodule 

```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o mul32b mul32b.v

D:\Dropbox\Public\web\oc\code>vvp mul32b
         5ns : x=        17 y=         7 z=                   0 ready=0 bit=32
        15ns : x=        17 y=         7 z=                   0 ready=0 bit=31
        25ns : x=        17 y=         7 z=                   0 ready=0 bit=30
        35ns : x=        17 y=         7 z=                   0 ready=0 bit=29
        45ns : x=        17 y=         7 z=                   0 ready=0 bit=28
        55ns : x=        17 y=         7 z=                   0 ready=0 bit=27
        65ns : x=        17 y=         7 z=                   0 ready=0 bit=26
        75ns : x=        17 y=         7 z=                   0 ready=0 bit=25
        85ns : x=        17 y=         7 z=                   0 ready=0 bit=24
        95ns : x=        17 y=         7 z=                   0 ready=0 bit=23
       105ns : x=        17 y=         7 z=                   0 ready=0 bit=22
       115ns : x=        17 y=         7 z=                   0 ready=0 bit=21
       125ns : x=        17 y=         7 z=                   0 ready=0 bit=20
       135ns : x=        17 y=         7 z=                   0 ready=0 bit=19
       145ns : x=        17 y=         7 z=                   0 ready=0 bit=18
       155ns : x=        17 y=         7 z=                   0 ready=0 bit=17
       165ns : x=        17 y=         7 z=                   0 ready=0 bit=16
       175ns : x=        17 y=         7 z=                   0 ready=0 bit=15
       185ns : x=        17 y=         7 z=                   0 ready=0 bit=14
       195ns : x=        17 y=         7 z=                   0 ready=0 bit=13
       205ns : x=        17 y=         7 z=                   0 ready=0 bit=12
       215ns : x=        17 y=         7 z=                   0 ready=0 bit=11
       225ns : x=        17 y=         7 z=                   0 ready=0 bit=10
       235ns : x=        17 y=         7 z=                   0 ready=0 bit= 9
       245ns : x=        17 y=         7 z=                   0 ready=0 bit= 8
       255ns : x=        17 y=         7 z=                   0 ready=0 bit= 7
       265ns : x=        17 y=         7 z=                   0 ready=0 bit= 6
       275ns : x=        17 y=         7 z=                   0 ready=0 bit= 5
       285ns : x=        17 y=         7 z=                   0 ready=0 bit= 4
       295ns : x=        17 y=         7 z=                   0 ready=0 bit= 3
       305ns : x=        17 y=         7 z=                  17 ready=0 bit= 2
       315ns : x=        17 y=         7 z=                  51 ready=0 bit= 1
       325ns : x=        17 y=         7 z=                 119 ready=1 bit= 0
       335ns : x=        17 y=         7 z=                 238 ready=0 bit=63
       345ns : x=        17 y=         7 z=                 476 ready=0 bit=62
       355ns : x=        17 y=         7 z=                 952 ready=0 bit=61
       365ns : x=        17 y=         7 z=                1904 ready=0 bit=60
       375ns : x=        17 y=         7 z=                3808 ready=0 bit=59
```

### 除法器

檔案： div32.v

```verilog
// 參考：http://www.ece.lsu.edu/ee3755/2002/l07.html
// 參考：http://answers.google.com/answers/threadview/id/109219.html
// a/b = q ; a%b = r;
module divider(output reg [31:0] q, output [31:0] r, output ready, input [31:0]  a,b, input start, clk);
   reg [63:0]    ta, tb, diff;
   reg [5:0]     bit; 
   wire          ready = !bit;
   
   initial bit = 0;

   assign r = ta[31:0];
   
   always @( posedge clk ) 
     if( ready && start ) begin
        bit = 32;
        q = 0;
        ta = {32'd0, a};
        tb = {1'b0, b,31'd0};
     end else begin
        diff = ta - tb;
        q = q << 1;
        if( !diff[63] ) begin
           ta = diff;
           q[0] = 1'd1;
        end
        tb = tb >> 1;
        bit = bit - 1;
     end
endmodule

module main;
reg clk, start;
reg [31:0] a, b;
wire [31:0] q, r;
wire ready;

divider div(q,r,ready,a,b,start,clk);

initial begin
  clk = 0;
  a = 90; b = 13; start = 1; 
  #200;
  start = 0;
  #200;
  $finish;
end

always #5 clk = !clk;
always @(posedge clk) $strobe("%dns : a=%d b=%d q=%d r=%d ready=%d", $stime, a, b, q, r, ready);

endmodule

```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o div32 div32.v

D:\Dropbox\Public\web\oc\code>vvp div32
         5ns : a=        90 b=        13 q=         0 r=        90 ready=0
        15ns : a=        90 b=        13 q=         0 r=        90 ready=0
        25ns : a=        90 b=        13 q=         0 r=        90 ready=0
        35ns : a=        90 b=        13 q=         0 r=        90 ready=0
        45ns : a=        90 b=        13 q=         0 r=        90 ready=0
        55ns : a=        90 b=        13 q=         0 r=        90 ready=0
        65ns : a=        90 b=        13 q=         0 r=        90 ready=0
        75ns : a=        90 b=        13 q=         0 r=        90 ready=0
        85ns : a=        90 b=        13 q=         0 r=        90 ready=0
        95ns : a=        90 b=        13 q=         0 r=        90 ready=0
       105ns : a=        90 b=        13 q=         0 r=        90 ready=0
       115ns : a=        90 b=        13 q=         0 r=        90 ready=0
       125ns : a=        90 b=        13 q=         0 r=        90 ready=0
       135ns : a=        90 b=        13 q=         0 r=        90 ready=0
       145ns : a=        90 b=        13 q=         0 r=        90 ready=0
       155ns : a=        90 b=        13 q=         0 r=        90 ready=0
       165ns : a=        90 b=        13 q=         0 r=        90 ready=0
       175ns : a=        90 b=        13 q=         0 r=        90 ready=0
       185ns : a=        90 b=        13 q=         0 r=        90 ready=0
       195ns : a=        90 b=        13 q=         0 r=        90 ready=0
       205ns : a=        90 b=        13 q=         0 r=        90 ready=0
       215ns : a=        90 b=        13 q=         0 r=        90 ready=0
       225ns : a=        90 b=        13 q=         0 r=        90 ready=0
       235ns : a=        90 b=        13 q=         0 r=        90 ready=0
       245ns : a=        90 b=        13 q=         0 r=        90 ready=0
       255ns : a=        90 b=        13 q=         0 r=        90 ready=0
       265ns : a=        90 b=        13 q=         0 r=        90 ready=0
       275ns : a=        90 b=        13 q=         0 r=        90 ready=0
       285ns : a=        90 b=        13 q=         0 r=        90 ready=0
       295ns : a=        90 b=        13 q=         0 r=        90 ready=0
       305ns : a=        90 b=        13 q=         1 r=        38 ready=0
       315ns : a=        90 b=        13 q=         3 r=        12 ready=0
       325ns : a=        90 b=        13 q=         6 r=        12 ready=1
       335ns : a=        90 b=        13 q=        13 r=         6 ready=0
       345ns : a=        90 b=        13 q=        27 r=         3 ready=0
       355ns : a=        90 b=        13 q=        55 r=         2 ready=0
       365ns : a=        90 b=        13 q=       111 r=         2 ready=0
       375ns : a=        90 b=        13 q=       223 r=         2 ready=0
       385ns : a=        90 b=        13 q=       447 r=         2 ready=0
       395ns : a=        90 b=        13 q=       895 r=         2 ready=0
```

### Booth 乘法器

* 參考：[維基百科：布斯乘法演算法](http://zh.wikipedia.org/wiki/%E5%B8%83%E6%96%AF%E4%B9%98%E6%B3%95%E7%AE%97%E6%B3%95)

以下範例來自維基百科

#### Booth 算法範例：

考慮一個由若干個 0 包圍著若干個 1 的正的[[二進制]]乘數，比如 00111110，積可以表達為：

$M \times \,^{\prime\prime} 0 \; 0 \; 1 \; 1 \; 1 \; 1 \; 1 \; 0 \,^{\prime\prime} = M \times (2^5 + 2^4 + 2^3 + 2^2 + 2^1) =  M \times 62$

其中，M 代表被乘數。變形為下式可以使運算次數可以減為兩次：

$M \times \,^{\prime\prime} 0 \; 1 \; 0 \; 0 \; 0 \; 0 \mbox{-1} \; 0 \,^{\prime\prime} = M \times (2^6 - 2^1) = M \times 62$

事實上，任何二進制數中連續的 1 可以被分解為兩個二進制數之差：

![](../img/BoothExp.jpg) .

<!--$(\ldots 0 \overbrace{1 \ldots 1}^{n} 0 \ldots)_{2} \equiv (\ldots 1 \overbrace{0 \ldots 0}^{n} 0 \ldots)_{2} - (\ldots 0 \overbrace{0 \ldots 1}^{n} 0 \ldots)_2$-->

因此，我們可以用更簡單的運算來替換原數中連續為 1 的數字的乘法，通過加上乘數，對部分積進行移位運算，
最後再將之從乘數中減去。它利用了我們在針對為零的位做乘法時，不需要做其他運算，只需移位這一特點，
這很像我們在做和 99 的乘法時利用 99=100-1 這一性質。

這種模式可以擴展應用於任何一串數字中連續為 1 的部分（包括只有一個 1 的情況）。那麼，

$M \times \,^{\prime\prime} 0 \; 0 \; 1 \; 1 \; 1 \; 0 \; 1 \; 0 \,^{\prime\prime} = M \times (2^5 + 2^4 + 2^3 + 2^1) = M \times 58$

$M \times \,^{\prime\prime} 0 \; 1 \; 0 \; 0 \mbox{-1} \; 0 \; 1 \; 0 \,^{\prime\prime} = M \times (2^6 - 2^3 + 2^1) = M \times 58$

布斯算法遵從這種模式，它在遇到一串數字中的第一組從 0 到 1 的變化時（即遇到 01 時）執行加法，
在遇到這一串連續 1 的尾部時（即遇到 10 時）執行減法。這在乘數為負時同樣有效。當乘數中的連續 1 
比較多時（形成比較長的 1 串時），布斯算法較一般的乘法算法執行的加減法運算少。

