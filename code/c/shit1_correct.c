#include <stdio.h>
#include <stdlib.h>

double* add(double *a, double *b, int n) {
  double *c=malloc(sizeof(double)*n);
  for (int i=0; i<n; i++) c[i] = a[i] + b[i];
  return c;
}

void print(double *a, int n) {
  for (int i=0; i<n; i++) printf("%6.2f ", a[i]);
}

int main() {
  double a[]={1,2,3,4};
  double b[]={4,3,2,1};
  double *c=add(a,b,4);
  print(c, 4);
}

