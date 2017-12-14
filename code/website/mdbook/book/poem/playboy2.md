# 花心蘿蔔2

```CPP
#include <limits.h>
int main() {
  char *girls[LLONG_MAX]={....};
  for (int i=0; i<LLONG_MAX; i++) 
    printf("%s, I love you !", girls[i]);
}
```