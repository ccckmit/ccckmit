#include <stdio.h>
#include <math.h>

double dx = 0.001;

double df(double (*f)(double), double x) {
  double dy = f(x+dx) - f(x);
  return dy/dx;
}

double square(double x) {
  return x*x;
}

int main() {
  printf("df(x^2,2)=%f\n", df(square, 2.0));
  printf("df(sin(x),pi/4)=%f\n", df(sin, 3.14159/4));
}