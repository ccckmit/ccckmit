# 硬體描述語言 -- Verilog

Verilog 與 VHDL 都是用來設計數位電路的硬體描述語言，但 VHDL 在1983年被提出後，1987　年被美國國防部和IEEE確定為標準的硬體描述語言。

Verilog 是由 Gateway Design Automation 公司於 1984 年開始發展的， Cadence Design Systems 公司於 1990 年購併了
 Gateway 公司，Cadence 隨後將 Verilog 提交到 Open Verilog International 成為開放公用標準，1995 年 Verilog 被
 IEEE 認可成為 IEEE 1364-1995 標準，簡稱為 Verilog-95。此一標準於 2001 年更新後成為 Verilog-2001。

相較於 VHDL 而言，Verilog 的語法較為簡潔，因此經常被專業的數位電路設計者採用，而 VHDL 的使用族群則有較多的初學者。當我們想學習數位電路設計時，經常會難以選擇要用哪一種語言，因為 VHDL 的書籍與教材似乎
比 Verilog 多一些，但是 Verilog 的高階設計電路（像是開放原始碼 CPU 等）則比 VHDL 多很多。

筆者是為了要設計 CPU 而學習數位電路設計的，因此決定學習 Verilog 語言，而非 VHDL 語言。雖然筆者也學過 VHDL 語言，但後來發現 Verilog 相當好，相對而言語法簡潔了許多，因此筆者比較偏好 Verilog 語言。

在本文中，我們將介紹 Verilog 的基本語法，並且採用 Icarus 作為主要開發測試工具，以便讓讀者能很快的進入 Verilog 硬體設計的領域。

## Verilog 基礎

### Verilog 的基本型態

在一般的程式語言當中，資料的最基本型態通常是「位元」(bit)，但是在 Verilog 這種「硬體描述語言」當中，
我們必須有「面向硬體」的思考方式，因此最基本的型態從「位元」轉換為「線路」(wire)。

一條線路的可能值，除了 0 與 1 之外，還有可能是未定值 X ，以及高阻抗 Z，如下表所示：

值   意義      說明
---  -------   ----------------------------------------------------------------------------
0    低電位    布林代數中的假值
1    高電位    布林代數中的真值
Z    高阻抗    三態緩衝器的輸出，高阻抗斷線
X    未定值    像是線路未初始化之前，以及有 0,1 兩者衝突的線路值，或者是輸入為 Z 的輸出值

其中的 0 對應到低電位、 1 對應到高電位，這是比較容易理解的部分，但是未定值 X 與高阻抗 Z 各代表甚麼意義呢？

對於一條沒有阻抗的線路而言，假如我們在某點對該線路輸出 1, 另一點對該線路輸出 0，那麼這條線路到底應該是
高電位還是低電位呢？

![圖、造成未定值 X 的情況](../img/VerilogWireX.jpg)

對於這種衝突的情況，Verilog 採用 X 來代表該線路的值。

而高阻抗，則基本上是代表斷線，您可以想像該線路如果是「非導體」，例如「塑膠、木頭、開關開路、或者是處於高阻抗
情況的半導體」等，就會使用者種 Z 值來代表。

根據這樣的四種線路狀態，一個原本簡易的 AND 閘，在數位邏輯中只要用 `2*2` 的真值表就能表示了，但在 Verilog 當中則有
`4*4` 種可能的情況，以下是 Verilog 中各種運算 (AND, OR, XOR, XNOR) 在這四種型態上的真值表定義：

<table style="border:0;width:500px;">
<tr>
<td style="border:0;">

AND (&)  0    1    X    Z
-----    ---  ---  ---  ---
0        0    0    0    0
1        0    1    X    X
X        0    X    X    X
Z        0    X    X    X

</td><td style="border:0;">

OR (|)  0    1    X    Z
------  ---  ---  ---  ---
0       0    1    X    X
1       1    1    1    1
X       X    1    X    X
Z       X    1    X    X

</td>
</tr>
<tr>
<td style="border:0;">

XOR(^)  0    1    X    Z
------  ---  ---  ---  ---
0       0    1    X    X
1       1    0    X    X
X       X    X    X    X
Z       1    X    X    X

</td><td style="border:0;">

XNOR(^~)   0    1    X    Z
--------   ---  ---  ---  ---
0          1    0    X    X
1          0    1    X    X
X          X    X    X    X
Z          X    X    X    X

</td>
</tr>
</table>

在 Verilog 當中，如果我們要宣告一條線路，只要用下列語法就可以了：

```verilog
wire w1;
```

如果我們想一次宣告很多條線路，那麼我們可以用很多個變數描述：

```verilog
wire w, x, y, z;
```

但是如果我們想宣告一整個排線 (例如匯流排)，那我們就可以用下列的陣列語法：

```verilog
wire [31:0] bus;
```

如果想要一次宣告很多組排線，那我們就可以用下列的陣列群語法：

```verilog
wire [31:0] bus [0:3];
```

當然、除了線路之外，Verilog 還有可以穩定儲存位元的型態，稱為 reg (暫存器)，reg 可以用來
儲存位元，而非像線路一樣只是「一種連接方式」而已，以下是一些 reg 的宣告方式：

