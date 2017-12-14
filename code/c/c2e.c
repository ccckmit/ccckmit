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