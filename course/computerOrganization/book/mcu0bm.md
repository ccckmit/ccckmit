## MCU0 的區塊式設計 -- MCU0bm.v

### 前言

我們曾經在下列文章中設計出了 MCU0 迷你版這個只有六個指令的微控制器，整個實作只有 51 行。

* [開放電腦計畫 (6) – 一顆只有 51 行 Verilog 程式碼的 16 位元處理器 MCU0](http://programmermagazine.github.io/201312/htm/article5.html)

但是、上述程式雖然簡單，但卻是採用流程式的寫法。雖然、筆者不覺得流程式的寫法有甚麼特別的缺陷，但是對那些習慣採用硬體角度設計 Verilog 程式的人而言，似乎採用「區塊式的設計方式」才是正統，所以、筆者將於本文中採用「區塊式的方式重新設計」MCU0 迷你版，以便能學習「硬體設計者」的思考方式。

### MCU0 迷你版的指令表

為了方便讀者閱讀，不需要查閱前文，我們再次列出了 MCU0 迷你版的指令表如下：

OP name		格式		意義
-- ------	--------	---------
0  LD		LD 	C		A = [C]
1  ADD		ADD C		A = A + [C]
2  JMP		JMP C		PC = C
3  ST		ST  C		[C] = A
4  CMP		CMP C		SW = A CMP [C]
5  JEQ		JEQ C		if SW[30]=Z=1 then PC = C

### MCU0 迷你版的區塊設計圖

在MCU0 迷你版裏，總共有三個暫存器，分別是 A, PC 與 SW，一個具有兩組讀取 (i1/d1, i2/d2) 與一組寫入的記憶體 (wi/wd)，還有一個算術邏輯單元 ALU，這個電路的設計圖如下。

![圖、MCU0bm 的區塊設計圖](../img/mcu0bm.jpg)

由於筆者不熟悉數位電路設計的繪圖軟體，因此就簡單的用 LibreOffice 的 Impress 繪製了上圖，純粹採用區塊表達法，並沒有使用標準的數位電路設計圖示。

### 原始碼

根據上圖，我們設計出了下列 Verilog 程式，您應該可以很清楚的找出程式與圖形之間的對應關係。

```Verilog
module memory(input w, input [11:0] wi, input [15:0] wd, input [11:0] i1, output [15:0] d1, input [11:0] i2, output [15:0] d2);
  integer i;  
  reg [7:0] m[0:2**12-1];
  initial begin
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign d1 = {m[i1], m[i1+1]};
  assign d2 = {m[i2], m[i2+1]};
  always @(w) begin
    if (w) {m[wi], m[wi+1]} = wd;
  end
endmodule

module adder#(parameter W=16)(input [W-1:0] a, input [W-1:0] b, output [W-1:0] c);
  assign c = a + b;
endmodule

module register#(parameter W=16)(input clock, w, input [W-1:0] ri, output [W-1:0] ro);
reg [W-1:0] r;
  always @(posedge clock) begin
    if (w) r = ri;
  end
  assign ro=r;
endmodule

module alu(input [3:0] op, input [15:0] a, input [15:0] b, output reg [15:0] c);
parameter [3:0] ZERO=4'h0, ADD=4'h1, CMP=4'he, APASS=4'hf;
  always @(*) begin
    case (op)
      ADD: c = a+b;
      CMP: begin c[15]=(a < b); c[14]=(a==b); c[13:0]=14'h0; end
      APASS: c = a;
      default: c = 0;
    endcase
  end
endmodule

module mux#(parameter W=16)(input sel, input [W-1:0] i0, i1, output [W-1:0] o);
  assign o=(sel)?i1:i0;
endmodule

`define OP ir[15:12]
`define C  ir[11:0]
`define N  SW.r[15]
`define Z  SW.r[14]

module control(input [3:0] op, input z, output mw, aw, pcmux, sww, output [3:0] aluop);
  assign mw=(op==mcu0.ST);
  assign aw=(op==mcu0.LD || op==mcu0.ADD);
  assign sww=(op==mcu0.CMP);
  assign pcmux=(op==mcu0.JMP || (op==mcu0.JEQ && z));
  assign aluop=(op==mcu0.LD)?alu0.APASS:(op==mcu0.CMP)?alu0.CMP:(op==mcu0.ADD)?alu0.ADD:alu0.ZERO;
endmodule

module mcu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  wire mw, aw, pcmux, sww;
  wire [3:0] aluop;
  wire [11:0] pco, pci, pcnext;
  wire [15:0] aluout, ao, swo, ir, mo;
  
  register#(.W(12)) PC(.clock(clock), .w(1), .ri(pci), .ro(pco));
  adder#(.W(12)) adder0(.a(2), .b(pco), .c(pcnext));
  memory mem(.w(mw), .wi(`C), .wd(ao), .i1(pco), .d1(ir), .i2(`C), .d2(mo));
  register A(.clock(~clock), .w(aw), .ri(aluout), .ro(ao));
  register SW(.clock(~clock), .w(sww), .ri(aluout), .ro(swo));
  alu alu0(.op(aluop), .a(mo), .b(ao), .c(aluout));
  mux#(.W(12)) muxpc(.sel(pcmux), .i0(pcnext), .i1(`C), .o(pci));
  control cu(.op(`OP), .z(`Z), .mw(mw), .aw(aw), .pcmux(pcmux), .sww(sww), .aluop(aluop));
  
  initial begin
    PC.r = 0; SW.r = 0;
  end
