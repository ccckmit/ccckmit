# 輸出入 I/O


在前一章中，我們透過標頭檔瞭解了《記憶體映射》的那些奇特技巧，讓我們可以順利的進行輸出入等動作，可惜的是沒有給出一個完整的案例。

現在、就讓我們用 jserv mini-arm-os 的第一個 HelloWorld 專案，當作我們的完整案例吧！

## Hello 輸出入

首先、讓我們直接看到 hello.c ，裡面有個主程式 main()，這個程式基本上只會《從開發板傳送 `Hello World!` 到宿主電腦》的上，然後宿主電腦通常會透過《minicom》(Linux) 或《超級終端機》(windows) 印出到畫面上，這樣就解決了《嵌入式開發板常常沒有顯示裝置可以用來觀察程式的執行狀況之問題》。

在以下的程式中，您會發現 print_str 這個函數，就是用來《從開發板傳送字串到宿主電腦》的輸出函數，請先仔細看看。

範例 1 : hello.c

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

在 print_str 函數中，程式會從第一個字開始，一個字接著一個字的透過 USART2 這個《記憶體映射》傳送字元出去。

```C
#define USART_FLAG_TXE	((uint16_t) 0x0080)

void print_str(const char *str)
{
	while (*str) {
		while (!(*(USART2_SR) & USART_FLAG_TXE));
		*(USART2_DR) = (*str & 0xFF);
		str++;
	}
}
```

上述程式用到下列兩個《記憶體映射暫存器》，其中 USART2_SR 的第七個位元 TXE 應該是代表《可傳送 Transmit data register empty》。

* USART2_SR : 狀態暫存器 USART2_Status_Register
* USART2_DR : 資料暫存器 USART2_Data_Register

當我們讀取並測試 USART2_SR 暫存器，發現 TXE 位元的值為 1 時，就代表我們《可以傳送下一個字元出去》了。

因此上述程式用 `while (!(*(USART2_SR) & USART_FLAG_TXE));` 這行以《忙碌等待》的方式，不斷測試 USART2_SR 的 TXE 位元是否為 1，一旦發現該位元為 1 時，就立刻離開迴圈並用 `*(USART2_DR) = (*str & 0xFF);` 這行程式將字元傳送出去。然後繼續前進到下一輪迴圈中，等待送出下一個字元。

當然、這些輸出入暫存器的記憶體映射位址都已經設定好了，以下是與 USART2 有關的映射，更完整的映射請參考 [reg.h](https://github.com/jserv/mini-arm-os/blob/master/01-HelloWorld/reg.h) 這個檔案。

```C
/* USART2 Memory Map */
#define USART2		((__REG_TYPE) 0x40004400)
#define USART2_SR	((__REG) (USART2 + 0x00))
#define USART2_DR	((__REG) (USART2 + 0x04))
#define USART2_BRR	((__REG) (USART2 + 0x08))
#define USART2_CR1	((__REG) (USART2 + 0x0C))
#define USART2_CR2	((__REG) (USART2 + 0x10))
#define USART2_CR3	((__REG) (USART2 + 0x14))
#define USART2_GTPR	((__REG) (USART2 + 0x18))

```

## 輪詢

上述的《忙碌等待》方式，只適用於單一輸入裝置的情況，如果有很多輸入裝置，我們都要同時監聽，看看是否有資料近來，那麼通常有兩種方法，第一種是採用《輪詢》(Polling 輪流詢問)，第二種是採用《中斷》(Interrupt) 的方式。

《輪詢的方式》和《忙碌等待》非常類似，只是輪詢會輪流詢問每一個裝置，以下是一個示意範例：

```C
while (1) {
  for each io_device {
    if (io_device.ready)
      doIO();
  }
}
```

這樣就可以輪流檢查每一個裝置是否可以輸出入，然後對輸入裝置讀取資料，對輸出裝置寫出資料了。

## 多線程的輸出入作法

在 jserv 的 mini_arm_os 當中，目前有 8 個專案，其中第七個 [07-Threads](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/) 專案已經有實作好完整的多線程 (multi-threads) 作業系統，因此在進行輸出入的時候，就可以利用不同線程，進行不同的輸出入動作，以下是該專案中創建了三個 thread 分別進行輸出的程式片段。

檔案： [os.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/os.c)

```C
// 前面還有...
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

您可以看到該專案的主程式分別啟動了 test1, test2, test3 等三個函數以 thread 的方式執行，這三個 thread 會在作業系統的安排下，各自輸出 'Task1', 'Task2', 'Task3' 的字串。

透過這種多線程的方式，您就可以《更彈性的撰寫輸出入程式》，而不用採用《輪詢》的方式將所有輸出入集中到一個迴圈裡完成了。


## 小結


輪詢的方式比較簡單，不須作業系統支持，也不需使用中斷機制。

但《多線程》的 Multi-Threads 方式，通常需要有作業系統支持。

《嵌入式作業系統》的核心通常就是《線程管理機制的實作》，而更複雜的《作業系統》可能還會支援 mutex、semaphore、monitor 等《同步機制》，那些就是作業系統課程裡的重點問題了。

