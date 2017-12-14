// 請寫一個函數計算兩矩陣相加？(範例： add([[1,2],[3,4]], [[1,1],[1,1]]) => [[2,3], [4,5]])
#include <stdio.h>

double matrix_transpose(double *m, int rows, int cols, double *mt) {
  for (int i=0; i<rows; i++) {
    for (int j=0; j<cols; j++) {
      int cell = i*cols+j, tcell = j*rows + i;
      mt[tcell] = m[tcell];
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
  double a[] = {1.,2.,3.,4.,5.,6.}, b[6], rows=2, cols=3;
  printf("========= a ===========\n");
  matrix_print(a, rows, cols);
  
  matrix_transpose(a, rows, cols, b);
  
  printf("========= b ===========\n");
  matrix_print(b, cols, rows);  
}

/*

D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 matrixTranspose.c -o matrixT
ranspose

D:\Dropbox\mdbookspace\web\code\c\exam>matrixTranspose
========= a ===========
  1.00   2.00   3.00
  4.00   5.00   6.00
========= b ===========
  1.00   2.00
  3.00   4.00
  5.00   6.00
  
*/