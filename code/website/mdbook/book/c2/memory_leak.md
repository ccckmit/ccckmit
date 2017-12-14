# C 語言的記憶體漏洞檢查

在 C 語言中，如果有人用 malloc() 等函數分配了記憶體，卻忘了用 free() 等函數進行釋放，那就會產生記憶體漏洞。要解決這個問題，必須遵循幾個原則，第一個是程式紀律的問題，例如一個很好的習慣是，採用物件導向的寫法，然後在物件的建構函數中分配記憶體，並在解構函數中，釋放該物件所分配的所有記憶體。

第二個原則是程式測試的問題，您可以使用記憶體檢查函數，進行記憶體漏洞檢查，像是 Linux 當中就有 mtrace 這樣的套件可以使用，您只要引用 這個標頭檔即可，以下是一個使用 mtrace 進行記憶體檢查的範例。

**mtrace 的使用 (Linux)**

檔案：leak.c

  ```
    #include <stdlib.h>
    #include <mcheck.h> // mtrace 的標頭檔

    int main() { 
        int *a;
        mtrace(); // 啟用 mtrace
        a = malloc(sizeof(int));  分配記憶體
        *a = 7; 
        // 忘了釋放
        return EXIT_SUCCESS;
    }```
執行方法：

```
    setenv MALLOC_TRACE  /home/karthik/temp/trace.txt // 設定 mtrace 的環境變數 MALLOC_TRACE
    $ gcc -g -Wall -ansi -pedantic leak.c -o leak.o       // 編譯
    $ ./leak                                                // 執行
    $ mtrace leak.o /home/karthik/temp/trace.txt    // 追蹤記憶體漏洞
    Memory not freed:
    -----------------
       Address     Size     Caller
    0x08049910      0x4  at /home/karthik/tips/leak.c:9 // 發現在 leak.c 的第 9 行，有 4 byte 沒釋放```
**簡單的檢查方法**

假如您沒有辦法使用像 mtrace 這種由系統所提供的記憶體檢查方法，也可以自己製作一個很簡單的版本。為了示範這種作法，我們設計了 new(), del() 與 mcheck() 等三個巨集，以示範這種簡單的漏洞檢查法。

程式範例：mcheck.c

   ``` 
    #include <stdio.h>
    #include <stdlib.h>

    int newSize = 0;
    int delSize = 0;
    #define new(TYPE, n) malloc(n*sizeof(TYPE)); newSize+=n*sizeof(TYPE)
    #define del(ptr, TYPE, n) free(ptr); delSize+=n*sizeof(TYPE)
    #define mcheck() printf("Memory:newSize=%d delSize=%d leakSize=%d\n", \
                        newSize, delSize, newSize-delSize);

    int main() {
      int *ip = new(int, 10);
      char *cp = new(char, 5);
      del(ip, int, 10);
      mcheck();
    }```
執行結果：

    D:\cp>gcc mcheck.c -o mcheck

    D:\cp>mcheck
    Memory:newSize=45 delSize=40 leakSize=5
有了這樣的函數，您就可以知道是否有記憶體漏洞的存在了，雖然不像 mtrace 那樣可以直接告訴您產生漏洞的程式位置，但至少可以讓您檢查是否存在記憶體漏洞。

**來自 jserv 的建議**

```內文提到:
"""
K & R 設計 C 語言時，還沒有物件導向的概念，因此不太可能設計出像範例五這樣具有物件導向概念的字串函式庫。當時電腦的記憶體極為有限，而且
K&R 一心只想設計出 UNIX 作業系統，因此像 strcpy()、strcat()、strtok()
這樣的函數，可以同時支援字串陣列與指標，因而發展出這樣一套 C 語言函式庫。
"""
==> 這說法不正確。事實上，我們在 UNIX 在 1974 年的經典論文，不時可見 "object" 字樣，甚至檔案系統的設計本來就有
OOP 風格。合理的說法是，C 語言的設計者將記憶體管理交給程式開發者去負責，UNIX 和 C
語言一樣的原則是，充分相信程式開發者，特別在記憶體管理的議題上。```
**參考文獻**

    Identifying Memory Leaks in Linux for C++ Programs -- http://www.devx.com/tips/Tip/20915