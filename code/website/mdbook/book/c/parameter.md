# 參數傳遞

## 傳值版

檔案： modify1.c

```c
#include <stdio.h>

void modify(int x) {
    x += 3;
}

int main() {
    int a =  5;
    modify(a);
    printf("a=%d\n", a);
}
```

執行結果

```
$ gcc modify1.c -o modify1
$ ./modify1
a=5
```

## 傳址版

檔案： modify2.c

```c
#include <stdio.h>

void modify(int* x) {
    *x += 3;
}

int main() {
    int a =  5;
    modify(&a);
    printf("a=%d\n", a);
}
```

執行結果

```
$ gcc modify2.c -o modify2
$ ./modify2
a=8

```

