## CPU0 迷你版 - CPU0m

在本章中，我們將透過設計一顆只支援 4 個指令的超微小處理器 CPU0m (CPU0-Mini) 開始，來解說處理器的設計方式。

### 只有 4 個指令的處理器 - CPU0m

在此、我們將用最簡單的方式，在完全不考慮成本與實用性的情況之下，設計一個將記憶體嵌入處理器內部的 CPU，也就是整個記憶體都用 Verilog 內嵌在 CPU 理面。

我們從 CPU0 的指令集當中，挑出了以下的四個指令，以便寫出一個可以計算 1+2+.....+n+.... 的組合語言程式 
(喔！不、應該說是機器語言程式)，然後用 Verilog 實作一個可以執行這些指令的 CPU0m 處理器。

格式    指令        OP      說明              語法                  語意         
-----   ---------   ------  ---------------   --------------------  ------------ 
L       LD          00      載入word          LD  Ra, [Rb+Cx]       Ra=[Rb+Cx]   
L       ST          01      儲存word          ST  Ra, [Rb+Cx]       Ra=[Rb+Cx]   
A       ADD         13      加法              ADD Ra, Rb, Rc        Ra=Rb+Rc     
J       JMP         26      跳躍 (無條件)     JMP Cx                PC=PC+Cx     

然後，我們就可以用這幾個指令寫出以下的程式：

位址 機器碼    標記  組合語言            對照的 C 語言
---- --------- ----- ----------------    ----------------------------
0000 001F0018        LD   R1, K1         R1 = K1
0004 002F0010        LD   R2, K0         R2 = K0
0008 003F0014        LD   R3, SUM        R3 = SUM
000C 13221000  LOOP: ADD  R2, R2, R1     R2 = R2 + R1
0010 13332000        ADD  R3, R3, R2     R3 = R3 + R2
0014 26FFFFF4        JMP  LOOP           goto LOOP
0018 00000000  K0:   WORD 0              int K0=0
001C 00000001  K1:   WORD 1              int K1=1
0020 00000000  SUM:  WORD 0              int SUM=0

這個程式的行為模式，是會讓暫存器 R3 (對應到 SUM) 從 0, 1, 1+2, 1+2+3, .... 一路向上跑，而且是永無止境的無窮迴圈。
因此我們會看到 R3 的內容會是 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55 ... ，的情況。

透過 CPU0m ，讀者將可以開始瞭解一顆 CPU 的結構與設計方式，並且更清楚的理解 CPU 的控制單元之功能。


### 指令提取、解碼與執行

CPU0 在執行一個指令時，必須經過提取、解碼與執行等三大階段，以下是這三個階段的詳細步驟。

```
階段 (a)：提取階段
    動作1、提取指令      ：IR = m[PC]
    動作2、更新計數器    ：PC = PC + 4
階段 (b)：解碼階段
    動作3、解碼          ：將 IR 分解為 (運算代碼 op, 暫存器代號 ra, rb, rc, 常數 c5, c16, c24 等欄位)。
階段 (c)：執行階段
    動作4、執行          ：根據運算代碼 op，執行對應的動作。
```

執行階段的動作根據指令的類型而有所不同。舉例而言，假如執行的指令是 ADD R1, R2, R1，那麼執行階段所進行的動作如下：

格式    指令        OP      說明              語法                  執行動作
-----   ---------   ------  ---------------   --------------------  ---------------------------
L       LD          00      載入word          LD  Ra, [Rb+Cx]       R[ra] = m[rb+c16] (4byte)
L       ST          01      儲存word          ST  Ra, [Rb+Cx]       m[rb+c16] = R[ra] (4byte)
A       ADD         13      加法              ADD Ra, Rb, Rc        R[ra] = R[rb]+R[rc]
J       JMP         26      跳躍 (無條件)     JMP Cx                PC = PC+c24

### CPU0m 模組

以下就是我們所設計的 CPU0m 模組，以及測試的主程式，我們在程式中寫了詳細的說明，請讀者對照閱讀。