```verilog
reg w;                 // 宣告一位元的暫存器變數 w
reg x, y, z;           // 宣告三個一位元的暫存器變數 x, y, z
reg [31:0] r1;         // 宣告 32 位元的暫存器 r1
reg [31:0] R [0:15];   // 宣告 16 個 32 位元的暫存器群組 R[0..15]
```

在 Verilog 中，wire 與 reg 是比較常用的基本型態，另外還有一些較不常用的基本型態，
像是 tri (三態線路)、trireg (三態暫存器)、integer (整數) 等，在此我們先不進行介紹。

### Icarus ： Verilog 的編譯執行工具

Icarus 是由 Stephen Williams 所設計的 Verilog 開發工具，採用 GPL 授權協議，並且可以在 Linux, BSD, OS X, MS Windows 等環境下執行。

Icarus 支援 Verilog 的 IEEE 1995、IEEE 2001 和 IEEE 2005 三種標準語法，也支援部分的 SystemVerilog 語法，其官方網站網址如下：

* <http://iverilog.icarus.com/>

如果您是 MS Windows 的使用者，可以從以下網址中下載 Icarus 的 MS Windows 版本，其安裝非常容易：

* <http://bleyer.org/icarus/>

### 範例 1：XOR3 的電路

```verilog
module xor3(input a, b, c, output abc);
wire ab;
xor g1(ab, a, b);
xor g2(abc, c, ab);
endmodule

module xor3test;
reg a, b, c;
wire abc;

xor3 g(a,b,c, abc);

initial
begin
  a = 0;
  b = 0;
  c = 0;
end

always #50 begin
  a = a+1;
  $monitor("%4dns monitor: a=%d b=%d c=%d a^b^c=%d", $stime, a, b, c, abc);
end

always #100 begin
  b = b+1;
end

always #200 begin
  c = c+1;
end

initial #2000 $finish;

endmodule
```

Icarus 執行結果

```
D:\ccc101\icarus\ccc>iverilog -o xor3test xor3test.v

D:\ccc101\icarus\ccc>vvp xor3test
  50ns monitor: a=1 b=0 c=0 a^b^c=1
 100ns monitor: a=0 b=1 c=0 a^b^c=1
 150ns monitor: a=1 b=1 c=0 a^b^c=0
 200ns monitor: a=0 b=0 c=1 a^b^c=1
 250ns monitor: a=1 b=0 c=1 a^b^c=0
 300ns monitor: a=0 b=1 c=1 a^b^c=0
 350ns monitor: a=1 b=1 c=1 a^b^c=1
 400ns monitor: a=0 b=0 c=0 a^b^c=0
 450ns monitor: a=1 b=0 c=0 a^b^c=1
 500ns monitor: a=0 b=1 c=0 a^b^c=1
 550ns monitor: a=1 b=1 c=0 a^b^c=0
 600ns monitor: a=0 b=0 c=1 a^b^c=1
 650ns monitor: a=1 b=0 c=1 a^b^c=0
 700ns monitor: a=0 b=1 c=1 a^b^c=0
 750ns monitor: a=1 b=1 c=1 a^b^c=1
 800ns monitor: a=0 b=0 c=0 a^b^c=0
 850ns monitor: a=1 b=0 c=0 a^b^c=1
 900ns monitor: a=0 b=1 c=0 a^b^c=1
 950ns monitor: a=1 b=1 c=0 a^b^c=0
1000ns monitor: a=0 b=0 c=1 a^b^c=1
1050ns monitor: a=1 b=0 c=1 a^b^c=0
1100ns monitor: a=0 b=1 c=1 a^b^c=0
1150ns monitor: a=1 b=1 c=1 a^b^c=1
1200ns monitor: a=0 b=0 c=0 a^b^c=0
1250ns monitor: a=1 b=0 c=0 a^b^c=1
1300ns monitor: a=0 b=1 c=0 a^b^c=1
1350ns monitor: a=1 b=1 c=0 a^b^c=0
1400ns monitor: a=0 b=0 c=1 a^b^c=1
1450ns monitor: a=1 b=0 c=1 a^b^c=0
1500ns monitor: a=0 b=1 c=1 a^b^c=0
1550ns monitor: a=1 b=1 c=1 a^b^c=1
1600ns monitor: a=0 b=0 c=0 a^b^c=0
1650ns monitor: a=1 b=0 c=0 a^b^c=1
1700ns monitor: a=0 b=1 c=0 a^b^c=1
1750ns monitor: a=1 b=1 c=0 a^b^c=0
1800ns monitor: a=0 b=0 c=1 a^b^c=1
1850ns monitor: a=1 b=0 c=1 a^b^c=0
1900ns monitor: a=0 b=1 c=1 a^b^c=0
1950ns monitor: a=1 b=1 c=1 a^b^c=1
2000ns monitor: a=0 b=0 c=0 a^b^c=0
```

仔細觀察上述輸出結果，您會發現這個結果與真值表的內容完全一致，因此驗證了該設計的正確性！

透過這種方式，您就可以用 Verilog 設計電路的程式，然後用 Icarus 編譯並驗證電路是否正確。

