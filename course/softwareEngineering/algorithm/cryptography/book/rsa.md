## RSA 非對稱型加解密演算法

### 簡介

RSA 是 1977 年由「麻省理工學院」的 Ron Rivest、Adi Shamir 與 Leonard Adleman 等三人所共同設計出來的一種加密方法，
因此該方法以這三個人名字的第一個字母 (Rivest, Shamir, Adleman) 命名。

在 RSA 之前，加密方法幾乎都是對稱型的，難以想像出有一種加密方法，可以讓「加密者」公告「解密密鑰」之後，
還不會被破解「加密密鑰」的。

因此、RSA 的出現，創造出了一種全新的「非對稱式密碼學」，讓人人都可以認證某個密文是否由特定人士發出，
但卻又沒辦法偽造該人士去發出密文。

雖然 1983 年時，「麻省理工學院」的 RSA 專利在美國申請通過了 (應該是 1980 年就發出申請的)，但由於專利從申請發出的
有效期限為 20 年，因此在 2000 年時 RSA 的專利就已經過期，因此現在 RSA 是一個人人都可以自由實作的方法，並不會侵犯專利權。

### RSA 的加解密原理

RSA 加解密的關鍵是質數問題，利用對 N 取餘數所形成的整數場之特性，設計出了如下的演算法：

1. 任取兩個質數 p, q ，令 N = p*q
2. 設定 r 為 (p-1, q-1) 兩數的公倍數，通常直接使用 r=(p-1)*(q-1)。
3. 取一個與 r 互質的數 e 做為加密密鑰。
4. 找出 e 在 mod r 下的反元素 d，使得 e*d = 1 mod r
5. 以 (N, e) 為公鑰，(N, d) 為私鑰，將 (N, d) 公開給解密者，但 (N, e) 則需自己留著保密。
6. 假如明文的某個區塊為 m，加密時透過 m 與 e 計算出 c=m^e mod N 得到密文。
7. 解密者用 m2 = c^d mod N 的方式解出 c 的密文 m2，該 m2 必然會是原本的訊息 m，也就是 m2=m。

RSA 保密的關鍵是採用隨機選出的超大的質數 p, q (目前通常必須採用 1024 bits 以上的大質數才會夠安全，否則可能會被破解)，
由於目前沒有任何方法可以快速的進行超大質數分解 (N=p*q, 給定 N，分解出 p, q)，因此確保了 RSA 的安全性。

但是為了簡單起見，在本文中我們將不實作超大數 (BigInteger) 的運算程式，而是直接採用 64 位元的整數作為運算示範，
目的是希望將 RSA 的概念解說清楚，避免讓整個程式看起來太過複雜。

以下是我們所實作的「簡易 RSA 加解密範例」與「編譯執行結果」。

檔案：rsa64.c

```CPP
#include <stdio.h>
#include <assert.h>
#include <stdint.h>

#define BigInt uint64_t

BigInt inv(BigInt e, BigInt r) {
  BigInt d;
  for (d=2; d<r; d++) {
	BigInt re = (e*d) % r;
    if (re == 1) {
	  printf("e=%lld d=%lld r=%lld (e*d) mod r=%lld\n", e, d, r, re);
	  return d;
	}
  }
  assert(0);
}

BigInt power(BigInt a, BigInt k, BigInt N) {
  BigInt p=1, i;
  for (i=1; i<=k; i++) { 
    p = (p*a)%N;
  }
  return p;
}

int main() {
  BigInt p =  2213, q = 2663;
  BigInt N = p*q;
  BigInt r = (p-1)*(q-1);
  printf("N=%lld r=%lld\n", N, r);
  BigInt e = 4723;
  BigInt d = inv(e, r);
  BigInt m = 3320;
  printf("m=%lld\n", m);
  BigInt c = power(m, e, N);
  printf("c=%lld\n", c);
  BigInt m2 = power(c, d, N);
  printf("m2=%lld\n", m2);
}
```

執行結果

```
D:\Dropbox\CodeData>gcc rsa64.c -o rsa64

D:\Dropbox\CodeData>rsa64
N=5893219 r=5888344
e=4723 d=52363 r=5888344 (e*d) mod r=1
m=3320
c=4125620
m2=3320
```

