# 記憶單元 (Memory Unit)

## 時序邏輯 (Sequential Logic)

組合邏輯 (Combinatorial Logic) 是一種沒有回饋線路的數位電路系統，而循序邏輯 (時序邏輯, Sequential Logic) 
則是一種包含回饋線路的系統。

舉例而言，在下圖 (a) 的全加器的電路裏，您可以看到從輸入線路一路輸入接向輸出，這種稱為組合邏輯電路。而在下圖 (b) 的
栓鎖器 (正反器) 線路裏，線路從輸出 Q 又拉回 S 做為輸入，這種有倒勾的線路就稱為循序邏輯電路。

![](../img/CombSeqCircuitCompare.jpg)

暫存器、靜態記憶體等記憶單元，都是由這種有反饋電路的時序邏輯所構成的，因此要瞭解記憶單元之前，先瞭解時序邏輯的
電路結構會是有幫助的。

## 正反器 (閂鎖器)

正反器有很多種型式，以下是來自維基百科的一些正反器說明與範例。

* 參考：<http://en.wikipedia.org/wiki/Flip-flop_(electronics)>

> 摘自維基百科：正反器（英語：Flip-flop, FF，中國大陸譯作觸發器，港澳譯作），學名雙穩態多諧振盪器（Bistable Multivibrator），
是一種應用在數位電路上具有記憶功能的循序邏輯元件，可記錄二進位制數位訊號「1」和「0」。
正反器是構成序向邏輯電路以及各種複雜數位系統的基本邏輯單元。

![圖、各種正反器](../img/flop_flop.png)

## SR 正反器

正反器是可以用來儲存位元，是循序電路的基礎，以下是一個用 NAND 閘構成的正反器。

![圖、NAND 閘構成的正反器](../img/nandLatch.png)


我們可以根據上圖實作出對應的 Verilog 程式如下：

檔案：latch.v

```verilog
module latch(input Sbar, Rbar, output Q, Qbar);
  nand LS(Q, Sbar, Qbar);
  nand LR(Qbar, Rbar, Q);
endmodule

module main;
reg Sbar, Rbar;
wire Q, Qbar;

latch latch1(Sbar, Rbar, Q, Qbar);

initial
begin
  $monitor("%4dns monitor: Sbar=%d Rbar=%d Q=%d Qbar=%d", $stime, Sbar, Rbar, Q, Qbar);
  $dumpfile("latch.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
end

always #50 begin
  Sbar = 0; Rbar = 1;
  #50;
  Sbar = 1; Rbar = 1;
  #50;
  Sbar = 1; Rbar = 0;
  #50;
end

initial #500 $finish;

endmodule
```

執行結果：

```
D:\verilog>iverilog -o latch latch.v

D:\verilog>vvp latch
VCD info: dumpfile latch.vcd opened for output.
   0ns monitor: Sbar=x Rbar=x Q=x Qbar=x
  50ns monitor: Sbar=0 Rbar=1 Q=1 Qbar=0
 100ns monitor: Sbar=1 Rbar=1 Q=1 Qbar=0
 150ns monitor: Sbar=1 Rbar=0 Q=0 Qbar=1
 250ns monitor: Sbar=0 Rbar=1 Q=1 Qbar=0
 300ns monitor: Sbar=1 Rbar=1 Q=1 Qbar=0
 350ns monitor: Sbar=1 Rbar=0 Q=0 Qbar=1
 450ns monitor: Sbar=0 Rbar=1 Q=1 Qbar=0
 500ns monitor: Sbar=1 Rbar=1 Q=1 Qbar=0
```

![圖、latch.vcd 的顯示圖形](../img/latchWave.jpg)

## 有 enable 的正反器

如果我們在上述正反器前面再加上兩個 NAND 閘進行控制，就可以形成一組有 enable 的正反器，以下是該正反器的圖形。

![圖、有 enable 的正反器](../img/enLatch.jpg)

根據上述圖形我們可以設計出以下的 Verilog 程式。

檔案：enLatch.v

```verilog
module latch(input Sbar, Rbar, output Q, Qbar);
  nand LS(Q, Sbar, Qbar);
  nand LR(Qbar, Rbar, Q);
endmodule

module enLatch(input en, S, R, output Q, Qbar);
  nand ES(Senbar, en, S);
  nand ER(Renbar, en, R);
  latch L1(Senbar, Renbar, Q, Qbar);
endmodule

module main;
reg S, en, R;
wire Q, Qbar;

enLatch enLatch1(en, S, R, Q, Qbar);

initial
begin
  $monitor("%4dns monitor: en=%d S=%d R=%d Q=%d Qbar=%d", $stime, en, S, R, Q, Qbar);
  $dumpfile("enLatch.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
end

always #50 begin
  en = 1;
  #50;
  S = 1; R = 0;
  #50;
  S = 0; R = 0;
  #50;
  S = 0; R = 1;
  #50
  en = 0;
  #50;
  S = 1; R = 0;
  #50;
  S = 0; R = 0;
  #50;
  S = 0; R = 1;
end

initial #1000 $finish;

endmodule
```

