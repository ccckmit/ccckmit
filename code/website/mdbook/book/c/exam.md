## 習題

1 - 請寫一個程式計算 10! ，也就是 `10*9*8*....*1` 。

2 - 請寫一個程式印出九九乘法表。

3 - 請檢查某數是否為質數？ 範例： isPrime(17) => true

4 - 請在一個已經排序的陣列中之正確位置插入一個數值。(範例： insert([1,2,5,6,7], 3) => [1,2,3,5,6,7])

5 - 請算出某陣列的平均值？(範例： mean([1,2,3,4,5]) => 3)

6 - 請寫一個函數計算兩矩陣相加？(範例： add([[1,2],[3,4]], [[1,1],[1,1]]) => [[2,3], [4,5]])

7 - 寫一個程式把矩陣轉置。(範例：transpose([[1,2,3], [3,2,1]]) => [[1,3], [2,2], [3,1]])

8 - 請寫一個函數可以傳回陣列的映射值？(範例：map(sqrt, [1,4,9])= [1,2,3])

9 - 請用遞迴計算 n! = n*…*2*1 ？(範例： factorial(3) = 6)

10 - 以結構實作矩陣 Matrix

## 解答

1 - 請寫一個程式計算 10! ，也就是 `10*9*8*....*1` 。

```C
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
```

2 - 請寫一個程式印出九九乘法表。

```C
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
```

3 - 請檢查某數是否為質數？ 範例： isPrime(17) => true

```C
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
```

4 - 請在一個已經排序的陣列中之正確位置插入一個數值。(範例： insert([1,2,5,6,7], 3) => [1,2,3,5,6,7])

```C
// 請在一個已經排序的陣列中之正確位置插入一個數值。(範例： insert([1,2,5,6,7], 3) => [1,2,3,5,6,7])
#include <stdio.h>

void array_insert(int a[], int *length, int item) {
  for (int i=0; i<*length; i++) {
    if (a[i] > item) { // 找到插入點
      // 把插入點之後的元素通通向後搬一格
      for (int ti=*length; ti>i; ti--) {
        a[ti] = a[ti-1];
      }      
      a[i] = item; // 把新增元素放進插入點
      break;
    }
  }
  *length += 1; // 新增了一個，長度必須加一
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
```

5 - 請算出某陣列的平均值？(範例： mean([1,2,3,4,5]) => 3)

```C
// 請算出某陣列的平均值？(範例： mean([1,2,3,4,5]) => 3)
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
```

6 - 請寫一個函數計算兩矩陣相加？(範例： add([[1,2],[3,4]], [[1,1],[1,1]]) => [[2,3], [4,5]])

```C
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
```

7 - 寫一個程式把矩陣轉置。(範例：transpose([[1,2,3], [3,2,1]]) => [[1,3], [2,2], [3,1]])

```C
// 請寫一個程式把矩陣轉置。(範例：transpose([[1,2,3], [3,2,1]]) => [[1,3], [2,2], [3,1]])
#include <stdio.h>

void matrix_transpose(double *m, int rows, int cols, double *mt) {
  for (int i=0; i<rows; i++) {
    for (int j=0; j<cols; j++) {
      int cell = i*cols+j, tcell = j*rows + i;
      mt[tcell] = m[cell];
    }
  }
}

void matrix_print(double *m, int rows, int cols) {
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
bash-3.2$ gcc matrix_transpose.c -o matrix_transpose
bash-3.2$ ./matrix_transpose
========= a ===========
  1.00   2.00   3.00
  4.00   5.00   6.00
========= b ===========
  1.00   4.00
  2.00   5.00
  3.00   6.00
*/
```

8 - 請寫一個函數可以傳回陣列的映射值？(範例：map(sqrt, [1,4,9])= [1,2,3])

```C
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
```

9 - 請用遞迴計算 n! = n*…*2*1 ？(範例： factorial(3) = 6)

```C
// 請用遞迴計算 n! = n*…*2*1 ？(範例： factorial(3) = 6)
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
```

10 - 以結構實作矩陣 Matrix

```C
// 以結構實作矩陣 Matrix (範例： add([[1,2],[3,4]], [[1,1],[1,1]]) => [[2,3], [4,5]])
#include <stdio.h>

typedef struct {
    double *m;
    int rows, cols;
} Matrix;

#define MATRIX_CELL(mat,i,j) (i*mat->cols+j)

void matrix_add(Matrix* a, Matrix* b, Matrix* c) {
  for (int i=0; i < a->rows; i++) {
    for (int j=0; j < a->cols; j++) {
      int cell = MATRIX_CELL(a, i, j);
      c->m[cell] = a->m[cell] + b->m[cell];
    }
  }  
}

void matrix_print(Matrix* m) {
  for (int i=0; i<m->rows; i++) {
    for (int j=0; j<m->cols; j++) {
      int cell = MATRIX_CELL(m, i, j);
      printf("%6.2f ", m->m[cell]);
    }
    printf("\n");
  }
}

int main() {
  double ma[] = {1,2,3,4}, mb[]={1,1,1,1}, mc[4];
  Matrix a = {.m=ma, .rows=2, .cols=2};
  Matrix b = {.m=mb, .rows=2, .cols=2};
  Matrix c = {.m=mc, .rows=2, .cols=2};

  printf("========= a ===========\n");
  matrix_print(&a);
  printf("========= b ===========\n");
  matrix_print(&b);

  matrix_add(&a, &b, &c);

  printf("========= c ===========\n");
  matrix_print(&c);
  return 0;
}

/*
bash-3.2$ gcc matrix.c -o matrix0
bash-3.2$ ./matrix0
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
```
