#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

typedef char* string;

typedef struct _Pair {
  string key;
  void *value;
} Pair;

string h2b[] = {
  "0000", "0001", "0010", "0011",
  "0100", "0101", "0110", "0111", 
  "1000", "1001", "1010", "1011",
  "1100", "1101", "1110", "1111"};

char hexDigits[] = "0123456789ABCDEF";

void hex2binary(string hex, string binary) {
  for (int i=0; hex[i] != '\0'; i++) {
    char *ptr = strchr(hexDigits, hex[i]);
    assert(ptr != NULL);
    char h = ptr - hexDigits;
    sprintf(&binary[4*i], "%s", h2b[h]);
  }
}

void decimal2binary(int d, string binary) {
  char hex[100];
  sprintf(hex, "%04X", d);
  hex2binary(hex, binary);
}

Pair dMap[] = {
  {"", "000"}, {"M", "001"}, {"D", "010"}, {"MD", "011"},
  {"A","100"}, {"AM","101"}, {"AD","110"}, {"AMD","111"}
};

Pair cMap[] = {
  {"0",   "0101010"}, {"1",   "0111111"}, {"-1",  "0111010"},
  {"D",   "0001100"}, {"A",   "0110000"}, {"!D",  "0001101"},
  {"!A",  "0110001"}, {"-D",  "0001111"}, {"-A",  "0110011"},
  {"D+1", "0011111"}, {"A+1", "0110111"}, {"D-1", "0001110"},
  {"A-1", "0110010"}, {"D+A", "0000010"}, {"D-A", "0010011"},
  {"A-D", "0000111"}, {"D&A", "0000000"}, {"D|A", "0010101"},
  {"M",   "1110000"}, {"!M",  "1110001"}, {"-M",  "1110011"},
  {"M+1", "1110111"}, {"M-1", "1110010"}, {"D+M", "1000010"},
  {"D-M", "1010011"}, {"M-D", "1000111"}, {"D&M", "1000000"},
  {"D|M", "1010101"}
};

Pair jMap[] = {
  {"",   "000"}, {"JGT","001"}, {"JEQ","010"}, {"JGE","011"},
  {"JLT","100"}, {"JNE","101"}, {"JLE","110"}, {"JMP","111"}
};

#define SYM_SIZE 1000

int addr[SYM_SIZE] = {
  0, 1, 2, 3,
  4, 5, 6, 7,
  8, 9, 10, 11, 
  12, 13, 14, 15,
  16384, 24576, 
  0, 1, 2, 3, 4
};

Pair symTable[SYM_SIZE] = {
  {"R0",&addr[0]},{"R1",&addr[1]},{"R2",&addr[2]},{"R3",&addr[3]}, 
  {"R4",&addr[4]},{"R5",&addr[5]},{"R6",&addr[6]},{"R7",&addr[7]},
  {"R8",&addr[8]}, {"R9",&addr[9]}, {"R10",&addr[10]}, {"R11",&addr[11]},
  {"R12",&addr[12]}, {"R13",&addr[13]}, {"R14",&addr[14]}, {"R15",&addr[15]},
  {"SCREEN",&addr[16]}, {"KBD",&addr[17]}, {"SP",&addr[18]}, {"LCL",&addr[19]}, 
  {"ARG",&addr[20]}, {"THIS",&addr[21]}, {"THAT",&addr[22]}
};

int symTop = 23;

char strTable[SYM_SIZE * 10];
char *strTableEnd = strTable;

char *newStr(char *str) {
  char *strBegin = strTableEnd;
  strcpy(strTableEnd, str);
  strTableEnd += strlen(str) + 1;
  return strBegin;
}

#define arraySize(array) (sizeof(array)/sizeof(array[0]))

int find(string key, Pair map[], int len) {
  for (int i=0; i<len; i++) {
    if (strcmp(map[i].key, key)==0)
      return i;
  }
  return -1;
}

