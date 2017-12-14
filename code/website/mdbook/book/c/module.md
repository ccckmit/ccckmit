## C 語言的模組化 – 學校沒教的那些事兒！ -- 以矩陣相加為例

有朋友在「程式人雜誌」社團上問到有關 C 語言的參數傳遞問題，其討論帖如下：

* <https://www.facebook.com/groups/programmerMagazine/permalink/622690621080991/>

筆者想藉此問題在此進行釐清與回答。

問題 1：C 語言的模組化問題

* 吳秉穎：不好意思可以問一個小問題嗎?
    * 老師給我的題目:以同一程式主類別之外部二維矩陣相加方式將 Sales A&B 每個月相加，其結果再以不在同一程式方式與 Sales C 每個月相加和輸出結果。
    * 因為要寫 C 跟JAVA，JAVA我是寫完了，但是不懂 C 要以不在同一程式方式寫是什麼意思? C 可以這樣寫嗎?

* 陳鍾誠：就是用兩個以上的 .c 檔，加上 .h 檔的方式，例如：main.c module1.c module2.c module1.h module2.h 的方式。

問題 2：矩陣參數與回傳值問題

* 吳秉穎：不好意思 請問一下 陣列怎回傳到主程式

```CPP
#include <iostream>
#include<stdio.h>
#include<stdlib.h>
/* run this program using the console pauser or add your own getch, system("pause") or input loop */
int sum(int arr[4][3],int arr1[4][3]);
int sum1(int arr[4][3],int arr1[4][3]);
void show(int arr[4][3]);
int main(int argc,char *argv[]) {
  int a[4][3],b[4][3],c[4][3],d[4][3];
  printf("請輸入A&B&C報表: \n");
  for(int i=0;i<4;i++)
  {
    for(int j=0;j<3;j++)
    {
      scanf("%d",&a[i][j]);
      scanf("%d",&b[i][j]);
      scanf("%d",&c[i][j]);
      d[i][j]=a[i][j]+b[i][j];
    }
    printf("\n");
  }
  sum1(a,b);
  sum(c,d);
  system("pause");
  return 0;
}

int sum1(int arr[4][3],int arr1[4][3])
{
  int i,j,d[4][3];
  for(i=0;i<4;i++)
  {
    for(j=0;j<3;j++)
    {
      d[i][j]=arr[i][j]+arr1[i][j];
    }
  }
  show(d);
  //return (d[4][3]);
} 
```

* 吳秉穎：現在卡在是 我想要把 SUM1 的 D 再傳到 SUM 裡跟 C 家再一起
* 李○○：你在函數參數內再放入一個陣列指標參數 將arr + arr1的值指派給他 不用迴傳就可以拿到此值了
* 吳秉穎：恩我試試看
* 李○○：你的函數宣告有很大的問題 參數型太沒人這樣用的吧@@
* 李○○：感覺你對於記憶體概念跟指標不是很熟
* 吳秉穎：對呀!還在學
...
* 若○○：你丟指標過去到涵式裡面就可以傳陣列了，2 維 = (ptr*)*
* 若○○：
    * 在 c 用標準的 stdio 涵式要小心很容易會爆掉 memory, 我舉例：scanf <= 這個涵式是要靠 `\n` 或是 `\0` 斷尾，不然它會無止盡的去換算下去...
    * 就是說如果你在 a[y][x] 裡面的值不是標準的 byte 或是整斷的結尾的話，那麼... %d 可能會轉成亂七八糟的東西出來，爆 mem 機率很大，而 & 取指符號的用法是要一開始用的，我不知道在 a[y][x] 的地方可不可以取址，因為 c 沒有很高階，要先在 &a 這裡取址，然後 a[y][x] 的位置要用算的，= (ptr[x] * ptr[y])* ，不知道我這樣說對不對...
    * 二維的意思是方形的區塊，但是在 mem 裡面是 (x * y)* 這樣代表 a[x][y]，所以一般都會先把維給轉成指標再去運算，在宣告的時候 int a[y][x] 這樣的用法在 c 語言是每一個 a[][] 都是 int 的區斷，並不是整個 int 如果你用 sizeof() 去取得就是得到 int (x * y) 那麼大的一塊 mem 區域，然後 a 和 b 的 array 不能夠直接去做 sum 運算...
    * 因為 int (x * y) 在 c 裡面是看成單獨的 int (x * y) 而不是一整個可以放單一個數值的，不知道我這樣會不會越說越亂...
    * 最後要回傳的值，必須要符合你一開始給涵數所宣告的遞迴值，你用 int 去宣告，就要符合 int 型態，你可以傳 int 的指標‧

