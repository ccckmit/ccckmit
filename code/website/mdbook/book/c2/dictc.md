#範例：字典 -- dict.c

C 語言沒有物件，也沒有字典結構與對應的函式庫。

C 語言可以說是高階語言裡面的低階語言，很多東西你都要自己來實作，或者採用其他人所寫的函式庫。

人員查詢 -- 姓名年齡分成兩個陣列

以下是一個實現用《姓名》搜尋《年齡》的範例，這種搜尋法是線性搜尋，比較慢但程式相對簡單！

檔案：dict.c

```c
#include <stdio.h>
#include <string.h>
    
int  size    = 3;
char *name[] = { "john", "mary", "george" };
int  age[]   = { 20,     30,     40       };

int findPeople(char *pName, int pSize) {
  int i;
  for (i=0; i<size; i++) {
    if (strcmp(name[i], pName)==0) {
      return i;
    }
  }
  return -1;
}

int main() {
  int mi = findPeople("mary", size);
  if (mi < 0) {
    printf("not found!\n");
  } else {
    printf("people[%d]: name=%s, age=%d\n", mi, name[mi], age[mi]);
  }
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc dict.c -o dict

    D:\Dropbox\cccwd\db\c\code>dict
    people[1]: name=mary, age=30
###人員查詢 -- 使用結構 (struct)

以下改使用結構 struct 來儲存人的姓名和年齡，結構和物件有點像，可以用 object.data 存取資料，但是通常不會將函數宣告在結構裡面。(因為 C 沒有支援物件的觀念，所以試圖模仿物件導向時，寫起來會很囉唆且麻煩)。

**檔案：dict2.c**

```c
#include <stdio.h>
#include <string.h>

#define SIZE 3

typedef struct {
  char *name;
  int  age;
} People;

People peoples[] = {
  { .name="john", .age=20}, 
  { .name="mary", .age=30}, 
  { .name="george", .age=40}
};

int findPeople(char *pName, int pSize) {
  int i;
  for (i=0; i<pSize; i++) {
    if (strcmp(peoples[i].name, pName)==0) {
      return i;
    }
  }
  return -1;
}

int main() {
  int mi = findPeople("mary", SIZE);
  if (mi < 0) {
    printf("not found!\n");
  } else {
    printf("people[%d]: name=%s, age=%d\n", mi, peoples[mi].name, peoples[mi].age);
  }
}
```

**執行結果**

    D:\Dropbox\cccwd\db\c\code>gcc dict2.c -o dict2
  
    D:\Dropbox\cccwd\db\c\code>dict2
    people[1]: name=mary, age=30