#include <stdio.h>

#define max(a,b) ((a>b)?a:b)

int main() {
  int m = max(9,5);
  printf("max(9,5)=%d\n", m);

  printf("max(3,8)=%d\n", max(3,8));
}