endmodule

module main;         // 測試程式開始
reg clock;           // 時脈 clock 變數

mcu mcu0(clock);

initial begin 
  clock = 0;
  $monitor("%4dns pc=%x ir=%x mo=%x sw=%x a=%d mw=%b aluout=%x", $stime, mcu0.PC.r, mcu0.ir, mcu0.mo, mcu0.SW.r, mcu0.A.r, mcu0.mw, mcu0.aluout);
  #1000 $finish;
end
always #5 begin 
  clock=~clock;    // 每隔 5ns 反相，時脈週期為 10ns
end  
endmodule
```

### 輸入的機器碼 mcu0m.hex

為了測試上述程式，我們同樣採用了計算 `SUM=1+2+...+10` 的這個程式作為輸入，以下是機器碼與對應的組合語言程式。

```
00 16  // 00    LOOP:   LD    I    
40 1A  // 02            CMP   N    
50 12  // 04            JEQ   EXIT
10 18  // 06            ADD   K1    
30 16  // 08            ST    I    
00 14  // 0A            LD    SUM    
10 16  // 0C            ADD   I    
30 14  // 0E            ST    SUM    
20 00  // 10            JMP   LOOP
20 12  // 12    EXIT:   JMP   EXIT
00 00  // 14    SUM:    WORD  0    
00 00  // 16    I:      WORD  0    
00 01  // 18    K1:     WORD  1    
00 0A  // 1A    N:      WORD  10    
```

### 執行結果

編寫完成之後，我們就可以測試整個 mcu0bm.v 程式了，其執行結果如下所示。

```
D:\Dropbox\Public\web\co\code\mcu0>iverilog mcu0bm.v -o mcu0bm