執行結果

```
D:\verilog>iverilog -o enLatch enLatch.v

D:\verilog>vvp enLatch
VCD info: dumpfile enLatch.vcd opened for output.
   0ns monitor: en=x Sbar=x Rbar=x Q=x Qbar=x
  50ns monitor: en=1 Sbar=x Rbar=x Q=x Qbar=x
 100ns monitor: en=1 Sbar=1 Rbar=0 Q=1 Qbar=0
 150ns monitor: en=1 Sbar=0 Rbar=0 Q=1 Qbar=0
 200ns monitor: en=1 Sbar=0 Rbar=1 Q=0 Qbar=1
 250ns monitor: en=0 Sbar=0 Rbar=1 Q=0 Qbar=1
 300ns monitor: en=0 Sbar=1 Rbar=0 Q=0 Qbar=1
 350ns monitor: en=0 Sbar=0 Rbar=0 Q=0 Qbar=1
 400ns monitor: en=0 Sbar=0 Rbar=1 Q=0 Qbar=1
 450ns monitor: en=1 Sbar=0 Rbar=1 Q=0 Qbar=1
 500ns monitor: en=1 Sbar=1 Rbar=0 Q=1 Qbar=0
 550ns monitor: en=1 Sbar=0 Rbar=0 Q=1 Qbar=0
 600ns monitor: en=1 Sbar=0 Rbar=1 Q=0 Qbar=1
 650ns monitor: en=0 Sbar=0 Rbar=1 Q=0 Qbar=1
 700ns monitor: en=0 Sbar=1 Rbar=0 Q=0 Qbar=1
 750ns monitor: en=0 Sbar=0 Rbar=0 Q=0 Qbar=1
 800ns monitor: en=0 Sbar=0 Rbar=1 Q=0 Qbar=1
 850ns monitor: en=1 Sbar=0 Rbar=1 Q=0 Qbar=1
 900ns monitor: en=1 Sbar=1 Rbar=0 Q=1 Qbar=0
 950ns monitor: en=1 Sbar=0 Rbar=0 Q=1 Qbar=0
1000ns monitor: en=1 Sbar=0 Rbar=1 Q=0 Qbar=1
```

![圖、enLatch.vcd 的顯示圖形](../img/enLatchWave.jpg)

## 閘級延遲 (Gate Delay)

在 Verilog 模型下，邏輯閘預設是沒有任何延遲的，因此呈現出來永遠是即時的結果，但現實世界的電路
總是有少許延遲的，每經過一個閘就會延遲一點點的時間，經過的閘數越多，延遲也就會越久。

* 參考： <http://www.asic-world.com/verilog/gate3.html>

為了模擬這種延遲，Verilog 允許你在閘上面附加延遲時間的語法，您可以分別指定最小延遲 min，典型延遲 typical 
與最大延遲 max。

舉例而言，以下的語法宣告了一個 not 閘，其中的 `#(1:3:5)` 語法指定了最小延遲 min=1, 典型延遲 typical=3, 
最大延遲 max=5。

```verilog
 not #(1:3:5) n2(nclk2, clk);
```

假如您不想分別指定這三種延遲，也可以只指定一個延遲參數，這樣 min, typical, max 三者都會設定為該數值，
舉例而言，以下是一個宣告延遲固定為 2 的 not 閘。

```verilog
 not #2 n1(nclk1, clk);
```

為了說明這種延遲狀況，我們寫了一個範例程式 delay.v 來示範設定了閘級延遲的效果，請參考下列程式：

```verilog
module main;
 reg clk;

 not #2 n1(nclk1, clk);
 not #(1:3:5) n2(nclk2, clk);

 initial begin
   clk = 0;
   $monitor("%dns monitor: clk=%b nclk1=%d nclk2=%d", $stime, clk, nclk1, nclk2);
   $dumpfile("delay.vcd"); // 輸出給 GTK wave 顯示波型
   $dumpvars;
 end

 always #10 begin
   clk = clk + 1;
 end

initial #100 $finish;

endmodule
```

執行結果：

