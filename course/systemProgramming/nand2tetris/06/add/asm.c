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
  sprintf(hex, "%04x", d);
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

#define arraySize(array) (sizeof(array)/sizeof(array[0]))

int find(string key, Pair map[], int len) {
  for (int i=0; i<len; i++) {
    if (strcmp(map[i].key, key)==0)
      return i;
  }
  return -1;
}

string lookup(string key, Pair map[], int len) {
   int i = find(key, map, len);
   if (i==-1) return NULL;
   return map[i].value;
}

void code2binary(string code, string binary) {
  if (code[0]=='@') { // A 指令： ＠number
    int number;
    sscanf(code, "@%d", &number);
    decimal2binary(number, binary);  
  } else { // C 指令： d = comp
    char d[10], comp[100];
    sscanf(code, "%[^=]=%s", d, comp);
    string dcode = lookup(d, dMap, arraySize(dMap));
    string ccode = lookup(comp, cMap, arraySize(cMap));
    string jcode = "000";
    sprintf(binary, "111%s%s%s", ccode, dcode, jcode);
  }
}

void assemble(string fname) {
  char infile[100], line[100], binary[17];
  sprintf(infile, "%s.asm", fname);
  FILE *fp = fopen(infile, "r");
  while (fgets(line, sizeof(line), fp)) {
    char code[100];
    sscanf(line, "%[^/\n\r]", code);
    if (strlen(code)==0) continue;
    code2binary(code, binary);
    printf("%s\n", binary);
  }
  fclose(fp);
}

// run: ./asm Add > Add.hack
int main(int argc, char *argv[]) {
  assemble(argv[1]);
}
