## 訊號機制 -- (signal) 攔截中斷訊號的處理機制

**程式範例**

```C
    #include <signal.h>
    #include <stdio.h>
    #include <windows.h>

    void sigdump(int sig) {
        printf("catch a signal:%d\n", sig);
    }

    int main(int argc, void *argv[]) {
        signal(SIGABRT, &sigdump);    // Process abort signal.
        signal(SIGFPE, &sigdump);    // Erroneous arithmetic operation.
        signal(SIGILL, &sigdump);    // Illegal instruction.
        signal(SIGINT, &sigdump);    // Terminal interrupt signal. Ctrl-C
        signal(SIGSEGV, &sigdump);    // Invalid memory reference.
        signal(SIGTERM, &sigdump);    // Termination signal.
        int a=7, b=0, result;
        if (strcmp(argv[1], "FPE")==0)
          result = a/b;
        else if (strcmp(argv[1], "SEGV")==0) {
          * (int*) (10000) = 1;
        }
        Sleep(1000*10);
        return 0;
    }
```

**執行結果**

```
    D:\cp>gcc signal.c -o signal

    D:\cp>signal FPE
    catch a signal:8

    D:\cp>signal SEGV
    catch a signal:11

    D:\cp>signal
    catch a signal:11

    D:\cp>signal X     // 執行後請在 10 秒鐘內按下 Ctrl-C，就會出現 catch a signal:2 的訊息
    catch a signal:2  
```

**來自 jserv 的建議**

```
    => 這個案例不好，第一個因為 <windows.h>，另外沒有闡述 UNIX signal 和 Windows 對於 POSIX 的支援狀況
```

**參考文獻**

* C语言编程技巧-signal(信号), 2008-12-08 来源：网络 -- http://www.uml.org.cn/c++/200812083.asp