```
D:\Dropbox\Public\web\oc\code>iverilog -o delay delay.v
delay.v:5: warning: choosing typ expression.

D:\Dropbox\Public\web\oc\code>vvp delay
VCD info: dumpfile delay.vcd opened for output.
         0ns monitor: clk=0 nclk1=z nclk2=z
         2ns monitor: clk=0 nclk1=1 nclk2=z
         3ns monitor: clk=0 nclk1=1 nclk2=1
        10ns monitor: clk=1 nclk1=1 nclk2=1
        12ns monitor: clk=1 nclk1=0 nclk2=1
        13ns monitor: clk=1 nclk1=0 nclk2=0
        20ns monitor: clk=0 nclk1=0 nclk2=0
        22ns monitor: clk=0 nclk1=1 nclk2=0
        23ns monitor: clk=0 nclk1=1 nclk2=1
        30ns monitor: clk=1 nclk1=1 nclk2=1
        32ns monitor: clk=1 nclk1=0 nclk2=1
        33ns monitor: clk=1 nclk1=0 nclk2=0
        40ns monitor: clk=0 nclk1=0 nclk2=0
        42ns monitor: clk=0 nclk1=1 nclk2=0
        43ns monitor: clk=0 nclk1=1 nclk2=1
        50ns monitor: clk=1 nclk1=1 nclk2=1
        52ns monitor: clk=1 nclk1=0 nclk2=1
        53ns monitor: clk=1 nclk1=0 nclk2=0
        60ns monitor: clk=0 nclk1=0 nclk2=0
        62ns monitor: clk=0 nclk1=1 nclk2=0
        63ns monitor: clk=0 nclk1=1 nclk2=1
        70ns monitor: clk=1 nclk1=1 nclk2=1
        72ns monitor: clk=1 nclk1=0 nclk2=1
        73ns monitor: clk=1 nclk1=0 nclk2=0
        80ns monitor: clk=0 nclk1=0 nclk2=0
        82ns monitor: clk=0 nclk1=1 nclk2=0
        83ns monitor: clk=0 nclk1=1 nclk2=1
        90ns monitor: clk=1 nclk1=1 nclk2=1
        92ns monitor: clk=1 nclk1=0 nclk2=1
        93ns monitor: clk=1 nclk1=0 nclk2=0
       100ns monitor: clk=0 nclk1=0 nclk2=0
```

以上輸出的波形如下，您可以看到 nclk1 的延遲固定為 2 ，而 nclk2 的延遲則介於 1 到 5 之間。

![圖、delay.vcd 的顯示波型](../img/delayGTKwave.jpg)

## 利用「閘級延遲」製作脈波變化偵測器 (Pulse Transition Detector, PTD)

雖然延遲現象看起來像是個缺陷，但事實上如果好好的利用這種現象，有時反而可以達到很好的效果，
「脈波變化偵測器」電路就是利用這種現象所設計的一種電路，可以用來偵測「脈波的上升邊緣或下降邊緣」。

以下是「脈波變化偵測電路」的圖形，其中的關鍵是在 左邊的 not 閘身上，由於每個閘都會造成延遲，因此多了 not 閘的那條路徑所造成的延遲較多，這讓輸出部份會因為延遲而形成一個脈衝波形。

![圖、脈波變化偵測器](../img/ptd.jpg)

以下是這個電路以 Verilog 實作的結果。

檔案：ptd.v

```verilog
module ptd(input clk, output ppulse);
  not #2 P1(nclkd, clk);
  nand #2 P2(npulse, nclkd, clk);
  not #2 P3(ppulse, npulse);
endmodule

module main;
 reg clk;
 wire p;

 ptd ptd1(clk, p);

 initial begin
   clk = 0;
   $monitor("%dns monitor: clk=%b p=%d", $stime, clk, p);
   $dumpfile("ptd.vcd"); // 輸出給 GTK wave 顯示波型
   $dumpvars;
 end

 always #50 begin
   clk = clk + 1;
 end

initial #500 $finish;

endmodule
```

執行結果

```
D:\Dropbox\Public\pmag\201311\code>iverilog -o ptd ptd.v

D:\Dropbox\Public\pmag\201311\code>vvp ptd
VCD info: dumpfile ptd.vcd opened for output.
         0ns monitor: clk=0 p=z
         4ns monitor: clk=0 p=0
        50ns monitor: clk=1 p=0
        54ns monitor: clk=1 p=1
        56ns monitor: clk=1 p=0
       100ns monitor: clk=0 p=0
       150ns monitor: clk=1 p=0
       154ns monitor: clk=1 p=1
       156ns monitor: clk=1 p=0
       200ns monitor: clk=0 p=0
       250ns monitor: clk=1 p=0
       254ns monitor: clk=1 p=1
       256ns monitor: clk=1 p=0
       300ns monitor: clk=0 p=0
       350ns monitor: clk=1 p=0
       354ns monitor: clk=1 p=1
       356ns monitor: clk=1 p=0
       400ns monitor: clk=0 p=0
       450ns monitor: clk=1 p=0
       454ns monitor: clk=1 p=1
       456ns monitor: clk=1 p=0
       500ns monitor: clk=0 p=0
```

![圖、ptd.vcd 的顯示圖形](../img/ptdWave.jpg)

## 使用「脈衝偵測電路」製作「邊緣觸發正反器」

有了「正反器」與「脈波變化偵測電路」之後，我們就可以組合出「邊緣觸發正反器」了，以下是其電路圖。

![圖、邊緣觸發的正反器](../img/ptdLatch.jpg)

事實上，上述電路圖只是將「有 enable 的正反器」前面加上一個「脈波變化偵測電路」而已，其實做的 Verilog 程式如下。

檔案：ptdLatch.v

