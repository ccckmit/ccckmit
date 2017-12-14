#鏈結串列：外包物件版 — 嵌入式的鏈結串列，是模仿 Linux 核心的作法。

本範例的實作靈感來自 Linux 核心中的雙向鏈結串列，為了簡單起見，我們改為單向鏈結串列，以便讓讀者容易理解。

###程式範例：

**檔案：LinkedListEmbed.c**

```c
#include <stdio.h>

#define offsetof(type, member) ((size_t) &((type *)0)->member)
#define ListEntry(ptr,type,member) ((type *)((char *)(ptr)-(unsigned long)(&((type *)0)->member)))
#define ListNew(head) ((head)->next=NULL)
#define ListAdd(head, node) { (node)->next=(head)->next; (head)->next = (node); }
#define ListEach(head, pos) for (pos = (head)->next; pos != NULL; pos = pos->next)

typedef struct listnode { 
  struct listnode *next;
} ListNode;

typedef struct {
    char *name;
    int age;
    ListNode node;
} Person;

void PersonListPrint(ListNode *head) {
  ListNode *ptr;
  ListEach(head, ptr) {
    Person *person = ListEntry(ptr, Person, node);
    printf("%s is %d years old\n", person->name, person->age);
  }
}

// 請注意，在本程式中，ListEach 會忽略表頭節點，因此 head 不應該包在 Person 裡面。
int main() {
    ListNode head;
    Person john = {
      .name = "John",
      .age = 40,
    };
    Person mary = {
      .name = "Mary",
      .age = 32,
    };
    Person george = {
      .name = "George",
      .age = 26,
    };
    ListNew(&head);
    ListAdd(&head, &john.node);
    ListAdd(&head, &mary.node);
    ListAdd(&head, &george.node);
    PersonListPrint(&head);
    return 0;
}
```

**執行結果**

    D:\cp>gcc LinkedListEmbed.c -o LinkedListEmbed

    D:\cp>LinkedListEmbed
    George is 26 years old
    Mary is 32 years old
    John is 40 years old
* **來自 jserv 的建議**
>=> 內文沒提到將資料搬出 list 結構的優勢，建議提供 for_each 的使用案例:

>http://stackoverflow.com/questions/15754236/how-do-i-use-the-list-for-each-macro-in-list-h-from-the-linux-kernel-properly
對於《將資料搬出 list 結構的優勢》這個問題，除了巨集展開不需要進函數， 速度可能會比較快之外，我也想不出其他的優勢了，所以就請大家自己想想，或者問 jserv 。