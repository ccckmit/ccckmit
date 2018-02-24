# 組譯器 - as0

在前面幾章，我們介紹了開放電腦計畫中的「處理器」 -- 包含 CPU0 的結構、指令集與編碼方式。
在本章中，我們將為 CPU0 設計一個組譯器 AS0，以便能更深入理解 CPU0 的結構，並瞭解
組譯器的設計原理。

## 組譯範例

讓我們先用範例導向的方式，先看看一個 CPU0 的組合語言程式，如下所示：

組合語言：sum.as0

```
        LD     R1, sum      ; R1 = sum = 0
        LD     R2, i        ; R2 = i = 1
        LDI    R3, 10       ; R3 = 10
FOR:    CMP    R2, R3       ; if (R2 > R3)
        JGT    EXIT         ;   goto EXIT
        ADD    R1, R1, R2   ; R1 = R1 + R2 (sum = sum + i)
        ADDI   R2, R2, 1    ; R2 = R2 + 1  ( i  = i + 1)
        JMP    FOR          ; goto FOR
EXIT:   ST     R1, sum      ; sum = R1
        ST     R2, i        ; i = R2
        LD     R9, msgptr   ; R9= pointer(msg) = &msg
        SWI    3            ; SWI 3 : print string &msg
        MOV    R9, R1       ; R9 = R1 = sum
        SWI    2            ; SWI 2 : print number sum
        RET                 ; return to CALLER
i:      RESW    1           ; int i
sum:    WORD    0           ; int sum=0
msg:    BYTE    "sum=", 0   ; char *msg = "sum="
msgptr: WORD    msg         ; char &msgptr = &msg
```

上述程式是一個可以計算 1+2+....+10 之結果的程式，最後會透過軟體中斷 (SWI, Software Interrupt) 的方式，印出訊息到螢幕畫面上，以下是利用我們寫的組譯器 AS0 對上述程式進行組譯的過程：

由於 CPU0 設計得很簡單，因此對於一般的指令而言(像是 ADD, MOV, RET 等)，編制出機器碼是很容易的，例如
RET 指令不包含任何參數，因此其機器碼就是在指令碼 OP=2C 後面補 0，直到填滿 32bit (8 個 16 進位數字) 為止，而 ADD R1,R1,R2 的編碼也很容易，就是將指令碼 OP=13 補上暫存器代號 1, 1, 2 之後再補 0，形成 13112000 
的編碼。

最難處理的是有標記的指令，舉例而言，像是 JGT EXIT 的機器碼 2300000C 與 JMP FOR 的機器碼 26FFFFEC 是怎麼來的呢？

關於這點，我們必須用較長的篇幅解釋一下：

在上述 AS0 程式的設計當中，我們一律用「相對於程式計數器 PC 的定址法」來進行標記的編碼 (cx = label.address-PC)，
例如在 JGT EXIT 這個指令中，由於標記 EXIT 的位址是 0020 ，而 JGT EXIT 指令的位址為 0010，因此兩者之差距為 
0010，但是由於 JGT EXIT 指令執行時其程式計數器 PC 已經進到下一個位址 (0014) 了(在指令擷取階段完成後就會進到下一個位址)，
所以 PC 與 FOR 標記之間的位址差距為 (cx = label.address-PC= 0020-0014 = 000C) (請注意這是用 16 進位的減法)，
因此整個 JGT EXIT 指令就被組譯為 JGT EXIT = JGT R15+cx = 23 F 000C。 
(其中 R15 是 CPU0 的程式計數器 PC，所以暫存器 Ra 部分編為 15 的十六進位值 F)。

但是、有時候相對定址若是負值，也就是標記在指令的前面，像是 JMP FOR 的情況時，最後 cx = label.address-PC 計算出來會是負值，此時就必須採用 2 補數表示法，例如 JMP FOR 的情況 (cx = label.address-PC = 000C-0020 = -0014) (請注意這是用 16 進位的減法)，
採用 2 補數之後就會變成 FFFFEC，因此 JMP FOR 被編為 26 F FFFEC。

## 結語

現在、我們已經完成了組譯器 AS0 的設計，並解析了整個組譯器的原始碼，希望透過這種方式，可以讓讀者瞭解
整個組譯器的設計過程。在後續的文章之中，我們還會介紹開放電腦計畫中「虛擬機、編譯器」的 JavaScript 原始碼，以及實作 CPU0 處理器的 Verilog 原始碼。然後再進入作業系統的設計部分，希望透過這種方式，可以讓讀者瞭解如何「自己動手設計一台電腦」，完成「開放電腦計畫」的主要目標。

