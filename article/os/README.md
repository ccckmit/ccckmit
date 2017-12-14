# OS

* https://www.facebook.com/shiwulo/posts/10215717020983954
  * [Mutexes and Semaphores Demystified](https://barrgroup.com/Embedded-Systems/How-To/RTOS-Mutex-Semaphore)

To summarize with an example, here's how to use a mutex:

```
/* Task 1 */
   mutexWait(mutex_mens_room);
      // Safely use shared resource
   mutexRelease(mutex_mens_room);

/* Task 2 */
   mutexWait(mutex_mens_room);
      // Safely use shared resource
   mutexRelease(mutex_mens_room);
```

By contrast, you should always use a semaphore like this:

```
/* Task 1 - Producer */
    semPost(sem_power_btn);   // Send the signal

/* Task 2 - Consumer */
    semPend(sem_power_btn);  // Wait for signal
```

Importantly, semaphores can also be used to signal from an interrupt service routine (ISR) to a task. Signaling a semaphore is a non-blocking RTOS behavior and thus ISR safe.  Because this technique eliminates the error-prone need to disable interrupts at the task level, signaling from within an ISR is an excellent way to make embedded software more reliable by design.