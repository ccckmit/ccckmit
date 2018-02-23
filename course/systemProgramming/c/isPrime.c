// 請檢查某數是否為質數？ 範例： isPrime(17) => true
#include <stdio.h>

int isPrime(int n) {
  for (int i=2; i<n; i++) {
    if (n%i==0) 
      return 0;
  }
  return 1;
}

int main() {
  printf("isPrime(19)=%d\n", isPrime(19));
  printf("isPrime(21)=%d\n", isPrime(21));
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 isPrime.c -o isPrime

D:\Dropbox\mdbookspace\web\code\c\exam>isPrime
isPrime(19)=1
isPrime(21)=0
*/