從以上結果中，您可以看到我們選擇的 p=2213, q = 2663，而 N=p*q=2213*2663=5893219，r=(p-1)*(q-1)=2212*2662=5888344，
接著我們選擇一個與 r 互質的數 e=4723 為公鑰，而私鑰則由程式選出為 d=inv(e,r)=52363。

然後當我們將訊息 m=3320 用 c=(m^e)%N 去將明文 m 編碼為密文 c=4125620，接著再用 m2=(c^d)%N 將密文解開成明文 m2=3320，
您可以看到解開後的結果 m2 = m = 3320，因此這個 RSA 的實作方法大致是正確的。

### 速度改進

在以上的程式當中，power() 函數的執行速度會很慢，舉例而言，假如我們想算 38757 的 79639 次方，那就要
進行 79639 次的 `p = (p*a)%N;` 這個運算 (包含乘法和取餘數)。

而且在採用 1024 bits 以上的大整數運算時，這種速度將會是完全不能接受的，因此我們有必要改進該函數的速度，
我們可以利用演算法中的 divide and conquer 法 (分割解決法)，利用遞迴的方式計算 power() 函數，這樣速度就可以
大幅的提升，以下是上述 power() 函數的快速改良版。


```CPP
BigInt power(BigInt a, BigInt k, BigInt N) {
  if (k < 0)
    assert(0);
  if (k == 0)
    return 1;
  else if (k == 1)
    return a;
  // k >=2
  BigInt k2 = k/2;             // k2 = k / 2;
  BigInt re = k%2;             // re = k % 2;
  BigInt ak2= power(a, k2, N); // ak2 = a^(k/2);
  BigInt ak = ak2*ak2;         // ak  = ak2*ak2 = a^((k/2)*2)
  BigInt akN= ak%N;            // akN = ak % N
  if (re == 1) {               // if k is odd
    akN = akN*a;               //   ak = ak*a;
    return akN%N;              //   return ak * k;
  } else                       // else
    return akN;                //   return ak;
}
```

所以、如果您用這個版本的 power() 函數取代原先 rsa64.c 程式中的 power() 函數，那程式的執行速度將會變快。

不過、在 rsa64.c 程式中，還有一個函數的速度會過慢，那就是 inv() 函數。過慢的原因是我們採用了逐一測試法
來決定 e 在 mod r 整數場當中的反元素 d，但是這在 1024 bits 以上的大整數場也是會慢到無法接受的，因此必須
採用 [擴展歐幾里得演算法] 去計算反元素 d。

我們並不想在本文中改進 inv() 函數的速度，有興趣的朋友可以自行用 [擴展歐幾里得演算法] 去改良此一函數。

### 將大整數運算函數化

在上述的 rsa64.c 程式中，我們採用了 64 位元的整數直接運算，而非採用 1024 位元的大整數，這樣雖然讓該程式比較清楚了，
但是要改寫成 1024 bits 時還是需要花費很多的功夫，整個程式都要大改。

為了讓這個程式更容易被改寫成 1024 bits 的大整數版本，筆者將該程式的 (+, *, /, %) 等運算給函數化了，這樣就會比較容易
改寫為大整數版本，以下是這個「運算函數化」後的版本。

檔案：rsaBig.c

