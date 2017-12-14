# 中斷與切換

[os.c]:https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/os.c
[context_switch.S]:https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/context_switch.S
[syscall.S]:https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/syscall.S
[03-ContextSwitch-2]:https://github.com/jserv/mini-arm-os/tree/master/03-ContextSwitch-2

除了非常低檔的處理器之外，現今的處理器通常有支援中斷功能。

在本文中我們會看到如何利用 ARM 的處理器支援的中斷達成『內文切換』(Context-Switch) 的功能。

本文將以 `mini_arm_os` 的 [03-ContextSwitch-2] 為例。

## 中斷向量

從連結檔 [os.ld](https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/os.ld) 當中您可以看到中斷向量被放在程式段 .text 的一開頭，這個段落會被燒到永久儲存體 FLASH 裡面。

檔案： <https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/os.ld>

```
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

該中斷向量內容定義在 startup.c 當中，以下是重要的程式碼片段。

* <https://github.com/jserv/mini-arm-os/blob/master/03-ContextSwitch-2/startup.c>

```C
...
void nmi_handler(void) __attribute((weak, alias("default_handler")));
void hardfault_handler(void) __attribute((weak, alias("default_handler")));
void memmanage_handler(void) __attribute((weak, alias("default_handler")));
void busfault_handler(void) __attribute((weak, alias("default_handler")));
void usagefault_handler(void) __attribute((weak, alias("default_handler")));
void svc_handler(void) __attribute((weak, alias("default_handler")));

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
};

...
```

雖然上述程式中有 `void svc_handler(void) __attribute((weak, alias("default_handler")))` 這樣的指令，但是應該會被下一段中的組合語言程式給蓋掉。

## 切換

在本專案裏的內文切換 (Context-Switch) 有兩種，第一種是從 Kernel-to-UserTask 的 activate 函數，第二種是從 UserTask-to-Kernel 的 svc_handler 函數，兩段程式碼都位於 [context_switch.S] 檔案裡面。


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

## 系統呼叫

在主程式 [os.c] 的 main 主程式裏總共呼叫了兩次 activate() 函數以進行 kernal to usertask 的切換。

```C
int main(void)
{
	/* Initialization of process stack
	 * r4, r5, r6, r7, r8, r9, r10, r11, lr */
	unsigned int usertask_stack[256];
	unsigned int *usertask_stack_start = usertask_stack + 256 - 16;
	usertask_stack_start[8] = (unsigned int) &usertask;

	usart_init();

	print_str("OS: Starting...\n");
	print_str("OS: Calling the usertask (1st time)\n");
	usertask_stack_start = activate(usertask_stack_start);
	print_str("OS: Return to the OS mode !\n");
	print_str("OS: Calling the usertask (2nd time)\n");
	usertask_stack_start = activate(usertask_stack_start);
	print_str("OS: Return to the OS mode !\n");
	print_str("OS: Going to infinite loop...\n");
	while (1)
		/* We can't exit, there is nowhere to go */ ;
	return 0;
}
```

然後在 usertask() 函數裡又呼叫了 syscall() 動作以進行 usertask to kernel 的切換。

```C
...
void usertask(void)
{
	print_str("usertask: 1st call of usertask!\n");
	print_str("usertask: Now, return to kernel mode\n");
	syscall();
	print_str("usertask: 2nd call of usertask!\n");
	print_str("usertask: Now, return to kernel mode\n");
	syscall();
	while (1)
		/* wait */ ;
}

```

上述的 syscall() 會呼叫 [syscall.S] 裡面的下列程式段落。

```C
.thumb
.syntax unified

.global syscall
syscall:
	svc 0
	nop
	bx lr
```

## 小結

至此我們已經看完 [03-ContextSwitch-2] 這個案例，該案例展示了從 Kernel-to-UserTask 與 UserTask-to-Kernel 的切換方法。



