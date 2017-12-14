## 長程跳躍 -- (setjump 與 longjump) 

在錯誤發生時，儲存行程狀態，執行特定程式的方法

**程式範例： setjump 與 longjump**

```C
    #include <stdio.h>
    #include <setjmp.h>

    jmp_buf jumper;

    int div(int a, int b) {
      if (b == 0) { // can't divide by 0
        longjmp(jumper, -3);
      }
      return a / b;
    }

    int main(int argc, char *argv[]) {
      int jstatus = setjmp(jumper);
      if (jstatus == 0) {
        int a = atoi(argv[1]);
        int b = atoi(argv[2]);
        printf("%d/%d", a, b);
        int result = div(a, b);
        printf("=%d\n", result);
      } 
      else if (jstatus == -3)
        printf(" --> Error:divide by zero\n");
      else
        printf("Unhandled Error Case");
    }
```

**執行結果**

```
    D:\cp>gcc jump.c -o jump

    D:\cp>jump 7 2
    7/2=3

    D:\cp>jump 7 0
    7/0 --> Error:divide by zero
```

**來自 jserv 的建議**

```
    => 請提及 C 語言作例外處理的重要性，以及如何用 setjump/longjump 實做 user-level thread 和 coroutine

    可參見拙作: http://blog.linux.org.tw/~jserv/archives/001848.html
```

**參考文獻**

* Java2s (C / ANSI-C) » setjmp.h » longjmp,  http://www.java2s.com/Code/C/setjmp.h/longjmplongjump.htm  
* Exception Handling in C without C++ -- Clean error handling without overhead, by Tom Schotland and Peter Petersen http://www.on-time.com/ddj0011.htm  
* 第16集 C语言中一种更优雅的异常处理机制, 作者：王胜祥　来源：希赛网　http://www.csai.cn　2005年5月19日  
* 第17集 全面了解setjmp与longjmp的使用, 作者：王胜祥　来源：希赛网　http://www.csai.cn　2005年5月21日