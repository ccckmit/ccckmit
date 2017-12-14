# MultiTask 切換

[04-Multitasking]:https://github.com/jserv/mini-arm-os/tree/master/04-Multitasking
[os.c]:https://github.com/jserv/mini-arm-os/blob/master/04-Multitasking/os.c

在 [03-ContextSwitch-2](https://github.com/jserv/mini-arm-os/tree/master/03-ContextSwitch-2) 裏展示了如何從 Kernel-to-UserTask 與 UserTask-to-Kernel 的切換方法，但這個範例只有單一個 UserTask，而不是多個 Task。

因此在 mini-arm-os 的《第 4 單元》[04-Multitasking] 中就啟動了兩個 task 並進行切換，只是這個切換是在 task 中主動進行的，而不是由時間中斷強制切換的。

## 啟動行程

在主程式 [os.c] 當中有個 create_task() 函數可以用來創建新的 task (thread)，其定義如下：

```C
...
unsigned int *create_task(unsigned int *stack, void (*start)(void))
{
	static int first = 1;

	stack += STACK_SIZE - 32; /* End of stack, minus what we are about to push */
	if (first) {
		stack[8] = (unsigned int) start;
		first = 0;
	} else {
		stack[8] = (unsigned int) THREAD_PSP;
		stack[15] = (unsigned int) start;
		stack[16] = (unsigned int) 0x01000000; /* PSR Thumb bit */
	}
	stack = activate(stack);

	return stack;
}
...
```

透過這個函數，我們可以啟動新的 thread (task)。

## Kernel-to-UserTask

您可以看到在下列 [os.c] 這個《主程式》裏透過 create_task() 啟動了兩個 task，並透過在主程式 (作業系統) 中呼叫 activate() 函數進行了  Kernel-to-UserTask 的切換動作。

```C
...
int main(void)
{
	unsigned int user_stacks[TASK_LIMIT][STACK_SIZE];
	unsigned int *usertasks[TASK_LIMIT];
	size_t task_count = 0;
	size_t current_task;

	usart_init();

	print_str("OS: Starting...\n");
	print_str("OS: First create task 1\n");
	usertasks[0] = create_task(user_stacks[0], &task1_func);
	task_count += 1;
	print_str("OS: Back to OS, create task 2\n");
	usertasks[1] = create_task(user_stacks[1], &task2_func);
	task_count += 1;

	print_str("\nOS: Start multitasking, back to OS till task yield!\n");
	current_task = 0;

	while (1) {
		print_str("OS: Activate next task\n");
		usertasks[current_task] = activate(usertasks[current_task]);
		print_str("OS: Back to OS\n");

		current_task = current_task == (task_count - 1) ? 0 : current_task + 1;
	}

	return 0;
}
...
```

## UserTask-to-Kernel

然後在 《主程式》 [os.c] 裏的 task1_func , task2_func 又利用 syscall 進行 UserTask-to-Kernel 的切換動作。

```C
...
void task1_func(void)
{
	print_str("task1: Created!\n");
	print_str("task1: Now, return to kernel mode\n");
	syscall();
	while (1) {
		print_str("task1: Executed!\n");
		print_str("task1: Now, return to kernel mode\n");
		syscall(); /* return to kernel mode */
	}
}

void task2_func(void)
{
	print_str("task2: Created!\n");
	print_str("task2: Now, return to kernel mode\n");
	syscall();
	while (1) {
		print_str("task2: Executed!\n");
		print_str("task2: Now, return to kernel mode\n");
		syscall(); /* return to kernel mode */
	}
}
...
```

因此主程式 main 與 task1, task2 之間就形成了一種讓來讓去的結構，主程式透過 activate 將控制權交給 task1 或 task2，而 task1, task2 又利用 syscall 將控制權交給 main。

這種方式是志願的，而非強迫性的，因此如果有任何一方忘了禮讓，那麼系統就會被該方的程式完全佔有鎖死，其他方就永遠都無法再得到控制權了。

## 小結

這種《志願式禮讓》的運作模式，曾經在微軟的 windows 3.1 裏被稱為《協同式多工》，也就是每個人都要配合協同，這樣多工才能夠正常的持續下去。如果有人霸道的佔了 CPU 之後就不禮讓了，那整個系統也就因此而鎖死了。


