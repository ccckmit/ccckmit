# 數學運算式編譯器 (C)

檔案：expCompiler.c

```
#include <stdio.h>
#include <string.h>
#include <assert.h>

int E();

char stack[100];
int top = 0;

void push(char c) {
  stack[top++] = c;
}

char pop(char c) {
  char ctop = stack[--top];
  assert(ctop==c);
  return ctop;
}

void printStack() {
  int i;
  for (i=0; i<top; i++)
    printf("%c", stack[i]);
  printf("\n");
}

int tokenIdx = 0;
char *tokens;

char ch() {
  char c = tokens[tokenIdx];
  return c;
}

char next() {
  char c = ch();
  push(c);
//  printStack();
  pop(c);
  tokenIdx++;
  return c;
}

int isNext(char *set) {
  return (ch()!='\0' && strchr(set, ch())!=NULL);
}

int tempIdx = 0;

int nextTemp() {
    return tempIdx++;
}

void pcode(char op, int t, int t1, int t2) {
    printf("  LD R1, t%d\n", t1);
    printf("  LD R2, t%d\n", t2);
    switch (op) {
        case '+': printf("  ADD R3, R1, R2\n"); break;
        case '-': printf("  SUB R3, R1, R2\n"); break;
        case '*': printf("  MUL R3, R1, R2\n"); break;
        case '/': printf("  DIV R3, R1, R2\n"); break;
    }
    printf("  ST R3, t%d\n", t);
}

int F() {
    int f;
    push('F');
    if (ch()=='(') {
      next();
      f = E();
      assert(ch()==')');
      next();
    } else {
      assert(ch()>='0' && ch()<='9');
      f = nextTemp();
      char c=next();
      printf("t%d=%c\n", f, c);
      printf("  LD R1, %c\n", c);
      printf("  ST R1, t%d\n", f);
    }
    pop('F');
    return f; 
}

int T() {
    push('T');
    int f1 = F();
    while (isNext("*/")) {
          char op=next();
          int f2 = F();
          int f = nextTemp();
          printf("t%d=t%d%ct%d\n", f, f1, op, f2);
          pcode(op, f, f1, f2);
          f1 = f;
    }
    pop('T');
    return f1;
}

int E() {
    push('E');
    int t1 = T();
    while (isNext("+-")) {
          char op=next();
          int t2 = T();
          int t = nextTemp();
          printf("t%d=t%d%ct%d\n", t, t1, op, t2);
          pcode(op, t, t1, t2);
          t1 = t;
    }
    pop('E');
    return t1;
}

void parse(char *str) {
     tokens = str;
     E();
}

int main(int argc, char * argv[]) {
    printf("=== EBNF Grammar =====\n");
    printf("E=T ([+-] T)*\n");
    printf("T=F ([*/] F)*\n");
    printf("F=N | '(' E ')'\n");
    printf("==== parse:%s ========\n", argv[1]);
    parse(argv[1]);
}
```

執行結果：

```
$ gcc expCompiler.c -o expCompiler
$ ./expCompiler 3+5*4
=== EBNF Grammar =====
E=T ([+-] T)*
T=F ([*/] F)*
F=N | '(' E ')'
==== parse:3+5*4 ========
t0=3
  LD R1, 3
  ST R1, t0
t1=5
  LD R1, 5
  ST R1, t1
t2=4
  LD R1, 4
  ST R1, t2
t3=t1*t2
  LD R1, t1
  LD R2, t2
  MUL R3, R1, R2
  ST R3, t3
t4=t0+t3
  LD R1, t0
  LD R2, t3
  ADD R3, R1, R2
  ST R3, t4

```