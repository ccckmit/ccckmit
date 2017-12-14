# 專案建置檔 Makefile


關於 Makefile 的那些事情，我想讀者可以看下列這兩篇，我就不多講了！

* [猴子都會寫的Makefile - makefile簡易教學 (1)](http://mropengate.blogspot.tw/2015/06/makefile-makefile.html)
* [猴子都會寫的Makefile - makefile簡易教學 (2)](http://mropengate.blogspot.tw/2015/06/makefile-makefile-2.html)

基本上、 Makefile 就是讓你只要下一個 make 指令，然後就能把整個專案建置完畢的一種工具。

在 mini-arm-os/07-Threads 專案中，其 Makefile 的內容如下：

* <https://github.com/jserv/mini-arm-os/blob/master/07-Threads/Makefile>

```C
CROSS_COMPILE ?= arm-none-eabi-
CC := $(CROSS_COMPILE)gcc
AS := $(CROSS_COMPILE)as
CFLAGS = -fno-common -ffreestanding -O0 -std=gnu99 \
	 -gdwarf-2 -g3 -Wall -Werror \
	 -mcpu=cortex-m3 -mthumb \
	 -Wl,-Tos.ld -nostartfiles \

TARGET = os.bin
all: $(TARGET)

$(TARGET): os.c startup.c malloc.c threads.c
	$(CC) $(CFLAGS) $^ -o os.elf
	$(CROSS_COMPILE)objcopy -Obinary os.elf os.bin
	$(CROSS_COMPILE)objdump -S os.elf > os.list

qemu: $(TARGET)
	@qemu-system-arm -M ? | grep stm32-p103 >/dev/null || exit
	@echo "Press Ctrl-A and then X to exit QEMU"
	@echo
	qemu-system-arm -M stm32-p103 -nographic -kernel os.bin

clean:
	rm -f *.o *.elf *.bin *.list
```

其實學《程式》這種東西，常常比須從做中學，理論懂一點就可以開始了，然後把《用電腦寫程式》的這種習慣，融入到日常生活中，這樣就會比較容易學會寫程式這件事情！

當然、向開放原始碼學習會是一個捷徑。

程式人當然不能只讀書，或者不明就裡就開始寫，從別人的程式裡取經是很重要的事情，而像 Makefile 這種東西，就先複製一個來用吧，會改就行了！

在 Makefile 裏，每條規則通常有下列形式：

```
A:B1,B2,B3
  cmd1
  cmd2
  cmd3
```

這代表若要建置 A，必須先建置 B1, B2, B3 ，完成 B1, B2, B3 之後，就可以執行 cmd1, cmd2, cmd3, ....

上述 Makefile 中的主要建置段落如下：

```
TARGET = os.bin
...
$(TARGET): os.c startup.c malloc.c threads.c
	$(CC) $(CFLAGS) $^ -o os.elf
	$(CROSS_COMPILE)objcopy -Obinary os.elf os.bin
	$(CROSS_COMPILE)objdump -S os.elf > os.list
````

其中 $(...) 中的東西是定義符號，會被展開。

所以 $(TARGET) 就會被展開成 os.bin，因此上述的 TARGET 段落被展開後會變成：

```
os.bin: os.c startup.c malloc.c threads.c
	arm-none-eabi-gcc -fno-common -ffreestanding -O0 -std=gnu99 \
	 -gdwarf-2 -g3 -Wall -Werror \
	 -mcpu=cortex-m3 -mthumb \
	 -Wl,-Tos.ld -nostartfiles \
     os.c startup.c malloc.c threads.c -o os.elf
	arm-none-eabi-objcopy -Obinary os.elf os.bin
	arm-none-eabi-objdump -S os.elf > os.list
````

請注意那個特殊的 $^ 符號代表觸發項，也就是 B1,B2,B3 的那部分，在這個例子中就是 os.c startup.c malloc.c threads.c 。


如果你只打 make 指令，那麼會觸發第一個建置項，也就是 

```
all: $(TARGET)
```

但是如果你打 `make qemu` ，那就只會觸發 qemu 那一項，以及後面 `$(TARGET)` 所帶動的那些項目。

所以如果你想跑 qemu 的模擬，那麼就請打 `make qemu` ，如果你想清除上次建置產生的檔案，就打 `make clean` 吧！

當你打 `make qemu` 的時候，最後會執行下列指令：

```
	qemu-system-arm -M stm32-p103 -nographic -kernel os.bin
```

那代表會直接跑 ARM 版本在 stm32-p103 這個設定檔上的 qemu 虛擬機，這樣就會在你的電腦上看到虛擬機的執行結果了。

如果你打 `make all` 或只打 `make` ，那麼就會建置後輸出 os.elf，這個檔被寫入《開發板》後，你就可以在開發板上測試系統是否正常了！

好了，現在你應該已經瞭解 Makefile 是甚麼，也知道為何打一個 make 指令就可以建置完整個專案了，那就開始動手吧！

