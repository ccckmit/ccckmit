#英中互翻系統

**程式： mt2.c**

```c
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

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc mt2.c -o mt2

    D:\Dropbox\cccwd\db\c\code>mt2 a dog chase a cat
     一隻  狗  追  一隻  貓

    D:\Dropbox\cccwd\db\c\code>mt2 一隻 狗 追 一隻 貓
     a  dog  chase  a  cat

    D:\Dropbox\cccwd\db\c\code>mt2 a 狗 chase 一隻 cat
     一隻  dog  追  a  貓