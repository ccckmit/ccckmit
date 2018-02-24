// 請在一個已經排序的陣列中之正確位置插入一個數值。(範例： insert([1,2,5,6,7], 3) => [1,2,3,5,6,7])
#include <stdio.h>

int array_insert(int a[], int *length, int item) {
  for (int i=0; i<*length; i++) {
    if (a[i] > item) {
      for (int ti=*length; ti>i; ti--) {
        a[ti] = a[ti-1];
      }      
      a[i] = item;
      break;
    }
  }
  *length += 1;
}

void array_print(int a[], int length) {
  for (int i=0; i<length; i++) {
    printf("%d ", a[i]);
  }
  printf("\n");
}

int main() {
  int a[10]={1,2,5,6,7}, len=5;
  array_print(a, len);
  array_insert(a, &len, 3);
  array_print(a, len);
}

/*
D:\Dropbox\mdbookspace\web\code\c\exam>gcc -std=c99 arrayInsert.c -o arrayInsert

D:\Dropbox\mdbookspace\web\code\c\exam>arrayInsert
1 2 5 6 7
1 2 3 5 6 7
*/