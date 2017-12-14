## 條件編譯 -- #if, #else, #endif, #ifdef, #ifndef, ….



**條件編譯的語法**

```
    #if constant_expression
    #elif constant_expression
    ...
    #else
    #endif
```

**程式範例**

```
    #include <stdio.h>

    int main() {
    #ifdef Linux
      printf("OS=LINUX\n");
    #elif defined(Windows)
      printf("OS=Microsoft Windows\n");
    #elif defined(OS)
      printf("OS=%s", OS);
    #else 
      printf("OS=Unknown\n");
    #endif
    }
```

**執行結果**

```
    D:\cp>gcc macroIf.c -o macroIf

    D:\cp>macroIf
    OS=Unknown

    D:\cp>gcc -DWindows macroIf.c -o macroIf

    D:\cp>macroIf
    OS=Microsoft Windows

    D:\cp>gcc -DLinux macroIf.c -o macroIf

    D:\cp>macroIf
    OS=LINUX

    D:\cp>gcc -DOS=\"Sun Solaris\" macroIf.c -o macroIf
    gcc: Solaris": Invalid argument
    macroIf.c: In function `main':
    macroIf.c:9: error: missing terminating " character
    macroIf.c:9: error: syntax error before ')' token

    D:\cp>gcc -DOS=\"Solaris\" macroIf.c -o macroIf

    D:\cp>macroIf
    OS=Solaris
    D:\cp>
```

**參考文獻**

* Wikipedia:C preprocessor --http://en.wikipedia.org/wiki/C_preprocessor