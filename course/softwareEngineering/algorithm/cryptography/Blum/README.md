# Blum 亂數產生器與加解密系統

圖靈獎得主 Manuel Blum : https://en.wikipedia.org/wiki/Manuel_Blum

## Blum Blum Shub 偽隨機亂數產生器

執行

```
$ node blumBlumShubTest.js
18098567
14489865
10612342
20647940
19395661
21368461
18118427
12120277
3205170
8426854
```

## Blum–Goldwasser (BG) Cryptosystem

BG 非對稱型加解密系統在 1984 年由 Manuel Blum 和 Shafi Goldwasser 提出，是個《機率安全型系統》。

加密時使用 XOR 法，將明文 plainText 與 Blum Blum Shub (BBS) 所產生的 bbsKey，透過逐個位元 xor 的方式形成密文。 (這有點像是 one time pad)

然後再利用 private key 與 BBS 的最終狀態找出亂數種子 seed，找出 seed 之後就能完整地將密文解回來了。

詳細演算法在以下網址：

* https://en.wikipedia.org/wiki/Blum%E2%80%93Goldwasser_cryptosystem

關鍵是：

Bob 送 c[0..L-1], y 給 Alice，然後 Alice 可以透過 y, L 與 (p,q) 輕鬆計算出種子 seed，於是就能解碼了。