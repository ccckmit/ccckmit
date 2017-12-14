#寬窄字串間的轉換

###程式: mbstowcs.c

```c
#include <stdlib.h>
#include <stdio.h>

int main(void){
  char *str = "Hi!您好";
  wchar_t wstr[10];
  char str2[10];
  mbstowcs(wstr, str, 10);
  printf("%s\n",str);
  printf("%ls\n",wstr);
  wcstombs(str2, wstr, 10);
  printf("%s",str2);
}
```

###執行結果

    D:\cp>gcc mbstowcs.c -o mbstowcs

    D:\cp>mbstowcs
    Hi!您好
    Hi!您好
    Hi!您好