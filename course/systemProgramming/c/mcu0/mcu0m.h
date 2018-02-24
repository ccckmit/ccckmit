#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define UINT16 unsigned short
#define BYTE unsigned char
#define MAX_LEN 100
#define WORD 0xFF
#define LD   0x0
#define ADD  0x1
#define JMP  0x2
#define ST   0x3
#define CMP  0x4
#define JEQ  0x5
#define RET  0xE

typedef struct {
  char *name;
  int  value; 
} Pair;
