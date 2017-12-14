# 標頭檔 `*.h`


對於標頭檔這件事，廢話不多說，讓我們直接看一個範例！

## 標頭檔範例

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

對於上述範例，很多學習 C 語言的學生會看不懂，但是在業界寫 C 語言的工程師卻都知道這些常識。

問題是、最麻煩的就是常識！

常識就是大家都知道，大家卻都不講的那些東西 ....

而且當你不知道的時候，就會被人家使白眼，搞得自己好像是白癡一樣 ....

對於 C 語言的標頭檔，有兩個學生經常不知道的《常識》，第一個是《引用防護》，第二個是《記憶體映射》。

## 引用防護

以下是上述範例中《引用防護》的部分：

```C
#ifndef __REG_H_
#define __REG_H_

#define __REG_TYPE	volatile uint32_t
#define __REG		__REG_TYPE *
// ...
#endif
```

請注意檔案最前面兩行，其意義如下：

```C
#ifndef __REG_H_ // 如果 __REG_H_ 還沒被定義過
#define __REG_H_ // 就定義 __REG_H_ ，然後展開直到 #endif 之前的內容

#define __REG_TYPE	volatile uint32_t
#define __REG		__REG_TYPE *
// ...
#endif
```

由於上述的 `reg.h` 檔案可能會被引用很多次，例如在 a.c, b.c 等檔案中如果都分別用 `#include "reg.h"` 引用該標頭檔，那麼 reg.h 就被引用了兩次。

有些編譯器，會允許符號定義兩次，但是也有很多編譯器不允許符號定義兩次，如果我們不加入上述的 `#ifndef` 引用防護，那麼當符號被展開兩次以上時，可能就會導致編譯發生錯誤的情況！

因此上述這種《引用防護》，可以防止《符號、結構、變數》等等內容被重複定義很多次，讓一個標頭檔的內容在編譯過程中只被展開一次，這樣就不會造成《重複定義》的錯誤了！

附帶提到的是，除了用 `#ifndef` 來進行引用防護之外，採用 `#pragma once` 也是一種可行的作法！

請參考： <https://zh.wikipedia.org/wiki/Pragma_once>

## 記憶體映射

電腦的輸出入設計方式通常有兩種，第一種是設計專門的 `in, out, ....` 等組合語言指令來做輸出入，第二種是採用《記憶體輸出入指令》，將輸出入裝置納入記憶體位址空間中，使用 `LOAD, STORE` 之類的指令來輸出入。

對於 C 語言來說，採用《記憶體輸出入指令》進行輸出入是很方便的做法，因為我們可以利用《指標》直接定位《記憶體位址》，不須透過組合語言就可以進行輸出入。以下是一個範例：

```
#define SEG7     		((unsigned char*)  0x40000000)
#define KEYBOARD		((unsigned short*) 0x40000002)
```

假如在某塊《開發板》中，硬體上的線路設計，就是將一個七段顯示器映射到 `0x40000000` 位址的一個 8 位元暫存器上，那麼我們就可以透過下列指令，在七段顯示器中點亮兩根亮棒。

```
*SEG7 = 0b00000011;
```

這就是透過記憶體映射進行輸出的方法！

相反的、如果要進行輸入，那麼就要《讀取某記憶體位址的內容》。

假如鍵盤映射到 `0x40000002` 位址的一個 16 位元暫存器上，那麼我們就可以透過下列指令讀取鍵盤到底是哪個鍵被按下了：

```
unsigned short key = *KEYBOARD;
```

1999 年的 C99 的標準在 `<stdint.h>` 當中定義了下列型態，提供了更簡短明確的整數型態：

| 有號型態 | 無號型態 | 長度 | 
|---------|----|-------| 
| int8_t | uint8_t | 8位元 | 
| int16_t | uint16_t | 16位元 | 
| int32_t | uint32_t | 32位元 | 
| int64_t | uint64_t | 64位元 | 

因此我們可以將上述程式：

```C
#define SEG7     		((unsigned char*)  0x40000000)
#define KEYBOARD		((unsigned short*) 0x40000002)
```

改寫成下列程式：

```C
#define SEG7     		((uint8_t*)  0x40000000)
#define KEYBOARD		((uint16_t*) 0x40000002)
```

## volatile 關鍵字

但是、上述的《記憶體映射定義》，特別是 KEYBOARD 的部分，是有可能在《編譯器優化》的過程中產生錯誤的：

舉例而言，假如有下列的程式碼：

```C
// ...
*KEYBOARD = 0
// ... 這段程式碼沒有更改 KEYBOARD 的內容。
if (*KEYBOARD) 
  *SEG7=0b00000011;
```

這段程式碼代表當鍵盤有輸入的時候，就點亮七段顯示器的兩根亮棒。

但問題是，編譯器在優化過程中，可能會覺得 `*KEYBOARD` 內容既然沒有更改，那麼 `if (*KEYBOARD) ` 將永遠都不可能會成立，於是就自動把 `if (*KEYBOARD) *SEG7=0b00000011` 這整段程式碼給優化移除了。

但鍵盤暫存器的內容，在硬體設計上通常是由鍵盤控制器所直接存取寫入的，當使用者按下按鍵時，`*KEYBOARD` 就會被更改了，因此《編譯器的優化》反而會在此造成致命的錯誤！

為了解決這個問題，我們可以修改定義檔：

```C
#define SEG7     		((uint8_t*)  0x40000000)
#define KEYBOARD		((uint16_t*) 0x40000002)
```

加入 volatile 這個關鍵字，告訴編譯器這些內容是《揮發性的》，也就是有可能被外部改變的意思，因此《不能假設內容不變而進行優化動作》。

```C
#define SEG7     		((uint8_t*)  0x40000000)
#define KEYBOARD		((volatile uint16_t*) 0x40000002)
```

這樣修改過後，程式就不會因為優化而導致錯誤了！

## 小結

現在、在讓我們看一次本章一開頭的標頭檔，相信您應該可以看懂這個標頭檔到底在寫些甚麼了！

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