# C 語言的專案結構

30 年前我還在念大學的時候，雖然學過 C 語言，但是卻沒有學過甚麼《嵌入式系統》或《單晶片微處理器》之類的課程。後來當我真正在松下從事 C 語言的開發時，才發現自己對 C 語言有多麼的無知，等到我進了金門大學當老師，才開始學習《嵌入式的 C 語言》，於是漸漸地發現了隱藏在 C 語言背後的那些秘密！

那些秘密，是 C 語言的精髓之所在，但卻因為牽涉到《硬體和組合語言》而常常令人感到難以接近，還好我們有《jserv 的七百行系列開放原始碼》，讓我們可以盡情地從裡面取出這些秘密，快速的公開在大家的眼前。

以下、就讓我們直接看一下這些神秘的代碼吧！

## 範例 1 : hello.c

* <https://github.com/jserv/mini-arm-os/blob/master/01-HelloWorld/hello.c>

```C
#include <stdint.h>
#include "reg.h"

/* USART TXE Flag
 * This flag is cleared when data is written to USARTx_DR and
 * set when that data is transferred to the TDR
 */
#define USART_FLAG_TXE	((uint16_t) 0x0080)

void print_str(const char *str)
{
	while (*str) {
		while (!(*(USART2_SR) & USART_FLAG_TXE));
		*(USART2_DR) = (*str & 0xFF);
		str++;
	}
}

void main(void)
{
	*(RCC_APB2ENR) |= (uint32_t) (0x00000001 | 0x00000004);
	*(RCC_APB1ENR) |= (uint32_t) (0x00020000);

	/* USART2 Configuration, Rx->PA3, Tx->PA2 */
	*(GPIOA_CRL) = 0x00004B00;
	*(GPIOA_CRH) = 0x44444444;
	*(GPIOA_ODR) = 0x00000000;
	*(GPIOA_BSRR) = 0x00000000;
	*(GPIOA_BRR) = 0x00000000;

	*(USART2_CR1) = 0x0000000C;
	*(USART2_CR2) = 0x00000000;
	*(USART2_CR3) = 0x00000000;
	*(USART2_CR1) |= 0x2000;

	print_str("Hello World!\n");

	while (1);
}
```

## 範例 2 : reg.h

* <https://github.com/jserv/mini-arm-os/blob/master/00-HelloWorld/reg.h>

```C
#ifndef __REG_H_
#define __REG_H_

#define __REG_TYPE	volatile uint32_t
#define __REG		__REG_TYPE *

/* RCC Memory Map */
#define RCC		((__REG_TYPE) 0x40021000)
#define RCC_CR		((__REG) (RCC + 0x00))
#define RCC_CFGR	((__REG) (RCC + 0x04))
#define RCC_CIR		((__REG) (RCC + 0x08))
#define RCC_APB2RSTR	((__REG) (RCC + 0x0C))
#define RCC_APB1RSTR	((__REG) (RCC + 0x10))
#define RCC_AHBENR	((__REG) (RCC + 0x14))
#define RCC_APB2ENR	((__REG) (RCC + 0x18))
#define RCC_APB1ENR	((__REG) (RCC + 0x1C))
#define RCC_BDCR	((__REG) (RCC + 0x20))
#define RCC_CSR		((__REG) (RCC + 0x24))

/* Flash Memory Map */
#define FLASH		((__REG_TYPE) 0x40022000)
#define FLASH_ACR	((__REG) (FLASH + 0x00))

/* GPIO Memory Map */
#define GPIOA		((__REG_TYPE) 0x40010800)
#define GPIOA_CRL	((__REG) (GPIOA + 0x00))
#define GPIOA_CRH	((__REG) (GPIOA + 0x04))
#define GPIOA_IDR	((__REG) (GPIOA + 0x08))
#define GPIOA_ODR	((__REG) (GPIOA + 0x0C))
#define GPIOA_BSRR	((__REG) (GPIOA + 0x10))
#define GPIOA_BRR	((__REG) (GPIOA + 0x14))
#define GPIOA_LCKR	((__REG) (GPIOA + 0x18))

/* USART2 Memory Map */
#define USART2		((__REG_TYPE) 0x40004400)
#define USART2_SR	((__REG) (USART2 + 0x00))
#define USART2_DR	((__REG) (USART2 + 0x04))
#define USART2_BRR	((__REG) (USART2 + 0x08))
#define USART2_CR1	((__REG) (USART2 + 0x0C))
#define USART2_CR2	((__REG) (USART2 + 0x10))
#define USART2_CR3	((__REG) (USART2 + 0x14))
#define USART2_GTPR	((__REG) (USART2 + 0x18))

#endif
```