檔案：[CPU0m](https://dl.dropboxusercontent.com/u/101584453/pmag/201310/code/CPU0m.v)

```verilog
`define PC R[15] // 程式計數器 PC 其實是 R[15] 的別名

module CPU(input clock); // CPU0-Mini 的快取版：cpu0m 模組
  parameter [7:0] LD = 8'h00, ST=8'h01, ADD=8'h13, JMP=8'h26; // 支援 4 個指令
  reg signed [31:0] R [0:15];   // 宣告暫存器 R[0..15] 等 16 個 32 位元暫存器
  reg signed [31:0] IR;         // 指令暫存器 IR
  reg [7:0] m [0:128];          // 內部的快取記憶體
  reg [7:0] op;                 // 變數：運算代碼 op
  reg [3:0] ra, rb, rc;         // 變數：暫存器代號 ra, rb, rc
  reg signed [11:0] cx12;       // 變數：12 位元常數 cx12
  reg signed [15:0] cx16;       // 變數：16 位元常數 cx16
  reg signed [23:0] cx24;       // 變數：24 位元常數 cx24
  reg signed [31:0] addr;       // 變數：暫存記憶體位址

  initial  // 初始化
  begin
    `PC = 0;                    // 將 PC 設為起動位址 0
    R[0] = 0;                   // 將 R[0] 暫存器強制設定為 0
    {m[0],m[1],m[2],m[3]}    = 32'h001F0018; // 0000       LD   R1, K1
    {m[4],m[5],m[6],m[7]}    = 32'h002F0010; // 0004       LD   R2, K0
    {m[8],m[9],m[10],m[11]}  = 32'h003F0014; // 0008       LD   R3, SUM
    {m[12],m[13],m[14],m[15]}= 32'h13221000; // 000C LOOP: ADD  R2, R2, R1
    {m[16],m[17],m[18],m[19]}= 32'h13332000; // 0010       ADD  R3, R3, R2
    {m[20],m[21],m[22],m[23]}= 32'h26FFFFF4; // 0014       JMP  LOOP
    {m[24],m[25],m[26],m[27]}= 32'h00000000; // 0018 K0:   WORD 0
    {m[28],m[29],m[30],m[31]}= 32'h00000001; // 001C K1:   WORD 1
    {m[32],m[33],m[34],m[35]}= 32'h00000000; // 0020 SUM:  WORD 0
  end
  
  always @(posedge clock) begin // 在 clock 時脈的正邊緣時觸發
      IR = {m[`PC], m[`PC+1], m[`PC+2], m[`PC+3]};  // 指令擷取階段：IR=m[PC], 4 個 Byte 的記憶體
      `PC = `PC+4;                                  // 擷取完成，PC 前進到下一個指令位址
      {op,ra,rb,rc,cx12} = IR;                      // 解碼階段：將 IR 解為 {op, ra, rb, rc, cx12}
      cx24 = IR[23:0];                              //           解出 IR[23:0] 放入 cx24
      cx16 = IR[15:0];                              //           解出 IR[15:0] 放入 cx16
      addr = R[rb]+cx16;                              // 記憶體存取位址 = PC+cx16
      case (op) // 根據 OP 執行對應的動作
        LD: begin   // 載入指令： R[ra] = m[addr]
          R[ra] = {m[addr], m[addr+1], m[addr+2], m[addr+3]};
          $write("%4dns %8x : LD  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
          end
        ST: begin   // 儲存指令： m[addr] = R[ra]
          {m[addr], m[addr+1], m[addr+2], m[addr+3]} = R[ra];
          $write("%4dns %8x : ST  %x,%x,%-4x", $stime, `PC, ra, rb, cx16);
          end
        ADD: begin  // 加法指令： R[ra] = R[rb]+R[rc]
          R[ra] = R[rb]+R[rc];
          $write("%4dns %8x : ADD %x,%x,%-4x", $stime, `PC, ra, rb, rc);
          end
        JMP:begin   // 跳躍指令： PC = PC + cx24
          `PC = `PC + cx24; // 跳躍目標位址=PC+cx
          $write("%4dns %8x : JMP %-8x", $stime, `PC, cx24);
          end
      endcase
      $display(" R[%2d]=%4d", ra, R[ra]); // 顯示目標暫存器的值
  end
