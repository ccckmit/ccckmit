## 浮點數運算

### 浮點運算單元 FALU

```verilog
// 輸入 a, b 後會執行 op 所指定的運算，然後將結果放在暫存器 y 當中
module falu(input [63:0] ia, input [63:0] ib, input [1:0] op, output reg [63:0] oy);
real a, b, y;

always @(a or b or op) begin
  a = $bitstoreal(ia);
  b = $bitstoreal(ib); 
  case (op)
    2'b00: y = a + b;
    2'b01: y = a - b;
    2'b10: y = a * b;
    2'b11: y = a / b;
  endcase
  $display("falu32:op=%d a=%f b=%f y=%f", op, a, b, y);
  oy = $realtobits(y);
end
endmodule

module main;                // 測試程式開始
  reg  [63:0] a64, b64;
  wire [63:0] y64;
  reg  [1:0] op;
  real a, b;

  falu falu1(a64, b64, op, y64);     // 建立一個 alu 單元，名稱為 alu1

  initial begin              // 測試程式的初始化動作
    a = 3.14159;  a64 = $realtobits(a);
    b = 2.71818;  b64 = $realtobits(b);
	op = 0;
  end

  always #50 begin           // 每個 50 奈秒就作下列動作
    op = op + 1;             // 讓 op 的值加 1
  end

  initial #1000 $finish;      // 時間到 1000 奈秒就結束

endmodule
```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o flu64 flu64.v

D:\Dropbox\Public\web\oc\code>vvp flu64
falu32:op=0 a=3.141590 b=2.718180 y=5.859770
falu32:op=1 a=3.141590 b=2.718180 y=0.423410
falu32:op=2 a=3.141590 b=2.718180 y=8.539407
falu32:op=3 a=3.141590 b=2.718180 y=1.155770
falu32:op=0 a=3.141590 b=2.718180 y=5.859770
falu32:op=1 a=3.141590 b=2.718180 y=0.423410
falu32:op=2 a=3.141590 b=2.718180 y=8.539407
falu32:op=3 a=3.141590 b=2.718180 y=1.155770
falu32:op=0 a=3.141590 b=2.718180 y=5.859770
falu32:op=1 a=3.141590 b=2.718180 y=0.423410
falu32:op=2 a=3.141590 b=2.718180 y=8.539407
falu32:op=3 a=3.141590 b=2.718180 y=1.155770
falu32:op=0 a=3.141590 b=2.718180 y=5.859770
falu32:op=1 a=3.141590 b=2.718180 y=0.423410
falu32:op=2 a=3.141590 b=2.718180 y=8.539407
falu32:op=3 a=3.141590 b=2.718180 y=1.155770
falu32:op=0 a=3.141590 b=2.718180 y=5.859770
falu32:op=1 a=3.141590 b=2.718180 y=0.423410
falu32:op=2 a=3.141590 b=2.718180 y=8.539407
falu32:op=3 a=3.141590 b=2.718180 y=1.155770
```


### 使用 Verilog 預設的浮點數運算

檔案： float.v

```verilog
module main;
real x, y, x2, y2, xyadd, xysub, xymul, xydiv;
reg [63:0] x1, y1;

initial 
begin
  x=3.14159;
  y=-2.3e4;
  x1 = $realtobits(x);
  x2 = $bitstoreal(x1);
  y1 = $realtobits(y);
  y2 = $bitstoreal(y1);
  xyadd = x+y;
  xysub = x-y;
  xymul = x*y;
  xydiv = x/y;
  $display("x=%f x1=%b x2=%f", x, x1, x2);
  $display("y=%f y1=%b y2=%f", y, y1, y2);
  $display("x+y=%f xyadd=%f", x+y, xyadd);
  $display("x-y=%f xysub=%f", x-y, xysub);
  $display("x*y=%f xymul=%f", x*y, xymul);
  $display("x/y=%f xydiv=%f", x/y, xydiv);
end

endmodule
```

執行結果：

```
D:\Dropbox\Public\web\oc\code>iverilog -o float float.v

