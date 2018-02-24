#include <stdio.h>

int main() {
  int i;
  int a[]={1,6,2,5,3,6,1}; // 注意：C 的陣列用 {...} 框住，這和 javascript 不同。
  for (i=0;i<7;i++) {
    printf("a[%d]=%d\n", i, a[i]);
  }
}
