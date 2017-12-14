# 強制切換 (Preemptive)

[05-TimerInterrupt]:https://github.com/jserv/mini-arm-os/tree/master/05-TimerInterrupt


## 時間中斷 (TimerInterrupt)

在上一章的  [《MultiTask 切換》](multitask.md) 主題中， mini-arm-os 完成了一個《協同式多工》的系統。透過 kernel 與 task1, task2 之間的相互禮讓，讓整個多工系統得以持續進行切換。

但是要完成一個真正的多工系統，必須要能強制處理那些《霸佔 CPU》的 task ，讓 OS 與其他 task 不至於被設計不良或惡意的 task 卡住，這時就需要《時間中斷》的配合。

因此 mini-arm-os 第五單元的 [hello.c](https://github.com/jserv/mini-arm-os/blob/master/05-TimerInterrupt/hello.c) 當中，就展示了一個簡易的《時間中斷》範例 [05-TimerInterrupt] ，這個範例透過設定 systick_handler 中斷，並設定 `*SYSTICK_LOAD = 7200000` 讓系統能在每隔一段時間就觸發一次時間中斷，然後印出 `Interrupt from System Timer` 的訊息到螢幕上，以便確認《時間中斷》是真的有被觸發的。

```C
void main(void)
{
	usart_init();

	print_str("Hello world!\n");

	/* SysTick configuration */
	*SYSTICK_LOAD = 7200000;
	*SYSTICK_VAL = 0;
	*SYSTICK_CTRL = 0x07;

	while (1); /* wait */
}

void __attribute__((interrupt)) systick_handler(void)
{
	print_str("Interrupt from System Timer\n");
}
```

當然、這個時間中斷的函數必須要被塞到中斷向量表當中，才能夠有效地在時間到的時候引發中斷，這段程式碼在 [startup.c](https://github.com/jserv/mini-arm-os/blob/master/05-TimerInterrupt/startup.c) 當中。

```C
...
__attribute((section(".isr_vector")))
uint32_t *isr_vectors[] = {
	(uint32_t *) &_estack,			/* stack pointer */
	(uint32_t *) reset_handler,		/* code entry point */
	(uint32_t *) nmi_handler,		/* NMI handler */
	(uint32_t *) hardfault_handler,		/* hard fault handler */
	(uint32_t *) memmanage_handler,		/* mem manage handler */
	(uint32_t *) busfault_handler,		/* bus fault handler */
	(uint32_t *) usagefault_handler,	/* usage fault handler */
	0,
	0,
	0,
	0,
	(uint32_t *) svc_handler,		/* svc handler */
	0,
	0,
	(uint32_t *) pendsv_handler,		/* pendsv handler */
	(uint32_t *) systick_handler		/* systick handler */
};
...
```

## 強制 Task 切換

學會《時間中斷》之後，就可以整合原本的 [MultiTask](multitask.md) 功能，為那個會被惡意霸占的《協同式多工》系統，加上時間中斷的功能，讓惡霸型 task 無法永遠霸佔 CPU 了。

於是、在下列兩個 task 當中，就不需要一直用 syscall 去把控制權交還給主程式 main (kernel)，而是改用 delay(1000) 這樣霸道的函數，整個系統也不會因此而真的掛在那裏一整秒不動，而是能在 kernel, task1, task2 之間切換來切換去了。

```C
void task1_func(void)
{
	print_str("task1: Created!\n");
	print_str("task1: Now, return to kernel mode\n");
	syscall();
	while (1) {
		print_str("task1: Running...\n");
		delay(1000);
	}
}

void task2_func(void)
{
	print_str("task2: Created!\n");
	print_str("task2: Now, return to kernel mode\n");
	syscall();
	while (1) {
		print_str("task2: Running...\n");
		delay(1000);
	}
}
...
void delay(volatile int count)
{
	count *= 50000;
	while (count--);
}
```

## 小結

至此、 mini-arm-os 的雛型基本上已經完成了，剩下的就是讓程式更完整，像是支援 malloc 的記憶體管理的功能等等，這就是後面的 [07-Threads] 單元的任務了。

