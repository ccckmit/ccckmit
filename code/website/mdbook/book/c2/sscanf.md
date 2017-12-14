#sscanf 函數

Sscanf 是很好用的字串剖析工具，並且支援類似 Regular Expression 的功能。

C 語言中的 scanf 函數，是初學者都會使用的，但也是大部分人都會誤用，或者是無法充分發揮其功能的。

C 語言的 sscanf() 與 ssprintf() 這兩個函數，採用的是一種既創新又好用的設計法，

事實上，函數 sscanf() 比 scanf() 更為好用，sscanf() 甚至支援了類似 Regular Expression 的功能，可以讓我們輕易的剖析格式化的字串。

sscanf 的函數原形如下，其中的 format 格式字串具有複雜的格式指定功能，以下我們將詳細說明這些格式的用途。

```c
int sscanf ( const char * str, const char * format, ...);

str : 被剖析的字串
format: 剖析格式


在 format 字串中，以 % 起頭者為剖析段落，通常在剖析完成後會指定給後面的變數，其格式語法如下：

剖析段落的語法：%[*][width][modifiers]type

  % 代表變數開始

  * 代表省略不放入變數中

  width 代表最大讀取寬度

  modifier 可以是 {h|I|L} 之一
  說明 : 其中 h 代表 2 byte 的變數 (像 short int)，
         I 代表 4 byte 的變數 (像 long int)，
         L 是 8 byte 的變數 (像 long double)

  type 則可以是 c, d,e,E,f,g,G,o, s, u, x, X 等基本型態，
       也可以是類似 Regular Expression 的表達式。
  說明: c : 字元 (char); 
        d : 整數 (Decimal integer); 
        f : 浮點數 (Floating Point); 
        e,E : 科學記號 (Scientific notation); 
        g,G : 取浮點數或科學記號當中短的那個; 
        o : 八進位 (Octal Integer); 
        u : 無號數 (unsigned integer); 
        x, X : 十六進位 (Hexadecimal integer)
```

為了說明 sscanf 函數的用法，我們寫了以下程式，以示範 format 欄位的各種寫法。

**檔案：sscanf.c**

```c
#include <stdio.h>

int main() {
  char name[20], tel[50], field[20], areaCode[20], code[20];
  int age;
  sscanf("name:john age:40 tel:082-313530", "%s", name);
  printf("%s\n", name);
  sscanf("name:john age:40 tel:082-313530", "%8s", name);
  printf("%s\n", name);
  sscanf("name:john age:40 tel:082-313530", "%[^:]", name);
  printf("%s\n", name);
  sscanf("name:john age:40 tel:082-313530", "%[^:]:%s", field, name);
  printf("%s %s\n", field, name);
  sscanf("name:john age:40 tel:082-313530", "name:%s age:%d tel:%s", name, &age, tel);
  printf("%s %d %s\n", name, age, tel);
  sscanf("name:john age:40 tel:082-313530", "%*[^:]:%s %*[^:]:%d %*[^:]:%s", name, &age, tel);
  printf("%s %d %s\n", name, age, tel);

  char protocol[10], site[50], path[50];
  sscanf("http://ccckmit.wikidot.com/cp/list/hello.txt", 
     "%[^:]:%*2[/]%[^/]/%[a-zA-Z0-9._/-]", 
        protocol, site, path);
  printf("protocol=%s site=%s path=%s\n", protocol, site, path);
  return 1;
}
```

其編譯執行結果如下所示。

    D:\oc>gcc sscanf.c -o sscanf

    D:\oc>sscanf
    name:john
    name:joh
    name
    name john
    john 40 082-313530
    john 40 082-313530
    protocol=http site=ccckmit.wikidot.com path=cp/list/hello.txt
###參考文獻

* http://www.cplusplus.com/reference/clibrary/cstdio/sprintf/
* http://www.cplusplus.com/reference/clibrary/cstdio/sscanf/
