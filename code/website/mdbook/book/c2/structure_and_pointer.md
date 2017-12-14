#C 語言結構中的指標算術

在 C 語言當中，指標的內容就是記憶體位址，於是我們可以利用指標的算術，計算出某些具有特殊價值的數字，然後進行位址操作，以便定址到我們想要的內容上。

舉例而言，在 Linux 的鏈結串列中，就定義了下列的 offsetof() 巨集函數，可以讓我們計算出一個結構與其欄位間的距離，

```c
#define offsetof(TYPE, MEMBER) ((size_t) &((TYPE *)0)->MEMBER)
```

事實上，offsetof() 這個巨集已經被納入到 ANSI C 的 表頭中，您也可以引用該表頭，而不需要自己實作。

如果我們要從欄位指標反求其母結構位址，則可參考下列 Linux 核心中的原始碼，使用 container_of() 函數

```c
#define container_of(ptr, type, member) ({    \
    const typeof( ((type *)0)->member ) *__mptr = (ptr);    \
    (type *)( (char *)__mptr - offsetof(type,member) );})
```

這樣的巨集函數要如何使用呢？請參考下列範例。

###程式範例：結構中的指標運算

**檔案：structptr.c**

```c
#include <stdio.h>

#define offsetof(TYPE, MEMBER) ((size_t) &((TYPE *)0)->MEMBER)

#define container_of(ptr, type, member) ({    \
    const typeof( ((type *)0)->member ) *__mptr = (ptr);    \
    (type *)( (char *)__mptr - offsetof(type,member) );})

typedef struct {
  char name[20];
  int age;
} Person;

// 以 Person 中的 age 欄位為例，說明 container_of() 函數的作法
//  container_of(&p.age, Person, age)
//    typeof( ((Person *)0)->age ) is int
//    int *__mptr = (&p.age); 
//    (Person *) ((char *) __mptr - offsetof(Person, age))

int main() {
  Person p = {
    .name="John",
    .age=40
  };

  size_t offset = offsetof(Person, age);
  printf("offset=0x%x\n", offset);
  printf("offsetof(Person,age)=0x%x\n", offsetof(Person, age));
  printf("&p=%p\n", &p);
  printf("&p.age=%p\n", &p.age);
  printf("p.age=%d\n", *(&p.age));
  printf("&p+1=%p\n", &p+1);
  printf("&((Person*)&p)[1]=%p\n", &((Person*)&p)[1]);
  char *cptr = (char*) &p;
  printf("cptr+1=%p\n", cptr+1);
  printf("cptr+20=%p\n", cptr+20);
  printf("*(int *)(cptr+20)=%d\n", *(int *)(cptr+20));
  int *mptr = (&p.age);
  Person *pptr = (Person *) ((char *) mptr-20);
  printf("*pptr=%p\n", pptr);
//  int **agePtr;
//  agePtr  = (int**) (&p+offset);
//  printf("agePtr=%p\n", agePtr);
//  printf("*(&p+offset)=%d\n", *agePtr);
//  printf("&p+offsetof(Person,age)=%p\n", &p+offset);
//  printf("container_of(&p.age,Person,age)=%p\n",        container_of(&p.age, Person, age));
}
```
**執行結果**

    D:\cp>gcc structptr.c -o structptr

    D:\cp>structptr
    offset=0x14
    offsetof(Person,age)=0x14
    &p=0022FF50
    &p.age=0022FF64
    p.age=40
    &p+1=0022FF68
    &((Person*)&p)[1]=0022FF68
    cptr+1=0022FF51
    cptr+20=0022FF64
    *(int *)(cptr+20)=40
    *pptr=0022FF50