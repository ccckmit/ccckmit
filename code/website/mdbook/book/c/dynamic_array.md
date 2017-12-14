## 以 C 語言實作動態陣列

在 C 語言當中，經常會碰到無法事先決定陣列大小的情況，像是實作某些符號表格時，就很難事先決定陣列大小，此時最好使用動態陣列來取代靜態陣列，這些動態陣列會實作自動長大的功能，如此就解決了無法事先決定陣列大小的問題，以下是筆者對動態陣列的一個實作。

在以下程式中，我們學習了 Linux 當中以巨集巡迴鏈結串列的方法，模仿後實作出以巨集巡迴動態陣列的方法，也就是 ArrayEach()，這樣的函數可以讓您再陣列元素巡迴時省一點力氣。

### 程式範例：動態陣列

檔案: darray.c

```CPP
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  int size;    // 陣列目前的上限 
  int count;   // 陣列目前的元素個數 
  void **item; // 每個陣列元素的指標
} Array;       // 動態陣列的資料結構 

void ArrayNew(Array *array, int size) {
  array->count = 0;
  array->size = size;
  array->item = malloc(array->size*sizeof(void*));
}

void ArrayAdd(Array *array, void *item) {
  if (array->count == array->size) {
    int newSize = array->size*2;
    void **newItems = malloc(newSize*sizeof(void*));
    memcpy(newItems, array->item, array->size*sizeof(void*));
    free(array->item);
    array->item = newItems;
    array->size = newSize;
    printf("Array growing : size = %d\n", array->size);
  }
  array->item[array->count++] = item;
}

#define ArrayEach(a, i, o) for (i=0, o=(a)->item[i]; i<(a)->count; o=(a)->item[i],i++) 

int main() {
  char *names[] = { "John", "Mary", "George", "Bob", "Tony" };
  int i;
  Array array;
  ArrayNew(&array, 1);
  for (i=0; i<5; i++)
    ArrayAdd(&array, names[i]);
  for (i=0; i<array.count; i++)
    printf("name[%d]=%s\n", i, (char*) array.item[i]);
  void *obj;
  ArrayEach(&array, i, obj) {
    printf("name[%d]=%s\n", i, (char*) obj);
  }
}
```


### 執行結果

```
D:\cp>gcc darray.c -o darray

D:\cp>darray
Array growing : size = 2
Array growing : size = 4
Array growing : size = 8
name[0]=John
name[1]=Mary
name[2]=George
name[3]=Bob
name[4]=Tony
name[0]=John
name[1]=John
name[2]=Mary
name[3]=George
name[4]=Bob
```

