#計算總和的函數

**檔案： fsum.c**

```c
#include <stdio.h>

int sum(n) {
  int i, s=0;
  for (i=1; i<=n; i++) {
    s = s+i;
  }
  return s;
}

int main() {
  int sum10 = sum(10);
  printf("1+...+10=%d\n", sum10);
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc fsum.c -o fsum
    D:\Dropbox\cccwd\db\c\code>fsum
    1+...+10=55