#include <stdio.h>

int sum(n) {
  int i, s=0;
  for (i=1; i<=n; i++) {
	s = s+i;
  }
  return s;
}

int main() {
  int sum10 = sum(10);
  printf("1+...+10=%d\n", sum10);
}