```verilog
module latch(input Sbar, Rbar, output Q, Qbar);
  nand LS(Q, Sbar, Qbar);
  nand LR(Qbar, Rbar, Q);
endmodule

module enLatch(input en, S, R, output Q, Qbar);
  nand ES(Senbar, en, S);
  nand ER(Renbar, en, R);
  latch L1(Senbar, Renbar, Q, Qbar);
endmodule

module ptd(input clk, output ppulse);
  not  #2 P1(nclkd, clk);
  nand #2 P2(npulse, nclkd, clk);
  not  #2 P3(ppulse, npulse);
endmodule

module ptdLatch(input clk, S, R, output Q, Qbar);
  ptd PTD(clk, ppulse);
  enLatch EL(ppulse, S, R, Q, Qbar);
endmodule

module main;
reg S, clk, R;
wire Q, Qbar;

ptdLatch ptdLatch1(clk, S, R, Q, Qbar);

initial
begin
  clk = 0;
  $monitor("%4dns monitor: clk=%d ppulse=%d S=%d R=%d Q=%d Qbar=%d", $stime, clk, ptdLatch1.ppulse, S, R, Q, Qbar);
  $dumpfile("ptdLatch.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
end

always #20 begin
  clk = ~clk;
end

always #50 begin
  S = 1; R = 0;
  #50;
  S = 0; R = 0;
  #50;
  S = 0; R = 1;
  #50;
end

initial #500 $finish;

endmodule
```

執行結果

```
D:\verilog>iverilog -o ptdLatch ptdLatch.v

D:\verilog>vvp ptdLatch
VCD info: dumpfile ptdLatch.vcd opened for output.
   0ns monitor: clk=0 ppulse=z S=x R=x Q=x Qbar=x
   4ns monitor: clk=0 ppulse=0 S=x R=x Q=x Qbar=x
  20ns monitor: clk=1 ppulse=0 S=x R=x Q=x Qbar=x
  24ns monitor: clk=1 ppulse=1 S=x R=x Q=x Qbar=x
  26ns monitor: clk=1 ppulse=0 S=x R=x Q=x Qbar=x
  40ns monitor: clk=0 ppulse=0 S=x R=x Q=x Qbar=x
  50ns monitor: clk=0 ppulse=0 S=1 R=0 Q=x Qbar=x
  60ns monitor: clk=1 ppulse=0 S=1 R=0 Q=x Qbar=x
  64ns monitor: clk=1 ppulse=1 S=1 R=0 Q=1 Qbar=0
  66ns monitor: clk=1 ppulse=0 S=1 R=0 Q=1 Qbar=0
  80ns monitor: clk=0 ppulse=0 S=1 R=0 Q=1 Qbar=0
 100ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 104ns monitor: clk=1 ppulse=1 S=0 R=0 Q=1 Qbar=0
 106ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 120ns monitor: clk=0 ppulse=0 S=0 R=0 Q=1 Qbar=0
 140ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 144ns monitor: clk=1 ppulse=1 S=0 R=0 Q=1 Qbar=0
 146ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 150ns monitor: clk=1 ppulse=0 S=0 R=1 Q=1 Qbar=0
 160ns monitor: clk=0 ppulse=0 S=0 R=1 Q=1 Qbar=0
 180ns monitor: clk=1 ppulse=0 S=0 R=1 Q=1 Qbar=0
 184ns monitor: clk=1 ppulse=1 S=0 R=1 Q=0 Qbar=1
 186ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 200ns monitor: clk=0 ppulse=0 S=0 R=1 Q=0 Qbar=1
 220ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 224ns monitor: clk=1 ppulse=1 S=0 R=1 Q=0 Qbar=1
 226ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 240ns monitor: clk=0 ppulse=0 S=0 R=1 Q=0 Qbar=1
 250ns monitor: clk=0 ppulse=0 S=1 R=0 Q=0 Qbar=1
 260ns monitor: clk=1 ppulse=0 S=1 R=0 Q=0 Qbar=1
 264ns monitor: clk=1 ppulse=1 S=1 R=0 Q=1 Qbar=0
 266ns monitor: clk=1 ppulse=0 S=1 R=0 Q=1 Qbar=0
 280ns monitor: clk=0 ppulse=0 S=1 R=0 Q=1 Qbar=0
 300ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 304ns monitor: clk=1 ppulse=1 S=0 R=0 Q=1 Qbar=0
 306ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 320ns monitor: clk=0 ppulse=0 S=0 R=0 Q=1 Qbar=0
 340ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 344ns monitor: clk=1 ppulse=1 S=0 R=0 Q=1 Qbar=0
 346ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
 350ns monitor: clk=1 ppulse=0 S=0 R=1 Q=1 Qbar=0
 360ns monitor: clk=0 ppulse=0 S=0 R=1 Q=1 Qbar=0
 380ns monitor: clk=1 ppulse=0 S=0 R=1 Q=1 Qbar=0
 384ns monitor: clk=1 ppulse=1 S=0 R=1 Q=0 Qbar=1
 386ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 400ns monitor: clk=0 ppulse=0 S=0 R=1 Q=0 Qbar=1
 420ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 424ns monitor: clk=1 ppulse=1 S=0 R=1 Q=0 Qbar=1
 426ns monitor: clk=1 ppulse=0 S=0 R=1 Q=0 Qbar=1
 440ns monitor: clk=0 ppulse=0 S=0 R=1 Q=0 Qbar=1
 450ns monitor: clk=0 ppulse=0 S=1 R=0 Q=0 Qbar=1
 460ns monitor: clk=1 ppulse=0 S=1 R=0 Q=0 Qbar=1
 464ns monitor: clk=1 ppulse=1 S=1 R=0 Q=1 Qbar=0
 466ns monitor: clk=1 ppulse=0 S=1 R=0 Q=1 Qbar=0
 480ns monitor: clk=0 ppulse=0 S=1 R=0 Q=1 Qbar=0
 500ns monitor: clk=1 ppulse=0 S=0 R=0 Q=1 Qbar=0
```

