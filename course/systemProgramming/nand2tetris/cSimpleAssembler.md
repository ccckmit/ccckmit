# 簡易組繹程式 (C)

檔案： assembler.c

```C
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *dtable[] = { "",   "M",  "D",  "MD", "A",  "AM", "AD", "AMD"};
int  dcode[]   = { 0b000,0b001,0b010,0b011,0b100,0b101,0b110,0b111};
#define DSIZE 8

char *ctable[] = { "0",      "1",      "-1",     "D",      "A",      "M",      "!D",     "!A",      "!M",      "-D",      "-A",      "-M",      "D+1",     "A+1",    "M+1",    "D-1",    "A-1",     "M-1",     "D+A",     "D+M",    "D-A",     "D-M",   "A-D",    "M-D",    "D&A",    "D&M",     "D|A",  "D|M"};
int  ccode[]   = { 0b0101010,0b0111111,0b0111010,0b0001100,0b0110000,0b1110000,0b0001101,0b0110001, 0b1110001, 0b0001111, 0b0110011, 0b1110011, 0b0011111, 0b0110111,0b1110111,0b0001110, 0b0110010, 0b1110010, 0b0000010,0b1000010,0b0010011,0b1010011,0b0000111,0b1000111,0b0000000,0b1000000,0b0010101,0b1010101};
#define CSIZE 28

void int2binary(int num, int len, char *str)
{
  *(str+len) = '\0';
  int mask = 0x01 << (len);
  while(mask >>= 1)
    *str++ = !!(mask & num) + '0';
}

int find(char *item, char *array[], int len) {
    for (int i=0; i<len; i++) {
        if (strcmp(array[i], item)==0)
            return i;
    }
    return -1;
}

int findCode(char *item, char *name[], int *value, int len) {
   int i = find(item, name, len);
   if (i==-1) return -1;
   return value[i]; 
}

void toCode(char *line, char *code) {
    char dstr[10], cstr[10], dbin[10], cbin[10];
    sscanf(line, "%[^=]=%s", dstr, cstr);
    int dc = findCode(dstr, dtable, dcode, DSIZE);
    int cc = findCode(cstr, ctable, ccode, CSIZE);
    int2binary(dc, 3, dbin);
    int2binary(cc, 7, cbin);
    sprintf(code, "111%s%s000", cbin, dbin);
}

int main() {
    char code[17];
    int2binary(0b101, 3, code);
    printf("code=%s\n", code);
    int dc = findCode("AM", dtable, dcode, 8);
    char dstr[4];
    int2binary(dc, 3, dstr);
    printf("dstr=%s\n", dstr);
    toCode("D=A", code);
    printf("code=%s\n", code);
}


```

執行結果

```
NQU-192-168-60-101:c csienqu$ ./assembler
code=101
dstr=101
code=1110110000010000
```