* 劉○○：請問樓上的大大 我該如何釐清所有程式的概念阿..
* 若○○：好問題... 我也弄不懂...
* 劉敦桐：我光 C 就1個頭兩個大了
* 若○○：我說一個經驗談好了，asm 是最基礎的機械語言，而 c 語言是把 asm 語言做成很多的 marco 巨集處理出來的二階語言，而更高階的 c++ 和 c# 語言則是將 c + 標準涵式庫再做一次 macro 處理的三階語言，所以在處理 memory 上有極高效率與穩定的特性，因此複雜度會高許多，但是因為高階語言所能夠容納的標處理器是更多，因此更貼合人類語言，所以感覺比較好學一點，其實許多觀念會比 asm 來的複雜不簡單的特性，我本身的感覺是透過基本的機械語言和 c 能夠去更了解實體的高階語言可能會有一些不一樣的想法...
* 吳秉穎 還有一些程式範例是 屏科老師的 我去他網站抓的
* 若○○ http://programming.im.ncnu.edu.tw/Chapter9.htm
* 若○○ *(p+10) = 100; // 相當於x[10] = 100
* 劉○○ 恩Q_Q
* 若○○ 2 維就是 *(*(ptr))
* 若○○ 用成的就可以指過去
* 若○○ 問一個小問題喔... int a[10]，在 a[1] - a[2] 的 mem 區域是怎麼編排的?!是 int a[1] + \0 + a[2] 或是 a[1] + a[2] 無空隙?!還是 a[1] 的實際位址在 0x000001 而 a[2] 是在 0xffff00，而 int a[1] 裡面裝的到底是什麼?!0000 0000 0000 0000 ?!
* 李○○ 位置應該會連續吧 我指的是MMU來說 實體記憶體應該不一定會連續 裡面裝的值應該是亂碼嗎? 我有說錯嗎~~
* 陳鍾誠 是 a[1] + a[2] 無空隙
* 紀○○ 陣列是一段連續的記憶體a[1]-a[2]的位址距離是sizeof(int)的大小
* 陳鍾誠 只有字串才需要以 \0 結尾，陣列是連續的空間。
* 陳鍾誠 對於有 MMU 的情況而言，在邏輯位址空間上仍然是連續的。但在實體位址空間就有可能有斷裂的情況。

問題 3 :矩陣參數與回傳值問題 (續)

* 吳秉穎：若再不用指標的方式將A[4][3]跟B[4][3]的兩個二維陣列傳到函數裡相加，也就是

```CPP
for(int i = 0 ; i < 4 ; i++)
{
  for(int j = 0 ; j < 3 ; j++)
  {
    D[i][j]=A[i][j]+B[i][j];
  }
}
```

* 我要如何將D陣列回傳到main裡，請問這方法可不可行。
* 若○○：int arr[10][10] main()...
* 吳秉穎：謝謝各位解說，所以如果我寫 void main(void) 這樣就無法接收回傳值對吧

### 筆者回覆與釐清

許多 C 語言的學習者都會有同樣的問題，但是卻往往學了很久之後還是不知道答案，有時摸索了很久自己找出一個答案，卻不見得就是好的方法。

以上的問題大致可歸結為兩個，第一個是「陣列的參數傳遞問題」，第二個是「程式的模組化問題」。

首先讓我們解答「陣列的參數傳遞問題」。

