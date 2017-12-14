## C 語言 -- 使用 Inline 函數



**程式範例**

檔案：inline.c

```
    inline int max(a,b) {
      return (a>b?a:b);
    }

    inline int min(a,b) {
      return (a<b?a:b);
    }

    int main() {
      int x = max(3,5);
      int y = min(3,5);
      printf("max(3,5)=%d\n", x);
      printf("min(3,5)=%d\n", y);
    }
```

**巨集展開結果**

執行 gcc -E inline.c -o inline.i 指令之後，就會得到 inline.i

檔案：inline.i

``` 
   inline int max(a,b) {
      return (a>b?a:b);
    }

    inline int min(a,b) {
      return (a<b?a:b);
    }

    int main() {
      int x = max(3,5);
      int y = min(3,5);
      printf("max(3,5)=%d\n", x);
      printf("min(3,5)=%d\n", y);
    }
```

**來自 jserv 的建議**

原本我寫了這句：「將函數巨集化 — (inline) 使用 inline 可以增快速度，但也會讓程式碼增大」，但似乎有很大問題，所以我就拿掉了，但是我搞不清楚問題在哪？所以忠實呈現 jserv 的來信建議。

    "將函數巨集化 — (inline) 使用 inline 可以增快速度，但也會讓程式碼增大。"

    => 這嚴重誤導讀者！
    C99 的 inline 行為和 macro 不同，請見:
    http://www.greenend.org.uk/rjk/tech/inline.html

後來經過 討論 之後，我開始理解 jserv 所說的誤導是指甚麼了，請容我總結一下錯誤的原因。

inline 並非強制要編譯器以巨集方式展開，而是提示編譯器可以用巨集或函數呼叫的方式處理，也就是授權編譯器決定要不要用巨集展開的意思。
以下是我和 jserv 的討論的過程

  　Jim Huang： 在 C99，inline function 本質上還是 function，是程式開發者對 C 編譯器的最佳化「提示」，不總是會像 macro 一般透過 C preprocessor 一樣「展開」。可以做個簡單的實驗，gcc -O0 (關閉最佳化) 對照看輸出的組合語言 ('-S' 選項)，inline 沒有實際作用
　陳鍾誠：原來如此，也就是《提示編譯器你可以自行決定要用巨集還是函數呼叫的意思》是嗎？  
　　Jim Huang： 改說「提示編譯器在適當的時機，可將函式當作巨集一般展開到函式呼叫之處」，這樣會更清楚  
　　盧釔辰 我的理解是： inline 只是"建議"編譯器你在這裡可以把整個function貼過來，好減少呼叫函式所需的長程跳躍但是否要這麼做，會由編譯器自行決定所以inline有可能會被編譯器使用，也有可能不會。請問2位大師，我理解的對嗎？如果有錯誤指正，我會很開心  
　　Jim Huang ： 盧釔辰: inline function 無法在每個場合都將 function body 予以 inlining，比方說 inline void foo(int n) { char str[n]; ... } 因為用到 variable sized data type，編譯器看到 inline 關鍵字卻無法達到預期效果 (請想想為什麼)