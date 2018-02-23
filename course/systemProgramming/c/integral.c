#include <stdio.h>
#include <math.h>

double dx = 0.001;

double integral(double (*f)(double), double a, double b) {
  double x, area = 0.0;
  for (x=a; x<b; x=x+dx) {
    area = area + f(x)*dx;
  }
  return area;
}

double square(double x) {
  return x*x;
}

int main() {
  printf("integral(x^2,0,1)=%f\n", integral(square,0,1));
  printf("integral(sin(x),0,pi)=%f\n", integral(sin,0,3.14159));
}

