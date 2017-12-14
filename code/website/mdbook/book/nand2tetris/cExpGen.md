# 產生數學運算式 (C)

檔案： expGen.c

```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void E();

int randInt(int n) {
  return rand() % n;
}

int randChar(char *set) {
  int len = strlen(set);
  int i = rand()%len;
  return set[i];
}

void F() {
  if (randInt(10) < 8) {
    printf("%c", randChar("0123456789"));
  } else {
    printf("(");
    E();
    printf(")");
  }
}

void T() {
  F();
  if (randInt(10) < 7) {
    printf("%c", randChar("*/"));
    F();
  }
}

void E() {
  T();
  while (randInt(10) < 3) {
     printf("%c", randChar("+-"));
     T();
  }
}

// === EBNF Grammar =====
// E=T ([+-] T)*
// T=F ([*/] F)?
// T=[0-9] | (E)

int main(int argc, char * argv[]) {
  E();
  int i;
  for (i=0; i<10; i++) {
    E();
    printf("\n");
  }
}
```

執行結果：

```
$ ./expGen
9*2(9/2)/(2/(0/(5)-3))-3/8+1*8+0*9
3
(8/5)*9
9/5
8
2*7
1+8
4-5-(0)
(0*5+1*1-(6*(6*9))-3/8)*4
3
```