```CPP
#include <stdio.h>
#include <assert.h>
#include <stdint.h>

#define BigInt uint64_t

BigInt newBigInt(char *str) {
  return atoi(str);
}

char tempStr[1025];

char *big2str(BigInt a) {
  sprintf(tempStr, "%lld", a);
  return tempStr;
}


BigInt mul(BigInt a, BigInt b) {
  return a*b;
}

BigInt div(BigInt a, BigInt b) {
  return a/b;
}

BigInt mod(BigInt a, BigInt n) {
  return a%n;
}

BigInt inv(BigInt e, BigInt r) {
  BigInt d;
  for (d=2; d<r; d++) {
    BigInt ed = mul(e, d); // re = (e*d) % r;
	BigInt re = mod(ed,r);
    if (re == 1) {
	  printf("e=%lld d=%lld r=%lld (e*d) mod r=%lld\n", e, d, r, re);
	  return d;
	}
  }
  assert(0);
}

/*
BigInt power(BigInt a, BigInt k, BigInt N) {
  BigInt p=1, i;
  for (i=1; i<=k; i++) { 
    p = mul(p, a); // p = (p * a) % N;
	p = mod(p, N);
  }
  return p;
}
*/

BigInt power(BigInt a, BigInt k, BigInt N) {
  if (k < 0)
    assert(0);
  if (k == 0)
    return 1;
  else if (k == 1)
    return a;
  // k >=2
  BigInt k2 = div(k, 2);       // k2 = k / 2;
  BigInt re = mod(k, 2);       // re = k % 2;
  BigInt ak2= power(a, k2, N); // ak2 = a^(k/2);
  BigInt ak = mul(ak2, ak2);   // ak  = ak2*ak2 = a^((k/2)*2)
  BigInt akN= mod(ak, N);      // akN = ak % N
  if (re == 1) {               // if k is odd
    akN = mul(akN, a);         //   ak = ak*a;
    return mod(akN, N);        //   return ak * k;
  } else                       // else
    return akN;                //   return ak;
}

int main() {
  BigInt p = newBigInt("2213"), q = newBigInt("2663");
  BigInt N = mul(p, q);
  BigInt r = mul(p-1, q-1);
  printf("N=%s r=%s\n", big2str(N), big2str(r));
  BigInt e = newBigInt("4723");
  BigInt d = inv(e, r);
  BigInt m = newBigInt("3320");
  printf("m=%s\n", big2str(m));
  BigInt c = power(m, e, N);
  printf("c=%s\n", big2str(c));
  BigInt m2 = power(c, d, N);
  printf("m2=%s\n", big2str(m2));
}
```

執行結果：

```
D:\Dropbox\CodeData>gcc rsaBig.c -o rsaBig

D:\Dropbox\CodeData>rsaBig
N=5893219 r=5893219
e=4723 d=52363 r=5888344 (e*d) mod r=1
m=3320
c=4125620
m2=3320
```

透過這種函數化的改變，您只要將 mul(), div(), mod(), newBigInt(), big2str() 等函數改為大整數版本，
然後再改良 inv() 函數的速度，就可以得到一個支援大整數的 RSA 加解密系統了。

### 結語

RSA 是現代密碼學當中很重要的一個方法，這個方法在 VPN (OpenVPN)、SSL (OpenSSL) 等安全協定裏廣泛的被使用著，
在各種現代程式語言裏 (像是 C#, Java, ....) 也都有函式庫支援，因此通常使用者不需要自行實作，只要從函式庫或
開放原始碼裏找一個來用就好了。

但是、使用這些函式庫的同時，若能瞭解 RSA 的原理，應該能讓設計者更清楚這些函式庫的能力與限制。

本文的目的也就是希望透過撰寫一個極度簡易的 RSA 程式，說明這種過程的實作方法，讓程式人能夠清楚的理解 RSA 
背後的設計原理。


### 參考文獻

* 維基百科, [RSA加密演算法](http://zh.wikipedia.org/wiki/RSA%E5%8A%A0%E5%AF%86%E6%BC%94%E7%AE%97%E6%B3%95)
* 維基百科, [質數列表](http://zh.wikipedia.org/zh-tw/%E8%B3%AA%E6%95%B8%E5%88%97%E8%A1%A8)
* [RSA algorithm in C](http://sourcecode4all.wordpress.com/2012/03/28/rsa-algorithm-in-c/), Posted by mohammedmoulana on March 28, 2012
* Wikipedia:[Extended Euclidean algorithm](http://en.wikipedia.org/wiki/Extended_Euclidean_algorithm)
* Wikipedia:[Euler's theorem](http://en.wikipedia.org/wiki/Euler%27s_theorem)
* [GMP](http://gmplib.org/) -- free library for arbitrary precision arithmetic, operating on signed integers, rational numbers, and floating-point numbers.


[擴展歐幾里得演算法]:http://zh.wikipedia.org/wiki/%E6%89%A9%E5%B1%95%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E7%AE%97%E6%B3%95