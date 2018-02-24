#include <stdio.h>
#include <stdlib.h>

void add(double *c, double *a, double *b, int n) {
  for (int i=0; i<n; i++) c[i] = a[i] + b[i];
}

void print(double *a, int n) {
  for (int i=0; i<n; i++) printf("%6.2f ", a[i]);
}

int main() {
  double a[]={1,2,3,4};
  double b[]={4,3,2,1};
  double *c = malloc(sizeof(a));
  if (c==NULL) { printf("malloc fail"); exit(1); }
  int len = sizeof(a)/sizeof(double);
  add(c, a, b, len);
  print(c, len);
  free(c);
  return 0;
}

