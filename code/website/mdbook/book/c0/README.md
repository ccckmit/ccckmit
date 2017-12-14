# 用 C 語言寫《嵌入式作業系統》

本書不談論任何有關《應用層》的 C 語言，專注講授《嵌入式、作業系統》等低層級的 C 語言。

感謝 jserv 寫了很多《底層》的範例開放給我們使用，在本書中我們將透過 jserv 的 mini-arm-os 專案來學習如何設計一個《嵌入式作業系統設計》 。

## 支援 multi-thread 的作業系統

Mini-arm-os 當中所發展出的《嵌入式作業系統》，是一個支援《多執行緒》(Multi-Thread, 中國稱為多線程》的系統，也就是可以支援 Thread 的自動切換，不會因為一個 thread 占用 CPU 而導致其他 thread 無法進行的《嵌入式作業系統》。

## 嵌入式作業系統的角色

一個嵌入式系統可以沒有作業系統，只要所有的程式都連結在一起，然候用《輪詢》或《中斷》的方式進行輸出入協調就可以了！

但是當系統開始想要充分利用 CPU，讓某個程式在輸出入時，可以切換給另一個程式執行，這時就會需要《行程或線程》的支援了。

## 何謂 Thread ？

所謂的 thread 基本上就是一個函數 f，但是我們使用 thread_create(..., f,...) 這樣的方式啟動該函數，而且可以連續啟動很多個函數 f1, f2, ...., fk， 這樣的函數和一般函數有所不同，因為 f1, f2, ...fk 等 thread 會在作業系統的安排下《有效率的進行切換，看起來就像是同時都在執行一樣》。

Mini-arm-os 就是一個可以支援這類 Multi-Thread 功能的《嵌入式作業系統》。

但是如果一開始就發展一個完整的《嵌入式作業系統》，勢必會太過困難而導致學習者無法理解，因此 Mini-arm-os 所設計的不是一套作業系統而已，而是一系列由淺入深的開發過程，目前 Mini-arm-os 共有八課，每一課通常有一到兩個專案，用來循序帶領讀者進入《嵌入式作業系統的世界》。

以下是 Mini-arm


## Mini-arm-os 的 Multi-threads 範例

以下是第七課當中的 [os.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/os.c) 作業系統主程式的 Multi-threads 範例，您可以看到程式中透過 `thread_create(test1, ...), thread_create(test2, ...), thread_create(test3, ...)` 連續創建了三個 thread 並啟動執行，這就是透過 Mini-arm-os 所發展出的作業系統進行 Multi-threads 多工作業的範例。

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

雖然 Mini-arm-os 支援了 multi-threads 的環境，但是到目前為止還沒有支援像 Mutex 、 Semaphore 等《號誌》類的同步機制，這或許是想延伸 Mini-arm-os 的讀者可以著墨的一個進階功能。

只要透過像《禁止中斷》這樣的方式，應該就可以實作出 Mutex 以避免 thread 共用變數時所可能造成的問題，然後利用號誌禁止臨界區間的中斷發生，就應該能實作出《單核心》處理器的 Mutex 功能了。

有了 Mutex、Semaphore 等《號誌》類的同步機制，就能進一步實作像是《生產者-消費者》或《哲學家用餐問題》之類的典型作業系統同步機制，以下的 Linux 之 Pthread 就運用 semaphore 實作了《生產者-消費者》問題的解法。

## Linux 當中的 PThread 範例

* <https://gist.github.com/jaseemabid/1922623>

檔案： producer_consumer.c

```C
/** PRODUCER - CONSUMER PROBLEM **/

#include <stdio.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <pthread.h>
#include <stdlib.h>

#define BUFSIZE 10

#define MUTEX 0
#define FULL 1
#define EMPTY 2

int semid;

union semun {
	int val; /*	Value	for	SETVAL	*/
	struct semid_ds *buf;		/*	Buffer	for	IPC_STAT,	IPC_SET	*/
	unsigned short *array;	/*	Array	for	GETALL,	SETALL	*/
	struct seminfo *__buf;	/*	Buffer	for	IPC_INFO (Linux-specific)	*/
};

int sem_create(int nsems) { 
	int  id;
	key_t key = 1234;
	int semflg = IPC_CREAT | 0666;
	id = semget(key, nsems, semflg);
	if(id < 0)
	{
		perror("semget:");
		exit (1);
	}
	return id;
}

void sem_initialise(int semno, int val) {
	union semun un;
	un.val = val;
	if(semctl(semid, semno, SETVAL, un) < 0)
	{
	//	printf("%d\n", semno);
		perror("semctl:");
		exit(2);
	}
}

void *producer(void *id);
void *consumer(void *id);

void wait(int semno);
void signal(int semno);

int buffer[BUFSIZE], data;
int in = 0;
int out = 0;

int i = 10000;
int j = 10000;

int	main	(int	argc,	char	*argv[])	{
	semid = sem_create(3);
	sem_initialise(MUTEX, 1);
	sem_initialise(FULL, 0);
	sem_initialise(EMPTY, 10);

	pthread_t prod, cons;	
	
	pthread_create(&prod, NULL, producer, (void *)semid);
	pthread_create(&cons, NULL, consumer, (void *)semid);
	
	pthread_exit(NULL);
	return	0;
}

void *producer(void *id) {
	int semid = (int) id;
	data = 0;
	while(i--) {
		wait(EMPTY);
		wait(MUTEX);

		/** Critical Section **/
		buffer[in] = data;
		in = (in + 1) % BUFSIZE;
		data = (data + 1) % BUFSIZE;
		printf("P:%d\n", data);
		//printf("P\n");
		signal(MUTEX);
		signal(FULL);
	}
	pthread_exit(NULL);
}

void *consumer(void *id) {
	int semid = (int) id;
	while(j--)
	{
	wait(FULL);
	wait(MUTEX);
	
	/** Critical Section 	**/	
	data = buffer[out];
	out = (out + 1) % BUFSIZE;
	printf("C:%d\n", data);
	/** 			**/
	
	signal(MUTEX);
	signal(EMPTY);
	}	
	
	pthread_exit(NULL);
}

void wait(int semno) {
	struct sembuf buf;
	buf.sem_num = semno;
	buf.sem_op = -1;
	buf.sem_flg = 0;
	if(semop(semid, &buf, 1) < 0) {
		perror("semop:");
		exit(2);
	}
}

void signal(int semno) {
	struct sembuf buf;
	buf.sem_num = semno;
	buf.sem_op = 1;
	buf.sem_flg = 0;
	if(semop(semid, &buf, 1) < 0)
	{
		perror("semop:");
		exit(2);
	}
}
```

執行：

```
$ gcc producer_consumer.c -lpthread -o producer_consumer
$ ./producer_consumer
```

上述範例來自下列文章：

* <http://timmurphy.org/2014/04/26/using-fork-in-cc-a-minimum-working-example/>

## 小節

當然、要實作一個很強大的作業系統，並不是那麼容易的，程式碼也會很難懂。

還好、 Mini-arm-os 採用一系列的專案課程，讓我們得以逐步的學習設計一個《嵌入式作業系統》所需要的知識，這樣的安排對我來說，可以說是非常好的入門磚，感謝 jserv 寫出 Mini-arm-os 讓我們得以快速的理解作業系統的設計原理。

