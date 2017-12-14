#動態字串物件 — (Dynamic String)

可以動態增長的字串物件，讓您不用再為字串長度傷腦筋。

歸根究底，字串誤用的問題，通常是由於 C 語言沒有提供一個標準的動態字串而造成的，如果您真的需要一個這樣的程式，那麼就應該採用一個支援動態字串的函式庫，然後將程式改寫如下。

###範例、字串連接的 C 程式 (動態字串版)

```c
Str *s = StrNew();
for (i=0; i<100; i++) {
  StrAppend(s, token[i]);
}
```
這樣的 C 語言程式，其實就與下列範例中的 Java 程式，看來相差不大了，最大的差別是 C 語言沒有支援物件的概念而已。

範例、字串連接的 Java 程式

```java
String s = "";
for (i=0; i<100; i++)
   s = s + token[i];
```

要能撰寫上述這樣的一個程式，動態字串函式庫至少要能支援 StrNew() 與 StrAppend() 這兩個函數，那麼我們應該怎麼做呢？其實，要自己打造這樣一個程式相當容易，筆者可以馬上撰寫一個，如以下範例所示。

###範例：實作動態字串函式庫

```c
typedef struct Str {
  int len, size;
  char *s;
};

Str *StrNew();
void StrAppend(Str *str, char *s);

Str *StrNew() {
  Str *str = malloc(sizeof(Str));
  str->s = malloc(1);
  str->s[0] = '\0';
  str->len = 0;
  str->size = 1;
}

void StrAppend(Str *str, char *s) {
  int newLen = str->len + strlen(s);
  if (newLen+1 > str->size) {
    int newSize = max(str->size*2, newLen+1);
    char *t = malloc(newSize);
    sprintf(t, "%s%s", str->s, s);
    free(str->s);
    str->s = t;
    str->len = newLen;
    str->size = newSize;
  } else {
    strcat(&str->s[str->len], s);
    str->len += strlen(s);
  }
}
```

只要有了這樣一個函式庫，那麼我們就不需要為了 C 語言缺乏動態字串而困擾了，也就不需要每次都寫出難看且沒有效率的程式了，而是直接寫出乾淨，簡潔的函式庫了。



