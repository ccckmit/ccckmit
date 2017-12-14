# 控制單元

## 簡介

如果您曾經用硬接線的方式設計過 CPU，那就會發現「控制單元」主要就是一堆「開關」與「多工器」的接線。

開關可以用來控制某些資料是否要流過，而多工器則可以從很多組輸入資料中選擇一組輸出，以下是一個四選一多工器的方塊圖。

![圖、4 選 1 多工器](../img/mux.png)

4 選 1 多工器的內部電路結構如下：

![圖、4 選 1 多工器的內部電路](../img/mux4to1.png)

接著、就讓我們來看一個完整的 Verilog 的 4 選 1 的多工器程式，由於 Verilog 支援像 Case 這樣的高階語法，因此在實作時
可以不需要採用細部的接線方式，只要使用 case 語句就可以輕易完成多工器的設計。

檔案：[mux4.v](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/mux.v)

```Verilog
module mux4(input[1:0]  select, input[3:0] d, output reg q );
always @( select or d )
begin
   case( select )
       0 : q = d[0];
       1 : q = d[1];
       2 : q = d[2];
       3 : q = d[3];
   endcase
end
endmodule

module main;
reg [3:0] d;
reg [1:0] s;
wire q;

mux4 DUT (s, d, q);

initial
begin
  s = 0;
  d = 4'b0110;
end

always #50 begin
  s=s+1;
  $monitor("%4dns monitor: s=%d d=%d q=%d", $stime, s, d, q);
end

initial #1000 $finish;

endmodule
```

執行結果

```
D:\ccc101\icarus>iverilog mux4.v -o mux4

D:\ccc101\icarus>vvp mux4
  50ns monitor: s=1 d= 6 q=1
 100ns monitor: s=2 d= 6 q=1
 150ns monitor: s=3 d= 6 q=0
 200ns monitor: s=0 d= 6 q=0
 250ns monitor: s=1 d= 6 q=1
 300ns monitor: s=2 d= 6 q=1
 350ns monitor: s=3 d= 6 q=0
 400ns monitor: s=0 d= 6 q=0
 450ns monitor: s=1 d= 6 q=1
 500ns monitor: s=2 d= 6 q=1
 550ns monitor: s=3 d= 6 q=0
 600ns monitor: s=0 d= 6 q=0
 650ns monitor: s=1 d= 6 q=1
 700ns monitor: s=2 d= 6 q=1
 750ns monitor: s=3 d= 6 q=0
 800ns monitor: s=0 d= 6 q=0
 850ns monitor: s=1 d= 6 q=1
 900ns monitor: s=2 d= 6 q=1
 950ns monitor: s=3 d= 6 q=0
1000ns monitor: s=0 d= 6 q=0
```

您可以看到在上述範例中，輸入資料 6 的二進位是 0110，如下所示：

```
       位置 s  3 2 1 0
       位元 d  0 1 1 0
```

因此當 s=0 時會輸出 0, s=1 時會輸出 1, s=2 時會輸出 1, s=3 時會輸出 0，這就是上述輸出結果的意義。

但是、這種採用多工器硬的接線方式，必須搭配區塊式的設計，才能建構出 CPU，但是這種方式較為困難，因此
我們留待後續章節再來介紹。為了簡單起見，我們會先採用流程式的設計方法。

## 流程式設計

傳統上、當您設計出「ALU、暫存器」等基本元件之後，就可以設計控制單元，去控制這些「基本元件」，形成一顆 CPU。

但是、在 Verilog 當中， 「+, -, *, /, 暫存器」等都是基本語法，因此整個 CPU 的設計其實就是一個控制單元的設計而已，我們只要在適當的時候呼叫 「+, -, *, /」運算與「暫存器讀取寫入」功能，就能設計完一顆 CPU 了。

換句話說，只要在 Verilog 中設計出控制單元，基本上就已經設計完成整顆 CPU 了，因為「+, -, *, /, 暫存器」等元件都已經內建了。

以下是我們用流程法設計 mcu0 微處理器的重要程式片段，您可以看到在這種作法上，整個處理器就僅僅是一個「控制單元」，而這個「控制單元」的責任就是根據「擷取、解碼、執行」的流程，操控暫存器的流向與運算。