## 範例 3 : startup.c

* <https://github.com/jserv/mini-arm-os/blob/master/00-HelloWorld/startup.c>

```C
#include <stdint.h>
#include "reg.h"

/* Bit definition for RCC_CR register */
#define RCC_CR_HSION	((uint32_t) 0x00000001)		/*!< Internal High Speed clock enable */
#define RCC_CR_HSEON	((uint32_t) 0x00010000)		/*!< External High Speed clock enable */
#define RCC_CR_HSERDY	((uint32_t) 0x00020000)		/*!< External High Speed clock ready flag */
#define RCC_CR_CSSON	((uint32_t) 0x00080000)		/*!< Clock Security System enable */

/* Bit definition for RCC_CFGR register */
#define RCC_CFGR_SW		((uint32_t) 0x00000003)	/*!< SW[1:0] bits (System clock Switch) */
#define RCC_CFGR_SW_HSE		((uint32_t) 0x00000001)	/*!< HSE selected as system clock */
#define RCC_CFGR_SWS		((uint32_t) 0x0000000C)	/*!< SWS[1:0] bits (System Clock Switch Status) */
#define RCC_CFGR_HPRE_DIV1	((uint32_t) 0x00000000)	/*!< SYSCLK not divided */
#define RCC_CFGR_PPRE1_DIV1	((uint32_t) 0x00000000)	/*!< HCLK not divided */
#define RCC_CFGR_PPRE2_DIV1	((uint32_t) 0x00000000)	/*!< HCLK not divided */

/* Bit definition for FLASH_ACR register */
#define FLASH_ACR_LATENCY	((uint8_t) 0x03)	/*!< LATENCY[2:0] bits (Latency) */
#define FLASH_ACR_LATENCY_0	((uint8_t) 0x00)	/*!< Bit 0 */
#define FLASH_ACR_PRFTBE	((uint8_t) 0x10)	/*!< Prefetch Buffer Enable */

#define HSE_STARTUP_TIMEOUT	((uint16_t) 0x0500)	/*!< Time out for HSE start up */

/* main program entry point */
extern void main(void);

/* start address for the initialization values of the .data section.
defined in linker script */
extern uint32_t _sidata;
/* start address for the .data section. defined in linker script */
extern uint32_t _sdata;
/* end address for the .data section. defined in linker script */
extern uint32_t _edata;
/* start address for the .bss section. defined in linker script */
extern uint32_t _sbss;
/* end address for the .bss section. defined in linker script */
extern uint32_t _ebss;
/* end address for the stack. defined in linker script */
extern uint32_t _estack;

void rcc_clock_init(void);

void reset_handler(void)
{
	/* Copy the data segment initializers from flash to SRAM */
	uint32_t *idata_begin = &_sidata;
	uint32_t *data_begin = &_sdata;
	uint32_t *data_end = &_edata;
	while (data_begin < data_end) *data_begin++ = *idata_begin++;

	/* Zero fill the bss segment. */
	uint32_t *bss_begin = &_sbss;
	uint32_t *bss_end = &_ebss;
	while (bss_begin < bss_end) *bss_begin++ = 0;

	/* Clock system intitialization */
	rcc_clock_init();

	main();
}

void nmi_handler(void)
{
	while (1);
}

void hardfault_handler(void)
{
	while (1);
}

__attribute((section(".isr_vector")))
uint32_t *isr_vectors[] = {
	(uint32_t *) &_estack,		/* stack pointer */
	(uint32_t *) reset_handler,	/* code entry point */
	(uint32_t *) nmi_handler,	/* NMI handler */
	(uint32_t *) hardfault_handler	/* hard fault handler */
};

void rcc_clock_init(void)
{
	/* Reset the RCC clock configuration to the default reset state(for debug purpose) */
	/* Set HSION bit */
	*RCC_CR |= (uint32_t) 0x00000001;

	/* Reset SW, HPRE, PPRE1, PPRE2, ADCPRE and MCO bits */
	*RCC_CFGR &= (uint32_t) 0xF8FF0000;

	/* Reset HSEON, CSSON and PLLON bits */
	*RCC_CR &= (uint32_t) 0xFEF6FFFF;

	/* Reset HSEBYP bit */
	*RCC_CR &= (uint32_t) 0xFFFBFFFF;

	/* Reset PLLSRC, PLLXTPRE, PLLMUL and USBPRE/OTGFSPRE bits */
	*RCC_CFGR &= (uint32_t) 0xFF80FFFF;

	/* Disable all interrupts and clear pending bits  */
	*RCC_CIR = 0x009F0000;

	/* Configure the System clock frequency, HCLK, PCLK2 and PCLK1 prescalers */
	/* Configure the Flash Latency cycles and enable prefetch buffer */
	volatile uint32_t StartUpCounter = 0, HSEStatus = 0;

	/* SYSCLK, HCLK, PCLK2 and PCLK1 configuration ---------------------------*/
	/* Enable HSE */
	*RCC_CR |= (uint32_t) RCC_CR_HSEON;

	/* Wait till HSE is ready and if Time out is reached exit */
	do {
		HSEStatus = *RCC_CR & RCC_CR_HSERDY;
		StartUpCounter++;
	} while ((HSEStatus == 0) && (StartUpCounter != HSE_STARTUP_TIMEOUT));

	if ((*RCC_CR & RCC_CR_HSERDY) != 0)
		HSEStatus = (uint32_t) 0x01;
	else
		HSEStatus = (uint32_t) 0x00;

	if (HSEStatus == (uint32_t) 0x01) {
		/* Enable Prefetch Buffer */
		*FLASH_ACR |= FLASH_ACR_PRFTBE;

		/* Flash 0 wait state */
		*FLASH_ACR &= (uint32_t) ((uint32_t) ~FLASH_ACR_LATENCY);

		*FLASH_ACR |= (uint32_t) FLASH_ACR_LATENCY_0;

		/* HCLK = SYSCLK */
		*RCC_CFGR |= (uint32_t) RCC_CFGR_HPRE_DIV1;

		/* PCLK2 = HCLK */
		*RCC_CFGR |= (uint32_t) RCC_CFGR_PPRE2_DIV1;

		/* PCLK1 = HCLK */
		*RCC_CFGR |= (uint32_t) RCC_CFGR_PPRE1_DIV1;

		/* Select HSE as system clock source */
		*RCC_CFGR &= (uint32_t) ((uint32_t) ~(RCC_CFGR_SW));
		*RCC_CFGR |= (uint32_t) RCC_CFGR_SW_HSE;

		/* Wait till HSE is used as system clock source */
		while ((*RCC_CFGR & (uint32_t) RCC_CFGR_SWS) != (uint32_t) 0x04);
	} else {
		/* If HSE fails to start-up, the application will have wrong clock
		configuration. User can add here some code to deal with this error */
	}
}
```

