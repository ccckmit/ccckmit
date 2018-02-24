// 請寫一個程式計算 10! ，也就是 10*9*8*....*1 。
#include <stdio.h>

int main() {
  int p = 1;
  for (int i=10; i>=1; i--) {
    p = p * i;
  }
  printf("10!=%d\n", p);
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 factorial.c -o factorial

D:\Dropbox\mdbookspace\web\code\c\exam>factorial
10!=3628800
*/