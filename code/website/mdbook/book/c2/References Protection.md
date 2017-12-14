## 引用防護 -- 避免重複引用某一個引用檔，或者重複定義某結構

在開發 C 語言專案時，我們通常在每一個標頭檔的開始與結尾，使用 #ifndef #define #endif 的方式防止重複引用，其語法通常如下所示。

```C
    #ifndef XXX_H 
    #define XXX_H
    ...

    #endif
```

舉例而言，以下是我們所撰寫的一個標頭檔 Str.h，我們可以使用 #ifndef STRH #define STRH ...#endif 來避免重複引用 Str.h 所造成的編譯錯誤，其程式碼如下所示。

```C
    #ifndef STR_H
    #define STR_H

    typedef struct {
      char *s;
    } Str;

    extern void StrAppend(String*, char *);

    #endif
```

這種方式是許多 C 語言初學者所不知道的，由於沒有與其他人一同開發過專案，而且寫程式時也都是自己一個人寫，就很難知道要使用這樣的技巧，這種技巧稱為「引用防護」(include guard)。

在某些 C 語言編譯器中，提供了 #pragma once 這樣的編譯指引，可以避免冗長的引用防護撰寫語法，但是為了可攜性的緣故，通常我們還是會加上引用防護，而不是只撰寫 #pragma once，因為畢竟寫一行的 #pragma 與寫三行的引用防護並沒有差太多。

在 Objective C 這個語言中，由為內建就有引用防護機制，因此就不需要撰寫這樣的語法了。