![圖、ptdLatch.vcd 的顯示圖形](../img/ptdLatchWave.jpg)

## 使用「脈衝偵測電路」設計邊緣觸發暫存器

有了「脈波變化偵測電路」，只要與任何需要偵測脈波變化的元件串接起來，就可以達到「邊緣觸發」的功能。

其實、像是 Verilog 當中的以下程式，其實都是利用類似的「脈波變化偵測電路」所完成的。

```verilog
  always @(posedge clock) begin
  ...
  end
```

如果我們真的不想使用 `posedge clock` 這種語法，我們也可以用前述的 「脈波變化偵測電路」(PTD) 來
製作這類的邊緣觸發功能，以下是我們用這種方式設計的一個邊緣觸發暫存器。

檔案： ptdRegister.v 

```verilog
module ptd(input clk, output ppulse);

not #2 g1(nclkd, clk);
nand #2 g2(npulse, nclkd, clk);
not #2 g3(ppulse, npulse);

endmodule

module register(input en, input [31:0] d, output reg [31:0] r);
always @(en) begin
  if (en)
    r <= d;
end
endmodule

module main;
reg [31:0] d;
wire [31:0] r;
reg clk;
wire en;

ptd ptd1(clk, en);
register register1(en, d, r);

initial begin
  clk = 0;
  d = 3;
  $monitor("%4dns monitor: clk=%d en=%d d=%d r=%d", $stime, clk, en, d, r);
end

always #10 begin
  clk = clk + 1;
end

always #20 begin
  d = d + 1;
end

initial #100 $finish;

endmodule
```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o ptdRegister ptdRegister.v

D:\Dropbox\Public\web\oc\code>vvp ptdRegister
   0ns monitor: clk=0 en=z d=         3 r=         x
   4ns monitor: clk=0 en=0 d=         3 r=         x
  10ns monitor: clk=1 en=0 d=         3 r=         x
  14ns monitor: clk=1 en=1 d=         3 r=         3
  16ns monitor: clk=1 en=0 d=         3 r=         3
  20ns monitor: clk=0 en=0 d=         4 r=         3
  30ns monitor: clk=1 en=0 d=         4 r=         3
  34ns monitor: clk=1 en=1 d=         4 r=         4
  36ns monitor: clk=1 en=0 d=         4 r=         4
  40ns monitor: clk=0 en=0 d=         5 r=         4
  50ns monitor: clk=1 en=0 d=         5 r=         4
  54ns monitor: clk=1 en=1 d=         5 r=         5
  56ns monitor: clk=1 en=0 d=         5 r=         5
  60ns monitor: clk=0 en=0 d=         6 r=         5
  70ns monitor: clk=1 en=0 d=         6 r=         5
  74ns monitor: clk=1 en=1 d=         6 r=         6
  76ns monitor: clk=1 en=0 d=         6 r=         6
  80ns monitor: clk=0 en=0 d=         7 r=         6
  90ns monitor: clk=1 en=0 d=         7 r=         6
  94ns monitor: clk=1 en=1 d=         7 r=         7
  96ns monitor: clk=1 en=0 d=         7 r=         7
 100ns monitor: clk=0 en=0 d=         8 r=         7
```

其輸出的波型檔如下圖所示：

![圖、在 GTKWave 中顯示的 ptdRegister.vcd 波型檔](../img/GTKWavePtdRegister.jpg)

## 使用「脈衝偵測電路」製作計數電路

如果我們將暫存器的輸出在接到一個加法電路上，進行回饋性的累加的動作，如下圖所示，那麼整個電路就會變成
一個邊緣觸發的計數電路


![圖、邊緣觸發的計數電路](../img/ptdCounterCircuit.jpg)

以上這種電路可以做為「採用區塊方法設計 CPU 的基礎」，因為 CPU 當中的「程式計數器」 (Program Counter) 通常會採用
這種邊緣觸發的設計方式。

以下是上述電路的設計與實作測試結果。

檔案： ptdCounter.v 

```verilog
module register(input en, input [31:0] d, output reg [31:0] r);
always @(en) begin
  if (en)
    r <= d;
end
endmodule

module ptd(input clk, output ppulse);
  not  #2 P1(nclkd, clk);
  nand #2 P2(npulse, nclkd, clk);
  not  #2 P3(ppulse, npulse);
