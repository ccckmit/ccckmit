## MCU0 的迷你版 -- mcu0m

### MCU0 處理器

MCU0 為一個 16 位元處理器，包含指令暫存器 IR，程式計數器 PC ，狀態佔存器 SW 與累積器 A 等四個暫存器。

### 指令表

OP name		格式		意義
-- ------	--------	---------
0  LD		LD 	C		A = [C]
1  ADD		ADD C		A = A + [C]
2  JMP		JMP C		PC = C
3  ST		ST  C		[C] = A
4  CMP		CMP C		SW = A CMP [C]
5  JEQ		JEQ C		if SW[30]=Z=1 then PC = C

### 組合語言與機器碼

```
00	LOOP: 	LD	I		0016
02			CMP K10		401A
04			JEQ EXIT	5012
06			ADD K1		1018
08			ST  I		3016
0A			LD  SUM		0014
0C			ADD	I		1016
0E			ST 	SUM		3014
10			JMP	LOOP	2000
12	EXIT:	JMP EXIT	2012
14	SUM:	WORD 0		0000
16	I:		WORD 0		0000
18	K1:		WORD 1		0001
1A	K10:	WORD 10		000A
```

轉成 Hex 輸入檔格式：

檔案： mcu0m.hex

```
00 16  // 00    LOOP:   LD    I    
40 1A  // 02            CMP   K10  
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
00 0A  // 1A    K10:    WORD  10   
```

### Verilog 程式實作

![圖、mcu0m 的結構圖](../img/mcu0m.jpg)

在以下的程式中，期暫存器與各欄位的對應關係圖如上所示，您可以看到程式用 `IR = {m[PC], m[PC+1]}` 提取指令後，會將 IR 拆解成 `OP=IR[15:12]` 與 `C=IR[11:0]` 兩部份，然後根據 OP 的指令碼內容，執行對應的動作。

在 LD、ST、ADD 等需要存取記憶體的指令中，會利用 `M= {m[C], m[C+1]}` 這個巨集定義存取對應的 16bit 記憶體，然後與累積器 A 進行對應的運算，像是在 LD 指令中用 `A = M` ，也就是 `A={m[C], m[C+1]}` 的方式，將記憶體內容載入到累積器 A 當中。而 ST 則是反過來用 `M=A` 將累積器 A 存回記憶體當中。類似的、加法也是用 `A = A + M`  將記憶體的內容 `M={m[C], m[C+1]}` 取出後與 A 相加，然後放回 A 而已。

檔案： mcu0m.v

