## MCU0 指令集

MCU0 是一顆 16 位元的 CPU，所有暫存器都是 16 位元的，總共有 (IR, SP, LR, SW, PC, A) 等暫存器，如下所示：

```
`define A    R[0]      // 累積器
`define LR   R[1]      // 狀態暫存器
`define SW   R[2]      // 狀態暫存器
`define SP   R[3]      // 堆疊暫存器
`define PC   R[4]      // 程式計數器
```

這些暫存器的功能與說明如下：

暫存器名稱    功能          說明
-----------   ----------    --------------------------------------------------------------------------------------
IR            指令暫存器    用來儲存從記憶體載入的機器碼指令
A =R[0]       累積器        用來儲存計算的結果，像是加減法的結果。
LR=R[1]       連結暫存器    用來儲存函數呼叫的返回位址
SW=R[2]       狀態暫存器    用來儲存 CMP 比較指令的結果旗標，像是負旗標 N 與零旗標 Z 等。作為條件跳躍 JEQ 等指令是否跳躍的判斷依據。
SP=R[3]       堆疊暫存器    堆疊指標，PUSH, POP 指令會用到。
PC=R[4]       程式計數器    用來儲存指令的位址 (也就是目前執行到哪個指令的記憶體位址)

MCU0 的指令暫存器 IR 的前 4 個位元是指令代碼 OP，由於 4 位元只能表達 16 種指令，這數量太少不敷使用，因此當 OP=0xF 時，
我們繼續用後面的位元作為延伸代碼，以便有更多的指令可以使用，以下是 MCU0 微控制器的完整指令表。

代碼 名稱       格式                 說明              語意
---- ------     --------             ------------      ----------------
0    LD         LD  C                載入              A = [C]
1    ST         ST  C                儲存              [C] = A
2    ADD        ADD C                加法              A = A + [C]
3    SUB        SUB C                減法              A = A - [C]
4    MUL        MUL C                乘法              A = A * [C]
5    DIV        DIV C                除法              A = A / [C]
6    AND        AND C                位元 AND 運算     A = A & [C]
7    OR         OR  C                位元 OR  運算     A = A | [C]
8    XOR        XOR C                位元 XOR 運算     A = A ^ [C]
9    CMP        CMP C                比較              SW = A CMP [C] ; N=(A<[C]), Z=(A==[C])
A    JMP        JMP C                跳躍              PC = C
B    JEQ        JEQ C                相等時跳躍        if Z then PC = C
C    JLT        JLT C                小於時跳躍        if N then PC = C
D    JLE        JLE C                小於或等於時跳躍  if Z or N then PC = C
E    CALL       CALL C               呼叫副程式        LR=PC; PC = C
F    OP8                             OP為8位元的運算
F0   LDI        LDI Ra,C4            載入常數          Ra=C4
F2   MOV        MOV Ra,Rb            暫存器移動        Ra=Rb
F3   PUSH       PUSH Ra              堆疊推入          SP--; [SP] = Ra
F4   POP        POP  Ra              堆疊取出          Ra=[SP]; SP++;
F5   SHL        SHL Ra,C4            左移              Ra = Ra << C4
F6   SHR        SHL Ra,C4            右移              Ra = Ra >> C4
F7   ADDI       ADDI Ra,C4           常數加法          Ra = Ra + C4
F8   SUBI       SUBI Ra,C4           常數減法          Ra = Ra - C4
F9   NEG        NEG Ra               反相              Ra = ~Ra
FA   SWI        SWI C                軟體中斷          BIOS 中斷呼叫
FD   NSW        NSW                  狀態反相          N=~N, Z=~Z; 由於沒有 JGE, JGT, JNE，因此可用此指令將 SW 反相，再用 JLE, JLT, JEQ 完成跳躍動作
FE   RET        RET                  返回              PC = LR
FF   IRET       IRET                 從中斷返回        PC = LR; I=0;

