# 檔案緩衝區

檔案緩衝區 -- 如何指定緩衝區大小與位址

在 C 語言的標準輸出入函式庫中，您可以使用 setbuf(file, buffer) 的方法，設定擋案的緩衝區，如果您用 setbuf(file, NULL) 這個函數將緩衝區設為 NULL，就會取消檔案緩衝機制，每次都直接輸出到檔案中。

另外，您也可以使用 setvbuf(file, buffer, mode, size) 這樣的方式，設定檔案緩衝區與緩衝模式，其中的 mode 有三種可能，第一種 _IOFBF 代表完全緩衝，該模式會等緩衝區滿了之後再輸出，第二種 _IOLBF 代表行緩衝 (line buffered)，一但碰到換行時就會輸出，而第三種 _IONBF 代表不緩衝，該方法會完全不進行緩衝而直接輸出。

程式範例

檔案：setbuf.c

  ```
    #include <stdio.h>

    int main () {
      char buffer[BUFSIZ];  // BUFSIZ 定義在 stdio.h 當中。
      FILE *file;
      file=fopen ("test.txt","w");
      setbuf (file, buffer ); // setbuf(file, NULL) 會取消緩衝區，每次都直接輸出入。
      fclose (file);
      return 0;
    }```
執行結果

    D:\cp>gcc setbuf.c -o setbuf

    D:\cp>setbuf
**來自 jserv 的建議**

    這整章節沒有把 C 語言的溫床 — UNIX 背後的思維闡述好，希望能多談 standard I/O file，descriptors 的概念，以及 C standard library 提供哪些包裝，這樣探討 buffering 才有意思。