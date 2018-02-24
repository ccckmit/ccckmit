# 比特幣挖礦的背後 -- SHA 安全雜湊演算法

## 比特幣的技術

最近筆者想瞭解比特幣的運作原理，於是找來比特幣的發明人「中本聰」的 Bitcoin 論文，
研讀了一番，該論文可在「比特幣的官方網站」上看到，網址如下：

* Bitcoin: A Peer-to-Peer Electronic Cash System -- <http://bitcoin.org/bitcoin.pdf>

研讀了該論文之後，筆者寫了一篇「介紹比特幣運作原理」的文章，打算放在2014 年 1 月 1 日出刊
的「程式人雜誌」當中，目前該文暫時還在筆者的 dropbox 帳號內公開，連結如下：

* [比特幣 (Bit Coin) 的運作原理](https://dl.dropboxusercontent.com/u/101584453/pmag/201401/htm/message1.html)

## 雜湊現金

寫完「比特幣 (Bit Coin) 的運作原理」這篇文章之後，筆者發現比特幣裏最關鍵的技術是一種稱為「雜湊現金」(hashcash) 的技術，這種技術
其實與金錢沒什麼關係，而是與 CPU 計算出某個雜湊值所需要花的時間有關係。1997 年，Adam Back 提出了雜湊現金的技術，
後來這個技術逐漸展現強大的用途，於是 Adam Back 於 2002 年又寫了一篇介紹「雜湊現金與其應用」的論文如下：

* [Hashcash - A Denial of Service Counter-Measure (PDF, 2002)](http://www.hashcash.org/papers/hashcash.pdf)

要瞭解這種雜湊現金技術，必須先瞭解「單向雜湊函數」的概念，所謂的單向雜湊函數 (One Way Hash Function)，
就像是一般資料結構中建立雜湊表 (Hash Table) 時，用來計算雜湊值 (Hash Value) 的那種函數。只是該雜湊函數還具有
很難逆向破解的特性，也就是給定雜湊值時很難反向計算出原文的特性，因此稱為「(單向) 雜湊函數」。

雜湊現金的機制，不只被用在「比特幣的挖礦」上面，也可以用來進行「垃圾郵件過濾」，以下文章就說明了如何用「雜湊現金」
的機制來打擊垃圾郵件。

* [可愛的 Python: 用 hashcash 打擊垃圾郵件-想發送垃圾郵件，就要付出代價](http://www.ibm.com/developerworks/cn/linux/l-hashcash.html)

想要瞭解「雜湊現金」機制是如何運作的，比需先瞭解一個密碼學上的技術，那就是「單向雜湊函數」。

## 單向雜湊函數

在密碼學領域，最常被使用的「單向雜湊函數」有 MD5, SHA-1, SHA-2 等函數，MD5 的雜湊值長度為 128 位元，雖然廣為使用，
但長度不夠，而且比較容易破解，因此現在已經不夠安全了。SHA-1 的摘要長度為 160位元，比 MD5 更安全一些，但最近也有些
方法可以在大約在 2 的 60 次方計算後破解，因此美國國家安全局（NSA）與美國國家標準與技術研究院（NIST）又設計出了一些
更複雜的 SHA-2 家族算法，SHA-2 包含 224, 256, 384, 512 等四種長度的雜湊值算法，SHA-2 會比 SHA-1 更安全一些。

在本文中，我們將示範如何用 SHA-1 函數來實現雜湊現金的機制，因此我們尋找到了一個開放原始碼的 C 語言 SHA-1 程式，其網址
與內容如下：

* <http://oauth.googlecode.com/svn../code/c/liboauth/src/sha1.c>

檔案：sha1.c

```CPP
/* This code is public-domain - it is based on libcrypt 
 * placed in the public domain by Wei Dai and other contributors.
 */
// gcc -Wall -DSHA1TEST -o sha1test sha1.c && ./sha1test

#include <stdint.h>
#include <string.h>

/* header */

#define HASH_LENGTH 20
#define BLOCK_LENGTH 64

union _buffer {
    uint8_t b[BLOCK_LENGTH];
    uint32_t w[BLOCK_LENGTH/4];
};

union _state {
    uint8_t b[HASH_LENGTH];
    uint32_t w[HASH_LENGTH/4];
};

typedef struct sha1nfo {
    union _buffer buffer;
    uint8_t bufferOffset;
    union _state state;
    uint32_t byteCount;
    uint8_t keyBuffer[BLOCK_LENGTH];
    uint8_t innerHash[HASH_LENGTH];
} sha1nfo;

/* public API - prototypes - TODO: doxygen*/
void sha1_init(sha1nfo *s);
void sha1_writebyte(sha1nfo *s, uint8_t data);
void sha1_write(sha1nfo *s, const char *data, size_t len);
uint8_t* sha1_result(sha1nfo *s);
void sha1_initHmac(sha1nfo *s, const uint8_t* key, int keyLength);
uint8_t* sha1_resultHmac(sha1nfo *s);

/* code */
#define SHA1_K0 0x5a827999
#define SHA1_K20 0x6ed9eba1
#define SHA1_K40 0x8f1bbcdc
#define SHA1_K60 0xca62c1d6

const uint8_t sha1InitState[] = {
  0x01,0x23,0x45,0x67, // H0
  0x89,0xab,0xcd,0xef, // H1
  0xfe,0xdc,0xba,0x98, // H2
  0x76,0x54,0x32,0x10, // H3
  0xf0,0xe1,0xd2,0xc3  // H4
};

void sha1_init(sha1nfo *s) {
  memcpy(s->state.b,sha1InitState,HASH_LENGTH);
  s->byteCount = 0;
  s->bufferOffset = 0;
}

uint32_t sha1_rol32(uint32_t number, uint8_t bits) {
  return ((number << bits) | (number >> (32-bits)));
}

void sha1_hashBlock(sha1nfo *s) {
  uint8_t i;
  uint32_t a,b,c,d,e,t;

  a=s->state.w[0];
  b=s->state.w[1];
  c=s->state.w[2];
  d=s->state.w[3];
  e=s->state.w[4];
  for (i=0; i<80; i++) {
    if (i>=16) {
      t = s->buffer.w[(i+13)&15] ^ s->buffer.w[(i+8)&15] ^ s->buffer.w[(i+2)&15] ^ s->buffer.w[i&15];
      s->buffer.w[i&15] = sha1_rol32(t,1);
    }
    if (i<20) {
      t = (d ^ (b & (c ^ d))) + SHA1_K0;
    } else if (i<40) {
      t = (b ^ c ^ d) + SHA1_K20;
    } else if (i<60) {
      t = ((b & c) | (d & (b | c))) + SHA1_K40;
    } else {
      t = (b ^ c ^ d) + SHA1_K60;
    }
    t+=sha1_rol32(a,5) + e + s->buffer.w[i&15];
    e=d;
    d=c;
    c=sha1_rol32(b,30);
    b=a;
    a=t;
  }
  s->state.w[0] += a;
  s->state.w[1] += b;
  s->state.w[2] += c;
  s->state.w[3] += d;
  s->state.w[4] += e;
}

void sha1_addUncounted(sha1nfo *s, uint8_t data) {
  s->buffer.b[s->bufferOffset ^ 3] = data;
  s->bufferOffset++;
  if (s->bufferOffset == BLOCK_LENGTH) {
    sha1_hashBlock(s);
    s->bufferOffset = 0;
  }
}

void sha1_writebyte(sha1nfo *s, uint8_t data) {
  ++s->byteCount;
  sha1_addUncounted(s, data);
}

void sha1_write(sha1nfo *s, const char *data, size_t len) {
    for (;len--;) sha1_writebyte(s, (uint8_t) *data++);
}

void sha1_pad(sha1nfo *s) {
  // Implement SHA-1 padding (fips180-2, 5.1.1)

  // Pad with 0x80 followed by 0x00 until the end of the block
  sha1_addUncounted(s, 0x80);
  while (s->bufferOffset != 56) sha1_addUncounted(s, 0x00);

  // Append length in the last 8 bytes
  sha1_addUncounted(s, 0); // We're only using 32 bit lengths
  sha1_addUncounted(s, 0); // But SHA-1 supports 64 bit lengths
  sha1_addUncounted(s, 0); // So zero pad the top bits
  sha1_addUncounted(s, s->byteCount >> 29); // Shifting to multiply by 8
  sha1_addUncounted(s, s->byteCount >> 21); // as SHA-1 supports bitstreams as well as
  sha1_addUncounted(s, s->byteCount >> 13); // byte.
  sha1_addUncounted(s, s->byteCount >> 5);
  sha1_addUncounted(s, s->byteCount << 3);
}

uint8_t* sha1_result(sha1nfo *s) {
  int i;
  // Pad to complete the last block
  sha1_pad(s);
  
  // Swap byte order back
  for (i=0; i<5; i++) {
    uint32_t a,b;
    a=s->state.w[i];
    b=a<<24;
    b|=(a<<8) & 0x00ff0000;
    b|=(a>>8) & 0x0000ff00;
    b|=a>>24;
    s->state.w[i]=b;
  }
  
  // Return pointer to hash (20 characters)
  return s->state.b;
}

#define HMAC_IPAD 0x36
#define HMAC_OPAD 0x5c

void sha1_initHmac(sha1nfo *s, const uint8_t* key, int keyLength) {
  uint8_t i;
  memset(s->keyBuffer, 0, BLOCK_LENGTH);
  if (keyLength > BLOCK_LENGTH) {
    // Hash long keys
    sha1_init(s);
    for (;keyLength--;) sha1_writebyte(s, *key++);
    memcpy(s->keyBuffer, sha1_result(s), HASH_LENGTH);
  } else {
    // Block length keys are used as is
    memcpy(s->keyBuffer, key, keyLength);
  }
  // Start inner hash
  sha1_init(s);
  for (i=0; i<BLOCK_LENGTH; i++) {
    sha1_writebyte(s, s->keyBuffer[i] ^ HMAC_IPAD);
  }
}

uint8_t* sha1_resultHmac(sha1nfo *s) {
  uint8_t i;
  // Complete inner hash
  memcpy(s->innerHash,sha1_result(s),HASH_LENGTH);
  // Calculate outer hash
  sha1_init(s);
  for (i=0; i<BLOCK_LENGTH; i++) sha1_writebyte(s, s->keyBuffer[i] ^ HMAC_OPAD);
  for (i=0; i<HASH_LENGTH; i++) sha1_writebyte(s, s->innerHash[i]);
  return sha1_result(s);
}

void printHash(uint8_t* hash) {
  int i;
  for (i=0; i<20; i++) {
    printf("%02x", hash[i]);
  }
  printf("\n");
}

/* self-test */

#if SHA1TEST
#include <stdio.h>

uint8_t hmacKey1[]={
   0x00,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0a,0x0b,0x0c,0x0d,0x0e,0x0f,
   0x10,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1a,0x1b,0x1c,0x1d,0x1e,0x1f,
   0x20,0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2a,0x2b,0x2c,0x2d,0x2e,0x2f,
   0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,0x3c,0x3d,0x3e,0x3f
};
uint8_t hmacKey2[]={
   0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3a,0x3b,0x3c,0x3d,0x3e,0x3f,
   0x40,0x41,0x42,0x43
};
uint8_t hmacKey3[]={
   0x50,0x51,0x52,0x53,0x54,0x55,0x56,0x57,0x58,0x59,0x5a,0x5b,0x5c,0x5d,0x5e,0x5f,
   0x60,0x61,0x62,0x63,0x64,0x65,0x66,0x67,0x68,0x69,0x6a,0x6b,0x6c,0x6d,0x6e,0x6f,
   0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7a,0x7b,0x7c,0x7d,0x7e,0x7f,
   0x80,0x81,0x82,0x83,0x84,0x85,0x86,0x87,0x88,0x89,0x8a,0x8b,0x8c,0x8d,0x8e,0x8f,
   0x90,0x91,0x92,0x93,0x94,0x95,0x96,0x97,0x98,0x99,0x9a,0x9b,0x9c,0x9d,0x9e,0x9f,
   0xa0,0xa1,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,0xa8,0xa9,0xaa,0xab,0xac,0xad,0xae,0xaf,
   0xb0,0xb1,0xb2,0xb3
};
uint8_t hmacKey4[]={
   0x70,0x71,0x72,0x73,0x74,0x75,0x76,0x77,0x78,0x79,0x7a,0x7b,0x7c,0x7d,0x7e,0x7f,
   0x80,0x81,0x82,0x83,0x84,0x85,0x86,0x87,0x88,0x89,0x8a,0x8b,0x8c,0x8d,0x8e,0x8f,
   0x90,0x91,0x92,0x93,0x94,0x95,0x96,0x97,0x98,0x99,0x9a,0x9b,0x9c,0x9d,0x9e,0x9f,
   0xa0
};

int main (int argc, char **argv) {
  uint32_t a;
  sha1nfo s;

  // SHA tests
  printf("Test: FIPS 180-2 C.1 and RFC3174 7.3 TEST1\n");
  printf("Expect:a9993e364706816aba3e25717850c26c9cd0d89d\n");
  printf("Result:");
  sha1_init(&s);
  sha1_write(&s, "abc", 3);
  printHash(sha1_result(&s));
  printf("\n\n");

  printf("Test: FIPS 180-2 C.2 and RFC3174 7.3 TEST2\n");
  printf("Expect:84983e441c3bd26ebaae4aa1f95129e5e54670f1\n");
  printf("Result:");
  sha1_init(&s);
  sha1_write(&s, "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq", 56);
  printHash(sha1_result(&s));
  printf("\n\n");
  
  printf("Test: RFC3174 7.3 TEST4\n");
  printf("Expect:dea356a2cddd90c7a7ecedc5ebb563934f460452\n");
  printf("Result:");
  sha1_init(&s);
  for (a=0; a<80; a++) sha1_write(&s, "01234567", 8);
  printHash(sha1_result(&s));
  printf("\n\n");

  // HMAC tests
  printf("Test: FIPS 198a A.1\n");
  printf("Expect:4f4ca3d5d68ba7cc0a1208c9c61e9c5da0403c0a\n");
  printf("Result:");
  sha1_initHmac(&s, hmacKey1, 64);
  sha1_write(&s, "Sample #1",9);
  printHash(sha1_resultHmac(&s));
  printf("\n\n");

  printf("Test: FIPS 198a A.2\n");
  printf("Expect:0922d3405faa3d194f82a45830737d5cc6c75d24\n");
  printf("Result:");
  sha1_initHmac(&s, hmacKey2, 20);
  sha1_write(&s, "Sample #2", 9);
  printHash(sha1_resultHmac(&s));
  printf("\n\n");

  printf("Test: FIPS 198a A.3\n");
  printf("Expect:bcf41eab8bb2d802f3d05caf7cb092ecf8d1a3aa\n");
  printf("Result:");
  sha1_initHmac(&s, hmacKey3,100);
  sha1_write(&s, "Sample #3", 9);
  printHash(sha1_resultHmac(&s));
  printf("\n\n");

  printf("Test: FIPS 198a A.4\n");
  printf("Expect:9ea886efe268dbecce420c7524df32e0751a2a26\n");
  printf("Result:");
  sha1_initHmac(&s, hmacKey4,49);
  sha1_write(&s, "Sample #4", 9);
  printHash(sha1_resultHmac(&s));
  printf("\n\n");
 
  // Long tests 
  printf("Test: FIPS 180-2 C.3 and RFC3174 7.3 TEST3\n");
  printf("Expect:34aa973cd4c4daa4f61eeb2bdbad27316534016f\n");
  printf("Result:");
  sha1_init(&s);
  for (a=0; a<1000000; a++) sha1_writebyte(&s, 'a');
  printHash(sha1_result(&s));

  return 0;
}

#endif /* self-test */
```

上述程式有個測試主程式，若你定義 SHA1TEST 這個符號時，就會連同主程式一起編譯，該主程式顯然是在測試一些 「SHA-1標準」所提供的測試案例，以下是該測試主程式的執行結果：

```
D:\Dropbox\Public\web\codedata\code\sha1>gcc -Wall -DSHA1TEST -o sha1test sha1.c


D:\Dropbox\Public\web\codedata\code\sha1>sha1test
Test: FIPS 180-2 C.1 and RFC3174 7.3 TEST1
Expect:a9993e364706816aba3e25717850c26c9cd0d89d
Result:a9993e364706816aba3e25717850c26c9cd0d89d


Test: FIPS 180-2 C.2 and RFC3174 7.3 TEST2
Expect:84983e441c3bd26ebaae4aa1f95129e5e54670f1
Result:84983e441c3bd26ebaae4aa1f95129e5e54670f1


Test: RFC3174 7.3 TEST4
Expect:dea356a2cddd90c7a7ecedc5ebb563934f460452
Result:dea356a2cddd90c7a7ecedc5ebb563934f460452


Test: FIPS 198a A.1
Expect:4f4ca3d5d68ba7cc0a1208c9c61e9c5da0403c0a
Result:4f4ca3d5d68ba7cc0a1208c9c61e9c5da0403c0a


Test: FIPS 198a A.2
Expect:0922d3405faa3d194f82a45830737d5cc6c75d24
Result:0922d3405faa3d194f82a45830737d5cc6c75d24


Test: FIPS 198a A.3
Expect:bcf41eab8bb2d802f3d05caf7cb092ecf8d1a3aa
Result:bcf41eab8bb2d802f3d05caf7cb092ecf8d1a3aa


Test: FIPS 198a A.4
Expect:9ea886efe268dbecce420c7524df32e0751a2a26
Result:9ea886efe268dbecce420c7524df32e0751a2a26


Test: FIPS 180-2 C.3 and RFC3174 7.3 TEST3
Expect:34aa973cd4c4daa4f61eeb2bdbad27316534016f
Result:34aa973cd4c4daa4f61eeb2bdbad27316534016f
```

## 使用 SHA-1 實做雜湊現金機制

有了上述的 SHA-1 雜湊函數程式之後，我們就可以來實作「雜湊現金」(hashcash) 系統了。

在以下程式中，主程式會從零開始一直向上調整 nonce 的值，直到找到一個 nonce 可以產生 
24 bit (或說 3 個 byte 或 6 個十六進位值) 以上的前導零，才會停止程式並輸出該包含 nonce 的文件
與雜湊摘要值。

檔案：hashcash.c

```CPP
#include <stdio.h>
#include <limits.h>
#include "sha1.c"

void printNow() { // 印出目前時間
  time_t now = time(NULL);
  struct tm *tmNow = (struct tm*) localtime(&now);
  printf ("Current local time and date: %s", asctime(tmNow));
}

int main (int argc, char **argv) {
  sha1nfo s;              // 呼叫 SHA-1 函數所需要的資料結構。
  char msg[1000];         // 需經 SHA-1 進行 hashcash 認證的郵件。
  char *head = "from:abc@gmail.com to:ccckmit@gmail.com title=hello! nonce=%d"; // 郵件樣式
  unsigned int nonce = 0; // 可嵌入在郵件中並通過認證的值，稱為 nonce。

  printNow();                  // 印出起始時間
  for (nonce = 0; nonce < UINT_MAX; nonce++) { // 從零開始一直往上找 nonce 值
    sprintf(msg, head, nonce); // 將 nonce 嵌入樣版文件中，取得此次測試的郵件訊息。
    sha1_init(&s);             // 準備開始進行 SHA-1 雜湊。
    sha1_write(&s, msg, strlen(msg)); // 將訊息加入，以便進行 SHA-1 雜湊。
    uint8_t* hash = sha1_result(&s);  // 開始進行 SHA-1 雜湊，計算出雜湊值 hash。
    if (hash[0] == 0 && hash[1]==0 && hash[2]==0) { // 如果雜湊值的前 24bit (3 個 byte) 都是零，那麼就符合了。
      printf("msg=%s\n", msg); // 印出訊息內容。
      printf("hash=");         // 印出雜湊欄位名稱。
      printHash(hash);         // 印出雜湊欄位內容。
      break;
    }
  }
  printNow();                  // 印出完成時間
  return 0;
}
```

執行結果：

```
D:\Dropbox\Public\web\codedata\code\sha1>gcc hashcash.c -o hashcash

D:\Dropbox\Public\web\codedata\code\sha1>hashcash
Current local time and date: Mon Dec 16 19:33:03 2013
msg=from:abc@gmail.com to:ccckmit@gmail.com title=hello! nonce=13973878
hash=00000016aa26951d1653fe515f112fe41d8ebd45
Current local time and date: Mon Dec 16 19:34:27 2013
```

您可以看到上述程式花了「1 分 24 秒」，從 nonce=0 開始向上不斷測試，直到 nonce=13973878 才找到了第一個符合有
24 bit 前導零 nonce ，也就是總共測試了一千三百多萬次才發現符合條件的含 nonce 文件，這也就是雜湊現金
(hashcash) 機制的實務用法。

一但找到符合這個條件的文件之後，就可以通過測試，假如這種雜湊現金是用來過濾垃圾郵件用的，那麼接收端就可以
檢查這封郵件 "from:abc@gmail.com to:ccckmit@gmail.com title=hello! nonce=13973878" 的接收者是否為自己，
然後再檢查其雜湊值是否真的有 24bit 的前導零，如果有的話就代表對方已經花了足夠的 CPU 時間 (換句話說就是已經付了「雜湊現金」
，有付的人其信件就可以被接受了)。

同樣的，比特幣也是如此，如果一個人花 CPU 時間幫「比特幣網路」計算出符合條件的 nonce 值，那麼他就可以得到對應的代價，
也就是一些「比特幣」，這也就是所謂的「挖掘比特幣」了。

## 參考文獻
* <http://oauth.googlecode.com/svn../code/c/liboauth/src/sha1.c>
* <http://www.packetizer.com/security/sha1/>
* <http://zh.wikipedia.org/wiki/MD5>
* <http://en.wikipedia.org/wiki/SHA-1>
* [SHA家族](http://zh.wikipedia.org/wiki/SHA_%E5%AE%B6%E6%97%8F)
* [可爱的 Python: 用 hashcash 打击垃圾邮件-想发送垃圾邮件，就要付出代价](http://www.ibm.com/developerworks/cn/linux/l-hashcash.html), David Mertz, Ph.D. (mertz@gnosis.cx), 开发人员, Gnosis Software, Inc.


