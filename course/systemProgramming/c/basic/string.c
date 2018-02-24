#include <stdio.h>
#include <string.h>

int main() {
  int i;
  char s[]="hello!"; // 注意：C 的陣列用 {...} 框住，這和 javascript 不同。
  for (i=0;i<strlen(s)+1;i++) {
    printf("s[%d]=%c ascii=%d\n", i, s[i], s[i]);
  }
}
