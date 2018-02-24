# MCU0 組譯器 -- 超簡易組譯器 (第二版)

## 組合語言輸入檔

檔案: sum.as0m

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
EXIT:		RET
SUM:    WORD  0    
I:      WORD  0    
K1:     WORD  1    
K10:    WORD  10   
```

## 程式碼

檔案: as0m.c 

```CPP
#include "mcu0m.h"
// 符號表宣告
int symTop = 0;
Pair symTable[1000];
// 指令表宣告
int opTop  = 8;
Pair opTable[] = {{"WORD", WORD}, {"LD", LD}, {"ADD", ADD},{"JMP", JMP}, 
                  {"ST", ST}, {"CMP", CMP}, {"JEQ", JEQ}, {"RET", RET}};
// 函數:將一行組合語言拆成 label, op, param 等三個欄位
// 例如  LOOP: LD I  會被拆成 label=LOOP, op=LD, param=I
void parse(char *line, char *label, char *op, char *param) {
  strcpy(label, ""); strcpy(op, ""); strcpy(param, "");
  char *rest=line;
  char *ptr = strchr(line, ':'); // 找看看是否這行有 : 符號，像是 LOOP: LD I 就有 
  if (ptr != NULL) { // 如果有 : 符號，代表前面是標記
    rest = ptr + 1; 
    sscanf(line, "%[^: \t]", label); // 將標記部分放入 label 欄位 (例如: label=LOOP)
  }
  int count = sscanf(rest, "%s %s", op, param); // 將後半剩下的部分拆成 (op, param) 兩個欄位
  if (count == 1) strcpy(param, ""); // 處理參數太少的情況
  if (count == 0) strcpy(op, "");
}
// 查詢表格 table 中有沒有名稱為 name 的項目，有的話傳回該項目 (pair)
Pair *table_get(Pair *table, int top, char *name) {
  int i;
  for (i=0; i<top; i++) {
    if (strcmp(name, table[i].name)==0)
      return &table[i];
  }
  return NULL;
}
// 將 pair=(name, value) 這個項目加入到表格中
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
// 組譯器第一輪: 記住符號位址
void pass1(char *asmFile) {
  printf("\n============== pass1 ===============\n");
  FILE *file = fopen(asmFile, "rt"); // 用 rt 模式開啟文字檔
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address=0, i;
  for (i=1; fgets(line, MAX_LEN, file); i++) { // 每次讀一行
    parse(line, label, op, param);             
    if (strcmp(op, "")==0) continue;
    printf("%02d %04x %s", i, address, line);
    if (table_get(opTable, opTop, op)==NULL) { // 若不認識該行指令欄
      printf("op %s: not found!\n", op); // 就顯示錯誤
      exit(1);
    }
    if (strcmp(label, "")!=0) { // 如果有標記
      if (table_put(symTable, &symTop, label, address)==0) { // 新增標記，假如失敗
        printf("Error: symbol %s duplicate\n", label); // 就顯示錯誤
        exit(1);
      }
    }
    address += 1; // 每行指令都佔一個 WORD
  }
  fclose(file);
}
// 將指令 (op, param) 翻譯成 16 位元機器碼傳回
UINT16 translate(char *label, char *op, char *param) {
  Pair *op1 = table_get(opTable, opTop, op);
  if (op == NULL) {
    printf("Error: op(%s) not found!\n", op);
    exit(0);
  }
  UINT16 code = 0;
  if (op1->value == WORD) { // 處理 K10:    WORD  10  的這種情況
    sscanf(param, "%hu", &code); 
  } else {
    UINT16 paddress;
    if (op1->value == RET) // RET 指令後面沒有跟著參數，所以補 0
      paddress = 0;
    else {
      Pair *sym = table_get(symTable, symTop, param); // 處理一般性指令，查詢符號位址
      if (sym == NULL) {
        printf("Error: symbol(%s) not found!\n", param);
        exit(0);
      }
      paddress = sym->value; // paddress=符號位址
    }
    code = (op1->value << 12) | paddress; // 將 op, address 編成 16 位元的機器碼
  }
  return code;
}
// 組譯器第二輪: 將所有指令翻譯成機器碼並寫入目的檔
void pass2(char *asmFile, char *objFile) {
  printf("\n============== pass2 ===============\n");
  FILE *file = fopen(asmFile, "rt");
  FILE *oFile = fopen(objFile, "wb");
  char line[MAX_LEN], label[MAX_LEN], op[MAX_LEN], param[MAX_LEN];
  UINT16 address = 0;
  while (fgets(line, MAX_LEN, file)) {
    parse(line, label, op, param);
    if (strcmp(op, "")==0) continue;
    UINT16 code = translate(label, op, param); // 將每行指令都翻成機器碼
    printf("%04x %04x %s", address, code, line);
    fwrite(&code, sizeof(code), 1, oFile);
    address += 1;
  }
  fclose(file);
  fclose(oFile);
}
// 組譯器的主程式
int main(int argc, char *argv[]) {
  if (argc != 3) { printf("as0m <asmFile> <objFile>\n"); exit(1); }
  char *asmFile=argv[1], *objFile=argv[2];
  pass1(asmFile);          // 組譯器第一輪，計算符號表位址
  pass2(asmFile, objFile); // 組譯器第二輪，編機器碼後輸出到目的檔
}
```

## 執行結果

```
D:\ccc\mcu02>gcc as0m.c -o as0m

