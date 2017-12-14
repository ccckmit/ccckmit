# 作業系統

[06-Preemptive]:https://github.com/jserv/mini-arm-os/tree/master/06-Preemptive
[07-Threads]:https://github.com/jserv/mini-arm-os/tree/master/07-Threads
[08-CMSIS]:https://github.com/jserv/mini-arm-os/tree/master/08-CMSIS
[malloc.c]:https://github.com/jserv/mini-arm-os/blob/master/07-Threads/malloc.c
[thread.c]:https://github.com/jserv/mini-arm-os/blob/master/07-Threads/threads.c

在前一章的 [《強制切換》](preemptive.md) 當中，其實已經完成了一個具體而微的《嵌入式多工作業系統》， 這個作業系統支援 Multi-Thread 的多線程架構。

在 mini-arm-os 的第七單元 [07-Threads] 中，除了加上 [malloc.c] 動態分配記憶體功能，也把所有 thread 相關函數都集中在一個 [thread.c] 模組當中，這讓整個系統變得更加模組化了。

這樣、 mini-arm-os 基本上就完成了一個具體而微的《嵌入式作業系統》 了。

現在讓我們更詳細的看一下這些模組的細節！

## 記憶體管理 malloc.c

[07-Threads] 當中的記憶體管理模組位於 [malloc.c] 檔案中 ，採用鏈結串列作為區塊串接的資料結構，該結構如下：

```C
...
typedef long Align;

union header {
	struct {
		union header *ptr;
		unsigned int size;
	} s;
	Align x;
};

typedef union header Header;

static unsigned char heaps[MAX_HEAPS];
static unsigned char *program_break = heaps;

static Header base; /* empty list to get started */
static Header *freep = NULL; /* start of free list */
...
```

記憶體管理採用《最先配適法》，也就是把第一個夠大的區塊分配出去，其程式碼位於 malloc() 函數當中，該函數如下：

```C
void *malloc(unsigned int nbytes)
{
	Header *p, *prevp;
	unsigned int nunits;
	void *cp;

	nunits = (nbytes + sizeof(Header) - 1) / sizeof(Header) + 1;

	if ((prevp = freep) == NULL) {
		base.s.ptr = freep = prevp = &base;
		base.s.size = 0;
	}

	for (p = prevp->s.ptr; ; prevp = p, p = p->s.ptr) {
		if (p->s.size >= nunits) {
			if (p->s.size == nunits) {
				prevp->s.ptr = p->s.ptr;
			} else {
				p->s.size -= nunits;
				p += p->s.size;
				p->s.size = nunits;
			}
			freep = prevp;
			return (void *)(p + 1);
		}

		if (p == freep) {
			cp = sbrk(nunits * sizeof(Header));
			if (cp == (void *) -1) {
				return NULL;
			} else {
				p = (Header *) cp;
				p->s.size = nunits;
				free((void *) (p + 1));
				p = freep;
			}
		}
	}
}
```

然後在釋放的時候，會盡可能將上下連接在一起的區塊合併，這樣就完成了《記憶體管理模組》。

## Thread 管理模組

在 [Thread.c] 裏面，實作了 Multi-thread 的機制， Mini-arm-os 主要支援下列 thread 相關的管理函數。

```C
void thread_start();
int thread_create(void (*run)(void*), void* userdata);
void thread_kill(int thread_id);
void thread_self_terminal();
```

這些函數基本上都能像 [強制切換](preemptive.md) 一章當中所描述的方式運作，但是原本的 [06-Preemptive] 中採用 `systick_handler` 的方式在 [07-Threads] 裏被修改為使用 `pendsv_handler()` 函數 。

