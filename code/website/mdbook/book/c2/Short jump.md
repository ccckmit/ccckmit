## C 語言 -- 短程跳躍 (goto)



**程式範例**

```
    #include <stdio.h>

    int main(int argc, char *argv[]) {
      int a = atoi(argv[1]);
      int b = atoi(argv[2]);
      char *fileName = argv[3];
      if (b == 0) // can't divide by 0
        goto DivideByZero;
      int result = a/b;
      FILE *file;
      if ((file=fopen(fileName, "w")) == NULL)
        goto FileError;
      else {
        fprintf(file, "%d/%d=%d\n", a, b, result);
        printf("save to file %s : %d/%d=%d\n", fileName, a, b, result);
      }
      fclose(file);
      goto Exit;
    DivideByZero:
      printf("Error  : Divide by zero\n");
      goto Exit;
    FileError:
      printf("Error : File error\n");
      goto Exit;
    Exit:
      return 0;
    }
```

**執行結果**

```
    D:\cp>gcc trygoto.c -o trygoto

    D:\cp>trygoto 7 2 div.txt
    save to file div.txt : 7/2=3

    D:\cp>trygoto 7 0 div.txt
    Error  : Divide by zero

    D:\cp>trygoto 7 2 trygoto.exe
    Error : File error
```

**注意事項**

goto 指令之所以被認為是短程跳躍，是因為 goto 不可以跨越函數，舉例而言，以下的跳躍方式就會出錯。

```
    #include <stdio.h>

    void div() {
    DivideByZero:
      printf("Error  : Divide by zero\n");
    }

    int main(int argc, char *argv[]) {
      int a = atoi(argv[1]);
      int b = atoi(argv[2]);
      char *fileName = argv[3];
      if (b == 0) // can't divide by 0
        goto DivideByZero;
      int result = a/b;
      return 0;
    }
```

**編譯錯誤**

```
    D:\cp>gcc trygotoerror.c -o trygotoerror
    trygotoerror.c: In function `main':
    trygotoerror.c:13: error: label `DivideByZero' used but not defined
```