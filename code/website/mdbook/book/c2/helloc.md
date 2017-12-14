#hello.c

**檔案： hello.c**

```c
#include <stdio.h>

int main() {
 printf("hello 你好！\n");
}
```

**執行結果**

    D:\code>gcc hello.c -o hello
    D:\code>hello
    hello 你好！
注意： 在 windows 8 當中我必須將 hello.c 儲存成 ansi 編碼，中文字才能正確印出。