# C語言 -- 目錄管理函式庫

程式範例

```C
    #include <stdio.h>
    #include <sys/stat.h>

    int main() {
      char path[100];
      size_t size;
      getcwd(path, sizeof(path));
      printf("path=%s\n", path);
      mkdir("/temp1", S_IWRITE);
      chdir("/temp1");
      getcwd(path);
      printf("path=%s\n", path);  
    }

```

執行結果

```
    D:\ccc\ca>gcc dirapi.c -o dirapi

    D:\ccc\ca>dirapi
    path=D:\ccc\ca
    path=D:\temp1
```