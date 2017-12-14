#範例：字串 -- string.c

C 語言宣告的字串，其實只是一種以 ASCII 編碼 0 的字母作為結果的字元陣列而已。(不像 javascript 的字串是一個物件，C 語言沒有物件的概念)。

**檔案：string.c**

```c
#include <stdio.h>
#include <string.h>

int main() {
  int i;
  char s[]="hello!"; 
  for (i=0;i<strlen(s)+1;i++) {
    printf("s[%d]=%c ascii=%d\n", i, s[i], s[i]);
   }
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc string.c -o string

    D:\Dropbox\cccwd\db\c\code>string
    s[0]=h ascii=104
    s[1]=e ascii=101
    s[2]=l ascii=108
    s[3]=l ascii=108
    s[4]=o ascii=111
    s[5]=! ascii=33
    s[6]=
說明： C 語言編譯器會自動在結尾多補一個 ASCII 代號 0 的字元，所以 s[6] 才會印出空的內容。