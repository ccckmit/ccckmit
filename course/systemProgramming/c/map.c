// 請寫一個函數可以傳回陣列的映射值？(範例：map(sqrt, [1,4,9])= [1,2,3])
#include <stdio.h>
#include <math.h>

void array_print(double a[], int length) {
  for (int i=0; i<length; i++) {
    printf("%6.2f ", a[i]);
  }
  printf("\n");
}

void map(double (*f)(double), double a[], int length, double fa[]) {
  for (int i=0; i<length; i++) {
    fa[i] = f(a[i]);
  }
}

int main() {
  double a[]={1.,4.,9.}, fa[3];
  int len=3;
  printf("a=");
  array_print(a, len);
  map(sqrt, a, len, fa);
  printf("fa=");
  array_print(fa, len);
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 map.c -o map

D:\Dropbox\mdbookspace\web\code\c\exam>map
a=  1.00   4.00   9.00
fa=  1.00   2.00   3.00
*/
