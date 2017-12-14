# 作業系統

[03-ContextSwitch-2]:https://github.com/jserv/mini-arm-os/tree/master/03-ContextSwitch-2
[04-Multitasking]:https://github.com/jserv/mini-arm-os/tree/master/04-Multitasking
[05-TimerInterrupt]:https://github.com/jserv/mini-arm-os/tree/master/05-TimerInterrupt
[06-Preemptive]:https://github.com/jserv/mini-arm-os/tree/master/06-Preemptive

理解了《中斷與切換》之後，只要再加上《時間中斷》，然後在設定時間到的時候強制進行切換，這樣就差不多是一個《作業系統》了。

在 [03-ContextSwitch-2] 裏展示了如何從 Kernel-to-UserTask 與 UserTask-to-Kernel 的切換方法，但這個範例只有單一個 UserTask，而不是多個 Task。

## MultiTask 切換

因此在 mini-arm-os 的《第 4 單元》[04-Multitasking] 中就啟動了兩個 task 並進行切換，只是這個切換是在 task 中主動進行的，而不是由時間中斷強制切換的。

您可以看 [os.c] 這個《主程式》裏

```
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

因此、mini-arm-os 的《第 5 單元》就是 [05-TimerInterrupt] ，先介紹一個簡易的時間中斷範例，然後再放入原本的作業系統裡面，