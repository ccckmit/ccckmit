#include <stdio.h>

int main() {
  int i, sum=0;
  for (i=1;i<=10;i++) {
    sum = sum + i;
    printf("i=%d sum=%d\n", i, sum);
  }	
}

