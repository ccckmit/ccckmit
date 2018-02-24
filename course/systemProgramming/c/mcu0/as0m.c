#include "mcu0m.h"

int symTop = 0;
Pair symTable[1000];

int opTop  = 8;
Pair opTable[] = {{"WORD", WORD}, {"LD", LD}, {"ADD", ADD},{"JMP", JMP}, 
                  {"ST", ST}, {"CMP", CMP}, {"JEQ", JEQ}, {"RET", RET}};

void parse(char *line, char *label, char *op, char *param) {
  strcpy(label, ""); strcpy(op, ""); strcpy(param, "");
  char *rest=line;
  char *ptr = strchr(line, ':');
  if (ptr != NULL) {
    rest = ptr + 1;
    sscanf(line, "%[^: \t]", label);
  }
  int count = sscanf(rest, "%s %s", op, param);
  if (count == 1) strcpy(param, "");
  if (count == 0) strcpy(op, "");
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

void pass1(char *asmFile) {
  printf("\n============== pass1 ===============\n");
  FILE *file = fopen(asmFile, "rt");
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address=0, i;
  for (i=1; fgets(line, MAX_LEN, file); i++) {
    parse(line, label, op, param);
//    printf("label=%s op=%s param=%s\n", label, op, param);
    if (strcmp(op, "")==0) continue;
    printf("%02d %04x %s", i, address, line);
    if (table_get(opTable, opTop, op)==NULL) {
      printf("op %s: not found!\n", op); 
      exit(1);
    }
    if (!strcmp(label, "")==0) {
      if (!table_put(symTable, &symTop, label, address)) {
        printf("Error: symbol %s duplicate\n", label);
        exit(1);
      }
    }
    address += 1;
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
    UINT16 paddress;
    if (op1->value == RET)
      paddress = 0;
    else {
      Pair *sym = table_get(symTable, symTop, param);
      if (sym == NULL) {
        printf("Error: symbol(%s) not found!\n", param);
        exit(0);
      }
      paddress = sym->value;
    }
    code = (op1->value << 12) | paddress;
  }
  return code;
}

void pass2(char *asmFile, char *objFile) {
  printf("\n============== pass2 ===============\n");
  FILE *file = fopen(asmFile, "rt");
  FILE *oFile = fopen(objFile, "wb");
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address = 0;
  while (fgets(line, MAX_LEN, file)) {
    parse(line, label, op, param);
    if (strcmp(op, "")==0) continue;
    UINT16 code = translate(label, op, param);
    printf("%04x %04x %s", address, code, line);
    fwrite(&code, sizeof(code), 1, oFile);
    address += 1;
  }
  fclose(file);
  fclose(oFile);
}

int main(int argc, char *argv[]) {
  if (argc != 3) { printf("as0m <asmFile> <objFile>\n"); exit(1); }
  char *asmFile=argv[1], *objFile=argv[2];
  pass1(asmFile);
  pass2(asmFile, objFile);
}
