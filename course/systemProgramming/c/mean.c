// ½Ðºâ¥X¬Y°}¦Cªº¥­§¡­È¡H(½d¨Ò¡G mean([1,2,3,4,5]) => 3)
#include <stdio.h>

double mean(double a[], int length) {
  double sum=0;
  for (int i=0; i<length; i++) {
    sum += a[i];
  }
  return sum/length;
}

int main() {
  double a[] = {1,2,3,4,5};
  printf("mean({1,2,3,4,5})=%6.2f\n", mean(a, 5));
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 mean.c -o mean

D:\Dropbox\mdbookspace\web\code\c\exam>mean
mean({1,2,3,4,5})=  3.00
*/