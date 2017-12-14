#函數：取大值 max(a,b)

###採用函數的作法

**檔案： max.c**

```c
#include <stdio.h>

int max(int a, int b) {
  if (a>b)
    return a;
  else
    return b;
}

int main() {
  int m = max(9,5);
  printf("max(9,5)=%d\n", m);
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc max.c -o max
    
    D:\Dropbox\cccwd\db\c\code>max
    max(9,5)=9
###採用巨集的作法

C 語言屬於靜態語言，所有變數都要宣告型態，這樣編譯器才能正確進行編譯。

但是如果你想寫一個《通用的函數》，不想綁訂在某些型態上，在 C 語言裡應該怎麼辦呢？

一個可能的方法是使用巨集！

巨集和函數不同，會被事先展開，然後在進行編譯，以下是一個用 C 語言設計通用的 max(a,b) 巨集的範例！

**檔案： maxMacro.c**

```c
#include <stdio.h>

#define max(a,b) ((a>b)?a:b)

int main() {
  int m = max(9,5);
  printf("max(9,5)=%d\n", m);

  printf("max(3,8)=%d\n", max(3,8));
}
```
**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc maxMacro.c -o maxMacro

    D:\Dropbox\cccwd\db\c\code>maxMacro
    max(9,5)=9
    max(3,8)=8
這種巨集會被先展開成沒有巨集的程式，方法是在每次呼叫時都《將整段程式碼貼上並取代參數》。

我們可以透過 gcc 的 -E 參數，來觀察展開的情況，指令如下：

    D:\Dropbox\cccwd\db\c\code>gcc -E maxMacro.c -o maxMacro.i
以下是展開後的程式碼

```c
// ... 前面有一大堆註解
int main() {
  int m = ((9>5)?9:5);
  printf("max(9,5)=%d\n", m);

  printf("max(3,8)=%d\n", ((3>8)?3:8));
}
```