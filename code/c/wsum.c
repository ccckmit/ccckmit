#include <stdio.h>

int main() {
  int i=1, sum=0;
  while (i<=10) {
    sum = sum + i;
    printf("i=%d sum=%d\n", i, sum);
    i = i + 1;
  }
}
