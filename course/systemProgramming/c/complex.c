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
