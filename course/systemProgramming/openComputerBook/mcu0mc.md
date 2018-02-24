# MCU0 微處理器 -- 超簡易的 16 位元處理器

## 指令格式

指令格式: OP C
 
OP 為四位元指令碼

C 為12位元常數，通常是記憶體位址。

每個指令均為16位元。

## C 語言表頭宣告
檔案:  mcu0.h

```CPP
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define UINT16 unsigned short // 16 位元無號數
#define BYTE unsigned char // 8 位元無號數
#define MAX_LEN 256 // 宣告一般字串的最大長度
#define WORD_OP 0xF // K10: WORD 10 中的那個 WORD 假指令之假代碼
#define LD   0x0    // LD 指令的代碼 ....
#define ADD  0x1
#define JMP  0x2
#define ST   0x3
#define CMP  0x4
#define JEQ  0x5
#define RET  0xE
// 表格裡的 pair=(name, value) 結構。
typedef struct {
  char *name;
  int  value; 
} Pair;


```