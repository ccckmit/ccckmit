## 字串大小的問題 -- 如何決定字串的大小，防止緩衝區溢位。

在 C 語言當中，最惱人的莫過於如何決定字串或陣列大小的這個問題了，舉例而言，在下列程式當中，我們宣告 input 大小為 5，但是我們永遠不會知道 5 到底夠不夠，萬一不夠就會造成當機，甚至被有心人士透過「緩衝區溢位」方法攻擊，這是使用 C 語言陣列時經常遇到的困擾。

### 程式一：很容易「緩衝區溢位」的程式

```c
#include <stdio.h>

int main() {
  char input[5];
  scanf("%s", input);
  printf("Your input : %s", input);
}
```

即使我們宣告 char input[100] 也有可能不夠，但是如果宣告 char input[10000]，會不會太浪費記憶體了，到底應該如何處理呢？

其實在 scanf 這樣的函數中，可以用 %s 指定大小，以下範例就改進了上述問題，因此當輸入字串長度超過 5 時，就會被截掉，

###程式二：不會造成「緩衝區溢位」的程式

```c
#include <stdio.h>

int main() {
  char input[6]; // 注意，這裡必須宣告 6=5+1，因為還有結束字元 \0。
  scanf("%5s", input);
  printf("Your input : %s", input);
}
```

**執行結果**

    D:\cp>gcc arraySize.c -o arraySize

    D:\cp>arraySize
    Hello!John.
    Your input : Hello