```verilog
module cpu(input clock);
  ...
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      IR = {m[PC], m[PC+1]};  // 指令擷取階段：IR=m[PC], 2 個 Byte 的記憶體
	  pc0= PC;                // 儲存舊的 PC 值在 pc0 中。
      PC = PC+2;              // 擷取完成，PC 前進到下一個指令位址
      case (`OP)              // 解碼、根據 OP 執行動作
        LD: A = `M; 		  // LD C
        ST: `M = A;			  // ST C
        CMP: begin `N=(A < `M); `Z=(A==`M); end // CMP C
        ADD: A = A + `M;	  // ADD C
        JMP: PC = `C;		  // JMP C
        JEQ: if (`Z) PC=`C;	  // JEQ C
		...
      endcase
	  // 印出 PC, IR, SW, A 等暫存器值以供觀察
      $display("%4dns PC=%x IR=%x, SW=%x, A=%d", $stime, pc0, IR, SW, A); 
  end
endmodule
```

## 區塊式設計

```verilog
module mcu(input clock);
  ...
  register#(.W(12)) PC(clock, 1, pci, pco);
  adder#(.W(12)) adder0(2, pco, pcnext);
  memory mem(mw, `C, ao, pco, ir, `C, mo);
  register#(.W(16)) A(~clock, aw, aluout, ao);
  register#(.W(16)) SW(~clock, sww, aluout, swo);
  alu alu0(aluop, mo, ao, aluout);
  mux#(.W(12)) muxpc(pcmux, pcnext, `C, pci);
  control cu(`OP, `Z, mw, aw, pcmux, sww, aluop);
  ...
endmodule
```

### 以流程法設計控制單元

然而、當指令愈來愈多，系統愈來愈複雜時，區塊式的設計方法就會愈來愈困難，此時有兩種解決方式，一種是採用流程式的設計法來撰寫控制單元，操控各種「開關與多工器」。這種設計方法混合了「區塊式與流程式」的設計方法，算是一種折衷性的方法。

```verilog
module control(input [3:0] op, input z, output mw, aw, pcmux, sww, output [3:0] aluop);
  reg mw, aw, pcmux, sww;
  reg [3:0] aluop;
  always @(op) begin
    mw = 0;
    aw = 0;
    sww = 0;
    pcmux = 0;
    aluop = alu0.ZERO;
    case (op)
      mcu0.LD: begin aw=1; aluop=alu0.APASS; end     // LD C
      mcu0.ST: mw=1;                                 // ST C
      mcu0.JMP: pcmux=1;                             // JMP C
      mcu0.JEQ: if (`Z) pcmux=1;                     // JEQ C
      mcu0.CMP: begin sww=1; aluop = alu0.CMP; end   // CMP C
      mcu0.ADD: begin aw=1; aluop=alu0.ADD; end      // ADD C
    endcase
  end  
endmodule
```

### 以區塊法設計控制單元

當然、我們也可以將上述的控制訊號硬是用 and, or, not 等方式寫下來，這樣就能將整個設計完全「區塊化」，而去掉「流程式」的寫法了。

```verilog
module control(input [3:0] op, input z, output mw, aw, pcmux, sww, output [3:0] aluop);
  assign mw=(op==mcu0.ST);
  assign aw=(op==mcu0.LD || op==mcu0.ADD);
  assign sww=(op==mcu0.CMP);
  assign pcmux=(op==mcu0.JMP || (op==mcu0.JEQ && z));
  assign aluop=(op==mcu0.LD)?alu0.APASS:(op==mcu0.CMP)?alu0.CMP:(op==mcu0.ADD)?alu0.ADD:alu0.ZERO;
endmodule
```

### 以微指令設計控制單元

另一種可以克服區塊式複雜度問題的方法，是採用「微指令」(microcode or  microprogram) 的設計方法，這種方法將指令的「擷取 (fetch)、解碼 (decode)、執行 (execute) 與寫回 (write-back)」等分成 T1, T2, T3, T4, ... 等子步驟，然後用一個微型計數器 mPC 控制這些子步驟的執行，如下圖所示。

![](../img/microcode.jpg)

由於 T1, T2, T3, T4 代表「擷取 (fetch)、解碼 (decode)、執行 (execute) 與寫回 (write-back)」，每個步驟各佔用一個 Clock，於是一個指令需要四個 Clock 才能完成，因此我們可以用以下方法將各個「開關與多工器」的控制編為一個表格。

```
       C1 C2 C3 .... Ck
T1
T2
T3
T4
```

這樣就可以很有系統的運用「區塊建構法」將控制單元也區塊化了，於是我們就不需要採用「流程式的寫法」，也能透過「按表操課」的方法完成「處理器的區塊式建構」了。







