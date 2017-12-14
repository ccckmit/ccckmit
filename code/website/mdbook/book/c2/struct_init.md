#結構的初始化 — (Initialization) 直接設定欄位初始值

這個範例程式為 C99 的《指定器初始化》( Designated Initializers)，使用 gcc 時建議加上 -std=C99 的參數。

**程式範例**

```c
#include <stdio.h>

typedef struct {
    char *name;
    int age;
} person;

int main() {
    person p = {
      .name = "John",
      .age = 40
    };

    printf("%s is %d years old", p.name, p.age);
}
```

**執行結果**

    D:\cp\code>gcc structInit.c -o structInit

    D:\cp\code>structInit
    John is 40 years old