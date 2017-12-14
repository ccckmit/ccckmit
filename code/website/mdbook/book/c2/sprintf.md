#sprintf 函數 — sprintf 是很好用的格式化工具。

sprintf() 函數是C 語言用來格式化的主要方法，其函數原形如下所示。由於其中的格式化參數稍微複雜，因此很多學習者並不知道該如何正確的使用這些格式化參數。

```c
int sprintf ( char * str, const char * format, ... );

str: 格式化後的輸出字串
format：格式化的規格字串

在 format 字串中，以 % 起頭者為格式段落，其格式語法如下：

格式段落的語法：%[flags][width][.precision][length]specifier

  % 代表變數開始

  [flag] 
    -:靠左
    +:輸出正負號
    (space):當不輸出正負號時，就輸出空白
    #:在 8 或 16 進位 (o,x,X) 時，強制輸出 0x 作為開頭，
      在浮點數 (e, E, f) 時，強制輸出小數點，
      在浮點數 (g, G) 時，強制輸出小數點，但尾端的 0 會被去掉。
    0:在開頭處(左側) 補 0，而非補空白。

  [width] 
  最小輸出寬度 (或 *)

  [.precision]
  精確度，小數點之後的輸出位數

  [length]
  長度符號 h, I, L

  [specifier]
  型態描述元，可以是 c, d, e, E, f, g, G, o, s, u, x, X 等基本型態。
  sprintf() 函數的用法與 printf() 很類似，只是第一個參數為輸出字串 str 而已，為了說明這些格式的意義，我們寫了以下程式，以示範 format 欄位的各種寫法。
```

**檔案：printf.c**

```c
#include <stdio.h>

int main()
{
   printf ("Characters: %c %c \n", 'a', 65);
   printf ("Decimals: %d %ld\n", 1977, 650000L);
   printf ("Preceding with blanks: %10d \n", 1977);
   printf ("Preceding with zeros: %010d \n", 1977);
   printf ("Some different radixes: %d %x %o %#x %#o \n", 100, 100, 100, 100, 100);
   printf ("floats: %4.2f %+.0e %E \n", 3.1416, 3.1416, 3.1416);
   printf ("Width trick: %*d \n", 5, 10);
   printf ("%s \n", "A string");
   return 0;
}
```

**以上程式的輸出結果：**

    D:\cp\code>gcc printf.c -o printf

    D:\cp\code>printf
    Characters: a A
    Decimals: 1977 650000
    Preceding with blanks:       1977
    Preceding with zeros: 0000001977
    Some different radixes: 100 64 144 0x64 0144
    floats: 3.14 +3e+000 3.141600E+000
    Width trick:    10
    A string
###參考文獻

* http://www.cplusplus.com/reference/clibrary/cstdio/sprintf/