## 函數指標型態 -- (function pointer type) 

您可以用 typedef 將函數指標宣告成一種型態。

我們希望定義一個具有一個參數的函數指標形態，則可以採用下列方式。

```c
typedef void(F1)(void);
```

###程式範例：函數指標的型態

```c
#include <stdio.h>

typedef int(*OP)(int,int);

int add(int a, int b) {
  return a+b;
}

int mult(int a, int b) {
  return a*b;
}

int main() {
  OP op = add;
  printf("op(3,5)=%d\n", op(3,5));
  op = mult;
  printf("op(3,5)=%d\n", op(3,5));
}
```

**執行結果**

    D:\cp>gcc fpointertype.c -o fpointertype

    D:\cp>fpointertype
    op(3,5)=8
    op(3,5)=15