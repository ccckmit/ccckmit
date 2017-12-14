#結構中的位元欄 — (Bits Field) 讓您為每個位元取名字

為了展示 C 語言中位元欄位的用途，筆者將拙著《系統程式》中 CPU0 處理器的狀態暫存器 (Status Word) 拿來做為範例，該狀態暫存器的位元配置如下圖所示。


圖一、CPU0 的狀態暫存器 (SW) 之位元配置

**程式範例：結構中的位元欄位**

```c
#include <stdio.h>

// 請注意，寫在前面的欄位會被編在低位元部份，因此通常我們必須倒著寫，也就是將圖從右看到左。
typedef struct 
{               
   unsigned lo:4; // 像是 unsigned hi, lo:4;
   unsigned hi:4; // 請注意，不能把兩個欄位寫在同一行
} byte;

typedef struct
{ 
   unsigned m:1;
   unsigned b2:5;
   unsigned t:1;
   unsigned i:1;
   unsigned b1:20;
   unsigned v:1;
   unsigned c:1;
   unsigned z:1;
   unsigned n:1;
} StatusWord;

int main() {
  byte b = { .hi=0x0F, .lo=0x0C };
  unsigned char *bp = (unsigned char*) &b;
  printf("byte=%02x\n", *bp);  

  StatusWord sw = { .n=1,.z=0,.c=1,.v=0,.i=1,.t=1,.m=0,.b1=0,.b2=0 };
  unsigned int *psw = (unsigned int*) &sw;
  printf("SW=%08x\n", *psw);  
}
```
**執行結果**

    D:\cp>gcc structBits.c -o structBits

    D:\cp>structBits
    byte=fc
    SW=a00000c0

