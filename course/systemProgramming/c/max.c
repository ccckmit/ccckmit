#include <stdio.h>

int max(int a, int b) {
  if (a>b)
    return a;
  else
    return b;
}

int main() {
  int m = max(9,5);
  printf("max(9,5)=%d\n", m);
}
