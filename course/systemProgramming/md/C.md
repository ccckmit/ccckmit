# C 語言

* [《C语言的面向对象（面向较大型软件）》ppt分享和ppt注解](https://mp.weixin.qq.com/s?__biz=MzAwMDUwNDgxOA%3D%3D&mid=2652662655&idx=1&sn=d9fc4751170b083acd233dee91d54059)

## Makefile

```
$@ : 該規則的目標文件 (Target file)
$* : 代表 targets 所指定的檔案，但不包含副檔名
$< : 依賴文件列表中的第一個依賴文件 (Dependencies file)
$^ : 依賴文件列表中的所有依賴文件
$? : 依賴文件列表中新於目標文件的文件列表
$* : 代表 targets 所指定的檔案，但不包含副檔名

?= 語法 : 若變數未定義，則替它指定新的值。
:= 語法 : make 會將整個 Makefile 展開後，再決定變數的值。
```

範例 1 ：

```
%.o: %.c
    gcc -c $<

$< : 屬於第一條件，也就是 foo.c
$@ : 屬於目標條件，也就是 foo.o
```

範例 2 : https://github.com/jserv/mini-arm-os/blob/master/07-Threads/Makefile


* [EricWang: makefile 心得、教學](https://wwssllabcd.github.io/blog/2016/10/03/how-to-write-make-file/)

## 專案
* https://github.com/jserv/full-stack-hello
  * https://www.facebook.com/groups/system.software2017/permalink/1532643660134331/

## 課程

* [Notes on Data Structures and Programming Techniques (CPSC 223, Spring 2015)](http://cs.yale.edu/homes/aspnes/classes/223/notes.html)

## 底層技術

* [C 语言编程透视 (書)](https://tinylab.gitbooks.io/cbook/)
* [Shell 编程范例 (書)](https://tinylab.gitbooks.io/shellbook/)

## 編譯器

* https://github.com/jserv/amacc
* https://github.com/rswier/c4

## 單元測試

* [C 語言單元測試](cunitTest)

## 開發環境

* git bash (含 MinGW)

在 git bash 下編譯 CUnit 成功。
