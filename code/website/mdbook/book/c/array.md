# 陣列

## 範例：陣列 -- array.c

C 語言的宣告陣列時，通常必須給定陣列大小，除非是將整個陣列初始值宣告進去時，才能交由編譯器自動決定大小。

檔案：array.c

```javascript
#include <stdio.h>

int main() {
  int i;
  int a[]={1,6,2,5,3,6,1};
  for (i=0;i<7;i++) {
    printf("a[%d]=%d\n", i, a[i]);
  }
}

```

執行結果

```
D:\Dropbox\cccwd\db\c\code>gcc array.c -o array

D:\Dropbox\cccwd\db\c\code>array
a[0]=1
a[1]=6
a[2]=2
a[3]=5
a[4]=3
a[5]=6
a[6]=1
```


