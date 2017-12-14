## C 語言中的函數指標

```c
#include <stdio.h>

int add(int a, int b) {
  return a+b;
}

int mult(int a, int b) {
  return a*b;
}

int main() {
  int (*op)(int a, int b);
  op = add;
  printf("op(3,5)=%d\n", op(3,5));
  op = mult;
  printf("op(3,5)=%d\n", op(3,5));
}
```

**執行結果：**

    D:\cp\code>gcc fpointer.c -o fpointer

    D:\cp\code>fpointer
    op(3,5)=8
    op(3,5)=15