```verilog
`define N    SW[15] // 負號旗標
`define Z    SW[14] // 零旗標
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define M    {m[`C], m[`C+1]}

module cpu(input clock);
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  reg signed [15:0] A;   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg [15:0] IR;  // 指令暫存器 IR
  reg [15:0] SW;  // 狀態暫存器 SW
  reg [15:0] PC;  // 程式計數器
  reg [15:0] pc0;
  reg [7:0]  m [0:32];    // 內部的快取記憶體
  integer i;  
  initial  // 初始化
  begin
    PC = 0; // 將 PC 設為起動位址 0
	SW = 0;
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
       $display("%8x: %8x", i, {m[i], m[i+1]});
    end
  end
  
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
      endcase
	  // 印出 PC, IR, SW, A 等暫存器值以供觀察
      $display("%4dns PC=%x IR=%x, SW=%x, A=%d", $stime, pc0, IR, SW, A); 
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu cpux(clock);            // 宣告處理器

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
initial #2000 $finish;      // 在 2000 奈秒的時候停止測試。
endmodule
```

跳躍指令不需要再存取記憶體，只要將指令暫存器的後半部 `C=IR[11:0]` 塞到程式計數器 PC 當中，就完成了跳躍動作。

而條件是跳躍指令 JEQ 則是在跳躍之前，先根據 Z 旗標進行判斷，只有當 Z 旗標是 1 的時候才會進行跳躍的動作。

### 執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o mcu0m mcu0m.v

D:\Dropbox\Public\web\oc\code>vvp cpu16m
WARNING: cpu16m.v:20: $readmemh(cpu16m.hex): Not enough words in the file for th
e requested range [0:32].
00000000:     0016
00000002:     401a
00000004:     5012
00000006:     1018
00000008:     3016
0000000a:     0014
0000000c:     1016
0000000e:     3014
00000010:     2000
00000012:     2012
00000014:     0000
00000016:     0000
00000018:     0001
0000001a:     000a
0000001c:     xxxx
0000001e:     xxxx
  10ns PC=0000 IR=0016, SW=0000, A=     0
  30ns PC=0002 IR=401a, SW=8000, A=     0
  50ns PC=0004 IR=5012, SW=8000, A=     0
  70ns PC=0006 IR=1018, SW=8000, A=     1
  90ns PC=0008 IR=3016, SW=8000, A=     1
 110ns PC=000a IR=0014, SW=8000, A=     0
 130ns PC=000c IR=1016, SW=8000, A=     1
 150ns PC=000e IR=3014, SW=8000, A=     1
 170ns PC=0010 IR=2000, SW=8000, A=     1
 190ns PC=0000 IR=0016, SW=8000, A=     1
 210ns PC=0002 IR=401a, SW=8000, A=     1
 230ns PC=0004 IR=5012, SW=8000, A=     1
 250ns PC=0006 IR=1018, SW=8000, A=     2
 270ns PC=0008 IR=3016, SW=8000, A=     2
 290ns PC=000a IR=0014, SW=8000, A=     1
 310ns PC=000c IR=1016, SW=8000, A=     3
 330ns PC=000e IR=3014, SW=8000, A=     3
 350ns PC=0010 IR=2000, SW=8000, A=     3
 370ns PC=0000 IR=0016, SW=8000, A=     2
 390ns PC=0002 IR=401a, SW=8000, A=     2
 410ns PC=0004 IR=5012, SW=8000, A=     2
 430ns PC=0006 IR=1018, SW=8000, A=     3
 450ns PC=0008 IR=3016, SW=8000, A=     3
 470ns PC=000a IR=0014, SW=8000, A=     3
 490ns PC=000c IR=1016, SW=8000, A=     6
 510ns PC=000e IR=3014, SW=8000, A=     6
 530ns PC=0010 IR=2000, SW=8000, A=     6
 550ns PC=0000 IR=0016, SW=8000, A=     3
 570ns PC=0002 IR=401a, SW=8000, A=     3
 590ns PC=0004 IR=5012, SW=8000, A=     3
 610ns PC=0006 IR=1018, SW=8000, A=     4
 630ns PC=0008 IR=3016, SW=8000, A=     4
 650ns PC=000a IR=0014, SW=8000, A=     6
 670ns PC=000c IR=1016, SW=8000, A=    10
 690ns PC=000e IR=3014, SW=8000, A=    10
 710ns PC=0010 IR=2000, SW=8000, A=    10
 730ns PC=0000 IR=0016, SW=8000, A=     4
 750ns PC=0002 IR=401a, SW=8000, A=     4
 770ns PC=0004 IR=5012, SW=8000, A=     4
 790ns PC=0006 IR=1018, SW=8000, A=     5
 810ns PC=0008 IR=3016, SW=8000, A=     5
 830ns PC=000a IR=0014, SW=8000, A=    10
 850ns PC=000c IR=1016, SW=8000, A=    15
 870ns PC=000e IR=3014, SW=8000, A=    15
 890ns PC=0010 IR=2000, SW=8000, A=    15
 910ns PC=0000 IR=0016, SW=8000, A=     5
 930ns PC=0002 IR=401a, SW=8000, A=     5
 950ns PC=0004 IR=5012, SW=8000, A=     5
 970ns PC=0006 IR=1018, SW=8000, A=     6
 990ns PC=0008 IR=3016, SW=8000, A=     6
1010ns PC=000a IR=0014, SW=8000, A=    15
1030ns PC=000c IR=1016, SW=8000, A=    21
1050ns PC=000e IR=3014, SW=8000, A=    21
1070ns PC=0010 IR=2000, SW=8000, A=    21
1090ns PC=0000 IR=0016, SW=8000, A=     6
1110ns PC=0002 IR=401a, SW=8000, A=     6
1130ns PC=0004 IR=5012, SW=8000, A=     6
1150ns PC=0006 IR=1018, SW=8000, A=     7
1170ns PC=0008 IR=3016, SW=8000, A=     7
1190ns PC=000a IR=0014, SW=8000, A=    21
1210ns PC=000c IR=1016, SW=8000, A=    28
1230ns PC=000e IR=3014, SW=8000, A=    28
1250ns PC=0010 IR=2000, SW=8000, A=    28
1270ns PC=0000 IR=0016, SW=8000, A=     7
1290ns PC=0002 IR=401a, SW=8000, A=     7
1310ns PC=0004 IR=5012, SW=8000, A=     7
1330ns PC=0006 IR=1018, SW=8000, A=     8
1350ns PC=0008 IR=3016, SW=8000, A=     8
1370ns PC=000a IR=0014, SW=8000, A=    28
1390ns PC=000c IR=1016, SW=8000, A=    36
1410ns PC=000e IR=3014, SW=8000, A=    36
1430ns PC=0010 IR=2000, SW=8000, A=    36
1450ns PC=0000 IR=0016, SW=8000, A=     8
1470ns PC=0002 IR=401a, SW=8000, A=     8
1490ns PC=0004 IR=5012, SW=8000, A=     8
1510ns PC=0006 IR=1018, SW=8000, A=     9
1530ns PC=0008 IR=3016, SW=8000, A=     9
1550ns PC=000a IR=0014, SW=8000, A=    36
1570ns PC=000c IR=1016, SW=8000, A=    45
1590ns PC=000e IR=3014, SW=8000, A=    45
1610ns PC=0010 IR=2000, SW=8000, A=    45
1630ns PC=0000 IR=0016, SW=8000, A=     9
1650ns PC=0002 IR=401a, SW=8000, A=     9
1670ns PC=0004 IR=5012, SW=8000, A=     9
1690ns PC=0006 IR=1018, SW=8000, A=    10
1710ns PC=0008 IR=3016, SW=8000, A=    10
1730ns PC=000a IR=0014, SW=8000, A=    45
1750ns PC=000c IR=1016, SW=8000, A=    55
1770ns PC=000e IR=3014, SW=8000, A=    55
1790ns PC=0010 IR=2000, SW=8000, A=    55
1810ns PC=0000 IR=0016, SW=8000, A=    10
1830ns PC=0002 IR=401a, SW=4000, A=    10
1850ns PC=0004 IR=5012, SW=4000, A=    10
1870ns PC=0012 IR=2012, SW=4000, A=    10
1890ns PC=0012 IR=2012, SW=4000, A=    10
1910ns PC=0012 IR=2012, SW=4000, A=    10
1930ns PC=0012 IR=2012, SW=4000, A=    10
1950ns PC=0012 IR=2012, SW=4000, A=    10
1970ns PC=0012 IR=2012, SW=4000, A=    10
1990ns PC=0012 IR=2012, SW=4000, A=    10
```