endmodule

module inc(input [31:0] i, output [31:0] o);
  assign o = i + 4;
endmodule

module main;
wire [31:0] r, ro;
reg clk;
wire en;

ptd ptd1(clk, en);
register r1(en, ro, r);
inc i1(r, ro);

initial begin
  clk = 0;
  r1.r = 0;
  $monitor("%4dns monitor: clk=%d en=%d r=%d", $stime, clk, en, r);
  $dumpfile("ptdCounter.vcd"); // 輸出給 GTK wave 顯示波型
  $dumpvars;    
end

always #10 begin
  clk = clk + 1;
end

initial #100 $finish;

endmodule
```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o ptdCounter ptdCounter.v

D:\Dropbox\Public\web\oc\code>vvp ptdCounter
VCD info: dumpfile ptdCounter.vcd opened for output.
   0ns monitor: clk=0 en=z r=         0
   4ns monitor: clk=0 en=0 r=         0
  10ns monitor: clk=1 en=0 r=         0
  14ns monitor: clk=1 en=1 r=         4
  16ns monitor: clk=1 en=0 r=         4
  20ns monitor: clk=0 en=0 r=         4
  30ns monitor: clk=1 en=0 r=         4
  34ns monitor: clk=1 en=1 r=         8
  36ns monitor: clk=1 en=0 r=         8
  40ns monitor: clk=0 en=0 r=         8
  50ns monitor: clk=1 en=0 r=         8
  54ns monitor: clk=1 en=1 r=        12
  56ns monitor: clk=1 en=0 r=        12
  60ns monitor: clk=0 en=0 r=        12
  70ns monitor: clk=1 en=0 r=        12
  74ns monitor: clk=1 en=1 r=        16
  76ns monitor: clk=1 en=0 r=        16
  80ns monitor: clk=0 en=0 r=        16
  90ns monitor: clk=1 en=0 r=        16
  94ns monitor: clk=1 en=1 r=        20
  96ns monitor: clk=1 en=0 r=        20
 100ns monitor: clk=0 en=0 r=        20
```

其輸出的波型檔如下圖所示：

![圖、在 GTKWave 中顯示的 ptdCounter.vcd 波型檔](../img/GTKWavePtdCounter.jpg)

## 暫存器單元

檔案：regbank.v

```verilog
module regbank(input [3:0] ra1, output [31:0] rd1, 
               input [3:0] ra2, output [31:0] rd2,
               input clk, input w_en, 
               input [3:0] wa, input [31:0] wd);
 reg [31:0] r[15:0]; // 宣告 16 個 32 位元的暫存器
 assign rd1 = r[ra1]; // 讀取索引值為 ra1 的暫存器
 assign rd2 = r[ra2]; // 讀取索引值為 ra2 的暫存器
 always @(posedge clk)
 begin
  if (w_en) // w_en=1 時寫入到暫存器
    r[wa] <= wd; // 將 wd 寫入到索引值為 wa 的暫存器
 end
endmodule

module main;
reg [3:0] ra1, ra2, wa;
reg clk, w_en;
wire [31:0] rd1, rd2;
reg [31:0] wd;

regbank rb0(ra1, rd1, ra2, rd2, clk, w_en, wa, wd);

initial
begin
  wa = 0;
  ra1 = 0;
  ra2 = 0;
  wd = 0;
  clk = 0;
  w_en = 1;
end

initial #200 ra1 = 0;

always #50 begin
  clk = clk + 1;
  $monitor("%4dns monitor: ra1=%d rd1=%d ra2=%d rd2=%d wa=%d wd=%d", 
           $stime, ra1, rd1, ra2, rd2, wa, wd);
end

always #100 begin
  wa = wa + 1;
  wd = wd + 2;
  ra1 = ra1 + 1;
  ra2 = ra2 - 1;
end

initial #1000 $finish;

endmodule
```

執行結果：

