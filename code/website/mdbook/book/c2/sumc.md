#範例 -- 加總 (sum.c)

###使用 while 迴圈

**檔案： wsum.c**

```c
#include <stdio.h>
int main() {
  int i=1, sum=0;
  while (i<=10) {
    sum = sum + i;
    printf("i=%d sum=%d\n", i, sum);
    i = i + 1;
  }
}
```
**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc wsum.c -o wsum

    D:\Dropbox\cccwd\db\c\code>wsum
    i=1 sum=1
    i=2 sum=3
    i=3 sum=6
    i=4 sum=10
    i=5 sum=15
    i=6 sum=21
    i=7 sum=28
    i=8 sum=36
    i=9 sum=45
    i=10 sum=55
###使用 for 迴圈

**檔案：sum.c**

```c
#include <stdio.h>


int main() {
  int i, sum=0;
  for (i=1;i<=10;i++) {
    sum = sum + i;
    printf("i=%d sum=%d\n", i, sum);
  }    
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc sum.c -o sum

    D:\Dropbox\cccwd\db\c\code>sum
    i=1 sum=1
    i=2 sum=3
    i=3 sum=6
    i=4 sum=10
    i=5 sum=15
    i=6 sum=21
    i=7 sum=28
    i=8 sum=36
    i=9 sum=45
    i=10 sum=55