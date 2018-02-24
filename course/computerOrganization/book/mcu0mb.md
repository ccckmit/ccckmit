## MCU0 的多週期版本 (獨立記憶體+有 reset)

在本文中我們將介紹如何以多週期的方式來設計 MCU0 微控制器的迷你版。

### 原始碼

```Verilog
`define OP   IR[15:12] // 運算碼
`define C    IR[11:0]  // 常數欄位
`define A    R[0]      // 累積器
`define PC   R[1]      // 程式計數器
`define SW   R[2]      // 狀態暫存器
`define N    `SW[15]   // 負號旗標
`define Z    `SW[14]   // 零旗標

module memory(input w, input [11:0] addr, inout [15:0] data);
  integer i;  
  reg [7:0] m[0:2**12-1];  // 內部的快取記憶體
  initial begin // 初始化
    $readmemh("mcu0m.hex", m);
    for (i=0; i < 32; i=i+2) begin
      $display("%x: %x", i, {m[i], m[i+1]});
    end
  end
  assign data = (!w)?{m[addr], m[addr+1]} : 16'hz;
  always @(w) begin
    if (w) begin
      {m[addr], m[addr+1]} = data;
       $display("write %x to addr=%x", data, addr);
    end
  end
endmodule

module mcu(input reset, clock, output reg mw, output reg [11:0] maddr, inout [15:0] mdata); // MCU0-Mini 的快取版
  parameter [3:0] LD=4'h0,ADD=4'h1,JMP=4'h2,ST=4'h3,CMP=4'h4,JEQ=4'h5;
  parameter [1:0] start=2'b00, fetch=2'b01, decode=2'b10, execute=2'b11;
  reg [1:0] pstate, nstate;
  reg [15:0] IR;    // 指令暫存器
  reg [15:0] R[0:2];
  reg [15:0] pc0;
  reg [15:0] mdr;
  
  always @(pstate) begin :combinatorial // 在 clock 時脈的正邊緣時觸發
    mdr=16'hz;
    mw = 0;
    case (pstate)
      start: begin
		`PC = 0;
		`SW = 0;
		nstate = fetch;
	  end
      fetch: begin
        mw = 0; 
        maddr = `PC;
        pc0 = `PC;              // 儲存舊的 PC 值在 pc0 中。
        `PC = `PC+2;            // 擷取完成，PC 前進到下一個指令位址
        nstate = decode;
      end
      decode: begin
        IR=mdata;
        maddr=`C;
        nstate = fetch;
        case (`OP) // 解碼、根據 OP 執行動作
          ST: begin mw=1; mdr=`A; end   // ST C
          JMP: `PC = `C;                // JMP C
          JEQ: if (`Z) `PC=`C;          // JEQ C
          default: nstate = execute;
        endcase
      end
      execute: begin 
        case (`OP) // 解碼、根據 OP 執行動作
          LD: `A = mdata;               // LD C
          CMP: begin `N=(`A < mdata); `Z=(`A==mdata); end // CMP C
          ADD: `A = `A + mdata;         // ADD C
        endcase
        nstate = fetch;
      end
    endcase
    // 印出 PC, IR, SW, A 等暫存器值以供觀察
    $display("%4dns PC=%x IR=%x, SW=%x, A=%d mdr=%x", $stime, pc0, IR, `SW, `A, mdr);
  end
  always @(posedge clock or reset) begin : sequential // 在 clock 時脈的正邊緣時觸發
    if (reset) 
	  pstate <= start;
	else 
      pstate <= nstate;
  end
  assign mdata = mdr;
endmodule

module main;                // 測試程式開始
reg clock, reset;           // 時脈 clock 變數
wire w;
wire [11:0] addr;
wire [15:0] data;

mcu mcu0(reset, clock, w, addr, data); // 宣告處理器
memory mem0(w, addr, data);            // 宣告記憶體

initial begin
  clock = 0;
  reset = 1;          // 一開始先重置
  #50 reset = 0;
  #5000 $finish;
end
always #10 clock=~clock;    // 每隔 10ns 反相，時脈週期為 20ns
endmodule
```

### 執行結果

```
D:\Dropbox\Public\web\co2\code\mcu0>iverilog mcu0mb.v -o mcu0mb

