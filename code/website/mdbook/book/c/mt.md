# 翻譯系統

## 範例：字典 -- dict.c

C 語言沒有物件，也沒有字典結構與對應的函式庫。

C 語言可以說是高階語言裡面的低階語言，很多東西你都要自己來實作，或者採用其他人所寫的函式庫。

### 人員查詢 -- 姓名年齡分成兩個陣列

以下是一個實現用《姓名》搜尋《年齡》的範例，這種搜尋法是線性搜尋，比較慢但程式相對簡單！

檔案：dict.c

```javascript
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

執行結果

```
D:\Dropbox\cccwd\db\c\code>gcc dict.c -o dict

D:\Dropbox\cccwd\db\c\code>dict
people[1]: name=mary, age=30
```

### 人員查詢 -- 使用結構 (struct)

以下改使用結構 struct 來儲存人的姓名和年齡，結構和物件有點像，可以用 object.data 存取資料，但是通常不會將函數宣告在結構裡面。(因為 C 沒有支援物件的觀念，所以試圖模仿物件導向時，寫起來會很囉唆且麻煩)。

檔案：dict2.c

```javascript
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

執行結果

```
D:\Dropbox\cccwd\db\c\code>gcc dict2.c -o dict2

D:\Dropbox\cccwd\db\c\code>dict2
people[1]: name=mary, age=30

```

## 英翻中系統 (版本 1)

程式： mt.c

```CPP
#include <stdio.h>
#include <string.h>

char *e[] = {"dog", "cat", "a",    "chase",  "eat", NULL};
char *c[] = {"狗",  "貓",  "一隻", "追",     "吃" , NULL};

int find(char *nameArray[], char *name) {
  for (int i=0; nameArray[i] != NULL; i++) {
    if (strcmp(nameArray[i], name)==0)
    return i;
  }
  return -1;
}

void mt(char *words[], int len) {
  for (int i=0; i<len; i++) {
    int ei = find(e, words[i]);
    if (ei < 0)
      printf(" _ ");
    else
      printf(" %s ", c[ei]);
  }
}

int main(int argc, char *argv[]) {
  mt(&argv[1], argc-1);
}
```

執行結果：

```
$ gcc mt.c -std=c99 -o mt

$ ./mt a dog chase a cat
 一隻  狗  追  一隻  貓
```

## 英翻中系統 (版本 2 英中互翻)

程式： mt2.c

```CPP
#include <stdio.h>
#include <string.h>

char *e[] = {"dog", "cat", "a",    "chase",  "eat", NULL};
char *c[] = {"狗",  "貓",  "一隻", "追",     "吃" , NULL};

int find(char *nameArray[], char *name) {
  int i;
  for (i=0; nameArray[i] != NULL; i++) {
	if (strcmp(nameArray[i], name)==0) {
	  return i;
	}
  }
  return -1;
}

void mt(char *words[], int len) {
  int i;
  for (i=0; i<len; i++) {
    int ei = find(e, words[i]);
	int ci = find(c, words[i]);
	if (ei >= 0) {
	  printf(" %s ", c[ei]);
	} else if (ci >=0) {
	  printf(" %s ", e[ci]);
	} else {
	  printf(" _ ");
	}
  }
}

int main(int argc, char *argv[]) {
  mt(&argv[1], argc-1); // 從 argv (例如：mt a dog chase a cat) 中取出尾部的位址 (例如：a dog chase a cat)。
}
```

執行結果：

```
D:\Dropbox\cccwd\db\c\code>gcc mt2.c -o mt2

D:\Dropbox\cccwd\db\c\code>mt2 a dog chase a cat
 一隻  狗  追  一隻  貓

D:\Dropbox\cccwd\db\c\code>mt2 一隻 狗 追 一隻 貓
 a  dog  chase  a  cat

D:\Dropbox\cccwd\db\c\code>mt2 a 狗 chase 一隻 cat
 一隻  dog  追  a  貓
```

## 中翻英系統

程式： c2e.c

```CPP
#include <stdio.h>
#include <string.h>

char *e[] = {"dog", "cat", "a",    "chase",  "eat", NULL};
char *c[] = {"狗",  "貓",  "一隻", "追",     "吃" , NULL};

int find(char *nameArray[], char *name) {
  int i;
  for (i=0; nameArray[i] != NULL; i++) {
	if (strcmp(nameArray[i], name)==0) {
	  return i;
	}
  }
  return -1;
}

// 注意，一個中文字佔兩個 byte，也就是兩個 char
void mt(char *s) {
  int i, len;
  for (i=0; i<strlen(s); ) {  
    for (len=8; len>0; len-=2) {
	  char word[9];
	  strncpy(word, &s[i], 9);
	  word[len] = '\0';
	  int ci = find(c, word);
	  if (ci >= 0) {
	    printf(" %s ", e[ci]);
		i+=len;
		break;
	  }
	}
	if (len <=0) {
      printf(" _ ");
	  i+=2; // 跳過一個中文字
	}
  }
}

int main(int argc, char *argv[]) {
  mt(argv[1]); // 從 argv (例如：mt 一隻狗追一隻貓) 中取出參數一 (例如：一隻狗追一隻貓)
}
```

執行結果：

```
D:\Dropbox\cccwd\db\c\code>gcc c2e.c -o c2e

D:\Dropbox\cccwd\db\c\code>c2e 一隻狗
 a  dog

D:\Dropbox\cccwd\db\c\code>c2e 一隻狗追一隻貓
 a  dog  chase  a  cat
```

