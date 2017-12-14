# 變動參數

## 範例：印出整數串列

```
#include <stdio.h>
#include <stdarg.h>

void printList(int head, ... ) {
  va_list va;
  va_start(va, head);
  int i;
  for(i=head ; i != -1; i=va_arg(va,int)) {
    printf("%d ", i);
  }
  va_end(va);
}

int main( void ) {
  printList(3, 7, 2, 5, 4, -1);
}

```

執行結果

```
D:\cp>gcc vaarg.c -o vaarg

D:\cp>vaarg
3 7 2 5 4
```

## 範例

```CPP
#include <stdio.h>

int debug(const char *fmt, ...)
{
  va_list args;
  va_start(args, fmt);
  return vprintf(fmt, args);
}

int main() {
  debug("pi=%6.2f\n", 3.14159);
}
```

執行結果：

```
D:\cp>gcc debug.c -o debug

D:\cp>debug
pi=  3.14
```

