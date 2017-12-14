# 人造英語 (ArtiEnglish)

[基本英語 (Basic English) 850 字](BasicEnglish.md)

## 語法和語義的連結

人造語的語法已簡化到剩下兩條：

```
S = P* .+ // 句子 = 短語* 符號+
P = a* (N+|V+)? // 短語 = 修飾* (名詞+|動詞+)
```

在這個架構下，所有的語句都是合語法的，但語意則必須由撰寫者檢驗。

```
strong boy
a strong boy
He is a strong boy
```

等等都是《語意語法均正確》的。

但是下列語句

```
He is strong
```

其中的 strong 是句尾修飾語，修飾的是整句 (也就是 strong 修飾 He is)，而不是單單只有 He 。

若要讓 strong修飾 He 有兩種方法

一種是用 strong he

另一種是用 He is a strong boy.

## 動詞

在目前的《人造語》中，詞性 V 所包含的，並不是只有《動詞》，凡是可以連接兩個名詞的《非修飾語》，都屬於 V 詞類。

因此、典型的 walk, run, see, read, .... 等詞性是 V，而那些常被認為是介係詞的 on, at, in, of, .... 等等詞性也是 V。

例如：

```
something in my mind
N          V  a  N
```

這樣的語句中，in 的功能連接個名詞短語，因此詞性為 V。