## 範例 4 : hello.ld

* <https://github.com/jserv/mini-arm-os/blob/master/00-HelloWorld/hello.ld>

```C
ENTRY(reset_handler)

MEMORY
{
	FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 128K
	RAM (rwx) : ORIGIN = 0x20000000, LENGTH = 40K
}

SECTIONS
{
	.text :
	{
		KEEP(*(.isr_vector))
		*(.text)
		*(.text.*)
		*(.rodata)
		_sromdev = .;
		_eromdev = .;
		_sidata = .;
	} >FLASH

	.data : AT(_sidata)
	{
		_sdata = .;
		*(.data)
		*(.data*)
		_edata = .;
	} >RAM

	.bss :
	{
		_sbss = .;
		*(.bss)
		_ebss = .;
	} >RAM

	_estack = ORIGIN(RAM) + LENGTH(RAM);
}
```


## 範例 5 : Makefile

* <https://github.com/jserv/mini-arm-os/blob/master/00-HelloWorld/Makefile>

```C
CROSS_COMPILE ?= arm-none-eabi-
CC := $(CROSS_COMPILE)gcc
CFLAGS = -fno-common -ffreestanding -O0 \
	 -gdwarf-2 -g3 -Wall -Werror \
	 -mcpu=cortex-m3 -mthumb \
	 -Wl,-Thello.ld -nostartfiles \

TARGET= hello.bin
all: $(TARGET)

$(TARGET): hello.c startup.c
	$(CC) $(CFLAGS) $^ -o hello.elf
	$(CROSS_COMPILE)objcopy -Obinary hello.elf hello.bin
	$(CROSS_COMPILE)objdump -S hello.elf > hello.list

qemu: $(TARGET)
	@qemu-system-arm -M ? | grep stm32-p103 >/dev/null || exit
	@echo "Press Ctrl-A and then X to exit QEMU"
	@echo
	qemu-system-arm -M stm32-p103 -nographic -kernel hello.bin

clean:
	rm -f *.o *.bin *.elf *.list
```



