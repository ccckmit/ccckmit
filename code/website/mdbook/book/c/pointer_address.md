## 指標算術 -- 指標的加減法，很容易會造成錯誤

在 C 語言當中，指標型態的變數，像是下列範例中的 `char *cp; int* ip;` 等，其加減法的表現，會根據型態而有所不同。

舉例而言，假如 cp = 0x0022FF77，那麼 cp+1 就是 0x0022FF78，因為 cp 是一種字元指標，這種結果是理所當然的。

但是，假如 ip = 0x0022FF6C，那麼 ip+1 卻是 0x0022FF70，這是因為 ip 是整數指標，因此當我們將 ip 加上 1 單位距離時，這個一單位距離的大小就相當於整數 int 的大小，也就是 sizeof(int) = 4。

### 範例程式

```CPP
#include <stdio.h>

int main() {
  char c = 'a';
  char *cp = &c;
  printf("&c=%p\n", &c);
  printf("cp=%p\n", cp);
  printf("cp+1=%p\n", cp+1);
  printf("cp+3=%p\n", cp+3);

  int i = 1;
  int *ip = &i;
  printf("&i=%p\n", &i);
  printf("ip=%p\n", ip);
  printf("ip+1=%p\n", ip+1);
  printf("ip+3=%p\n", ip+3);
}

```

### 執行結果

```CPP
D:\cp>gcc ptradd.c -o ptradd

D:\cp>ptradd
&c=0022FF77
cp=0022FF77
cp+1=0022FF78
cp+3=0022FF7A
&i=0022FF6C
ip=0022FF6C
ip+1=0022FF70
ip+3=0022FF78
```

### 習題

這個設計的邏輯，是為了讓您寫程式時，可以都用 ptr ++ 來將指標前進一格，而不需要用 ptr += sizeof(*ptr) 這樣複雜的寫法，但是這也造成了一些問題。

假如您的認知錯誤，很可能會多此一舉，萬一您自己計算大小以便調整指標時，就會產生錯誤的結果，像是以下程式一樣。

```CPP
#include <stdio.h>

int main() {
  int a[] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
  int *ptr = a;
  int i;
  for (i=0; i<3; i++) {
    printf("%d ", *ptr);
    ptr += sizeof(int);
  }
}
```

習題的輸出

```CPP
D:\cp>gcc ptrerror.c -o ptrerror

D:\cp>ptrerror
1 5 9
```

### 補充

根據 jserv 的來信補充，提到下列這幾點，是本文原本所沒提到的：

```
* pointer type 的變數可以對一個純量作 '+' 和 '-' 操作
* 兩個 pointer type 的變數可以施加 '-' 操作，以得知位移量 (offset)，但不能施加 '+' 操作

意思是說，假設:
        int a, b;
        void *ptrA = &a, *ptrB = &b;

那麼：
ptrB - ptrA; // 合法
ptrA + 1; 合法
ptrA - 1; 合法
ptrA + ptrB; // 不合法
ptrA / 1;  // 不合法

```