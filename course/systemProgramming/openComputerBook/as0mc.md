#  as0m.c 組譯器 -- MCU0-Mini 的組譯器，使用 Ｃ語言實作

## 組合語言：sum.as0m

```
LOOP:   LD    I    
        CMP   K10  
        JEQ   EXIT
        ADD   K1   
        ST    I    
        LD    SUM  
        ADD   I    
        ST    SUM  
        JMP   LOOP
EXIT:   JMP   EXIT
SUM:    WORD  0    
I:      WORD  0    
K1:     WORD  1    
K10:    WORD  10   

```

## as0m.c 組譯器

```CPP
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define UINT16 unsigned short
#define MAX_LEN 100
#define WORD 0xFF
#define LD   0x0
#define ADD  0x1
#define JMP  0x2
#define ST   0x3
#define CMP  0x4
#define JEQ  0x5

typedef struct {
  char *name;
  int  value; 
} Pair;

int symTop = 0;
Pair symTable[1000];

int opTop  = 7;
Pair opTable[] = {{"WORD", WORD}, {"LD", LD}, {"ADD", ADD},
  {"JMP", JMP}, {"ST", ST}, {"CMP", CMP}, {"JEQ", JEQ}};

void parse(char *line, char *label, char *op, char *param) {
  if (sscanf(line, "%[^:]:%s %s", label, op, param)>=3) {
  } else if (sscanf(line, "%s %s", op, param)==2) {
    strcpy(label, "");
  }
}

Pair *table_get(Pair *table, int top, char *name) {
  int i;
  for (i=0; i<top; i++) {
    if (strcmp(name, table[i].name)==0)
      return &table[i];
  }
  return NULL;
}

int table_put(Pair *table, int *top, char *name, int value) {
  Pair *pair = table_get(table, *top, name);
  if (pair == NULL) {
    pair = &table[*top];
    pair->value = value;
    pair->name = strdup(name);
    (*top)++;
    return 1;
  } 
  return 0;
}

void pass1(char *filename) {
  printf("============== pass1 ===============\n");
  FILE *file = fopen(filename, "rt");
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address = 0;
  while (fgets(line, MAX_LEN, file)) {
    printf("%04x %s", address, line);
    parse(line, label, op, param);
    if (!strcmp(label, "")==0) {
      if (!table_put(symTable, &symTop, label, address)) {
        printf("Error: symbol %s duplicate\n", label);
        exit(1);
      }
    } 
    address += 2;
  }
  fclose(file);
}

UINT16 translate(char *label, char *op, char *param) {
  Pair *op1 = table_get(opTable, opTop, op);
  if (op == NULL) {
    printf("Error: op(%s) not found!\n", op);
    exit(0);
  }
  UINT16 code = 0;
  if (op1->value == WORD) {
    sscanf(param, "%hu", &code); 
  } else {
    Pair *sym = table_get(symTable, symTop, param);
    if (sym == NULL) {
      printf("Error: symbol(%s) not found!\n", param);
      exit(0);
    }
    UINT16 paddress = sym->value;
    code = (op1->value << 12)|paddress;
  }
  return code;
}

void pass2(char *filename) {
  printf("============== pass2 ===============\n");
  FILE *file = fopen(filename, "rt");
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address = 0;
  while (fgets(line, MAX_LEN, file)) {
    parse(line, label, op, param);
    UINT16 code = translate(label, op, param);
    printf("%04x %04x %s", address, code, line);
    address += 2;
  }
  fclose(file);
}

int main(int argc, char *argv[]) {
  char *filename=argv[1];
  pass1(filename);
  pass2(filename);
}

```

## 執行結果

```
nqu-192-168-61-142:c mac020$ gcc as0m.c -o as0m
nqu-192-168-61-142:c mac020$ ./as0m sum.as0m
============== pass1 ===============
0000 LOOP:   LD    I    
0002         CMP   K10  
0004         JEQ   EXIT
0006         ADD   K1   
0008         ST    I    
000a         LD    SUM  
000c         ADD   I    
000e         ST    SUM  
0010         JMP   LOOP
0012 EXIT:   JMP   EXIT
0014 SUM:    WORD  0    
0016 I:      WORD  0    
0018 K1:     WORD  1    
001a K10:    WORD  10   
============== pass2 ===============
0000 0016 LOOP:   LD    I    
0002 401a         CMP   K10  
0004 5012         JEQ   EXIT
0006 1018         ADD   K1   
0008 3016         ST    I    
000a 0014         LD    SUM  
000c 1016         ADD   I    
000e 3014         ST    SUM  
0010 2000         JMP   LOOP
0012 2012 EXIT:   JMP   EXIT
0014 0000 SUM:    WORD  0    
0016 0000 I:      WORD  0    
0018 0001 K1:     WORD  1    
001a 000a K10:    WORD  10   
```