## 範例 6 : context_switch.S

* <https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/context_switch.S>

```C
.thumb
.syntax unified

.type svc_handler, %function
.global svc_handler
svc_handler:
	/* save user state */
	mrs r0, psp
	stmdb r0!, {r4, r5, r6, r7, r8, r9, r10, r11, lr}

	/* load kernel state */
	pop {r4, r5, r6, r7, r8, r9, r10, r11, ip, lr}
	msr psr, ip

	bx lr

.global activate
activate:
	/* save kernel state */
	mrs ip, psr
	push {r4, r5, r6, r7, r8, r9, r10, r11, ip, lr}

	/* switch to process stack */
	msr psp, r0
	mov r0, #3
	msr control, r0

	/* load user state */
	pop {r4, r5, r6, r7, r8, r9, r10, r11, lr}

	/* jump to user task */
	bx lr
```



## 範例 7 : syscall.S

* <https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/syscall.S>

```C
.thumb
.syntax unified

.global syscall
syscall:
	svc 0
	nop
	bx lr
```



## 範例 8 : threads.c

* <https://github.com/jserv/mini-arm-os/tree/master/07-Threads>

```C
#include <stdint.h>
#include "threads.h"
#include "os.h"
#include "malloc.h"
#include "reg.h"

#define THREAD_PSP	0xFFFFFFFD

/* Thread Control Block */
typedef struct {
	void *stack;
	void *orig_stack;
	uint8_t in_use;
} tcb_t;

static tcb_t tasks[MAX_TASKS];
static int lastTask;
static int first = 1;

/* FIXME: Without naked attribute, GCC will corrupt r7 which is used for stack
 * pointer. If so, after restoring the tasks' context, we will get wrong stack
 * pointer.
 */
void __attribute__((naked)) pendsv_handler()
{
	/* Save the old task's context */
	asm volatile("mrs   r0, psp\n"
	             "stmdb r0!, {r4-r11, lr}\n");
	/* To get the task pointer address from result r0 */
	asm volatile("mov   %0, r0\n" : "=r" (tasks[lastTask].stack));

	/* Find a new task to run */
	while (1) {
		lastTask++;
		if (lastTask == MAX_TASKS)
			lastTask = 0;
		if (tasks[lastTask].in_use) {
			/* Move the task's stack pointer address into r0 */
			asm volatile("mov r0, %0\n" : : "r" (tasks[lastTask].stack));
			/* Restore the new task's context and jump to the task */
			asm volatile("ldmia r0!, {r4-r11, lr}\n"
			             "msr psp, r0\n"
			             "bx lr\n");
		}
	}
}

void systick_handler()
{
	*SCB_ICSR |= SCB_ICSR_PENDSVSET;
}

void thread_start()
{
	lastTask = 0;

	/* Save kernel context */
	asm volatile("mrs ip, psr\n"
	             "push {r4-r11, ip, lr}\n");

	/* To bridge the variable in C and the register in ASM,
	 * move the task's stack pointer address into r0.
	 * http://www.ethernut.de/en/documents/arm-inline-asm.html
	 */
	asm volatile("mov r0, %0\n" : : "r" (tasks[lastTask].stack));
	/* Load user task's context and jump to the task */
	asm volatile("msr psp, r0\n"
	             "mov r0, #3\n"
	             "msr control, r0\n"
	             "isb\n"
	             "pop {r4-r11, lr}\n"
	             "pop {r0}\n"
	             "bx lr\n");
}

int thread_create(void (*run)(void *), void *userdata)
{
	/* Find a free thing */
	int threadId = 0;
	uint32_t *stack;

	for (threadId = 0; threadId < MAX_TASKS; threadId++) {
		if (tasks[threadId].in_use == 0)
			break;
	}

	if (threadId == MAX_TASKS)
		return -1;

	/* Create the stack */
	stack = (uint32_t *) malloc(STACK_SIZE * sizeof(uint32_t));
	tasks[threadId].orig_stack = stack;
	if (stack == 0)
		return -1;

	stack += STACK_SIZE - 32; /* End of stack, minus what we are about to push */
	if (first) {
		stack[8] = (unsigned int) run;
		stack[9] = (unsigned int) userdata;
		first = 0;
	} else {
		stack[8] = (unsigned int) THREAD_PSP;
		stack[9] = (unsigned int) userdata;
		stack[14] = (unsigned) &thread_self_terminal;
		stack[15] = (unsigned int) run;
		stack[16] = (unsigned int) 0x21000000; /* PSR Thumb bit */
	}

	/* Construct the control block */
	tasks[threadId].stack = stack;
	tasks[threadId].in_use = 1;

	return threadId;
}

void thread_kill(int thread_id)
{
	tasks[thread_id].in_use = 0;

	/* Free the stack */
	free(tasks[thread_id].orig_stack);
}

void thread_self_terminal()
{
	/* This will kill the stack.
	 * For now, disable context switches to save ourselves.
	 */
	asm volatile("cpsid i\n");
	thread_kill(lastTask);
	asm volatile("cpsie i\n");

	/* And now wait for death to kick in */
	while (1);
}
```



