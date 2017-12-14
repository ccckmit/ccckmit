## 字串化 -- Stringification, 使用 #symbol 可以將某符號字串化



使用 #symbol 可以讓巨集處理器將 symbol 符號轉為字串，這個過程稱為 (Stringification) ，以下是程式範例。

**範例一：將運算式字串化**

檔案：stringfication.c

```C
    #include <stdio.h>

    #define WARN_IF(EXP) \
         do { if (EXP) \
                 fprintf (stderr, "Warning: " #EXP "\n"); } \
         while (0)

    int main() {
        int x = 0;
        WARN_IF(x == 0);
    }
```

執行結果：

```
    D:\cp>gcc stringfication.c -o stringfication
    stringfication.c:11:2: warning: no newline at end of file

    D:\cp>gcc stringfication.c -o stringfication

    D:\cp>stringfication
    Warning: x == 0
```

**範例二：利用字串化取得變數名稱。**

檔案：stringfication2.c

```C 
   #include <stdio.h>
    // 本程式節錄修改自 TinyCC 
    typedef struct TCCSyms {
        char *str;
        void *ptr;
    } TCCSyms;

    #define TCCSYM(a) { #a, &a, },
    /* add the symbol you want here if no dynamic linking is done */
    static TCCSyms tcc_syms[] = {
      TCCSYM(printf)
      TCCSYM(fprintf)
      TCCSYM(fopen)
      TCCSYM(fclose)
      { NULL, NULL },
    };

    int main() {
      int i;
      for (i=0; tcc_syms[i].str != NULL; i++)
        printf("symbol:%-10s address:%d\n", tcc_syms[i].str, tcc_syms[i].ptr);
    }
```

執行結果：

```
    D:\cp>gcc stringfication2.c -o stringfication2

    D:\cp>stringfication2
    symbol:printf     address:4200528
    symbol:fprintf    address:4200512
    symbol:fopen      address:4200544
    symbol:fclose     address:4200496
```

**參考文獻**
* GCC online document (Stringification) -- http://gcc.gnu.org/onlinedocs/cpp/Stringification.html#Stringification