D:\Dropbox\Public\web\co2\code\mcu0>vvp mcu0mb
WARNING: mcu0mb.v:13: $readmemh(mcu0m.hex): Not enough words in the file for the
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
   0ns PC=xxxx IR=xxxx, SW=0000, A=    x mdr=zzzz
  50ns PC=0000 IR=xxxx, SW=0000, A=    x mdr=zzzz
  70ns PC=0000 IR=0016, SW=0000, A=    x mdr=zzzz
  90ns PC=0000 IR=0016, SW=0000, A=    0 mdr=zzzz
 110ns PC=0002 IR=0016, SW=0000, A=    0 mdr=zzzz
 130ns PC=0002 IR=401a, SW=0000, A=    0 mdr=zzzz
 150ns PC=0002 IR=401a, SW=8000, A=    0 mdr=zzzz
 170ns PC=0004 IR=401a, SW=8000, A=    0 mdr=zzzz
 190ns PC=0004 IR=5012, SW=8000, A=    0 mdr=zzzz
 210ns PC=0006 IR=5012, SW=8000, A=    0 mdr=zzzz
 230ns PC=0006 IR=1018, SW=8000, A=    0 mdr=zzzz
 250ns PC=0006 IR=1018, SW=8000, A=    1 mdr=zzzz
 270ns PC=0008 IR=1018, SW=8000, A=    1 mdr=zzzz
 290ns PC=0008 IR=3016, SW=8000, A=    1 mdr=0001
write 0001 to addr=016
 310ns PC=000a IR=3016, SW=8000, A=    1 mdr=zzzz
 330ns PC=000a IR=0014, SW=8000, A=    1 mdr=zzzz
 350ns PC=000a IR=0014, SW=8000, A=    0 mdr=zzzz
 370ns PC=000c IR=0014, SW=8000, A=    0 mdr=zzzz
 390ns PC=000c IR=1016, SW=8000, A=    0 mdr=zzzz
 410ns PC=000c IR=1016, SW=8000, A=    1 mdr=zzzz
 430ns PC=000e IR=1016, SW=8000, A=    1 mdr=zzzz
 450ns PC=000e IR=3014, SW=8000, A=    1 mdr=0001
write 0001 to addr=014
 470ns PC=0010 IR=3014, SW=8000, A=    1 mdr=zzzz
 490ns PC=0010 IR=2000, SW=8000, A=    1 mdr=zzzz
 510ns PC=0000 IR=2000, SW=8000, A=    1 mdr=zzzz
 530ns PC=0000 IR=0016, SW=8000, A=    1 mdr=zzzz
 550ns PC=0000 IR=0016, SW=8000, A=    1 mdr=zzzz
 570ns PC=0002 IR=0016, SW=8000, A=    1 mdr=zzzz
 590ns PC=0002 IR=401a, SW=8000, A=    1 mdr=zzzz
 610ns PC=0002 IR=401a, SW=8000, A=    1 mdr=zzzz
 630ns PC=0004 IR=401a, SW=8000, A=    1 mdr=zzzz
 650ns PC=0004 IR=5012, SW=8000, A=    1 mdr=zzzz
 670ns PC=0006 IR=5012, SW=8000, A=    1 mdr=zzzz
 690ns PC=0006 IR=1018, SW=8000, A=    1 mdr=zzzz
 710ns PC=0006 IR=1018, SW=8000, A=    2 mdr=zzzz
 730ns PC=0008 IR=1018, SW=8000, A=    2 mdr=zzzz
 750ns PC=0008 IR=3016, SW=8000, A=    2 mdr=0002
write 0002 to addr=016
 770ns PC=000a IR=3016, SW=8000, A=    2 mdr=zzzz
 790ns PC=000a IR=0014, SW=8000, A=    2 mdr=zzzz
 810ns PC=000a IR=0014, SW=8000, A=    1 mdr=zzzz
 830ns PC=000c IR=0014, SW=8000, A=    1 mdr=zzzz
 850ns PC=000c IR=1016, SW=8000, A=    1 mdr=zzzz
 870ns PC=000c IR=1016, SW=8000, A=    3 mdr=zzzz
 890ns PC=000e IR=1016, SW=8000, A=    3 mdr=zzzz
 910ns PC=000e IR=3014, SW=8000, A=    3 mdr=0003
write 0003 to addr=014
 930ns PC=0010 IR=3014, SW=8000, A=    3 mdr=zzzz
 950ns PC=0010 IR=2000, SW=8000, A=    3 mdr=zzzz
 970ns PC=0000 IR=2000, SW=8000, A=    3 mdr=zzzz
 990ns PC=0000 IR=0016, SW=8000, A=    3 mdr=zzzz