## 範例 9 : threads.h

* <https://github.com/jserv/mini-arm-os/blob/master/07-Threads/threads.h>

```C
#ifndef __THREADS_H__
#define __THREADS_H__

void thread_start();
int thread_create(void (*run)(void*), void* userdata);
void thread_kill(int thread_id);
void thread_self_terminal();

#endif
```

## 範例 10: rubi/asm.h

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


## 範例 11: rubi/engine.c

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


## 小結

看完上面的範例，不知道您是否發現了一些事情？

一個 C 語言專案，通常至少會包含如下的檔案結構：

1. 一堆 `*.h` 的標頭檔案
2. 一堆 `*.c` 的程式檔案
3. 至少一個 `Makefile` 專案建置檔
4. 嵌入式專案通常會有 `*.ld` 連結檔

如果想更清楚的瞭解一個《最簡單的嵌入式 C 語言專案》，請參考下列的 HelloWorld 專案網址。

* <https://github.com/jserv/mini-arm-os/tree/master/00-HelloWorld>

其中 `*.c` 的功能大家應該都已經清楚了，而學過 C 語言者應該也知道 `*.h` 是宣告《函數原型、常數、資料結構》的地方。

C 語言從來就不只是 C 語言而已，C 語言是用來寫作業系統的語言，我們必須考慮《處理器架構》、撰寫《組合語言》、瞭解《開發板的架構》、利用《記憶體映射》來進行輸出入、並且用《連結檔 ld 》來指定《每一段機器碼或資料》必須要載入到哪裡，最後用 Makefile 來指定檔案之間的相關編譯順序，還有建置整個專案的程序等等。


如果以上這些範例你都可以看得懂的話，那這本書基本上你已經不需要看了，請直接關掉吧，這樣才不會浪費你的生命！

假如你有些範例看不懂，那就請跟隨我們一起向第二章邁進吧！



