// 請寫一個函數計算兩矩陣相加？(範例： add([[1,2],[3,4]], [[1,1],[1,1]]) => [[2,3], [4,5]])
#include <stdio.h>

double matrix_add(double *a, double *b, double *c, int rows, int cols) {
  for (int i=0; i<rows; i++) {
    for (int j=0; j<cols; j++) {
      int cell = i*cols+j;
      c[cell] = a[cell] + b[cell];
    }
  }
}

int matrix_print(double *m, int rows, int cols) {
  for (int i=0; i<rows; i++) {
    for (int j=0; j<cols; j++) {
      int cell = i*cols+j;
      printf("%6.2f ", m[cell]);
    }
    printf("\n");
  }
}

int main() {
  double a[] = {1.,2.,3.,4.}, b[]={1.,1.,1.,1.}, c[4], rows=2, cols=2;
  printf("========= a ===========\n");
  matrix_print(a, rows, cols);
  printf("========= b ===========\n");
  matrix_print(b, rows, cols);
  
  matrix_add(a, b, c, rows, cols);
  
  printf("========= c ===========\n");
  matrix_print(c, rows, cols);
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 matrixAdd.c -o matrixAdd

D:\Dropbox\mdbookspace\web\code\c\exam>matrixAdd
========= a ===========
  1.00   2.00
  3.00   4.00
========= b ===========
  1.00   1.00
  1.00   1.00
========= c ===========
  2.00   3.00
  4.00   5.00
*/