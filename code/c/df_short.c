#include <stdio.h>
#include <math.h>

#define dx 0.001
double df(double (*f)(double), double x) {
  double dy = f(x+dx) - f(x);
  return dy/dx;
}

int main() {
  printf("df(sin(x),pi/4)=%f\n", df(sin,3.14159/4));
}

