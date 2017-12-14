#自動產生英文語句

**程式： gen.c**

```c
#include <stdio.h>
#include <stdlib.h>

char *randPrint(char *a[], int size) {
  int r = rand()%size;
  printf(" %s ", a[r]);
}

/*
S = NP VP
NP = DET N
VP = V NP
N = dog | cat
V = chase | eat
DET = a | the
*/
    
char *n[] = {"dog", "cat"};
void N() { 
  randPrint(n, 2);
}
  
char *v[] = {"chase", "eat"};
void V() {
  randPrint(v, 2);
}
    
char *det[] = {"a", "the"};
void DET() {
  randPrint(det, 2);
}

void NP() { DET(); N(); }

void VP() {    V(); NP(); }

void S() { NP(); VP(); }

int main() {
  srand(time(NULL));
  S();
}
```

**執行結果：**

    D:\Dropbox\cccwd\db\c\code>gcc gen.c -o gen

    D:\Dropbox\cccwd\db\c\code>gen
     the  cat  chase  the  cat
    D:\Dropbox\cccwd\db\c\code>gen
     a  dog  eat  the  dog
    D:\Dropbox\cccwd\db\c\code>gen
     the  dog  eat  the  cat
    D:\Dropbox\cccwd\db\c\code>gen
     a  cat  eat  a  cat
    D:\Dropbox\cccwd\db\c\code>gen
     a  cat  eat  the  dog
    D:\Dropbox\cccwd\db\c\code>gen
     the  dog  eat  the  dog
    D:\Dropbox\cccwd\db\c\code>gen
     the  dog  eat  the  dog
    D:\Dropbox\cccwd\db\c\code>gen
     the  cat  chase  a  cat
    D:\Dropbox\cccwd\db\c\code>gen
     the  dog  eat  a  dog
    D:\Dropbox\cccwd\db\c\code>gen
     a  dog  eat  a  cat
    D:\Dropbox\cccwd\db\c\code>gen
     a  cat  eat  the  cat
    D:\Dropbox\cccwd\db\c\code>gen
     the  cat  eat  a  dog
    D:\Dropbox\cccwd\db\c\code>gen
     a  dog  eat  a  dog
    D:\Dropbox\cccwd\db\c\code>gen
     the  dog  chase  a  cat