void* lookup(string key, Pair map[], int len) {
  int i = find(key, map, len);
//  printf("lookup: i=%d\n", i);
  if (i==-1) return NULL;
  return map[i].value;
}

void symAdd(char *label, int address, Pair map[], int *top) {
  addr[*top] = address;
  Pair p = { newStr(label), &addr[*top] };
  map[(*top)++] = p;
  printf("  p.key=%s *p.value=%d top=%d\n", p.key, *(int*)p.value, *top);
}

void symDump(Pair *map, int top) {
  printf("======= SYMBOL TABLE ===========\n");
  for (int i=0; i<top; i++) {
    char *key = map[i].key;
    int *vptr = map[i].value;
    printf("%d: %s, %d\n", i, key, *vptr);
  }
}

char *parse(string line) {
  char *codePtr = line, *codeEnd = line;
  while (strchr("\t ", *codePtr) != NULL) codePtr++;
  while (*codeEnd != '\0' && strchr("/\n\r", *codeEnd) == NULL) codeEnd++;
  *codeEnd = '\0';
  return codePtr;
}

void code2binary(string code, string binary) {
  char d[10], comp[100], j[10];
  string dcode, ccode, jcode;
  if (code[0]=='@') { // A 指令： ＠number || @symbol
    int address;
    int match = sscanf(code, "@%d", &address);
    if (match == 1)
      decimal2binary(address, binary);
    else {
      char symbol[100];
      match = sscanf(code, "@%s", symbol);
      int* addrPtr = lookup(symbol, symTable, symTop);
      assert(addrPtr != NULL);
      address = *addrPtr;
      decimal2binary(address, binary);
    }
  } else { // C 指令： d = comp;j
    if (strchr(code, '=') != NULL) {
      sscanf(code, "%[^=]=%s", d, comp);
      dcode = lookup(d, dMap, arraySize(dMap));
      ccode = lookup(comp, cMap, arraySize(cMap));
      sprintf(binary, "111%s%s000", ccode, dcode);
    } else {
      sscanf(code, "%[^;];%s", comp, j);
      ccode = lookup(comp, cMap, arraySize(cMap));
      jcode = lookup(j, jMap, arraySize(jMap));
      sprintf(binary, "111%s000%s", ccode, jcode);      
    }
  }
}

void pass1(string inFile) {
  printf("============= PASS1 ================\n");
  char line[100]="";
  FILE *fp = fopen(inFile, "r");
  int address = 0;
  while (fgets(line, sizeof(line), fp)) {
    char *code = parse(line);
    if (strlen(code)==0) continue;
    printf("%02d:%s\n", address, code);
    if (code[0] == '(') {
      char label[100];
      sscanf(code, "(%[^)])", label);
      symAdd(label, address, symTable, &symTop);
    } else {
      address ++;
    }
  }
  fclose(fp);
}

void pass2(string inFile, string outFile) {
  printf("============= PASS2 ================\n");
  char line[100], binary[17];
  FILE *fp = fopen(inFile, "r");
  FILE *ofp = fopen(outFile, "w");
  while (fgets(line, sizeof(line), fp)) {
    char *code = parse(line);
    if (strlen(code)==0) continue;
    if (code[0] == '(') {
      printf("%s\n", code);
    } else {
      code2binary(code, binary);
      printf("  %-20s %s\n", code, binary);
      fprintf(ofp, "%s\n", binary);
    }
  }
  fclose(fp);
  fclose(ofp);
}

void assemble(string file) {
  char inFile[100], outFile[100];
  sprintf(inFile, "%s.asm", file);
  sprintf(outFile, "%s.my.hack", file);
  symDump(symTable, symTop);
  pass1(inFile);
  symDump(symTable, symTop);
  pass2(inFile, outFile);
}

// run: ./asm Add
int main(int argc, char *argv[]) {
  assemble(argv[1]);
}
