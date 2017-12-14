#C 的結構與物件

###整個結構傳遞

C 語言沒有物件導向，只有一種稱為《結構》(struct) 的組織模式，可以讓你把很多個欄位放在一起，形成一種《多欄位結構》。

舉例而言，假如我們要表達《複數》，可以將《實部 r 和虛部 i》組合之後，形成一個《複數結構》，以下是其程式範例：

**檔案： complex.c**

```c
#include <stdio.h>

typedef struct {
  double r, i;
} Complex;

Complex add(Complex c1, Complex c2) {
  Complex c;
  c.r = c1.r+c2.r;
  c.i = c1.i+c2.i;
  return c;
}

Complex sub(Complex c1, Complex c2) {
  Complex c;
  c.r = c1.r-c2.r;
  c.i = c1.i-c2.i;
  return c;
}

Complex mul(Complex c1, Complex c2) {
  Complex c;
  c.r = c1.r*c2.r-c1.i*c2.i;
  c.i = c1.r*c2.i+c1.i*c2.r;
  return c;
}

void print(char *name, Complex c) {
  printf("%s=%6.2f+%6.2fi\n", name, c.r, c.i);
}

int main() {
  Complex o1={ .r=1.0, .i=2.0 };
  Complex o2={ .r=2.0, .i=1.0 };

  print("o1", o1);
  print("o2", o2);

  Complex add12 = add(o1, o2);
  Complex sub12 = sub(o1, o2);
  Complex mul12 = mul(o1, o2);

  print("add(o1,o2)", add12);
  print("sub(o1,o2)", sub12);
  print("mul(o1,o2)", mul12);
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc complex.c -o complex

    D:\Dropbox\cccwd\db\c\code>complex
    o1=  1.00+  2.00i
    o2=  2.00+  1.00i
    add(o1,o2)=  3.00+  3.00i
    sub(o1,o2)= -1.00+  1.00i
    mul(o1,o2)=  0.00+  5.00i
###只有傳遞指標，不須複製內容

**檔案： complex.c**

```c
#include <stdio.h>

typedef struct {
 double r, i;
} Complex;

Complex add(Complex *c1, Complex *c2) {
  Complex c;
  c.r = c1->r+c2->r;
  c.i = c1->i+c2->i;
  return c;
}

Complex sub(Complex *c1, Complex *c2) {
  Complex c;
  c.r = c1->r-c2->r;
  c.i = c1->i-c2->i;
  return c;
}

Complex mul(Complex *c1, Complex *c2) {
  Complex c;
  c.r = c1->r*c2->r-c1->i*c2->i;
  c.i = c1->r*c2->i+c1->i*c2->r;
  return c;
}

void print(char *name, Complex *c) {
  printf("%s=%6.2f+%6.2fi\n", name, c->r, c->i);
}

int main() {
  Complex o1={ .r=1.0, .i=2.0 };
  Complex o2={ .r=2.0, .i=1.0 };
  
  print("o1", &o1);
  print("o2", &o2);

  Complex add12 = add(&o1, &o2);
  Complex sub12 = sub(&o1, &o2);
  Complex mul12 = mul(&o1, &o2);

  print("add(o1,o2)", &add12);
  print("sub(o1,o2)", &sub12);
  print("mul(o1,o2)", &mul12);
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc complex2.c -o complex2

    D:\Dropbox\cccwd\db\c\code>complex2
    o1=  1.00+  2.00i
    o2=  2.00+  1.00i
    add(o1,o2)=  3.00+  3.00i
    sub(o1,o2)= -1.00+  1.00i
    mul(o1,o2)=  0.00+  5.00i
問題是，到底指標是甚麼？ 接下來我們將花比較多的時間，講述這個 C 語言當中令人又愛又恨的奇特概念！