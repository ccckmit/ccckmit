## 模擬 try ... catch 

使用跳躍機制 (setjump, longjump) 模擬 try … catch 的錯誤捕捉機制


**程式範例**

檔案：trycatch.c

```C
    #include <stdio.h>
    #include <setjmp.h>

    enum Error { NoError=0, DivByZero=1, FileError=2 };

    jmp_buf jumper;

    void run(char *astr, char *bstr, char *fileName) {  // try 的主程式
      int a = atoi(astr);
      int b = atoi(bstr);
      if (b == 0) // can't divide by 0
        longjmp(jumper, DivByZero);
      int result = a/b;
      FILE *file;
      if ((file=fopen(fileName, "w")) == NULL)
        longjmp(jumper, FileError);
      else {
        fprintf(file, "%d/%d=%d\n", a, b, result);
        printf("save to file %s : %d/%d=%d\n", fileName, a, b, result);
      }
      fclose(file);
    }

    int main(int argc, char *argv[]) {
      int error = setjmp(jumper); // try
      switch (error) {    //
        case NoError:    //
          run(argv[1], argv[2], argv[3]);    //     run();
          break;    //
        case DivByZero:    // catch DivByZero:
          printf("Error %d : Divide by zero\n", error);//    ...
          break;    //
        case FileError:    // catch FileError:
          printf("Error %d : File error\n", error);    //    ...
          break;    //
        default:    // default:
          printf("Error %d:Unhandled error\n", error);//    ...
      } 
    }
```

**輸出結果**

```
    D:\cp>gcc trycatch.c -o trycatch

    D:\cp>trycatch 7 2 div.txt
    save to file div.txt : 7/2=3

    D:\cp>trycatch 7 0 div.txt
    Error 1 : Divide by zero

    D:\cp>trycatch 7 0 trycatch.exe
    Error 1 : Divide by zero

    D:\cp>trycatch 7 1 trycatch.exe
    Error 2 : File error
```