D:\ccc\mcu02>gcc vm0m.c -o vm0m

D:\ccc\mcu02>as0m sum.as0m sum.ob0m

============== pass1 ===============
01 0000 LOOP:   LD    I
02 0001         CMP   K10
03 0002         JEQ   EXIT
04 0003         ADD   K1
05 0004         ST    I
06 0005         LD    SUM
07 0006         ADD   I
08 0007         ST    SUM
09 0008         JMP   LOOP
10 0009 EXIT:   RET
12 000a SUM:    WORD  0
13 000b I:      WORD  0
14 000c K1:     WORD  1
15 000d K10:    WORD  10

============== pass2 ===============
0000 000b LOOP:   LD    I
0001 400d         CMP   K10
0002 5009         JEQ   EXIT
0003 100c         ADD   K1
0004 300b         ST    I
0005 000a         LD    SUM
0006 100b         ADD   I
0007 300a         ST    SUM
0008 2000         JMP   LOOP
0009 e000 EXIT: RET
000a 0000 SUM:    WORD  0
000b 0000 I:      WORD  0
000c 0001 K1:     WORD  1
000d 000a K10:    WORD  10

D:\ccc\mcu02>vm0m sum.ob0m
PC=0000 IR=000b  SW=1000 A=0000=   0
PC=0001 IR=400d  SW=8000 A=0000=   0
PC=0002 IR=5009  SW=8000 A=0000=   0
PC=0003 IR=100c  SW=8000 A=0001=   1
PC=0004 IR=300b  SW=8000 A=0001=   1
PC=0005 IR=000a  SW=8000 A=0000=   0
PC=0006 IR=100b  SW=8000 A=0001=   1
PC=0007 IR=300a  SW=8000 A=0001=   1
PC=0008 IR=2000  SW=8000 A=0001=   1
PC=0000 IR=000b  SW=8000 A=0001=   1
PC=0001 IR=400d  SW=8000 A=0001=   1
PC=0002 IR=5009  SW=8000 A=0001=   1
PC=0003 IR=100c  SW=8000 A=0002=   2
PC=0004 IR=300b  SW=8000 A=0002=   2
PC=0005 IR=000a  SW=8000 A=0001=   1
PC=0006 IR=100b  SW=8000 A=0003=   3
PC=0007 IR=300a  SW=8000 A=0003=   3
PC=0008 IR=2000  SW=8000 A=0003=   3
PC=0000 IR=000b  SW=8000 A=0002=   2
PC=0001 IR=400d  SW=8000 A=0002=   2
PC=0002 IR=5009  SW=8000 A=0002=   2
PC=0003 IR=100c  SW=8000 A=0003=   3
PC=0004 IR=300b  SW=8000 A=0003=   3
PC=0005 IR=000a  SW=8000 A=0003=   3
PC=0006 IR=100b  SW=8000 A=0006=   6
PC=0007 IR=300a  SW=8000 A=0006=   6
PC=0008 IR=2000  SW=8000 A=0006=   6
PC=0000 IR=000b  SW=8000 A=0003=   3
PC=0001 IR=400d  SW=8000 A=0003=   3
PC=0002 IR=5009  SW=8000 A=0003=   3
PC=0003 IR=100c  SW=8000 A=0004=   4
PC=0004 IR=300b  SW=8000 A=0004=   4
PC=0005 IR=000a  SW=8000 A=0006=   6
PC=0006 IR=100b  SW=8000 A=000a=  10
PC=0007 IR=300a  SW=8000 A=000a=  10
PC=0008 IR=2000  SW=8000 A=000a=  10
PC=0000 IR=000b  SW=8000 A=0004=   4
PC=0001 IR=400d  SW=8000 A=0004=   4
PC=0002 IR=5009  SW=8000 A=0004=   4
PC=0003 IR=100c  SW=8000 A=0005=   5
PC=0004 IR=300b  SW=8000 A=0005=   5
PC=0005 IR=000a  SW=8000 A=000a=  10
PC=0006 IR=100b  SW=8000 A=000f=  15
PC=0007 IR=300a  SW=8000 A=000f=  15
PC=0008 IR=2000  SW=8000 A=000f=  15
PC=0000 IR=000b  SW=8000 A=0005=   5
PC=0001 IR=400d  SW=8000 A=0005=   5
PC=0002 IR=5009  SW=8000 A=0005=   5
PC=0003 IR=100c  SW=8000 A=0006=   6
PC=0004 IR=300b  SW=8000 A=0006=   6
PC=0005 IR=000a  SW=8000 A=000f=  15
PC=0006 IR=100b  SW=8000 A=0015=  21
PC=0007 IR=300a  SW=8000 A=0015=  21
PC=0008 IR=2000  SW=8000 A=0015=  21
PC=0000 IR=000b  SW=8000 A=0006=   6
PC=0001 IR=400d  SW=8000 A=0006=   6
PC=0002 IR=5009  SW=8000 A=0006=   6
PC=0003 IR=100c  SW=8000 A=0007=   7
PC=0004 IR=300b  SW=8000 A=0007=   7
PC=0005 IR=000a  SW=8000 A=0015=  21
PC=0006 IR=100b  SW=8000 A=001c=  28
PC=0007 IR=300a  SW=8000 A=001c=  28
PC=0008 IR=2000  SW=8000 A=001c=  28
PC=0000 IR=000b  SW=8000 A=0007=   7
PC=0001 IR=400d  SW=8000 A=0007=   7
PC=0002 IR=5009  SW=8000 A=0007=   7
PC=0003 IR=100c  SW=8000 A=0008=   8
PC=0004 IR=300b  SW=8000 A=0008=   8
PC=0005 IR=000a  SW=8000 A=001c=  28
PC=0006 IR=100b  SW=8000 A=0024=  36
PC=0007 IR=300a  SW=8000 A=0024=  36
PC=0008 IR=2000  SW=8000 A=0024=  36
PC=0000 IR=000b  SW=8000 A=0008=   8
PC=0001 IR=400d  SW=8000 A=0008=   8
PC=0002 IR=5009  SW=8000 A=0008=   8
PC=0003 IR=100c  SW=8000 A=0009=   9
PC=0004 IR=300b  SW=8000 A=0009=   9
PC=0005 IR=000a  SW=8000 A=0024=  36
PC=0006 IR=100b  SW=8000 A=002d=  45
PC=0007 IR=300a  SW=8000 A=002d=  45
PC=0008 IR=2000  SW=8000 A=002d=  45
PC=0000 IR=000b  SW=8000 A=0009=   9
PC=0001 IR=400d  SW=8000 A=0009=   9
PC=0002 IR=5009  SW=8000 A=0009=   9
PC=0003 IR=100c  SW=8000 A=000a=  10
PC=0004 IR=300b  SW=8000 A=000a=  10
PC=0005 IR=000a  SW=8000 A=002d=  45
PC=0006 IR=100b  SW=8000 A=0037=  55
PC=0007 IR=300a  SW=8000 A=0037=  55
PC=0008 IR=2000  SW=8000 A=0037=  55
PC=0000 IR=000b  SW=8000 A=000a=  10
PC=0001 IR=400d  SW=4000 A=000a=  10
PC=0002 IR=5009  SW=4000 A=000a=  10
PC=0009 IR=e000
```