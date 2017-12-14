
# 檔案錯誤 -- 如何處理檔案的錯誤狀況



**程式範例**

  ```
    #include <stdio.h>
    #include <stdlib.h>

    int main(int argc, char *argv[]) {
      FILE *in, *out;
      char ch;

      if((in=fopen(argv[1], "rb")) == NULL) {
        perror("Error");
        exit(1);
      }

      while(!feof(in)) {
        ch = getc(in);
        if(ferror(in)) {
          perror("Error");
          clearerr(in);
          break;
        }
        putchar(ch);
      }
      fclose(in);
      return 0;
    }```
**執行結果**

    D:\cp>gcc ferror.c -o ferror

    D:\cp>ferror
    Error: No such file or directory

    D:\cp>ferror exist.not
    Error: No such file or directory

    D:\cp>ferror ferror.c
    #include <stdio.h>
    #include <stdlib.h>

    int main(int argc, char *argv[]) {
      FILE *in, *out;
      char ch;

      if((in=fopen(argv[1], "rb")) == NULL) {
        perror("Error");
        exit(1);
      }

      while(!feof(in)) {
        ch = getc(in);
        if(ferror(in)) {
          perror("Error");
          clearerr(in);
          break;
        }
        putchar(ch);
      }
      fclose(in);
      return 0;
    }