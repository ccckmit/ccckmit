#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>

char *skip(char *ptr, char *skipChars) {
  while (strchr(skipChars, *ptr) != NULL) {
    ptr ++;
  }
  return ptr;
}

void next(char *ptr, char *token) {
  token[0] = '\0';
  if (*ptr == '\0') return;
  int count = sscanf(ptr, "%[a-zA-Z0-9_]", token);
  if (count == 1) return;
  token[0] = *ptr; token[1] = '\0';
}

void parseLine(char *line) {
  char *ptr = line;
  for (ptr = line; ;) {
    char token[100];
    ptr = skip(ptr, " \t\n");
    next(ptr, token);
    if (strlen(token) == 0) break;
    printf("token=%s\n", token);
    ptr = ptr + strlen(token);
  }
}

void parse(char *inFile) {
  printf("============= parse ================\n");
  char line[100]="";
  FILE *fp = fopen(inFile, "r");
  int address = 0;
  while (fgets(line, sizeof(line), fp)) {
    char *comment = strstr(line, "//");
    if (comment != NULL) *comment = '\0';
    printf("line=%s", line);
//    parseLine(line);
  }
  fclose(fp);
}

void compile(char *file) {
  char inFile[100], outFile[100];
  sprintf(inFile, "%s.jack", file);
  sprintf(outFile, "%s.my.xml", file);
  parse(inFile);
}

// run: ./parser <file> 
// notice : <file> with no extension.
int main(int argc, char *argv[]) {
  compile(argv[1]);
}
