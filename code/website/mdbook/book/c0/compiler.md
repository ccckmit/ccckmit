# 編譯器
撰寫中 ....


## 剖析

* <https://github.com/embedded2015/rubi/blob/master/parser.c>

## 程式碼產生

* <https://github.com/embedded2015/rubi/blob/master/asm.h>


```C
#ifndef RUBI_ASM_INCLUDED
#define RUBI_ASM_INCLUDED

#include <stdint.h>

unsigned char *ntvCode;
int ntvCount;

enum { EAX = 0, ECX, EDX, EBX, ESP, EBP, ESI, EDI };

static inline void emit(unsigned char val)
{
    ntvCode[ntvCount++] = (val);
}
static inline void emitI32(unsigned int val)
{
    emit(val << 24 >> 24);
    emit(val << 16 >> 24);
    emit(val <<  8 >> 24);
    emit(val <<  0 >> 24);
}
static inline void emitI32Insert(unsigned int val, int pos)
{
    ntvCode[pos + 0] = (val << 24 >> 24);
    ntvCode[pos + 1] = (val << 16 >> 24);
    ntvCode[pos + 2] = (val <<  8 >> 24);
    ntvCode[pos + 3] = (val <<  0 >> 24);
}

#endif
```


## JIT 即時執行

範例 11: rubi/engine.c

* <https://github.com/embedded2015/rubi/blob/master/engine.c>

```C
// 以下為剪貼片段，並非完整程式碼 ...
static void ssleep(uint32_t t) { usleep(t * CLOCKS_PER_SEC / 1000); }

static void add_mem(int32_t addr) { mem.addr[mem.count++] = addr; }

static int xor128()
{
    static uint32_t x = 123456789, y = 362436069, z = 521288629;
    uint32_t t;
    t = x ^ (x << 11);
    x = y; y = z; z = w;
    w = (w ^ (w >> 19)) ^ (t ^ (t >> 8));
    return ((int32_t) w < 0) ? -(int32_t) w : (int32_t) w;
}

static void *funcTable[] = {
    put_i32, /*  0 */ put_str, /*  4 */ put_ln, /*   8 */ malloc, /* 12 */
    xor128,  /* 16 */ printf,  /* 20 */ add_mem, /* 24 */ ssleep, /* 28 */
    fopen,   /* 32 */ fprintf, /* 36 */ fclose,  /* 40 */ fgets,   /* 44 */
    free,    /* 48 */ freeAddr  /* 52 */
};

static int execute(char *source)
{
    init();
    lex(source);
    parser();
    ((int (*)(int *, void **)) ntvCode)(0, funcTable);
    dispose();
    return 0;
}
// 程式未完 ....
```