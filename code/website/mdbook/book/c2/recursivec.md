#C 的遞迴函數

###用遞迴計算 s(n)=1+..+n

**檔案： s10.c**

```c
#include <stdio.h>

int s(int n) {
  if (n==1) return 1;
  int sn = s(n-1)+n;
  return sn;
}

int main() {
  printf("s(10)=%d", s(10));
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc s10.c -o s10

    D:\Dropbox\cccwd\db\c\code>s10
    s(10)=55
###印出中間過程

**檔案： recursive.c**

```c
#include <stdio.h>

int s(int n) {
  if (n==1) return 1;
  int sn = s(n-1)+n;
  printf("s(%d)=%d\n", n, sn);
  return sn;
}

int main() {
  printf("s(10)=%d", s(10));
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc recursive.c -o recursive

    D:\Dropbox\cccwd\db\c\code>recursive
    s(2)=3
    s(3)=6
    s(4)=10
    s(5)=15
    s(6)=21
    s(7)=28
    s(8)=36
    s(9)=45
    s(10)=55
    s(10)=55