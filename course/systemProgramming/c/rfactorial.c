// ½Ð¥Î»¼°j­pºâ n! = n*¡K*2*1 ¡H(½d¨Ò¡G factorial(3) = 6)
#include <stdio.h>
#include <math.h>

int factorial(int n) {
  if (n == 1) 
    return 1;
  return n*factorial(n-1);
}

int main() {
  printf("factorial(3)=%d\n", factorial(3));
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 rfactorial.c -o rfactorial

D:\Dropbox\mdbookspace\web\code\c\exam>rfactorial
factorial(3)=6
*/