標準 C 語言的參數傳遞，基本上只有兩種，一種是傳值的參數 (通常用在基本型態上)，另一種是傳遞位址的參數 (通常用在陣列或結構上)。

舉例而言，在下列程式當中，函數 max 的參數 a, b 都是傳遞值的參數。而函數 sum 的參數 len 仍然是傳值的參數，但 a 則是傳遞位址的參數。

檔案：param.c

```CPP
#include <stdio.h>

int max(int a, int b) {
  if (a > b)
    return a;
  else
    return b;
}

int sum(int a[], int len) {
  int i, s=0;
  for (i=0; i<len; i++) {
    s += a[i];
  }
  return s;
}

int main() {
  int x = 3, y = 5;
  int z = max(x, y);
  int array[] = { 1, 2, 3, 4, 5};
  int s = sum(array, 5);
  printf("x=%d y=%d z=%d s=%d\n", x, y, z, s);
}
```

執行結果：

```
D:\Dropbox\Public\c>gcc param.c -o param

D:\Dropbox\Public\c>param
x=3 y=5 z=5 s=15
```

對於傳值的參數，在傳遞時會複製一份該參數傳進函數，因此函數中的任何的修改都將不會影響到原來的正本，
因此下列程式中 modify(a) 函數呼叫後， a 的值仍然是 5，並不會改變。

檔案：modify1.c

```CPP
#include <stdio.h>

int modify(int x) {
  x += 3;
}

int main() {
  int a = 5;
  modify(a);
  printf("a=%d\n", a);
}

```

執行結果：

```
D:\Dropbox\Public\c>gcc modify1.c -o modify1

D:\Dropbox\Public\c>modify1
a=5
```

但是對於傳遞位址的參數，如果我們採用類似的方法進行修改，那麼其內容將會被改變，因此下列程式中的 modify(a) 
執行完之後，a[0] 的值將會變成 8。

檔案：modify2.c

```CPP
#include <stdio.h>

int modify(int x[]) {
  x[0] += 3;
}

int main() {
  int a[] = { 5 };
  modify(a);
  printf("a[0]=%d\n", a[0]);
}

```

執行結果：

```
D:\Dropbox\Public\c>gcc modify2.c -o modify2

D:\Dropbox\Public\c>modify2
a[0]=8
```

事實上、傳址參數也有進行參數複製後傳遞的動作，但複製的是「記憶體位址」，而非參數內容，假如上述程式中 a 的記憶體位址為 100，
那麼當 modify(a) 被呼叫時，會將 100 複製一份後傳給 x，因此當 x[0] +=3 執行的時候，事實上是將記憶體位址 100 的內容 5 取出，然後
加上 3 ，於是記憶體位址 100 的內容就變成了 8，因此在程式執行完之後，a[0] (也就是記憶體位址 100 的內容) 的值也就變成 8 了。

對於上述的程式，如果我們改成指標的寫法，那麼程式碼將改寫如下：

```CPP
#include <stdio.h>

int modify(int *x) {
  x[0] += 3;
}

int main() {
  int a[] = { 5 };
  modify(a);
  printf("a[0]=%d\n", a[0]);
}

```

執行結果：

```
D:\Dropbox\Public\c>gcc modify3.c -o modify3

D:\Dropbox\Public\c>modify3
a[0]=8
```

您可以看到這兩個版本，除了 int x[] 改為 int *x 之外，其餘的部分完全沒有改變，因為在 C 語言當中，陣列形態的參數事實上就是用
「位址」的方式傳遞的，而這也正是傳址參數的底層實作方式。

接著讓我們看看矩陣參數的傳遞問題，首先讓我們看看以下的二維陣列寫法。

檔案：matrix1.c