D:\Dropbox\Public\web\co\code\mcu0>vvp mcu0bm
WARNING: mcu0bm.v:5: $readmemh(mcu0m.hex): Not enough words in the file for the
requested range [0:4095].
00000000: 0016
00000002: 401a
00000004: 5012
00000006: 1018
00000008: 3016
0000000a: 0014
0000000c: 1016
0000000e: 3014
00000010: 2000
00000012: 2012
00000014: 0000
00000016: 0000
00000018: 0001
0000001a: 000a
0000001c: xxxx
0000001e: xxxx
   0ns pc=000 ir=0016 mo=0000 sw=0000 a=    0 mw=0 aluout=0000
   5ns pc=002 ir=401a mo=000a sw=0000 a=    0 mw=0 aluout=0000
  15ns pc=004 ir=5012 mo=2012 sw=0000 a=    0 mw=0 aluout=0000
  25ns pc=006 ir=1018 mo=0001 sw=0000 a=    0 mw=0 aluout=0001
  30ns pc=006 ir=1018 mo=0001 sw=0000 a=    1 mw=0 aluout=0002
  35ns pc=008 ir=3016 mo=0001 sw=0000 a=    1 mw=1 aluout=0000
  45ns pc=00a ir=0014 mo=0000 sw=0000 a=    1 mw=0 aluout=0000
  50ns pc=00a ir=0014 mo=0000 sw=0000 a=    0 mw=0 aluout=0000
  55ns pc=00c ir=1016 mo=0001 sw=0000 a=    0 mw=0 aluout=0001
  60ns pc=00c ir=1016 mo=0001 sw=0000 a=    1 mw=0 aluout=0002
  65ns pc=00e ir=3014 mo=0001 sw=0000 a=    1 mw=1 aluout=0000
  75ns pc=010 ir=2000 mo=0016 sw=0000 a=    1 mw=0 aluout=0000
  85ns pc=000 ir=0016 mo=0001 sw=0000 a=    1 mw=0 aluout=0001
  95ns pc=002 ir=401a mo=000a sw=0000 a=    1 mw=0 aluout=0000
 105ns pc=004 ir=5012 mo=2012 sw=0000 a=    1 mw=0 aluout=0000
 115ns pc=006 ir=1018 mo=0001 sw=0000 a=    1 mw=0 aluout=0002
 120ns pc=006 ir=1018 mo=0001 sw=0000 a=    2 mw=0 aluout=0003
 125ns pc=008 ir=3016 mo=0002 sw=0000 a=    2 mw=1 aluout=0000
 135ns pc=00a ir=0014 mo=0001 sw=0000 a=    2 mw=0 aluout=0001
 140ns pc=00a ir=0014 mo=0001 sw=0000 a=    1 mw=0 aluout=0001
 145ns pc=00c ir=1016 mo=0002 sw=0000 a=    1 mw=0 aluout=0003
 150ns pc=00c ir=1016 mo=0002 sw=0000 a=    3 mw=0 aluout=0005
 155ns pc=00e ir=3014 mo=0003 sw=0000 a=    3 mw=1 aluout=0000
 165ns pc=010 ir=2000 mo=0016 sw=0000 a=    3 mw=0 aluout=0000
 175ns pc=000 ir=0016 mo=0002 sw=0000 a=    3 mw=0 aluout=0002
 180ns pc=000 ir=0016 mo=0002 sw=0000 a=    2 mw=0 aluout=0002
 185ns pc=002 ir=401a mo=000a sw=0000 a=    2 mw=0 aluout=0000
 195ns pc=004 ir=5012 mo=2012 sw=0000 a=    2 mw=0 aluout=0000
 205ns pc=006 ir=1018 mo=0001 sw=0000 a=    2 mw=0 aluout=0003
 210ns pc=006 ir=1018 mo=0001 sw=0000 a=    3 mw=0 aluout=0004
 215ns pc=008 ir=3016 mo=0003 sw=0000 a=    3 mw=1 aluout=0000
 225ns pc=00a ir=0014 mo=0003 sw=0000 a=    3 mw=0 aluout=0003
 235ns pc=00c ir=1016 mo=0003 sw=0000 a=    3 mw=0 aluout=0006
 240ns pc=00c ir=1016 mo=0003 sw=0000 a=    6 mw=0 aluout=0009
 245ns pc=00e ir=3014 mo=0006 sw=0000 a=    6 mw=1 aluout=0000
 255ns pc=010 ir=2000 mo=0016 sw=0000 a=    6 mw=0 aluout=0000
 265ns pc=000 ir=0016 mo=0003 sw=0000 a=    6 mw=0 aluout=0003
 270ns pc=000 ir=0016 mo=0003 sw=0000 a=    3 mw=0 aluout=0003
 275ns pc=002 ir=401a mo=000a sw=0000 a=    3 mw=0 aluout=0000
 285ns pc=004 ir=5012 mo=2012 sw=0000 a=    3 mw=0 aluout=0000
 295ns pc=006 ir=1018 mo=0001 sw=0000 a=    3 mw=0 aluout=0004
 300ns pc=006 ir=1018 mo=0001 sw=0000 a=    4 mw=0 aluout=0005
 305ns pc=008 ir=3016 mo=0004 sw=0000 a=    4 mw=1 aluout=0000
 315ns pc=00a ir=0014 mo=0006 sw=0000 a=    4 mw=0 aluout=0006
 320ns pc=00a ir=0014 mo=0006 sw=0000 a=    6 mw=0 aluout=0006
 325ns pc=00c ir=1016 mo=0004 sw=0000 a=    6 mw=0 aluout=000a
 330ns pc=00c ir=1016 mo=0004 sw=0000 a=   10 mw=0 aluout=000e
 335ns pc=00e ir=3014 mo=000a sw=0000 a=   10 mw=1 aluout=0000
 345ns pc=010 ir=2000 mo=0016 sw=0000 a=   10 mw=0 aluout=0000
 355ns pc=000 ir=0016 mo=0004 sw=0000 a=   10 mw=0 aluout=0004
 360ns pc=000 ir=0016 mo=0004 sw=0000 a=    4 mw=0 aluout=0004
 365ns pc=002 ir=401a mo=000a sw=0000 a=    4 mw=0 aluout=0000
 375ns pc=004 ir=5012 mo=2012 sw=0000 a=    4 mw=0 aluout=0000
 385ns pc=006 ir=1018 mo=0001 sw=0000 a=    4 mw=0 aluout=0005
 390ns pc=006 ir=1018 mo=0001 sw=0000 a=    5 mw=0 aluout=0006
 395ns pc=008 ir=3016 mo=0005 sw=0000 a=    5 mw=1 aluout=0000
 405ns pc=00a ir=0014 mo=000a sw=0000 a=    5 mw=0 aluout=000a
 410ns pc=00a ir=0014 mo=000a sw=0000 a=   10 mw=0 aluout=000a
 415ns pc=00c ir=1016 mo=0005 sw=0000 a=   10 mw=0 aluout=000f
 420ns pc=00c ir=1016 mo=0005 sw=0000 a=   15 mw=0 aluout=0014
 425ns pc=00e ir=3014 mo=000f sw=0000 a=   15 mw=1 aluout=0000
 435ns pc=010 ir=2000 mo=0016 sw=0000 a=   15 mw=0 aluout=0000
 445ns pc=000 ir=0016 mo=0005 sw=0000 a=   15 mw=0 aluout=0005
 450ns pc=000 ir=0016 mo=0005 sw=0000 a=    5 mw=0 aluout=0005
 455ns pc=002 ir=401a mo=000a sw=0000 a=    5 mw=0 aluout=0000
 465ns pc=004 ir=5012 mo=2012 sw=0000 a=    5 mw=0 aluout=0000
 475ns pc=006 ir=1018 mo=0001 sw=0000 a=    5 mw=0 aluout=0006
 480ns pc=006 ir=1018 mo=0001 sw=0000 a=    6 mw=0 aluout=0007
 485ns pc=008 ir=3016 mo=0006 sw=0000 a=    6 mw=1 aluout=0000
 495ns pc=00a ir=0014 mo=000f sw=0000 a=    6 mw=0 aluout=000f
 500ns pc=00a ir=0014 mo=000f sw=0000 a=   15 mw=0 aluout=000f
 505ns pc=00c ir=1016 mo=0006 sw=0000 a=   15 mw=0 aluout=0015
 510ns pc=00c ir=1016 mo=0006 sw=0000 a=   21 mw=0 aluout=001b
 515ns pc=00e ir=3014 mo=0015 sw=0000 a=   21 mw=1 aluout=0000
 525ns pc=010 ir=2000 mo=0016 sw=0000 a=   21 mw=0 aluout=0000
 535ns pc=000 ir=0016 mo=0006 sw=0000 a=   21 mw=0 aluout=0006
 540ns pc=000 ir=0016 mo=0006 sw=0000 a=    6 mw=0 aluout=0006
 545ns pc=002 ir=401a mo=000a sw=0000 a=    6 mw=0 aluout=0000
 555ns pc=004 ir=5012 mo=2012 sw=0000 a=    6 mw=0 aluout=0000
 565ns pc=006 ir=1018 mo=0001 sw=0000 a=    6 mw=0 aluout=0007
 570ns pc=006 ir=1018 mo=0001 sw=0000 a=    7 mw=0 aluout=0008
 575ns pc=008 ir=3016 mo=0007 sw=0000 a=    7 mw=1 aluout=0000
 585ns pc=00a ir=0014 mo=0015 sw=0000 a=    7 mw=0 aluout=0015
 590ns pc=00a ir=0014 mo=0015 sw=0000 a=   21 mw=0 aluout=0015
 595ns pc=00c ir=1016 mo=0007 sw=0000 a=   21 mw=0 aluout=001c
 600ns pc=00c ir=1016 mo=0007 sw=0000 a=   28 mw=0 aluout=0023
 605ns pc=00e ir=3014 mo=001c sw=0000 a=   28 mw=1 aluout=0000
 615ns pc=010 ir=2000 mo=0016 sw=0000 a=   28 mw=0 aluout=0000
 625ns pc=000 ir=0016 mo=0007 sw=0000 a=   28 mw=0 aluout=0007
 630ns pc=000 ir=0016 mo=0007 sw=0000 a=    7 mw=0 aluout=0007
 635ns pc=002 ir=401a mo=000a sw=0000 a=    7 mw=0 aluout=0000
 645ns pc=004 ir=5012 mo=2012 sw=0000 a=    7 mw=0 aluout=0000
 655ns pc=006 ir=1018 mo=0001 sw=0000 a=    7 mw=0 aluout=0008
 660ns pc=006 ir=1018 mo=0001 sw=0000 a=    8 mw=0 aluout=0009
 665ns pc=008 ir=3016 mo=0008 sw=0000 a=    8 mw=1 aluout=0000
 675ns pc=00a ir=0014 mo=001c sw=0000 a=    8 mw=0 aluout=001c
 680ns pc=00a ir=0014 mo=001c sw=0000 a=   28 mw=0 aluout=001c
 685ns pc=00c ir=1016 mo=0008 sw=0000 a=   28 mw=0 aluout=0024
 690ns pc=00c ir=1016 mo=0008 sw=0000 a=   36 mw=0 aluout=002c
 695ns pc=00e ir=3014 mo=0024 sw=0000 a=   36 mw=1 aluout=0000
 705ns pc=010 ir=2000 mo=0016 sw=0000 a=   36 mw=0 aluout=0000
 715ns pc=000 ir=0016 mo=0008 sw=0000 a=   36 mw=0 aluout=0008
 720ns pc=000 ir=0016 mo=0008 sw=0000 a=    8 mw=0 aluout=0008
 725ns pc=002 ir=401a mo=000a sw=0000 a=    8 mw=0 aluout=0000
 735ns pc=004 ir=5012 mo=2012 sw=0000 a=    8 mw=0 aluout=0000
 745ns pc=006 ir=1018 mo=0001 sw=0000 a=    8 mw=0 aluout=0009
 750ns pc=006 ir=1018 mo=0001 sw=0000 a=    9 mw=0 aluout=000a
 755ns pc=008 ir=3016 mo=0009 sw=0000 a=    9 mw=1 aluout=0000
 765ns pc=00a ir=0014 mo=0024 sw=0000 a=    9 mw=0 aluout=0024
 770ns pc=00a ir=0014 mo=0024 sw=0000 a=   36 mw=0 aluout=0024
 775ns pc=00c ir=1016 mo=0009 sw=0000 a=   36 mw=0 aluout=002d
 780ns pc=00c ir=1016 mo=0009 sw=0000 a=   45 mw=0 aluout=0036
 785ns pc=00e ir=3014 mo=002d sw=0000 a=   45 mw=1 aluout=0000
 795ns pc=010 ir=2000 mo=0016 sw=0000 a=   45 mw=0 aluout=0000
 805ns pc=000 ir=0016 mo=0009 sw=0000 a=   45 mw=0 aluout=0009
 810ns pc=000 ir=0016 mo=0009 sw=0000 a=    9 mw=0 aluout=0009
 815ns pc=002 ir=401a mo=000a sw=0000 a=    9 mw=0 aluout=0000
 825ns pc=004 ir=5012 mo=2012 sw=0000 a=    9 mw=0 aluout=0000
 835ns pc=006 ir=1018 mo=0001 sw=0000 a=    9 mw=0 aluout=000a
 840ns pc=006 ir=1018 mo=0001 sw=0000 a=   10 mw=0 aluout=000b
 845ns pc=008 ir=3016 mo=000a sw=0000 a=   10 mw=1 aluout=0000
 855ns pc=00a ir=0014 mo=002d sw=0000 a=   10 mw=0 aluout=002d
 860ns pc=00a ir=0014 mo=002d sw=0000 a=   45 mw=0 aluout=002d
 865ns pc=00c ir=1016 mo=000a sw=0000 a=   45 mw=0 aluout=0037
 870ns pc=00c ir=1016 mo=000a sw=0000 a=   55 mw=0 aluout=0041
 875ns pc=00e ir=3014 mo=0037 sw=0000 a=   55 mw=1 aluout=0000
 885ns pc=010 ir=2000 mo=0016 sw=0000 a=   55 mw=0 aluout=0000
 895ns pc=000 ir=0016 mo=000a sw=0000 a=   55 mw=0 aluout=000a
 900ns pc=000 ir=0016 mo=000a sw=0000 a=   10 mw=0 aluout=000a
 905ns pc=002 ir=401a mo=000a sw=0000 a=   10 mw=0 aluout=4000
 910ns pc=002 ir=401a mo=000a sw=4000 a=   10 mw=0 aluout=4000
 915ns pc=004 ir=5012 mo=2012 sw=4000 a=   10 mw=0 aluout=0000
 925ns pc=012 ir=2012 mo=2012 sw=4000 a=   10 mw=0 aluout=0000
```

您可以清楚的看到，該程式在 870ns 時計算出了總合 SUM=55 的結果，這代表 mcu0bm.v 的設計完成了計算 1+...+10 的功能。

### 結語

在上述實作中，採用區塊式設計的 mcu0bm.v 總共有 98 行，比起同樣功能的流程式設計 mcu0m.v 的 51 行多了將近一倍，而且程式的設計難度感覺高了不少，但是我們可以很清楚的掌握到整個設計的硬體結構，這是採用流程式設計所難以確定的。

當然、由於筆者是「程式人員」，並非硬體設計人員，因此比較喜歡採用流程式的設計方式。不過採用了區塊式設計法設計出 mcu0bm.v 之後，也逐漸開始能理解這種「硬體導向」的設計方式，這大概是我在撰寫本程式時最大的收穫了。

