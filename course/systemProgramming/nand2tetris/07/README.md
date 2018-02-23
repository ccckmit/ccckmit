# nand2tetris - 虛擬機

```
$ node vmh SimpleAdd
[
  "// This file is part of www.nand2tetris.org",
  "// and the book \"The Elements of Computing Systems\"",
  "// by Nisan and Schocken, MIT Press.",
  "// File name: projects/07/StackArithmetic/SimpleAdd/SimpleAdd.vm",
  "",
  "// Pushes and adds two constants.",
  "push constant 7",
  "push constant 8",
  "add",
  ""
]
============== pass1 ================
// push constant 7
@7
D=A
@SP
A=M
M=D
@SP
M=M+1
// push constant 8
@8
D=A
@SP
A=M
M=D
@SP
M=M+1
// add
@SP
M=M-1
@SP
A=M
D=M
@SP
M=M-1
@SP
A=M
A=M
D=D+A
@SP
A=M
M=D
@SP
M=M+1
```