D:\Dropbox\Public\web\oc\code>vvp float
x=3.141590 x1=0100000000001001001000011111100111110000000110111000011001101110 x
2=3.141590
y=-23000.000000 y1=1100000011010110011101100000000000000000000000000000000000000
000 y2=-23000.000000
x+y=-22996.858410 xyadd=-22996.858410
x-y=23003.141590 xysub=23003.141590
x*y=-72256.570000 xymul=-72256.570000
x/y=-0.000137 xydiv=-0.000137
```

### 自行設計浮點運算器

```verilog
// https://instruct1.cit.cornell.edu/courses/ece576/StudentWork/ss868/fp/Reg27FP/FpMul.v
// https://instruct1.cit.cornell.edu/courses/ece576/StudentWork/ss868/fp/Reg27FP/FpAdd.v
// https://instruct1.cit.cornell.edu/courses/ece576/FloatingPoint/index.html#Schneider_fp

`define F_SIGN               63
`define F_EXP                62:52
`define F_FRAC               51:0

// a = (-1)^a.s (1+a.f) * 2 ^ {a.e-1023} 
// b = (-1)^b.s (1+b.f) * 2 ^ {b.e-1023} 
// a*b = (-1)^(a.s xor b.s) (1+a.f) (1+b.f) * 2^{ (a.e+b.e-1023) - 1023}
//       z.s = a.s xor b.s  z.f = tail(...)   z.e = a.e+b.e-1023
module fmul(input [63:0] a, input [63:0] b, output [63:0] z);
    wire        a_s = a[`F_SIGN];
    wire [10:0] a_e = a[`F_EXP];
    wire [51:0] a_f = a[`F_FRAC];
    wire        b_s = b[`F_SIGN];
    wire [10:0] b_e = b[`F_EXP];
    wire [51:0] b_f = b[`F_FRAC];

    wire   z_s = a_s ^ b_s;// 正負號 z.s = a.s xor b.s
    wire [105:0] f = {1'b1, a_f} * {1'b1, b_f};	// 小數部分： f = {1, a.f} * {1, b.f}
    wire [11:0]  e = a_e + b_e - 12'd1023; // 指數部份： e = a.e + b.e - 1023
    wire [51:0]  z_f = f[105] ? f[104:53] : f[103:52]; // 若最高位 f[105] == 1，則取 z.f[104:53]，否則取 z.f[103:52]
    wire [10:0]  z_e = f[105] ? e[10:0]+1 : e[10:0]; // 若最高位 f[105] == 1，則取 z.e 要上升 1 (???)，否則不變 
    wire underflow = a_e[10] & b_e[10] & ~z_e[10];  // underflow
    assign z = underflow ? 64'b0 : {z_s, z_e, z_f}; // 若 underflow，則傳回零，否則傳回 z={z.s, z.e, z.f}。
endmodule

module main;
real x, y, z;
reg [63:0] x1, y1;
wire [63:0] z1;

fmul f1(x1, y1, z1);

initial 
begin
//  x=7.00;  y=-9.00;
//  x=6.00;  y=8.00;
//  x=301.00;  y=200.00;
  x=1.75;  y=1.75;
  x1 = $realtobits(x);
  y1 = $realtobits(y);
  #100;
  $display("a.s=%b a.e=%b a.f=%b", f1.a_s, f1.a_e, f1.a_f);
  $display("a.s=%b b.e=%b b.f=%b", f1.b_s, f1.b_e, f1.b_f);
  $display("e=%b \nf=%b \nunderflow=%b", f1.e, f1.f, f1.underflow);
  $display("z.s=%b z.e=%b z.f=%b", f1.z_s, f1.z_e, f1.z_f);

  z = $bitstoreal(z1);
  $display("x=%f y=%f z=%f", x, y, z);
  $display("x1=%b \ny1=%b \nz1=%b", x1, y1, z1);
end

endmodule
```

執行結果

```
D:\Dropbox\Public\web\oc\code>iverilog -o fpu64 fpu64.v

D:\Dropbox\Public\web\oc\code>vvp fpu64
a.s=0 a.e=01111111111 a.f=1100000000000000000000000000000000000000000000000000
a.s=0 b.e=01111111111 b.f=1100000000000000000000000000000000000000000000000000
e=001111111111
f=110001000000000000000000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000
underflow=0
z.s=0 z.e=10000000000 z.f=1000100000000000000000000000000000000000000000000000
x=1.750000 y=1.750000 z=3.062500
x1=0011111111111100000000000000000000000000000000000000000000000000
y1=0011111111111100000000000000000000000000000000000000000000000000
z1=0100000000001000100000000000000000000000000000000000000000000000
```


### 參考文獻
* http://en.wikipedia.org/wiki/Single-precision_floating-point_format
* http://en.wikipedia.org/wiki/Double-precision_floating-point_format
