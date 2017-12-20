# 習題作業

提示： [計算機結構 (習題：Nand2tetris硬體部分) (SlideShare)](https://www.slideshare.net/ccckmit/nand2tetris-79925285)

## 第 1 週習題 (2017/09/14)

http://www.nand2tetris.org/01.php

```
Not	Not gate	Not.tst	Not.cmp
And	And gate	And.tst	And.cmp
Or	Or gate	Or.tst	Or.cmp
Xor	Xor gate	Xor.tst	Xor.cmp
Mux	Mux gate	Mux.tst	Mux.cmp
DMux	DMux gate	DMux.tst	DMux.cmp
```

## 第 2 週習題 (2017/09/21)

http://www.nand2tetris.org/01.php

```
Not16	16-bit Not	Not16.tst	Not16.cmp
And16	16-bit And	And16.tst	And16.cmp
Or16	16-bit Or	Or16.tst	Or16.cmp
Mux16	16-bit multiplexor	Mux16.tst	Mux16.cmp
Or8Way	Or(in0,in1,...,in7)	Or8Way.tst	Or8Way.cmp
Mux4Way16	16-bit/4-way mux	Mux4Way16.tst	Mux4Way16.cmp
Mux8Way16	16-bit/8-way mux	Mux8Way16.tst	Mux8Way16.cmp
DMux4Way	4-way demultiplexor	DMux4Way.tst	DMux4Way.cmp
DMux8Way	8-way demultiplexor	DMux8Way.tst	DMux8Way.cmp
```

## 第 3 週習題 (2017/09/28)

http://www.nand2tetris.org/02.php

```
HalfAdder	Half Adder	HalfAdder.tst	HalfAdder.cmp
FullAdder	Full Adder	FullAdder.tst	FullAdder.cmp
Add16	16-bit Adder	Add16.tst	Add16.cmp
Inc16	16-bit incrementer	Inc16.tst	Inc16.cmp
```

## 第 4 週習題 (2017/10/05)

http://www.nand2tetris.org/02.php

```
ALU	Arithmetic Logic Unit (without handling of status outputs)	ALU-nostat.tst	ALU-nostat.cmp
ALU	Arithmetic Logic Unit (complete)	ALU.tst	ALU.cmp
```

## 第 5 週習題 (2017/10/12)

http://www.nand2tetris.org/03.php

```
DFF	Data Flip-Flop (primitive)		
Bit	1-bit register	Bit.tst	Bit.cmp
Register	16-bit register	Register.tst	Register.cmp
```

## 第 6 週習題 (2017/10/19)

http://www.nand2tetris.org/03.php

```
RAM8	16-bit / 8-register memory	RAM8.tst	RAM8.cmp
RAM64	16-bit / 64-register memory	RAM64.tst	RAM64.cmp
RAM512	16-bit / 512-register memory	RAM512.tst	RAM512.cmp
RAM4K	16-bit / 4096-register memory	RAM4K.tst	RAM4K.cmp
RAM16K	16-bit / 16384-register memory	RAM16K.tst	RAM16K.cmp
```

## 第 7 週習題 (2017/10/26)

http://www.nand2tetris.org/03.php

```
PC	16-bit program counter	PC.tst	PC.cmp
```

## 第 8 週習題 (2017/11/02)

http://www.nand2tetris.org/04.php

```
Mult.asm
```

Multiplication: in the Hack computer, the top 16 RAM words (RAM[0] ... RAM[15]) are also referred to as the so-called virtual registers R0 ... R15. 

With this terminology in mind, this program computes the value R0*R1 and stores the result in R2.

Note that in the context of this program, we assume that R0>=0, R1>=0, and R0*R1<32768 (you are welcome to ponder where this limiting value comes from). Your program need not test these conditions, but rather assume that they hold.

## 第 9 週 (2017/11/09)

由於下週有些課程有期中考，因此不出習題，讓大家有時間念書！

## 第 10 週習題 (2017/11/16)

http://www.nand2tetris.org/04.php

```
Fill.asm
```

I/O handling: this program illustrates low-level handling of the screen and keyboard devices, as follows. 

The program runs an infinite loop that listens to the keyboard input. When a key is pressed (any key), the program blackens the screen, i.e. writes "black" in every pixel; the screen should remain fully black as long as the key is pressed. 

When no key is pressed, the program clears the screen, i.e. writes "white" in every pixel; the screen should remain fully clear as long as no key is pressed.


## 第 11 週習題 (2017/11/23)

http://www.nand2tetris.org/05.php

```
Memory.hdl	Entire RAM address space	Test this chip using Memory.tst and Memory.cmp
```

## 第 12 週習題 (2017/12/02)

http://www.nand2tetris.org/05.php

```
CPU.hdl	-- The Hack CPU

Recommended test files: CPU.tst and CPU.cmp. 
Alternative test files (less thorough but do not require using the built-in DRegister): CPU-external.tst and CPU-external.cmp.
```

## 第 13 週習題 (2017/12/09)

http://www.nand2tetris.org/05.php

```
Computer.hdl -- The platform's top-most chip

Test by running some Hack programs on the constructed chip. See more instructions below.
```

恭喜你，這是 nand2tetris 《硬體部分》的最後一題習題，順利做到這裏的話，就代表你已經設計了一台完整的電腦了！

下學期的《系統程式》才會繼續做《軟體部分》的習題。

接著讓我們來看看《較複雜的現代電腦架構》，探討如何讓電腦速度《快、很快、更快》的那些方法！


