#include <stdio.h>

int s(int n) {
  if (n==1) return 1;
  int sn = s(n-1)+n;
  printf("s(%d)=%d\n", n, sn);
  return sn;
}

int main() {
  printf("s(10)=%d", s(10));
}

