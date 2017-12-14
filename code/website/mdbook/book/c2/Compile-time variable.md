## 編譯時期變數 -- FILE, LINE, DATE, TIME, STDC.



**程式範例**

檔案：macroVar.c

```C
    #include <stdio.h>

    int main(void) {
    // #line 100 "renameFromMacroVar.c"
      printf("Compiling %s, line: %d, on %s, at %s, STDC=%d",
           __FILE__, __LINE__, __DATE__, __TIME__, __STDC__);

      return 0;
    }
```

**執行結果**

```
    D:\cp>gcc macroVar.c -o macroVar

    D:\cp>macroVar
    Compiling macroVar.c, line: 6, on Sep  2 2010, at 14:55:30, STDC=1
```