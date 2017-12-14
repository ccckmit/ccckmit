# 啟動程式與連結檔


不管你程式寫得多好，如果《開發板》啟動不了，那麼一切都是白談！

但是要讓《開發板》啟動，通常必須要進行一連串的設定。

問題是到底要怎麼設定呢？

其實如果你向《開放原始碼社群》學習，往往仔細看專案的 README 就可以得到解答了！

## 向開源專案學習

以 jserv 的 mini-arm-os 而言，專案的 README 一開頭，就告訴我們下列這些事情：

```
Build a minimal multi-tasking OS kernel for ARM from scratch (的步驟與流程)

Prerequisites

QEMU with an STM32 microcontroller implementation
Build instructions
./configure --disable-werror --enable-debug \
    --target-list="arm-softmmu" \
    --extra-cflags=-DSTM32_UART_NO_BAUD_DELAY \
    --extra-cflags=-DSTM32_UART_ENABLE_OVERRUN \
    --disable-gtk
make
GNU Toolchain for ARM
Set $PATH accordingly
...
Building and Verification

Changes the current working directory to the specified one and then
make
make qemu
...
Quick Start / Support Devices:

STM32F429i-Discovery(physical devices)
Details in Chinese by NCKU
STM32F429i-Discovery uses USART1(Tx=PA9,Rx=PA10,baud rate=115200) as default serial port here.
You will a terminal emulator, such as screen
Installation on Ubuntu / Debian based systems: sudo apt-get install screen
Then, attach the device file where a serial to USB converter is attached: screen /dev/ttyUSB0 115200 8n1
Once you want to quit screen, press: Ctrl-a then 
...
STM32-P103(QEMU)

make p103 or make target PLAT=p103
Build "p103.bin"
make qemu
Build "p103.bin" and run QEMU automatically.
make qemu_GDBstub
Build "p103.bin" and run QEMU with GDB stub and wait for remote GDB automatically.
make qemu_GDBconnect
Open remote GDB to connect to the QEMU GDB stub with port:1234 (the default port).
```

所以如果要為了這個程式買開發板的話，應該按照指示買《STM32F429》這塊，如果要用 QEMU 模擬的話，可以使用 STM32-P103 的設定，

