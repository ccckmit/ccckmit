# 臨時暫存檔 -- 如何建立暫存檔案



程式範例

```C
    #include <stdio.h>

    int main(void){
      FILE *file;
      if((file=tmpfile())==NULL) {
        printf("Cannot open temporary work file.\n");
        exit(1);
      }
      fprintf(file, "Hello! How are you.");
      fflush(file);

      char msg[10];
      fseek(file, 0, SEEK_SET);
      fscanf(file, "%s", msg);
      printf("msg=%s", msg);
      fclose(file);  
    }
```


執行結果
```
    D:\cp>gcc tmpfile.c -o tmpfile

    D:\cp>tmpfile
    msg=Hello!
```