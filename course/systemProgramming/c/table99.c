// 請寫一個程式印出九九乘法表。
#include <stdio.h>

int main() {
  for (int i=2; i<=9; i++) {
    for (int j=2; j<=9; j++) {
      printf("%d*%d=%d\n", i, j, i*j);
    }
  }
}

/*

D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 table99.c -o table99

D:\Dropbox\mdbookspace\web\code\c\exam>table99
2*2=4
2*3=6
2*4=8
...
9*7=63
9*8=72
9*9=81
*/