# nand2tetris -- 組譯器

## Node.js 版本執行

```
PS D:\Dropbox\ccc\ccckmit\course\systemProgramming\nand2tetris\06> node ash Add
[
  "// This file is part of www.nand2tetris.org",
  "// and the book \"The Elements of Computing Systems\"",
  "// by Nisan and Schocken, MIT Press.",
  "// File name: projects/06/add/Add.asm",
  "",
  "// Computes R0 = 2 + 3",
  "",
  "@2",
  "D=A",
  "@3",
  "D=D+A",
  "@0",
  "M=D",
  ""
]
============== pass1 ================
 p: {"type":"A","arg":"2"}
008:0000 @2
 p: {"type":"C","c":"A","d":"D","j":""}
009:0001 D=A
 p: {"type":"A","arg":"3"}
010:0002 @3
 p: {"type":"C","c":"D+A","d":"D","j":""}
011:0003 D=D+A
 p: {"type":"A","arg":"0"}
012:0004 @0
 p: {"type":"C","c":"D","d":"M","j":""}
013:0005 M=D
============== pass2 ================
008:0000000000000010 @2
009:1110110000010000 D=A
010:0000000000000011 @3
011:1110000010010000 D=D+A
012:0000000000000000 @0
013:1110001100001000 M=D
```

## C 語言版本執行

```
$ gcc -std=c99 asm.c c6.c -o asm.o
$ ./asm.o Rect
======= SYMBOL TABLE ===========
0: R0, 0
1: R1, 1
2: R2, 2
3: R3, 3
4: R4, 4
5: R5, 5
6: R6, 6
7: R7, 7
8: R8, 8
9: R9, 9
10: R10, 10
11: R11, 11
12: R12, 12
13: R13, 13
14: R14, 14
15: R15, 15
16: SCREEN, 16384
17: KBD, 24576
18: SP, 0
19: LCL, 1
20: ARG, 2
21: THIS, 3
22: THAT, 4
============= PASS1 ================
00:@0
01:D=M
02:@INFINITE_LOOP
03:D;JLE
04:@counter
05:M=D
06:@SCREEN
07:D=A
08:@address
09:M=D
10:(LOOP)
  p.key=LOOP *p.value=10 top=24
10:@address
11:A=M
12:M=-1
13:@address
14:D=M
15:@32
16:D=D+A
17:@address
18:M=D
19:@counter
20:MD=M-1
21:@LOOP
22:D;JGT
23:(INFINITE_LOOP)
  p.key=INFINITE_LOOP *p.value=23 top=25
23:@INFINITE_LOOP
24:0;JMP
======= SYMBOL TABLE ===========
0: R0, 0
1: R1, 1
2: R2, 2
3: R3, 3
4: R4, 4
5: R5, 5
6: R6, 6
7: R7, 7
8: R8, 8
9: R9, 9
10: R10, 10
11: R11, 11
12: R12, 12
13: R13, 13
14: R14, 14
15: R15, 15
16: SCREEN, 16384
17: KBD, 24576
18: SP, 0
19: LCL, 1
20: ARG, 2
21: THIS, 3
22: THAT, 4
23: LOOP, 10
24: INFINITE_LOOP, 23
============= PASS2 ================
  @0                   0000000000000000
  D=M                  1111110000010000
  @INFINITE_LOOP       0000000000010111
  D;JLE                1110001100000110
  p.key=counter *p.value=16 top=26
  @counter             0000000000010000
  M=D                  1110001100001000
  @SCREEN              0100000000000000
  D=A                  1110110000010000
  p.key=address *p.value=17 top=27
  @address             0000000000010001
  M=D                  1110001100001000
(LOOP)
  @address             0000000000010001
  A=M                  1111110000100000
  M=-1                 1110111010001000
  @address             0000000000010001
  D=M                  1111110000010000
  @32                  0000000000100000
  D=D+A                1110000010010000
  @address             0000000000010001
  M=D                  1110001100001000
  @counter             0000000000010000
  MD=M-1               1111110010011000
  @LOOP                0000000000001010
  D;JGT                1110001100000001
(INFINITE_LOOP)
  @INFINITE_LOOP       0000000000010111
  0;JMP                1110101010000111
  ```