1010ns PC=0000 IR=0016, SW=8000, A=    2 mdr=zzzz
1030ns PC=0002 IR=0016, SW=8000, A=    2 mdr=zzzz
1050ns PC=0002 IR=401a, SW=8000, A=    2 mdr=zzzz
1070ns PC=0002 IR=401a, SW=8000, A=    2 mdr=zzzz
1090ns PC=0004 IR=401a, SW=8000, A=    2 mdr=zzzz
1110ns PC=0004 IR=5012, SW=8000, A=    2 mdr=zzzz
1130ns PC=0006 IR=5012, SW=8000, A=    2 mdr=zzzz
1150ns PC=0006 IR=1018, SW=8000, A=    2 mdr=zzzz
1170ns PC=0006 IR=1018, SW=8000, A=    3 mdr=zzzz
1190ns PC=0008 IR=1018, SW=8000, A=    3 mdr=zzzz
1210ns PC=0008 IR=3016, SW=8000, A=    3 mdr=0003
write 0003 to addr=016
1230ns PC=000a IR=3016, SW=8000, A=    3 mdr=zzzz
1250ns PC=000a IR=0014, SW=8000, A=    3 mdr=zzzz
1270ns PC=000a IR=0014, SW=8000, A=    3 mdr=zzzz
1290ns PC=000c IR=0014, SW=8000, A=    3 mdr=zzzz
1310ns PC=000c IR=1016, SW=8000, A=    3 mdr=zzzz
1330ns PC=000c IR=1016, SW=8000, A=    6 mdr=zzzz
1350ns PC=000e IR=1016, SW=8000, A=    6 mdr=zzzz
1370ns PC=000e IR=3014, SW=8000, A=    6 mdr=0006
write 0006 to addr=014
1390ns PC=0010 IR=3014, SW=8000, A=    6 mdr=zzzz
1410ns PC=0010 IR=2000, SW=8000, A=    6 mdr=zzzz
1430ns PC=0000 IR=2000, SW=8000, A=    6 mdr=zzzz
1450ns PC=0000 IR=0016, SW=8000, A=    6 mdr=zzzz
1470ns PC=0000 IR=0016, SW=8000, A=    3 mdr=zzzz
1490ns PC=0002 IR=0016, SW=8000, A=    3 mdr=zzzz
1510ns PC=0002 IR=401a, SW=8000, A=    3 mdr=zzzz
1530ns PC=0002 IR=401a, SW=8000, A=    3 mdr=zzzz
1550ns PC=0004 IR=401a, SW=8000, A=    3 mdr=zzzz
1570ns PC=0004 IR=5012, SW=8000, A=    3 mdr=zzzz
1590ns PC=0006 IR=5012, SW=8000, A=    3 mdr=zzzz
1610ns PC=0006 IR=1018, SW=8000, A=    3 mdr=zzzz
1630ns PC=0006 IR=1018, SW=8000, A=    4 mdr=zzzz
1650ns PC=0008 IR=1018, SW=8000, A=    4 mdr=zzzz
1670ns PC=0008 IR=3016, SW=8000, A=    4 mdr=0004
write 0004 to addr=016
1690ns PC=000a IR=3016, SW=8000, A=    4 mdr=zzzz
1710ns PC=000a IR=0014, SW=8000, A=    4 mdr=zzzz
1730ns PC=000a IR=0014, SW=8000, A=    6 mdr=zzzz
1750ns PC=000c IR=0014, SW=8000, A=    6 mdr=zzzz
1770ns PC=000c IR=1016, SW=8000, A=    6 mdr=zzzz
1790ns PC=000c IR=1016, SW=8000, A=   10 mdr=zzzz
1810ns PC=000e IR=1016, SW=8000, A=   10 mdr=zzzz
1830ns PC=000e IR=3014, SW=8000, A=   10 mdr=000a
write 000a to addr=014
1850ns PC=0010 IR=3014, SW=8000, A=   10 mdr=zzzz
1870ns PC=0010 IR=2000, SW=8000, A=   10 mdr=zzzz
1890ns PC=0000 IR=2000, SW=8000, A=   10 mdr=zzzz
1910ns PC=0000 IR=0016, SW=8000, A=   10 mdr=zzzz
1930ns PC=0000 IR=0016, SW=8000, A=    4 mdr=zzzz
1950ns PC=0002 IR=0016, SW=8000, A=    4 mdr=zzzz
1970ns PC=0002 IR=401a, SW=8000, A=    4 mdr=zzzz
1990ns PC=0002 IR=401a, SW=8000, A=    4 mdr=zzzz
2010ns PC=0004 IR=401a, SW=8000, A=    4 mdr=zzzz
2030ns PC=0004 IR=5012, SW=8000, A=    4 mdr=zzzz
2050ns PC=0006 IR=5012, SW=8000, A=    4 mdr=zzzz
2070ns PC=0006 IR=1018, SW=8000, A=    4 mdr=zzzz
2090ns PC=0006 IR=1018, SW=8000, A=    5 mdr=zzzz
2110ns PC=0008 IR=1018, SW=8000, A=    5 mdr=zzzz
2130ns PC=0008 IR=3016, SW=8000, A=    5 mdr=0005
write 0005 to addr=016
2150ns PC=000a IR=3016, SW=8000, A=    5 mdr=zzzz
2170ns PC=000a IR=0014, SW=8000, A=    5 mdr=zzzz
2190ns PC=000a IR=0014, SW=8000, A=   10 mdr=zzzz
2210ns PC=000c IR=0014, SW=8000, A=   10 mdr=zzzz
2230ns PC=000c IR=1016, SW=8000, A=   10 mdr=zzzz
2250ns PC=000c IR=1016, SW=8000, A=   15 mdr=zzzz
2270ns PC=000e IR=1016, SW=8000, A=   15 mdr=zzzz
2290ns PC=000e IR=3014, SW=8000, A=   15 mdr=000f
write 000f to addr=014
2310ns PC=0010 IR=3014, SW=8000, A=   15 mdr=zzzz
2330ns PC=0010 IR=2000, SW=8000, A=   15 mdr=zzzz
2350ns PC=0000 IR=2000, SW=8000, A=   15 mdr=zzzz
2370ns PC=0000 IR=0016, SW=8000, A=   15 mdr=zzzz
2390ns PC=0000 IR=0016, SW=8000, A=    5 mdr=zzzz
2410ns PC=0002 IR=0016, SW=8000, A=    5 mdr=zzzz
2430ns PC=0002 IR=401a, SW=8000, A=    5 mdr=zzzz
2450ns PC=0002 IR=401a, SW=8000, A=    5 mdr=zzzz
2470ns PC=0004 IR=401a, SW=8000, A=    5 mdr=zzzz
2490ns PC=0004 IR=5012, SW=8000, A=    5 mdr=zzzz
2510ns PC=0006 IR=5012, SW=8000, A=    5 mdr=zzzz
2530ns PC=0006 IR=1018, SW=8000, A=    5 mdr=zzzz
2550ns PC=0006 IR=1018, SW=8000, A=    6 mdr=zzzz
2570ns PC=0008 IR=1018, SW=8000, A=    6 mdr=zzzz
2590ns PC=0008 IR=3016, SW=8000, A=    6 mdr=0006
write 0006 to addr=016
2610ns PC=000a IR=3016, SW=8000, A=    6 mdr=zzzz
2630ns PC=000a IR=0014, SW=8000, A=    6 mdr=zzzz
2650ns PC=000a IR=0014, SW=8000, A=   15 mdr=zzzz
2670ns PC=000c IR=0014, SW=8000, A=   15 mdr=zzzz
2690ns PC=000c IR=1016, SW=8000, A=   15 mdr=zzzz
2710ns PC=000c IR=1016, SW=8000, A=   21 mdr=zzzz
2730ns PC=000e IR=1016, SW=8000, A=   21 mdr=zzzz
2750ns PC=000e IR=3014, SW=8000, A=   21 mdr=0015
write 0015 to addr=014
2770ns PC=0010 IR=3014, SW=8000, A=   21 mdr=zzzz
2790ns PC=0010 IR=2000, SW=8000, A=   21 mdr=zzzz
2810ns PC=0000 IR=2000, SW=8000, A=   21 mdr=zzzz
2830ns PC=0000 IR=0016, SW=8000, A=   21 mdr=zzzz
2850ns PC=0000 IR=0016, SW=8000, A=    6 mdr=zzzz
2870ns PC=0002 IR=0016, SW=8000, A=    6 mdr=zzzz
2890ns PC=0002 IR=401a, SW=8000, A=    6 mdr=zzzz
2910ns PC=0002 IR=401a, SW=8000, A=    6 mdr=zzzz
2930ns PC=0004 IR=401a, SW=8000, A=    6 mdr=zzzz
2950ns PC=0004 IR=5012, SW=8000, A=    6 mdr=zzzz
2970ns PC=0006 IR=5012, SW=8000, A=    6 mdr=zzzz
2990ns PC=0006 IR=1018, SW=8000, A=    6 mdr=zzzz
3010ns PC=0006 IR=1018, SW=8000, A=    7 mdr=zzzz
3030ns PC=0008 IR=1018, SW=8000, A=    7 mdr=zzzz
3050ns PC=0008 IR=3016, SW=8000, A=    7 mdr=0007
write 0007 to addr=016
3070ns PC=000a IR=3016, SW=8000, A=    7 mdr=zzzz
3090ns PC=000a IR=0014, SW=8000, A=    7 mdr=zzzz
3110ns PC=000a IR=0014, SW=8000, A=   21 mdr=zzzz
3130ns PC=000c IR=0014, SW=8000, A=   21 mdr=zzzz
3150ns PC=000c IR=1016, SW=8000, A=   21 mdr=zzzz
3170ns PC=000c IR=1016, SW=8000, A=   28 mdr=zzzz
3190ns PC=000e IR=1016, SW=8000, A=   28 mdr=zzzz
3210ns PC=000e IR=3014, SW=8000, A=   28 mdr=001c
write 001c to addr=014
3230ns PC=0010 IR=3014, SW=8000, A=   28 mdr=zzzz
3250ns PC=0010 IR=2000, SW=8000, A=   28 mdr=zzzz
3270ns PC=0000 IR=2000, SW=8000, A=   28 mdr=zzzz
3290ns PC=0000 IR=0016, SW=8000, A=   28 mdr=zzzz
3310ns PC=0000 IR=0016, SW=8000, A=    7 mdr=zzzz
3330ns PC=0002 IR=0016, SW=8000, A=    7 mdr=zzzz
3350ns PC=0002 IR=401a, SW=8000, A=    7 mdr=zzzz
3370ns PC=0002 IR=401a, SW=8000, A=    7 mdr=zzzz
3390ns PC=0004 IR=401a, SW=8000, A=    7 mdr=zzzz
3410ns PC=0004 IR=5012, SW=8000, A=    7 mdr=zzzz
3430ns PC=0006 IR=5012, SW=8000, A=    7 mdr=zzzz
3450ns PC=0006 IR=1018, SW=8000, A=    7 mdr=zzzz
3470ns PC=0006 IR=1018, SW=8000, A=    8 mdr=zzzz
3490ns PC=0008 IR=1018, SW=8000, A=    8 mdr=zzzz
3510ns PC=0008 IR=3016, SW=8000, A=    8 mdr=0008
write 0008 to addr=016
3530ns PC=000a IR=3016, SW=8000, A=    8 mdr=zzzz
3550ns PC=000a IR=0014, SW=8000, A=    8 mdr=zzzz
3570ns PC=000a IR=0014, SW=8000, A=   28 mdr=zzzz
3590ns PC=000c IR=0014, SW=8000, A=   28 mdr=zzzz
3610ns PC=000c IR=1016, SW=8000, A=   28 mdr=zzzz
3630ns PC=000c IR=1016, SW=8000, A=   36 mdr=zzzz
3650ns PC=000e IR=1016, SW=8000, A=   36 mdr=zzzz
3670ns PC=000e IR=3014, SW=8000, A=   36 mdr=0024
write 0024 to addr=014
3690ns PC=0010 IR=3014, SW=8000, A=   36 mdr=zzzz
3710ns PC=0010 IR=2000, SW=8000, A=   36 mdr=zzzz
3730ns PC=0000 IR=2000, SW=8000, A=   36 mdr=zzzz
3750ns PC=0000 IR=0016, SW=8000, A=   36 mdr=zzzz
3770ns PC=0000 IR=0016, SW=8000, A=    8 mdr=zzzz
3790ns PC=0002 IR=0016, SW=8000, A=    8 mdr=zzzz
3810ns PC=0002 IR=401a, SW=8000, A=    8 mdr=zzzz
3830ns PC=0002 IR=401a, SW=8000, A=    8 mdr=zzzz
3850ns PC=0004 IR=401a, SW=8000, A=    8 mdr=zzzz
3870ns PC=0004 IR=5012, SW=8000, A=    8 mdr=zzzz
3890ns PC=0006 IR=5012, SW=8000, A=    8 mdr=zzzz
3910ns PC=0006 IR=1018, SW=8000, A=    8 mdr=zzzz
3930ns PC=0006 IR=1018, SW=8000, A=    9 mdr=zzzz
3950ns PC=0008 IR=1018, SW=8000, A=    9 mdr=zzzz
3970ns PC=0008 IR=3016, SW=8000, A=    9 mdr=0009
write 0009 to addr=016
3990ns PC=000a IR=3016, SW=8000, A=    9 mdr=zzzz
4010ns PC=000a IR=0014, SW=8000, A=    9 mdr=zzzz
4030ns PC=000a IR=0014, SW=8000, A=   36 mdr=zzzz
4050ns PC=000c IR=0014, SW=8000, A=   36 mdr=zzzz
4070ns PC=000c IR=1016, SW=8000, A=   36 mdr=zzzz
4090ns PC=000c IR=1016, SW=8000, A=   45 mdr=zzzz
4110ns PC=000e IR=1016, SW=8000, A=   45 mdr=zzzz
4130ns PC=000e IR=3014, SW=8000, A=   45 mdr=002d
write 002d to addr=014
4150ns PC=0010 IR=3014, SW=8000, A=   45 mdr=zzzz
4170ns PC=0010 IR=2000, SW=8000, A=   45 mdr=zzzz
4190ns PC=0000 IR=2000, SW=8000, A=   45 mdr=zzzz
4210ns PC=0000 IR=0016, SW=8000, A=   45 mdr=zzzz
4230ns PC=0000 IR=0016, SW=8000, A=    9 mdr=zzzz
4250ns PC=0002 IR=0016, SW=8000, A=    9 mdr=zzzz
4270ns PC=0002 IR=401a, SW=8000, A=    9 mdr=zzzz
4290ns PC=0002 IR=401a, SW=8000, A=    9 mdr=zzzz
4310ns PC=0004 IR=401a, SW=8000, A=    9 mdr=zzzz
4330ns PC=0004 IR=5012, SW=8000, A=    9 mdr=zzzz
4350ns PC=0006 IR=5012, SW=8000, A=    9 mdr=zzzz
4370ns PC=0006 IR=1018, SW=8000, A=    9 mdr=zzzz
4390ns PC=0006 IR=1018, SW=8000, A=   10 mdr=zzzz
4410ns PC=0008 IR=1018, SW=8000, A=   10 mdr=zzzz
4430ns PC=0008 IR=3016, SW=8000, A=   10 mdr=000a
write 000a to addr=016
4450ns PC=000a IR=3016, SW=8000, A=   10 mdr=zzzz
4470ns PC=000a IR=0014, SW=8000, A=   10 mdr=zzzz
4490ns PC=000a IR=0014, SW=8000, A=   45 mdr=zzzz
4510ns PC=000c IR=0014, SW=8000, A=   45 mdr=zzzz
4530ns PC=000c IR=1016, SW=8000, A=   45 mdr=zzzz
4550ns PC=000c IR=1016, SW=8000, A=   55 mdr=zzzz
4570ns PC=000e IR=1016, SW=8000, A=   55 mdr=zzzz
4590ns PC=000e IR=3014, SW=8000, A=   55 mdr=0037
write 0037 to addr=014
4610ns PC=0010 IR=3014, SW=8000, A=   55 mdr=zzzz
4630ns PC=0010 IR=2000, SW=8000, A=   55 mdr=zzzz
4650ns PC=0000 IR=2000, SW=8000, A=   55 mdr=zzzz
4670ns PC=0000 IR=0016, SW=8000, A=   55 mdr=zzzz
4690ns PC=0000 IR=0016, SW=8000, A=   10 mdr=zzzz
4710ns PC=0002 IR=0016, SW=8000, A=   10 mdr=zzzz
4730ns PC=0002 IR=401a, SW=8000, A=   10 mdr=zzzz
4750ns PC=0002 IR=401a, SW=4000, A=   10 mdr=zzzz
4770ns PC=0004 IR=401a, SW=4000, A=   10 mdr=zzzz
4790ns PC=0004 IR=5012, SW=4000, A=   10 mdr=zzzz
4810ns PC=0012 IR=5012, SW=4000, A=   10 mdr=zzzz
4830ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4850ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4870ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4890ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4910ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4930ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4950ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4970ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
4990ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
5010ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
5030ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
5050ns PC=0012 IR=2012, SW=4000, A=   10 mdr=zzzz
```

### 結語

在這個版本中，我們除了採用多週期的模式之外，還加入了重置 (reset) 的功能，並且把原本內嵌在 MCU0 內部的記憶體給獨立了出來，讓記憶體成為一個單獨的模組。


