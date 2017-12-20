# 期末考模擬試題

1: 給你下列元件，請設計出 RAM8, 先畫電路圖，然後寫出 HackHDL 程式。

```
CHIP Register {
    IN in[16], load;
    OUT out[16];
}

CHIP Mux8Way16 {
    IN a[16], b[16], c[16], d[16],
       e[16], f[16], g[16], h[16],
       sel[3];
    OUT out[16];
}

CHIP DMux8Way {
    IN in, sel[3];
    OUT a, b, c, d, e, f, g, h;
}
```

RAM8 的原型定義如下

```
CHIP RAM8 {
    IN in[16], load, address[3];
    OUT out[16];

    PARTS:
    // Put your code here:
}
```

2: 請將下列組合語言翻成二進位機器碼

```
@30
D=A
D;JLE
M=D+M
M=M-1
0;JMP
```

參考：

![](https://raw.githubusercontent.com/cccnqu/co106a/9423e9dc/cinstruction.png)

3: 請將下列演算法改寫為低階程式（沒有 while 迴圈，改用 goto)

```
p=16384
while (p<24576) {
  *p = -1
  p = p + 1
}
```

解答

```
    p = 16384
loop:
    if (p >= 24576) goto end
    *p = -1
    p = p + 1
    goto loop
end:
```

4: 請將上述低階程式改寫為 HackCPU 的組合語言

解答:

```
// p = 16384
@16384
D=A
@p
M=D
// loop:
(loop)
// if (p >= 24576) goto end
@p
D=M
@24576
D=D-A
@end
D;JGE
// *p = -1
@p           
A=M          // 把 p 的內容當成地址 (提取到 A)
M=-1         // 把那個內容 (*p) 當成地址，然後將 -1 存入那個地址的記憶體當中。
// p = p + 1
@p
M=M+1
// goto loop
@loop
0;JMP
// end:
(end)
// 以下為無窮迴圈，避免程式執行到後面導致亂跑。
@end
0;JMP
```

5: 請寫出下列 HackCPU 控制電路中指定項目的布林式

![](https://raw.githubusercontent.com/cccnqu/co106a/9423e9dc/hackcpu.png)

6: 請說明下列指令在 HackCPU 中執行時，那些指定項目布林式的值會是什麼，這會如何影響資料的流動與計算。
* M=D+1    // 其中 D 的值目前為 3
* D;JLE    // 其中 D 的值目前為 0 

