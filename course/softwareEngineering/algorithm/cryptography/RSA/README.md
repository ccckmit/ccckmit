# RSA

參考： https://en.wikipedia.org/wiki/RSA_(cryptosystem)

## 執行

```
$ node rsa.js
M1= [ 65, 22, 37, 18, 29 ]
M2= [ 65, 22, 37, 18, 29 ]
```

## 數學背景

1. n = pq       // p, q 均為質數
2. r = (p-1)(q-1)
3. 找一 e 與 r 互質，並解得 e 的反元素 d， e*d = -1 mod r

e 為公鑰，d 為私鑰

## 程序

1. Alice.broadcast(n, e)
2. Bob.sendTo(Alice, c)
  * c = m^e (mod n)  // m 為訊息
3. Alice.receiveFrom(Bob, c)
  * c^d =m (mod n)

c^d = m^{ed} = m (mod N)

範例： 

```
p=61, q=53, n=61*53=3233, λ(3233)=lcm(61,53)=780

let e = 17 , compute d = 413

e*d = 1 mod λ(n)
17*413 = 1 mod 780
```

假如 Bob 要傳 m 給 Alice，則可以傳送 c=m^e (mod n) 這個密文，然後 Alice 透過下列方式解碼：

c^d = m^ed = m (mod n) 

