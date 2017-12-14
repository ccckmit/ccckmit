#以 C 語言實作物件封裝 (Encapsulation)

物件導向中的封裝，是指將資料與函數封裝在一個稱為物件的結構當中，我們可以使用 C 語言的結構，將資料與函數指標一起放入結構中，就形成了一個類似物件的結構。

###程式範例：實作 Circle 物件

```c
#include <stdio.h>

struct Circle {
  void (*new)(struct Circle*, float); 
  float (*area)(struct Circle*);
  float r;
};

float CircleArea(struct Circle *obj) { return 3.14 * obj->r * obj->r; }

void CircleNew(struct Circle *obj, float r) {
  obj->new = CircleNew;
  obj->area = CircleArea;
  obj->r = r;
}

int main() {
  struct Circle c;
  CircleNew(&c, 3.0);
  printf("area() = %G\n", c.area(&c));
}
```

**執行結果**

    D:\cp>gcc Circle.c -o Circle

    D:\cp>Circle
    area() = 28.26