```
D:\Dropbox\Public\web\oc\code\verilog>iverilog -o regbank regbank.v

D:\Dropbox\Public\web\oc\code\verilog>vvp regbank
  50ns monitor: ra1= 0 rd1=         0 ra2= 0 rd2=         0 wa= 0 wd=         0
 100ns monitor: ra1= 1 rd1=         x ra2=15 rd2=         x wa= 1 wd=         2
 150ns monitor: ra1= 1 rd1=         2 ra2=15 rd2=         x wa= 1 wd=         2
 200ns monitor: ra1= 1 rd1=         2 ra2=14 rd2=         x wa= 2 wd=         4
 250ns monitor: ra1= 1 rd1=         2 ra2=14 rd2=         x wa= 2 wd=         4
 300ns monitor: ra1= 2 rd1=         4 ra2=13 rd2=         x wa= 3 wd=         6
 350ns monitor: ra1= 2 rd1=         4 ra2=13 rd2=         x wa= 3 wd=         6
 400ns monitor: ra1= 3 rd1=         6 ra2=12 rd2=         x wa= 4 wd=         8
 450ns monitor: ra1= 3 rd1=         6 ra2=12 rd2=         x wa= 4 wd=         8
 500ns monitor: ra1= 4 rd1=         8 ra2=11 rd2=         x wa= 5 wd=        10
 550ns monitor: ra1= 4 rd1=         8 ra2=11 rd2=         x wa= 5 wd=        10
 600ns monitor: ra1= 5 rd1=        10 ra2=10 rd2=         x wa= 6 wd=        12
 650ns monitor: ra1= 5 rd1=        10 ra2=10 rd2=         x wa= 6 wd=        12
 700ns monitor: ra1= 6 rd1=        12 ra2= 9 rd2=         x wa= 7 wd=        14
 750ns monitor: ra1= 6 rd1=        12 ra2= 9 rd2=         x wa= 7 wd=        14
 800ns monitor: ra1= 7 rd1=        14 ra2= 8 rd2=         x wa= 8 wd=        16
 850ns monitor: ra1= 7 rd1=        14 ra2= 8 rd2=        16 wa= 8 wd=        16
 900ns monitor: ra1= 8 rd1=        16 ra2= 7 rd2=        14 wa= 9 wd=        18
 950ns monitor: ra1= 8 rd1=        16 ra2= 7 rd2=        14 wa= 9 wd=        18
1000ns monitor: ra1= 9 rd1=        18 ra2= 6 rd2=        12 wa=10 wd=        20
```

## 記憶體

```verilog
module memory(input clock, reset, en, rw, 
                input [31:0] abus, input [31:0] dbus_in, output [31:0] dbus_out);
    reg [7:0] m [0:128];
    reg [31:0] data;

    always @(clock or reset or abus or en or rw or dbus_in) 
    begin
        if (reset == 1) begin
            {m[0],m[1],m[2],m[3]}     = 32'h002F000C; // 0000           LD   R2, K0
            {m[4],m[5],m[6],m[7]}     = 32'h001F000C; // 0004           LD   R1, K1
            {m[8],m[9],m[10],m[11]}   = 32'h13221000; // 0008 LOOP:     ADD  R2, R2, R1
            {m[12],m[13],m[14],m[15]} = 32'h26FFFFF8; // 000C           JMP  LOOP
            {m[16],m[17],m[18],m[19]} = 32'h00000000; // 0010 K0:        WORD 0
            {m[20],m[21],m[22],m[23]} = 32'h00000001; // 0014 K1:        WORD 1
            data = 32'hZZZZZZZZ; 
        end else if (abus >=0 && abus < 128) begin
            if (en == 1 && rw == 0) // r_w==0:write
            begin
                data = dbus_in;
                {m[abus], m[abus+1], m[abus+2], m[abus+3]} = dbus_in;
            end
            else if (en == 1 && rw == 1) // r_w==1:read
                data = {m[abus], m[abus+1], m[abus+2], m[abus+3]};
            else
                data = 32'hZZZZZZZZ;
        end else
            data = 32'hZZZZZZZZ;
    end
    assign dbus_out = data;
endmodule

module main;
reg clock, reset, en, rw;
reg [31:0] addr;
reg [31:0] data_in;
wire [31:0] data_out;

memory DUT (.clock(clock), .reset(reset), .en(en), .rw(rw), 
   .abus(addr), .dbus_in(data_in), .dbus_out(data_out));

initial // reset：設定 memory 內容為 0,1,2,....,127
begin
  clock = 0;
  reset = 1;
  en = 0;
  rw = 1; // rw=1:讀取模式
  #75;
  en = 1;
  reset = 0;
  addr = 0;
  #500;
  addr = 4;
  rw = 0; // 寫入模式
  data_in = 8'h3A;
  #100;
  addr = 0;
  rw = 1; // 讀取模式
  data_in = 0;
end

always #50 begin
  clock = clock + 1; 
  $monitor("%4dns monitor: clk=%d en=%d rw=%d, addr=%8h din=%8h dout=%8h", 
           $stime, clock, en, rw, addr, data_in, data_out);  
end

always #200 
begin
 addr=addr+1;
end

initial #2000 $finish;

endmodule
```

執行結果：

