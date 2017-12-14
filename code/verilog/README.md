# Verilog

## Icarus Verilog

範例： basic/xor3.v 的執行

```
$ cd basic
$ iverilog -o xor3.o xor3.v
$ vvp xor3.o
```

範例： nand2tetris/alu_test.v 的執行

```
$ cd nand2tetris
$ iverilog -o alu_test.o alu_test.v
$ vvp alu_test.o
```

範例： nand2tetris/computer_test.v 的執行

```
$ iverilog -o computer_test.o computer_test.v
$ vvp computer_test.o
```