```CPP
#include <stdio.h>

#define ROWS 4
#define COLS 3

void print(char *name, double M[ROWS][COLS]) {
  int i, j;
  if (name != NULL)
    printf("================= %s ====================\n", name);
  for(i = 0; i < ROWS; i++) {
    for(j = 0; j < COLS; j++) {
      printf("%4.1f ", M[i][j]);
    }
    printf("\n");   
  }
}

void add(double A[ROWS][COLS], double B[ROWS][COLS], double M[ROWS][COLS]) {
  int i, j;
  for(i = 0 ; i < ROWS ; i++) {
    for(j = 0 ; j < COLS ; j++) {
      M[i][j]=A[i][j]+B[i][j];
    }
  }
}

int main() {
  double X[ROWS][COLS] = { {1, 2, 3}, {1, 2, 3}, {1, 2, 3}, {1, 2, 3} };
  double Y[ROWS][COLS] = { {1, 1, 1}, {1, 1, 1}, {1, 1, 1}, {1, 1, 1} };
  double Z[ROWS][COLS];
  
  add(X,Y,Z);
  print("X", X);
  print("Y", Y);
  print("Z", Z);
}

```

執行結果

```
D:\Dropbox\Public\c\matrix>gcc matrix1.c -o matrix1

D:\Dropbox\Public\c\matrix>matrix1
================= X ====================
 1.0  2.0  3.0
 1.0  2.0  3.0
 1.0  2.0  3.0
 1.0  2.0  3.0
================= Y ====================
 1.0  1.0  1.0
 1.0  1.0  1.0
 1.0  1.0  1.0
 1.0  1.0  1.0
================= Z ====================
 2.0  3.0  4.0
 2.0  3.0  4.0
 2.0  3.0  4.0
 2.0  3.0  4.0
```

您可以看到這樣的寫法感覺好像很正常，但事實上卻很沒有彈性，因為陣列大小都定死了，沒有辦法同時宣告 `4*3` 的陣列與 `3*5` 的陣列。

假如我們改用以下寫法，彈性就會大多了，因為可以宣告任意大小的二維陣列。

檔案：matrix2.c

```CPP
#include <stdio.h>

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

#define matrixAdd(A, B, M, rows, cols) add(A, B, M, rows*cols)

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

註：讀者可能會感覺到奇怪，為何我們用 `double *x = X[0]` 這樣的語法，筆者原本是寫成 `double *x = (double *) X` 這樣的方式，
但是這樣的語法在 gcc 中是正確的，但有人在 Visual C++ 當中編譯就錯了。而用 `double *x = X[0]` 這樣寫，因為 X 是二維陣列，
X[0] 自然就是一維陣列，與 `double *x` 的形態相容，而且位址也對，所以就採用了這種寫法。

執行結果：

```
D:\Dropbox\Public\c\matrix>gcc matrix2.c -o matrix2

D:\Dropbox\Public\c\matrix>matrix2
================= X ====================
 1.0  2.0  3.0
 1.0  2.0  3.0
 1.0  2.0  3.0
 1.0  2.0  3.0
================= Y ====================
 1.0  1.0  1.0
 1.0  1.0  1.0
 1.0  1.0  1.0
 1.0  1.0  1.0
================= Z ====================
 2.0  3.0  4.0
 2.0  3.0  4.0
 2.0  3.0  4.0
 2.0  3.0  4.0
================= A ====================
 1.0  2.0
 3.0  4.0
================= B ====================
 1.0  1.0
 1.0  1.0
================= C ====================
 2.0  3.0
 4.0  5.0
```

現在我們應該已經回答完 C 語言參數的傳遞問題了，接著讓我們來回答第二個問題，也就是 C 語言的模組化問題。

針對以上程式，我們通常不應該將主程式與矩陣函數撰寫在同一個檔案裏面，因此我們可以分開成兩個檔案：main.c 
與 matrix.c 如下所示：

檔案：matrix.c

```CPP
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

#define matrixAdd(A, B, M, rows, cols) add(A, B, M, rows*cols)
```

檔案：main.c

```CPP
#include <stdio.h>
#include "matrix.c"

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

編譯時您只要將兩個檔案放在同一個資料夾，就可以用下列指令編譯完成後執行，執行結果仍然與原本一樣。

```
$ gcc main.c -o matrix

$ ./matrix
```