由於我們的範例 mini-arm-os 是針對 ARM-Cortex M3 而設計的，所以必要時得讀 [The Definitive Guide to the ARM Cortex M3 (PDF)](http://tinymicros.com/mediawiki/images/7/75/Definitive_Guide_To_The_ARM_Cortex_M3.pdf)  這份文件，才能詳細瞭解到底該如何設定處理器，如何撰寫啟動程式了。

不過其實廠商通常會出範例程式，其中就包含了啟動程式，我們只要啟動《複製修改大法》，就可以完成這個任務了。

不過要修改的話，還是得瞭解一下比較好，否則亂改很可能會動不了！

筆者對 ARM-Cortex M3 還不是很瞭解，因此本文僅供參考，如有錯誤或不清楚之處，敬請反映給我，我會修改內容！


本文接下來的講解，以 mini-arm-os 的 07-Threads 專案為主要內容：

* <https://github.com/jserv/mini-arm-os/tree/master/07-Threads>

## 啟動程式

以下的啟動程式有點長，但其中的重點在 reset_handler 這個函數上，只要將這個函數塞入到《重開機中斷》的中斷向量位址上，那麼就可以在啟動時觸發此函數，然後再進行一連串的設定動作，最後導入主程式 main 完成啟動動作。

```C
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


```

您可以看到在 reset_handler 程式中，開頭的部分是將 flash 裡面的資料載入到 SRAM 裡面，這是因為 flash 這種永久儲存體不方便直接當作記憶體來存取，因此該程式會先將資料區段複製到 SRAM 之後，未來的資料存取動作就都在 SRAM 上進行，不需要再存取 flash 了。(這種做法在嵌入式系統上很常見，特別是在開發板當中)

接著第二段的 `Zero fill the bss segment` 部分，是將那些不需要初始化的空陣列與未設初值的變數區域 (也就是 BSS段的內容)，全部清空為 0，這樣可以比較安全的確定程式在一開始執行時有個乾淨的環境，比較不容易造成一些《不確定現象》。

完成上述兩個動作後，就可以開始進行《開發板設定》，rcc_clock_init 函數應該就是在做這件工作，只是設定的項目眾多，有興趣的人可以進一步參考 jserv 他們上課的 hackpad 共筆資料。

* <https://embedded2015.hackpad.com/ep/pad/static/mlcSB9jJXNy>

稍微了解之後，您應該就可以看懂完整的啟動程式模組 [startup.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/startup.c) 了！


範例 : startup.c

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

但是、只有上述啟動程式是不夠的，嵌入式程式要能正確跑起來，必須《把程式放到正確的記憶體位址》，所以我們需要撰寫指定連結位址的 ld 描述檔！

## 連結檔

以下是 mini-arm-os / 07-Threads 專案連結檔 os.ld 的內容，請先讀一遍！

* <https://github.com/jserv/mini-arm-os/blob/master/07-Threads/os.ld>

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

該連結檔指定了開發板上的 FLASH 永久記憶體與 RAM 暫時記憶體分別位於哪個區塊，

```
MEMORY
{
	FLASH (rx) : ORIGIN = 0x08000000, LENGTH = 128K
	RAM (rwx) : ORIGIN = 0x20000000, LENGTH = 40K
}
```

然後下列這段指定了《程式部分》是要放入 FLASH 裡面的，而且中斷向量 isr_vector 是要放在程式的最開頭 (這很重要，否則一開機就跑錯地方，那就慘了...)

```
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

```

接著是《有初始值的資料 (data 段)》與《無初始值的資料 (bss段)》 應該要放在 RAM 裡面，按順序排下來：

```
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
````

最後設定 _estack 符號的內容，

```
	_estack = ORIGIN(RAM) + LENGTH(RAM);
```

這個 `_estack` 變數在 [startup.c](https://github.com/jserv/mini-arm-os/blob/master/07-Threads/startup.c) 當中會用到，以下是相關程式片段：

```
// 前面還有 ...
/* start address for the initialization values of the .data section.
 * defined in linker script */
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


void nmi_handler(void) __attribute((weak, alias("default_handler")));
void hardfault_handler(void) __attribute((weak, alias("default_handler")));
void memmanage_handler(void) __attribute((weak, alias("default_handler")));
void busfault_handler(void) __attribute((weak, alias("default_handler")));
void usagefault_handler(void) __attribute((weak, alias("default_handler")));
void svc_handler(void) __attribute((weak, alias("default_handler")));
void pendsv_handler(void) __attribute((weak, alias("default_handler")));
void systick_handler(void) __attribute((weak, alias("default_handler")));

__attribute((section(".isr_vector")))
uint32_t *isr_vectors[] = {
	[0x00] = (uint32_t *) &_estack,			/* stack pointer */
	[0x01] = (uint32_t *) reset_handler,		/* code entry point */
	[0x02] = (uint32_t *) nmi_handler,		/* NMI handler */
	[0x03] = (uint32_t *) hardfault_handler,	/* hard fault handler */
	[0x04] = (uint32_t *) memmanage_handler,	/* mem manage handler */
	[0x05] = (uint32_t *) busfault_handler,		/* bus fault handler */
	[0x06] = (uint32_t *) usagefault_handler,	/* usage fault handler */
	[0x0B] = (uint32_t *) svc_handler,		/* svc handler */
	[0x0E] = (uint32_t *) pendsv_handler,		/* pendsv handler */
	[0x0F] = (uint32_t *) systick_handler		/* systick handler */
};
// 後面也還有 ...

```

您可以看到上述程式最後的 isr_vectors 中斷向量，開頭的兩個就是 `_estack` 和 reset_handler 。

```
	[0x00] = (uint32_t *) &_estack,			/* stack pointer */
	[0x01] = (uint32_t *) reset_handler,		/* code entry point */
```

由於在連結檔 os.ld 中指定了 isr_vector 要放在 FLASH 的一開頭，而《開發板》在一開機的時候就預設會從該處載入並開始執行，因此這個中斷向量一定得塞到這個位址，整個系統才能正確啟動。

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
    ...
```

## 小結

現在、你應該看清楚整個《啟動程式》是如何布局並且被啟動的，還有《連結的 ld 檔》到底在系統裡面扮演的是甚麼角色了！

嵌入式的專案，和一般專案的最大不同點，或許就在《啟動程式和連結的 ld 檔》了！



