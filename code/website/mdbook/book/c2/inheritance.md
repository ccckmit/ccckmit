#以 C 語言實作繼承

在物件導向當中，子類別繼承父類別時，會同時繼承所有父類別的內容，我們可以在程式中加入

###程式範例：以 C 語言實作繼承 (Circle 繼承 Shape)

```c
#include <stdio.h>

#define ShapeMembers(TYPE) void (*new)(struct TYPE*);float (*area)(struct TYPE*)

typedef struct _Shape { // Shape 物件，沒有欄位
  ShapeMembers(_Shape);
} Shape;


float ShapeArea(Shape *obj) { return 0; }

void ShapeNew(Shape *obj) {
  obj->new = ShapeNew;
  obj->area = ShapeArea;
}

typedef struct _Circle {
  ShapeMembers(_Circle);
  float r;
} Circle;

float CircleArea(Circle *obj) { return 3.14 * obj->r * obj->r;     }
   
void CircleNew(Circle *obj) {
  obj->new = CircleNew;
  obj->area = CircleArea;
}

int main() {
  Shape s;
  ShapeNew(&s);
  printf("s.area()=%G\n", s.area(&s));

  Circle c;
  CircleNew(&c);
  c.r = 3.0;
  printf("c.area()=%G\n", c.area(&c));
}
```

**執行結果**

    D:\cp>gcc inherit.c -o inherit

    D:\cp>inherit
    s.area()=0
    c.area()=28.26