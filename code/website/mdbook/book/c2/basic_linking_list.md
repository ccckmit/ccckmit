#範例程式：鏈結串列

###檔案：LinkedList.c

```c
#include <stdio.h>

typedef struct lnode { 
  struct lnode *next;
} ListNode;

void ListNodePrint(ListNode *node) {
  ListNode *p;
  for (p = node; p != NULL; p=p->next)
    printf("%p-->", p);
}

int main() {
  ListNode node1, node2, node3;
  node1.next = &node2;
  node2.next = &node3;
  node3.next = NULL;
  ListNodePrint(&node1);
}
```

**執行結果**

    D:\cp>gcc LinkedList.c -o LinkedList

    D:\cp>LinkedList
    0022FF74-->0022FF70-->0022FF6C-->

###參考文獻

* 深入分析 Linux 内核链表 -- http://www.ibm.com/developerworks/cn/linux/kernel/l-chain/index.html