雖然以上的方式已經可以「分開撰寫、合併編譯」，但是仍然有一些缺陷，那就是每次要使用矩陣函式庫時，
都要用 `#include "matrix.c"` 指令將整個 matrix.c 引入並且重新編譯，這樣作會造成編譯速度緩慢的問題，
因此若要加快速度，可以將 matrix.c 先行編譯為目的檔 matrix.o，然後再將 matrix.c 當中的函數原型抽取
出來獨立成一個檔案 matrix.h，這樣不用每次都勞動編譯器重新編譯 matrix.c 檔，而且可以讓編譯器將
main.c matrix.h matrix.o 等檔案順利編譯連結成執行檔。

因此我們可以將上述程式改寫如下。

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

$ ./main
```

但是上述程式可能還會引起一些小問題，因為有些編譯器可能會對重複引用的行為產生警告或編譯錯誤的形況，
因此最好再加上引用防護，將 matrix.h 改寫如下。

檔案：matrix.h

```CPP
#ifndef __MATRIX_H__
#define __MATRIX_H__

#define matrixAdd(A, B, M, rows, cols) add(A, B, M, rows*cols)

void matrixPrint(char *name, double *M, int rows, int cols);
void add(double *A, double *B, double *M, int size);

#endif
```

如此就完成了將矩陣函數模組化的動作，事先將 matrix.c 編譯成目的檔 matrix.o，以縮短編譯時間，並且方便
使用者引用。

當然、如果您有很多模組，分別都編譯成目的檔，最好還是用 ar 指令將這些目的合併成函式庫，這樣就不用每次編譯
都要引用一大堆目的檔，只要引用對應的函式庫就可以了。

### 結語

對於初學 C 語言的朋友們而言，參數傳遞的誤解與型態的混淆是很常見的問題，不會使用 *.h 或撰寫引用防護也是很正常的事情。
C 語言是一個很困難的語言 (Ｃ++ 則更困難，事實上、C 語言是筆者所學過的語言當中，我認為最困難的一個。不過最近發現 JavaScript 這個語言
有後來居上的趨勢 -- 或者說有些語法更不容易理解)，所以初學者在學習 C 語言時感到困難是很正常的事情。

我還記得自己在先前寫的一份網誌電子書上寫下了這一段話，在此與讀者分享：

> 當我還是一個大學生的時候，總覺得 C 語言就是這樣了。但是在 10 年後我進入職場時，才發現原來我並不太認識這個語言。產業界所使用的 C 語言有許多是大學所沒有教授過的，像是 #ifdef、make、GNU 工具等等。又過了 10 年，當我研究嵌入式系統時，這個感覺又出現了，我仍然不太認識 C 語言，嵌入式系統中所使用的「記憶體映射輸出入、volatile、組合語言連接、Link Script」等，又讓我耳目一新，我再度重新認識了 C 語言一次。然後，當我研讀 Linux 核心的程式碼時，看到 Torvalds 所使用的「鏈結串列、行程切換技巧」等，又再度讓我大為驚訝，C 語言竟然還可以這樣用。然後，當我開始研究 Google Android 手機平台的架構時，又看到了如何用 C 語言架構出網路、視窗、遊戲、瀏覽器等架構，於是我必須再度學習一次 C 語言。
> 
> 當我翻閱坊間的書籍時，不禁如此想著，如果有人能直接告訴我這些 C 語言的學習歷程，那應該有多好。難道，我們真的必需花上數十年的時間去學習 C 語言，才能得到這些知識嗎？這些知識在初學者的眼中，看來簡直像是「奇技淫巧」。然而這些「奇技淫巧」，正是 C 語言為何如此強大的原因，我希望能透過這本書，告訴各位這些「奇技淫巧」，讓各位讀者不需要再像我一樣，花上二十年功夫，才能學會這些技術。
> 
> 在我的眼中，C 語言就像一把鋒利的雙面刃，初出茅廬的人往往功力不夠深厚，反而將這個神兵利器往自己身上砍，因而身受重傷。但是在專家的手中，C 語言卻具有無比的威力，這種神兵利器具有「十年磨一劍、十步殺一人」的驚人力量。筆者希望能透過這本書，讓讀者能夠充分發揮 C 語言的力量，快速的掌握這個難以駕馭的神兵利器。

### 參考文獻

* 免費電子書：高等 C 語言(專業限定版) -- <http://ccckmit.wikidot.com/cp:main>

### 補充

在本文預覽版刊出之後，柏諺兄在 [程式人雜誌社團] 當中寫了一段精準的解說，於是我將這段解說放在這裏，作為補充：


在 C 語言裡面沒有 "傳遞陣列" 給函式的概念, 一直都是 call by value. 

#### 預備知識

當你在將 陣列名稱 傳遞給函式或是拿去作數值運算([], +)時, 你的運算元實際上是 "第一個元素的位址值", 我們在語言裡稱它為 decay(退化). 陣列不是指標, 但能夠退化成指標. 

在 C/C++ 中型別是很重要的, 例如陣列 int array[ 2 ][ 3 ]: (array) 的數值跟 array[ 0 ]、&array[ 0 ][ 0 ] 一樣, 但是他們各自擁有不同的型別, 在運算上的差異甚大. 若以 "數值" 來理解這個語言那麼有可能在撰寫跨平台程式時產生非預期的bugs.

陣列和函式的型態跟一般內建型態不同, 是在變數的左右兩側, 例如一維陣列: int array[ 10 ], array 自己本身的型態是 int[ 10 ], 而成員型態則是 int; 二維陣列: int matrix[ 4 ][ 3 ], matrix 本身的型態是 int[ 4 ][ 3 ], 成員型態則是 int[ 3 ] (所代表的意義是: matrix 是一個 int[ 3 ] 陣列, 大小為 4 )

有這樣的理解我們就可以看懂更複雜的語法: 

```CPP
int add( int, int ), abs( int );
```

上面程式碼是在 "宣告" 兩個函式: 
1) 第一個是 add(), 有兩個 int 參數, 回傳值型態是 int
2) 第二個是 abs(), 只有一個 int 參數, 回傳值型態是 int

因為宣告時每個名稱能夠共用的只有型態的左邊部分, 但是右邊部分無法共用所以必須分開寫.

#### 本文開始

在範例中的函式宣告(a):

```CPP
void print(char *name, double M[ROWS][COLS]);
```

有的人說 "最高維可以忽略", 所以延伸了第二種宣告方式(b):

```CPP
void print(char *name, double M[][COLS]);
```

但最正確的宣告則是第三種(c):

```CPP
void print(char *name, double (*M)[COLS]);
```

三者被 名稱修飾(Name Mangling) 出來的結果是一樣的, 但是你卻無法傳遞 int[ ROWS+1 ][ COLS ] 給 (a) --- 因為撰碼的人在宣告的地方自己加上最高維的限制使然.

當叫用 print( "Y", Y ) 時, Y 會被 decay(退化) 成指標, 因為 Y 的型態是 double[ROWS][COLS], 它的成員型態是 double[COLS], 那麼第一個元素的位址型態就是 double(*)[COLS] 所以我們參數應該寫成 (c) 而不是其它兩種. 一樣的概念適用在任何維度的陣列.

在 print() 內可以直接使用 M[ i ][ j ] 的語法來存取成員, M[ i ] 是對傳進來的連續 double[COLS] 中取第 i 個小陣列, [ j ] 則是拿出小陣列的第 j 個值, 想要達到陣列 slice 也不無可能.

用不適當的方法去傳遞多維陣列導致 M[i*cols+j] 這寫法反而有可能拖慢間接位址計算的速度.

順帶一提下面的宣告:
 
```CPP
void matrixPrint(char *name, double *M, int rows, int cols); 
```

語意上是 "給予一塊連續的 double 記憶體, 並且用額外的必要資訊 rows, cols 來存取該記憶體". 這邊我們看到的就只剩數個 double 小個體而不是整體概念 "矩陣", 所以傳遞的時候最好用 struct 包裝起來 "語意" 才會一樣.
