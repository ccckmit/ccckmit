## 錯誤訊息列表 -- 用 strerror 列出所有內建的錯誤訊息



**程式範例**

```C
    #include <stdio.h>
    #include <errno.h>

    int main ()
    {
      FILE * file;
      file=fopen ("exist.not","rb");
      if (file==NULL) {
        perror("perror");
        printf("strerror(errno)=%s\n", strerror(errno));
      }
      else
        fclose (file);
      return 0;
    }
```

**執行結果**

```
    D:\cp>gcc perror.c -o perror

    D:\cp>perror
    perror: No such file or directory
    strerror(errno)=No such file or directory
```