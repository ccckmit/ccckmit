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

## 學習資源

* [Verilog HDL 教學講義](https://www.gitbook.com/book/hom-wang/verilog-hdl/details)
* [免費電子書：Verilog 電路設計](http://ccckmit.wikidot.com/ve:main)
