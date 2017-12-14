# 引用檔

檔案：matrix.h

```CPP
#define matrixAdd(A, B, M, rows, cols) add(A, B, M, rows*cols)

void matrixPrint(char *name, double *M, int rows, int cols);
void add(double *A, double *B, double *M, int size);
```

檔案：matrix.c

```CPP
#include <stdio.h>
#include "matrix.h"

void matrixPrint(char *name, double *M, int rows, int cols) {
	int i, j;
	if (name != NULL)
		printf("================= %s ====================\n", name);
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            printf("%4.1f ", M[i*cols+j]);
        }
        printf("\n");		
    }
}

void add(double *A, double *B, double *M, int size) {
	int i;
    for(i = 0 ; i < size ; i++)
        M[i] = A[i] + B[i];
}
```


檔案：main.c

```CPP
#include <stdio.h>
#include "matrix.h"

int main() {
    double X[4][3] = { {1, 2, 3}, {1, 2, 3}, {1, 2, 3}, {1, 2, 3} };
    double Y[4][3] = { {1, 1, 1}, {1, 1, 1}, {1, 1, 1}, {1, 1, 1} };
    double Z[4][3];
    double *x = X[0], *y = Y[0], *z = Z[0];
	
    matrixAdd(x, y, z, 4, 3);
	matrixPrint("X", x, 4, 3);
	matrixPrint("Y", y, 4, 3);
	matrixPrint("Z", z, 4, 3);

    double A[2][2] = { {1, 2}, {3, 4} };
    double B[2][2] = { {1, 1}, {1, 1} };
    double C[2][2];
    double *a = A[0], *b = B[0], *c = C[0];
	
    matrixAdd(a, b, c, 2, 2);
	matrixPrint("A", a, 2, 2);
	matrixPrint("B", b, 2, 2);
	matrixPrint("C", c, 2, 2);
}

```

然後用下列指令編譯並執行 (其中的 -c 參數用來告訴編譯器只要編譯成目的檔就好，不需要進一步連結成執行檔)。

```
$ gcc -c matrix.c -o matrix.o

$ gcc main.c matrix.o -o main

$ main
```