```
D:\Dropbox\Public\web\oc\code\verilog>iverilog -o memory32 memory32.v

D:\Dropbox\Public\web\oc\code\verilog>vvp memory32
  50ns monitor: clk=1 en=0 rw=1, addr=xxxxxxxx din=xxxxxxxx dout=zzzzzzzz
  75ns monitor: clk=1 en=1 rw=1, addr=00000000 din=xxxxxxxx dout=002f000c
 100ns monitor: clk=0 en=1 rw=1, addr=00000000 din=xxxxxxxx dout=002f000c
 150ns monitor: clk=1 en=1 rw=1, addr=00000000 din=xxxxxxxx dout=002f000c
 200ns monitor: clk=0 en=1 rw=1, addr=00000001 din=xxxxxxxx dout=2f000c00
 250ns monitor: clk=1 en=1 rw=1, addr=00000001 din=xxxxxxxx dout=2f000c00
 300ns monitor: clk=0 en=1 rw=1, addr=00000001 din=xxxxxxxx dout=2f000c00
 350ns monitor: clk=1 en=1 rw=1, addr=00000001 din=xxxxxxxx dout=2f000c00
 400ns monitor: clk=0 en=1 rw=1, addr=00000002 din=xxxxxxxx dout=000c001f
 450ns monitor: clk=1 en=1 rw=1, addr=00000002 din=xxxxxxxx dout=000c001f
 500ns monitor: clk=0 en=1 rw=1, addr=00000002 din=xxxxxxxx dout=000c001f
 550ns monitor: clk=1 en=1 rw=1, addr=00000002 din=xxxxxxxx dout=000c001f
 575ns monitor: clk=1 en=1 rw=0, addr=00000004 din=0000003a dout=0000003a
 600ns monitor: clk=0 en=1 rw=0, addr=00000005 din=0000003a dout=0000003a
 650ns monitor: clk=1 en=1 rw=0, addr=00000005 din=0000003a dout=0000003a
 675ns monitor: clk=1 en=1 rw=1, addr=00000000 din=00000000 dout=002f000c
 700ns monitor: clk=0 en=1 rw=1, addr=00000000 din=00000000 dout=002f000c
 750ns monitor: clk=1 en=1 rw=1, addr=00000000 din=00000000 dout=002f000c
 800ns monitor: clk=0 en=1 rw=1, addr=00000001 din=00000000 dout=2f000c00
 850ns monitor: clk=1 en=1 rw=1, addr=00000001 din=00000000 dout=2f000c00
 900ns monitor: clk=0 en=1 rw=1, addr=00000001 din=00000000 dout=2f000c00
 950ns monitor: clk=1 en=1 rw=1, addr=00000001 din=00000000 dout=2f000c00
1000ns monitor: clk=0 en=1 rw=1, addr=00000002 din=00000000 dout=000c0000
1050ns monitor: clk=1 en=1 rw=1, addr=00000002 din=00000000 dout=000c0000
1100ns monitor: clk=0 en=1 rw=1, addr=00000002 din=00000000 dout=000c0000
1150ns monitor: clk=1 en=1 rw=1, addr=00000002 din=00000000 dout=000c0000
1200ns monitor: clk=0 en=1 rw=1, addr=00000003 din=00000000 dout=0c000000
1250ns monitor: clk=1 en=1 rw=1, addr=00000003 din=00000000 dout=0c000000
1300ns monitor: clk=0 en=1 rw=1, addr=00000003 din=00000000 dout=0c000000
1350ns monitor: clk=1 en=1 rw=1, addr=00000003 din=00000000 dout=0c000000
1400ns monitor: clk=0 en=1 rw=1, addr=00000004 din=00000000 dout=00000000
1450ns monitor: clk=1 en=1 rw=1, addr=00000004 din=00000000 dout=00000000
1500ns monitor: clk=0 en=1 rw=1, addr=00000004 din=00000000 dout=00000000
1550ns monitor: clk=1 en=1 rw=1, addr=00000004 din=00000000 dout=00000000
1600ns monitor: clk=0 en=1 rw=1, addr=00000005 din=00000000 dout=0000003a
1650ns monitor: clk=1 en=1 rw=1, addr=00000005 din=00000000 dout=0000003a
1700ns monitor: clk=0 en=1 rw=1, addr=00000005 din=00000000 dout=0000003a
1750ns monitor: clk=1 en=1 rw=1, addr=00000005 din=00000000 dout=0000003a
1800ns monitor: clk=0 en=1 rw=1, addr=00000006 din=00000000 dout=00003a22
1850ns monitor: clk=1 en=1 rw=1, addr=00000006 din=00000000 dout=00003a22
1900ns monitor: clk=0 en=1 rw=1, addr=00000006 din=00000000 dout=00003a22
1950ns monitor: clk=1 en=1 rw=1, addr=00000006 din=00000000 dout=00003a22
2000ns monitor: clk=0 en=1 rw=1, addr=00000007 din=00000000 dout=003a2210
```

## 結語

在本章中，我們介紹了正反器 (Flip-Flop, Latch, 栓鎖器) 等循序電路的概念，並且利用閘級延遲的現象，
設計出了「脈衝偵測電路」(Pause Transition Detector, PTD)，於是我們可以利用「脈衝偵測電路」
設計出像「邊緣觸發型」的電路，像是「邊緣觸發型」的正反器、暫存器、計數器等等電路，
這些電路是構成電腦當中的記憶線路的基礎。

一但理解這些基礎原理之後，我們就可以用 Verilog 的高階語法直接宣告「暫存器、一群暫存器與
一整塊記憶體」，這種高階寫法已經非常接近高階語言的寫法，只是由於是設計硬體，所以這些高階指令
最後都會被轉換為線路，燒錄到 FPGA 或內建於 ASIC 裡面而已，如此我們就不需要用一條一條的線路去
兜出暫存器或記憶體，可以輕鬆的透過 Verilog 設計出記憶單元了。