程式：[06-Preemptive] 專案中 [context_switch.S](https://github.com/jserv/mini-arm-os/blob/master/06-Preemptive/context_switch.S) 檔案裏的 `systick_handler` 。

```ASM
svc_handler:
systick_handler:
	/* save user state */
	mrs r0, psp
	stmdb r0!, {r4, r5, r6, r7, r8, r9, r10, r11, lr}

	/* load kernel state */
	pop {r4, r5, r6, r7, r8, r9, r10, r11, ip, lr}
	msr psr_nzcvq, ip

	bx lr
```

[PendSV](http://infocenter.arm.com/help/index.jsp?topic=/com.arm.doc.dui0553a/BABBGBEC.html) 是 ARM 的一種低優先權中斷，這似乎是為了讓 thread 的切換不要干擾到重要的緊急工作之運行。

以下是 ARM 對 PendSV 的官方說明：

> PendSV is an interrupt-driven request for system-level service. 
> In an OS environment, use PendSV for context switching when no other exception is active.

只是這部分我還沒辦法理解的夠深入，因此請大家直接看 [thread.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/threads.c) 中的原始程式碼！


```C
...
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
...
```

這樣就完成了一個具體而微的嵌入式作業系統了，我們可以在其中啟動很多 thread 並且由作業系統自動安排執行順序與自動切換。寫程式的人只要專注於各個 thread 函數的撰寫就行了。

以下是 [07-Threads] 主程式 [os.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/os.c) 的完整原始碼。

```C
#include <stddef.h>
#include <stdint.h>
#include "reg.h"
#include "threads.h"

/* USART TXE Flag
 * This flag is cleared when data is written to USARTx_DR and
 * set when that data is transferred to the TDR
 */
#define USART_FLAG_TXE	((uint16_t) 0x0080)

void usart_init(void)
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
}

void print_str(const char *str)
{
	while (*str) {
		while (!(*(USART2_SR) & USART_FLAG_TXE));
		*(USART2_DR) = (*str & 0xFF);
		str++;
	}
}

static void delay(volatile int count)
{
	count *= 50000;
	while (count--);
}

static void busy_loop(void *str)
{
	while (1) {
		print_str(str);
		print_str(": Running...\n");
		delay(1000);
	}
}

void test1(void *userdata)
{
	busy_loop(userdata);
}

void test2(void *userdata)
{
	busy_loop(userdata);
}

void test3(void *userdata)
{
	busy_loop(userdata);
}

/* 72MHz */
#define CPU_CLOCK_HZ 72000000

/* 100 ms per tick. */
#define TICK_RATE_HZ 10

int main(void)
{
	const char *str1 = "Task1", *str2 = "Task2", *str3 = "Task3";

	usart_init();

	if (thread_create(test1, (void *) str1) == -1)
		print_str("Thread 1 creation failed\r\n");

	if (thread_create(test2, (void *) str2) == -1)
		print_str("Thread 2 creation failed\r\n");

	if (thread_create(test3, (void *) str3) == -1)
		print_str("Thread 3 creation failed\r\n");

	/* SysTick configuration */
	*SYSTICK_LOAD = (CPU_CLOCK_HZ / TICK_RATE_HZ) - 1UL;
	*SYSTICK_VAL = 0;
	*SYSTICK_CTRL = 0x07;

	thread_start();

	return 0;
}
```

## 結合 ARM 的 CMSIS 輸出入函式庫

雖然 [07-Threads] 已經完成了一個《支援 Multi-Threads 的嵌入式作業系統》，而且也能透過 USART 串流介面進行基本的輸出入到宿主電腦上了，但是若要銜接更多的周邊裝置，由於每個周邊裝置的差異很大，每個都要寫 driver 的話會很麻煩。

因此在 Mini-arm-os 在 [08-CMSIS] 這個最後的專案中，引入了《CMSIS》這個 ARM Cortex 微控制器標準介面，這樣就可以方便的透過 Mini-arm-os 銜接更多的周邊裝置，我想這就是為何會有 [08-CMSIS] 這個專案的原因了。

雖然 [08-CMSIS] 並非必需的，但是卻對後續的開發很有幫助！

在 [08-CMSIS] 的 [core/src/os.c](https://github.com/jserv/mini-arm-os/blob/master/08-CMSIS/core/src/os.c) 原始碼中，我們可以看到下列程式碼

```C
#include "stream.h"

#define puts(x) do {                       \
                   stream_write(USART,x);  \
                }while(0)
```

而這個 stream_write 則是定義在 stream.c 當中，原始碼如下，其中的 uart_write 

```C
#include "stream.h"
#include "uart.h"

void stream_init(STREAM stream_type)
{
	switch (stream_type) {
	case USART:
		uart_init();
		break;
	default:
		break;
	}
}


void stream_write(STREAM stream_type, const char *data)
{
	switch (stream_type) {
	case USART:
		uart_write(data);
		break;
	default:
		break;
	}
}
```

這個 uart_write 定義在 [platform/f429disco/src/uart.c](https://github.com/jserv/mini-arm-os/blob/master/08-CMSIS/platform/f429disco/src/uart.c) 檔案裏，原始碼如下：

```C
/*
 * USART1: Tx=PA9 , Rx=PA10
 */
void uart_init(void)
{
	enableUartPeripheralCLOCK();
	enableGPIO();
	enableUART();
	uart_write("USART initialized!\r\n");
}

void uart_write(const char *str)
{
	while (*str) {
		while (!(USART1->SR & USART_SR_TXE))
			;
		USART1->DR = (*str & 0xFF);
		str++;
	}
}
```

雖然程式碼感覺沒有節省多少，但是當周邊裝置很多，而不是只有 USART 時，使用 CMSIS 應該可以節省很多寫程式的時間才對。

在原本 [07-Threads] 當中，程式裏必須自己用《記憶體映射》去定義 USART 以便輸出到 USART 上，如下所示：

```C
void print_str(const char *str)
{
	while (*str) {
		while (!(*(USART2_SR) & USART_FLAG_TXE));
		*(USART2_DR) = (*str & 0xFF);
		str++;
	}
}
```

但是在使用 CMSIS 的版本中，在卻只要直接用 `stream_write(USART,x)` 就可以輸出了。

## 結語

至此、我們已經透過 Mini-arm-os 學習了如何開發一個《嵌入式作業系統》，該作業系統可以支援 Multi-Threads 的多執行緒 (多線程) 功能。

相信透過 mini-arm-os 的逐步引導，只要您原本就熟悉 C 語言與記憶體映射輸出入，並且能看懂組合語言，那應該是不會太難看懂 mini-arm-os  原始碼才對。

希望這本書的介紹，能幫助您真正理解《嵌入式作業系統》的設計原理，讓作業系統不再只是一個書本上的概念，而是您可以實際感受體會的《真正程式碼》。







