#include <stdio.h>

void main(int argc, char *argv[]) {
  int i, n = atoi(argv[1]);
  float ei = 1, f=1;
  for (i=1; i<n; i++) {
    f = f * i;
    ei = ei+1/f;
  }
  printf("e[%d]=%f", n, ei);
}