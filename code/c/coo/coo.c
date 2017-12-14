#include <stdio.h>

typedef struct {
  double r, i;
} Complex;

Complex add(Complex *o, Complex *o2) {
  Complex c;
  c.r = o->r + o2->r;
  c.i = o->i + o2->i;
  return c;
}

char _str[1000];

char *toStr(Complex *o) {
  sprintf(_str, "%f+%fi", o->r, o->i);
  return _str;
}

// o.f1().f2()... => f2(&o, f1(&o,) ....)

int main() {
  Complex c1={.r=1.0,.i=2.0}, c2={.r=2.0,.i=1.0};
  Complex c;
  c = add(&c1, &c2);
//  c1.add(c2);
//  c = o(&c1, add, &c2);
  printf("add(c1,c2)=%s\n", toStr(&c));
}


