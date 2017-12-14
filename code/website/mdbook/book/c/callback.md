# C 語言 -- 回呼

## 微分

檔案： @[[df.c]](code/df.c)

```
#include <stdio.h>
#include <math.h>

double dx = 0.001;

double df(double (*f)(double), double x) {
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

執行結果

```
D:\Dropbox\cccwd\db\c\code>gcc df.c -o df

D:\Dropbox\cccwd\db\c\code>df
df(x^2,2)=4.001000
df(sin(x/4),pi/4)=0.706754
```

## 積分

檔案： @[[integral.c]](code/integral.c)

```
#include <stdio.h>
#include <math.h>
#define dx 0.001

double integral(double (*f)(double), double a, double b) {
  double x, area = 0.0;
  for (x=a; x<b; x=x+dx) {
    area = area + f(x)*dx;
  }
  return area;
}

double square(double x) {
  return x*x;
}

int main() {
  printf("integral(x^2,0,1)=%f\n", integral(square,0,1));
  printf("integral(sin(x),0,pi)=%f\n", integral(sin,0,3.14159));
}


```

執行結果

```
D:\Dropbox\cccwd\db\c\code>gcc integral.c -o integral

D:\Dropbox\cccwd\db\c\code>integral
integral(x^2,0,1)=0.332834
integral(sin(x),0,pi)=2.000000

```