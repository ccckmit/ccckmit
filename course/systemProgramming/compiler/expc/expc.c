#include <stdio.h>
#include <assert.h>
#include <string.h>

int tokenIdx = 0;
char *tokens;

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

// E=T ([+-] T)*
int E() {
    push('E');
    int t1 = T();
    while (isNext("+-")) {
          char op=next();
          int t2 = T();
          int t = nextTemp();
          printf("t%d=t%d%ct%d\n", t, t1, op, t2);
          t1 = t;
    }
    pop('E');
    return t1;
}

// T=F ([*/] F)*
int T() {
    push('T');
    int f1 = F();
    while (isNext("*/")) {
          char op=next();
          int f2 = F();
          int f = nextTemp();
          printf("t%d=t%d%ct%d\n", f, f1, op, f2);
          f1 = f;
    }
    pop('T');
    return f1;
}

// F=N | '(' E ')'
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
    }
    pop('F');
    return f; 
}