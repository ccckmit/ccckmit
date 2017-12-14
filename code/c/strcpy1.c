#include <stdio.h>
#include <string.h>
int main() {
  char a[]="hello!", b[100];
  strcpy(b, a);
  printf("b=%s\n", b);
}

