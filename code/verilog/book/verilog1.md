## 區塊式設計

### 閘級的線路設計方法

Verilog 既然是硬體描述語言，那當然會有邏輯閘的表示法，Verilog 提供的邏輯閘有 and, nand, or, nor, xor, xnor, not 
等元件，因此您可以用下列 Verilog 程式描述一個全加器：

```verilog
module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
or g5(c_out, c2, c1) ;

endmodule
```

上述程式所對應的電路如下圖所示：

![全加器電路圖](../img/fulladder.jpg)

這些邏輯閘並不受限於兩個輸入，也可以是多個輸入的，例如以下範例中的 g 閘，就一次將三個輸入 a, b, c_in 進行 xor 
運算，產生輸出 sum 的結果。

```verilog
xor g(sum, a, b, c_in);
```

### 範例 2：全加器的閘級設計

傳統的數位邏輯課程當中，我們通常會用「邏輯閘」的組合方式，來設計出所要的電路，以下我們就用「全加器」當範例，
說明如何用「閘級」的語法，在 Verilog 當中設計數位電路。

全加器總共有 3 個輸入 (a, b, c_in)，兩個輸出值 (sum, c_out)，其真值表如下所示：

a   b   c_in    c_out    sum
--- --- -----   ------  -------
0   0   0       0       0
0   0   1       0       1
0   1   0       0       1
0   1   1       1       0
1   0   0       0       1
1   0   1       1       0
1   1   0       1       0
1   1   1       1       1

根據這個真值表，我們可以用卡諾圖得到化簡後的電路 (但必須注意的是，卡諾圖化簡出來的電路只有 AND, OR, NOT，沒有 XOR)，
然後根據化簡後的算式繪製電路圖。(在此範例中，c_out 可以採用卡諾圖化簡出來，但 sum 使用的並非化簡的結果，而是以經驗
得到的 XOR 組合式)

當您完成邏輯運算式設計之後，就可以用 TinyCAD 這個軟體，繪製出全加器的電路如下圖所示：

![用 TinyCAD 繪製的全加器電路圖](../img/FullAdder.jpg)

接著我們可以按照以上的線路，根據 Verilog 的語法，設計出對應元件與測試程式如下所示：

程式：fulladder.v

```verilog
// 以下為全加器模組的定義
module fulladder (input a, b, c_in, output sum, c_out);
wire s1, c1, c2;

xor g1(s1, a, b);
xor g2(sum, s1, c_in);
and g3(c1, a,b);
and g4(c2, s1, c_in) ;
or g5(c_out, c2, c1) ;

endmodule

// 以下為測試程式
module main;
reg a, b, c_in;
wire sum, c_out;

fulladder fa1(a, b, c_in, sum, c_out);

initial begin
  a = 0;  b = 0;  c_in = 0;
  $monitor("%04dns monitor: a=%d b=%d c_in=%d c_out=%d sum=%d", $stime, a, b, c_in, c_out, sum);
  #1000 $finish;
end

always #50 c_in = c_in+1;

always #100 b = b+1;

always #200 a = a+1;

endmodule

```

然後我們就可以利用 Icarus 進行編譯與測試，看看 fulladder.v 的模擬執行結果是否正確。

編譯執行結果：

```
D:\Dropbox\Public\pmag\201306\code>iverilog -o fulladder fulladder.v

D:\Dropbox\Public\pmag\201306\code>vvp fulladder
0000ns monitor: a=0 b=0 c_in=0 c_out=0 sum=0
0050ns monitor: a=0 b=0 c_in=1 c_out=0 sum=1
0100ns monitor: a=0 b=1 c_in=0 c_out=0 sum=1
0150ns monitor: a=0 b=1 c_in=1 c_out=1 sum=0
0200ns monitor: a=1 b=0 c_in=0 c_out=0 sum=1
0250ns monitor: a=1 b=0 c_in=1 c_out=1 sum=0
0300ns monitor: a=1 b=1 c_in=0 c_out=1 sum=0
0350ns monitor: a=1 b=1 c_in=1 c_out=1 sum=1
0400ns monitor: a=0 b=0 c_in=0 c_out=0 sum=0
0450ns monitor: a=0 b=0 c_in=1 c_out=0 sum=1
0500ns monitor: a=0 b=1 c_in=0 c_out=0 sum=1
0550ns monitor: a=0 b=1 c_in=1 c_out=1 sum=0
0600ns monitor: a=1 b=0 c_in=0 c_out=0 sum=1
0650ns monitor: a=1 b=0 c_in=1 c_out=1 sum=0
0700ns monitor: a=1 b=1 c_in=0 c_out=1 sum=0
0750ns monitor: a=1 b=1 c_in=1 c_out=1 sum=1
0800ns monitor: a=0 b=0 c_in=0 c_out=0 sum=0
0850ns monitor: a=0 b=0 c_in=1 c_out=0 sum=1
0900ns monitor: a=0 b=1 c_in=0 c_out=0 sum=1
0950ns monitor: a=0 b=1 c_in=1 c_out=1 sum=0
1000ns monitor: a=1 b=0 c_in=0 c_out=0 sum=1
```

習題 1：請證明 nand 閘是全能的 (提示：只要用 nand 做出 and, or, not 就行了)
習題 2：請用卡諾圖去化簡全加器的 Cout 電路。
習題 3：請寫一個 Verilog 程式用 nand 兜出 or 電路，並測試之。

### 區塊式設計的注意事項

當您採用區塊式設計時，有一些常見的初學者錯誤必須注意，列舉如下：

1. assign 的指定是針對線路，而暫存器的指定必須放在 always 或 initial 區塊裏。

因此，下列程式中在 assign 指定 reg 型態的變數 o1 = i1 是錯的，必須將 reg 去掉，或者改放到 always 區塊裏。

![圖、在 assign 裏只能指定 wire 型態的變數，不能指定 reg 型態的](../img/error1.jpg)

2. 相反的，always 區塊裏的指定，只能針對 reg 型態的變數進行，不能套用在線路 (wire: 含 input, output, inout) 型態的變數上。

因此、下列程式當中若沒有將 o1 加上 reg 型態，則會發生錯誤。

![圖、在 always 裏才能指定 reg 型態的變數](../img/error2.jpg)

3. 上述的參數 output reg o1 其實是一種將暫存器與線路同時宣告的縮寫，事實上我們可以將該宣告拆開成相同名稱的兩部份 (output o1, reg o1) 或者甚至乾脆使用不同的名稱來宣告暫存器，然後再透過 assign 將線路與暫存器綁在一起，這三種寫法的意義其實都是相同的，請參考下圖：

![圖、同時具備 wire + reg 的宣告方式](../img/regparameter3style.jpg)

4. assign 裏面除了 指定敘述 = 與基本運算 `(&|!^...)` 之外，還可以用 (cond)?case1:case2; 的這種語法。舉例而言，以下是微控制器 mcu0 裏控制單元的範例，您可以看到類似層次性 `if else` 的語法也可用這種方式在 aluop 這個語句上實現。

```verilog
module control(input [3:0] op, input z, output mw, aw, pcmux, sww, output [3:0] aluop);
  assign mw=(op==mcu0.ST);
  assign aw=(op==mcu0.LD || op==mcu0.ADD);
  assign sww=(op==mcu0.CMP);
  assign pcmux=(op==mcu0.JMP || (op==mcu0.JEQ && z));
  assign aluop=(op==mcu0.LD)?alu0.APASS:
				 (op==mcu0.CMP)?alu0.CMP:
                   (op==mcu0.ADD)?alu0.ADD:alu0.ZERO;
endmodule
```