endmodule

module main;                // 測試程式開始
reg clock;                  // 時脈 clock 變數

cpu cpu0m(clock);          // 宣告 cpu0m 處理器

initial clock = 0;          // 一開始 clock 設定為 0
always #10 clock=~clock;    // 每隔 10 奈秒將 clock 反相，產生週期為 20 奈秒的時脈
initial #640 $finish;       // 在 640 奈秒的時候停止測試。(因為這時的 R[1] 恰好是 1+2+...+10=55 的結果)
endmodule
```

### 測試結果

上述程式使用 icarus 測試與執行的結果如下所示。


```
D:\Dropbox\Public\web\oc\code>iverilog -o cpu0m cpu0m.v

D:\Dropbox\Public\web\oc\code>vvp cpu0m
  10ns 00000004 : LD  1,f,0018 R[ 1]=   1
  30ns 00000008 : LD  2,f,0010 R[ 2]=   0
  50ns 0000000c : LD  3,f,0014 R[ 3]=   0
  70ns 00000010 : ADD 2,2,1    R[ 2]=   1
  90ns 00000014 : ADD 3,3,2    R[ 3]=   1
 110ns 0000000c : JMP fffff4   R[15]=  12
 130ns 00000010 : ADD 2,2,1    R[ 2]=   2
 150ns 00000014 : ADD 3,3,2    R[ 3]=   3
 170ns 0000000c : JMP fffff4   R[15]=  12
 190ns 00000010 : ADD 2,2,1    R[ 2]=   3
 210ns 00000014 : ADD 3,3,2    R[ 3]=   6
 230ns 0000000c : JMP fffff4   R[15]=  12
 250ns 00000010 : ADD 2,2,1    R[ 2]=   4
 270ns 00000014 : ADD 3,3,2    R[ 3]=  10
 290ns 0000000c : JMP fffff4   R[15]=  12
 310ns 00000010 : ADD 2,2,1    R[ 2]=   5
 330ns 00000014 : ADD 3,3,2    R[ 3]=  15
 350ns 0000000c : JMP fffff4   R[15]=  12
 370ns 00000010 : ADD 2,2,1    R[ 2]=   6
 390ns 00000014 : ADD 3,3,2    R[ 3]=  21
 410ns 0000000c : JMP fffff4   R[15]=  12
 430ns 00000010 : ADD 2,2,1    R[ 2]=   7
 450ns 00000014 : ADD 3,3,2    R[ 3]=  28
 470ns 0000000c : JMP fffff4   R[15]=  12
 490ns 00000010 : ADD 2,2,1    R[ 2]=   8
 510ns 00000014 : ADD 3,3,2    R[ 3]=  36
 530ns 0000000c : JMP fffff4   R[15]=  12
 550ns 00000010 : ADD 2,2,1    R[ 2]=   9
 570ns 00000014 : ADD 3,3,2    R[ 3]=  45
 590ns 0000000c : JMP fffff4   R[15]=  12
 610ns 00000010 : ADD 2,2,1    R[ 2]=  10
 630ns 00000014 : ADD 3,3,2    R[ 3]=  55
```

從上述輸出訊息當中，您可以看到程式的執行是正確的，其中 R[2] 從 0, 1, 2, ..... 一路上數，
而 R[3] 則從 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55 一路累加上來，完成了我們想要的程式功能。
 
### 結語

其實、CPU0m 這樣的設計應該還不能稱之為快取，而是在程式不大的情況之下，將 SRAM 直接包入在 CPU 當中的一種作法，
這種作法的好處是記憶體存取速度很快，但相對的記憶體成本也很貴，因為這些記憶體是直接用靜態記憶體的方式內建在
CPU 當中的。

這種方式比較像 SOC 系統單晶片的做法，在程式很小的情況之下，直接將記憶體包入 SOC 當中，會得到比較高速的電路，
可惜的是這種做法不像目前的電腦架構一樣，是採用外掛 DRAM 的方式，可以大幅降低記憶體的成本，增大記憶體的容量
就是了。

