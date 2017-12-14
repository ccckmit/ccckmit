#英翻中系統

**程式： mt.c**

```c
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

**執行結果：**

    $ gcc mt.c -std=c99 -o mt

    $ ./mt a dog chase a cat
     一隻  狗  追  一隻  貓