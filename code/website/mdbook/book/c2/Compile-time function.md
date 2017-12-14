## 編譯時期函數 -- #define, #undef, defined(), #error, #line, …



在 C 語言的巨集處理器當中，常用的編譯時期函數有 defined(), #error, #warning, #pragma，以下我們將介紹這些編譯時期函數的用法。

defined() : 檢查某的巨集定義是否被定義了，通常與 #if 合用，像是 #if defined(OS) ...

```
    #error : 在編譯時，輸出錯誤訊息，警告使用者某些錯誤，並且不會真的進行編譯，在巨集處理階段就會停止。

    #warning:在編譯時，輸出警告訊息，警告使用者某些注意事項，但是不會中止編譯，仍然會繼續編譯出目的檔。

    #pragma: 用來告知編譯器某些特殊指示，例如不要輸出錯誤訊息，抑制警告訊息，或者加上記憶體漏洞檢查機制等。
```

雖然 #error 與 #warning 後的訊息並不需要加上字串式的引號，但是建議最好還是加上，以避免特殊符號所產生的一些問題，導致巨集處理器的誤解。以下是這兩種狀況。

不好：#warning Do not use ABC, which is deprecated. Use XYZ instead.

較好：#warning "Do not use ABC, which is deprecated. Use XYZ instead."

**程式範例**

檔案：macroFunc.c

```C
    #include <stdio.h>

    #if !defined( HELLO_MESSAGE )
       # error "You have forgotten to define the header file name."
    #endif

    char *format = "%s",
         *hello = HELLO_MESSAGE;

    int main() {

      printf ( format, hello );

    }
```

**執行結果**

```
    D:\cp>gcc macroFunc.c -o macroFunc
    macroFunc.c:4:6: #error "You have forgotten to define the header file name."
    macroFunc.c:8: error: `HELLO_MESSAGE' undeclared here (not in a function)

    D:\cp>gcc -DHELLO_MESSAGE=\"Hello!\" macroFunc.c -o macroFunc

    D:\cp>macroFunc
    Hello!
```