#微分

**檔案： df.c**

```C
#include <stdio.h>
#include <math.h>
  
double dx = 0.001;

double df(double (*Fx)(double), double x) {
  double dy = f(x+dx) - f(x);
  return dy/dx;
}

double square(double x) {
  return x*x;
}

int main() {
  printf("df(x^2,2)=%f\n", df(square, 2.0));
  printf("df(sin(x),pi/4)=%f\n", df(sin, 3.14159/4));
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc df.c -o df

    D:\Dropbox\cccwd\db\c\code>df
    df(x^2,2)=4.001000
    df(sin(x/4),pi/4)=0.706754