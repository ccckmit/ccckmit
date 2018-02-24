## 加密技術

### 前言

在網路發達的今天，大家應該常常看到很多網頁上的亂碼吧！不知您有沒有想過，
亂碼與加密過的密碼 (不是登入帳號要輸入的那種密碼) 之間，其實有種非常類似的關聯性。
在某種角度看來，亂碼其實是一種密碼，只是亂碼的編碼法是公開的，而加密過的密碼，
則至少隱藏了一點點秘密。

今天、就讓我們一起來研究隱藏在這些碼背後的秘密吧！

### 亂碼

如果您依照下列的方式，用記事本建立一個網頁檔 big5asUtf8.htm ，其內容如下所示：

```html
<html>
<meta charset="UTF-8">
<body>
這是一個用 Big5 編碼的文件！
</body>
</html>
```

然後選擇「檔案/另存新檔」的方式，在中文 Windows 系統下儲存成 ANSI 的格式，
接著再用瀏覽器打開它，您會發現這個網頁上顯示的是一堆亂碼，除了 Big5 這幾個
英文字之外，中文都變成了奇怪的符號。

對於有網頁設計經驗的程式人而言，一定會看出來問題之所在，因為在中文 Windows 底下
所謂的 ANSI 標準格式，就是俗稱 Big5 大五碼的編碼方式，這個方式是 1983 年由台灣資策會
招集許多廠商一起為「文書處理」、「資料庫」、「試算表」、「通訊」及「繪圖」等五大軟體
專案而設計出來的編碼方式，因此才被稱為大五碼。

上述文件之所以會出現亂碼，是因為在 HTML 網頁中的 `<meta charset="UTF-8">` 這行陳述，
錯誤的告訴瀏覽器該檔案的編碼方式為 Unicode 的 UTF8 編碼法，因此造成瀏覽器以 UTF8 
的解碼方式顯示原本為 Big5 的檔案內容，於是才會顯示出亂碼。

那麼、我們應該如何更正這個文件，讓他能正確顯示呢？基本上有兩種辦法，第一種是再次按下「另存新檔」，
將該檔案儲存為 UTF-8 的格式，這樣 `<meta charset="UTF-8">` 這個陳述與檔案格式一致，就能正確顯示出來了。

另一種方式是將上述文件中的 `<meta charset="UTF-8">` 這行文字改為 `<meta charset="Big5">` ，
這樣就讓陳述與檔案格式都統一為 Big5 編碼法，於是瀏覽器也就能正確的呈現該網頁了。

對於不知道這個編碼方式的人而言，他們無法正確的解讀這些亂碼，因此、亂碼基本上就是一種加密過的碼了。
然而對於有經驗的人而言，應該可以很容易的用上述方法解開這些碼，因此這就只是一種亂碼，而不是秘密了。

### 加密技術的用途

在此我們所說的密碼，是指加密過的密碼，而不是您要輸入帳號密碼時的那種密碼。

在歷史上、加密是一門在軍事通訊上很有價值的技術，有時在商業上也有強大的用途，像是中國唐代因為銅錢不足且攜帶不變而
發展出「飛錢」之後，那些錢莊就發展出了一種加密機制，在飛錢這種貨幣券的後面寫上密碼，以便防止偽造盜領，後來這種密碼
就成了各個錢莊的鎮店之寶，您可以在「喬家大院」這部大陸歷史劇當中看到：「喬致庸」與「孫茂才」是如何想破頭去破解錢莊
密碼的橋段，就可以理解這個加密方法的重要性了。

在軍事上、加密技術最著名的例子，是在二次大戰當中發生的，由於納粹德軍所使用的 [Enigma] 密碼機被「英美盟軍」破解了卻不知情，
導致後來「英美盟軍」掌控了德軍的關鍵情報，因而戰勝了納粹德軍，成為歷史上最經典的密碼戰役，加密機制的破解扮演了關鍵性的角色。

[Enigma] 密碼機並非德軍所發明的，早在 1920 年代就曾經被使用於商業用途，但德軍所使用的是改良過安全等級較高的機器，
1932 年，波蘭密碼學家 Marian_Rejewski、Jerzy Różycki 和 Henryk Zygalski 根據 [Enigma] 的設計原理破解了它。 1939 年中期，波蘭政府將此破解方法告知了英國和法國，但直到 1941 年英國海軍捕獲德國 U-110 潛艇，得到密碼機和密碼本才成功破解。

密碼的破解使得納粹海軍對英美商船補給船的大量攻擊失效。盟軍的情報部門將破解出來的密碼稱為 ULTRA ，這極大地幫助了西歐的盟軍部隊。
ULTRA 到底有多大貢獻還在爭論中，但是很多研究者認為 [Enigma] 的破解讓盟軍在西歐的勝利提前了兩年。

### 加密技術的範例

加密技術其實不難，但是要做出完全無法破解的加密方法就有點困難了。首先讓我們來看看一些簡單的加密方法範例：

範例一：凱撒密碼 -- 字母位移法

凱撒密碼 (Caesar cipher) 是在古代就被發展出來的一種加密方式，當年凱撒大帝曾用此種方式與其將領進行秘密通訊，
因此後來被稱為「凱撒密碼」。

舉例而言，假如我們原本的訊息是 'attackatdawn' (attack at dawn) 那麼在英文字母順序位移到下一個字，例如 a 變 b，b 變 c 的編碼之下，
訊息就成了 'bubdlbuebxo' 這樣的語句，如果不知道加密方法的人，應該是很難看懂的。

當然，如果我們知道是採用位移法，只是不知道到底位移幾位的話，那麼只要將 26 種位移前的結果都寫出來，就會很明顯的看到答案了，
因此這種方法的安全性肯定是不高的。

範例二：維吉尼亞密碼 -- 多位移量版本的凱撒密碼

維吉尼亞密碼 (Vigenère_cipher) 是凱薩密碼的進化版，其方法是將位移量從單一數字變成一連串的位移，也就是讓金鑰變成金鑰陣列時，
加密方法就從「凱撒密碼」進化成了「維吉尼亞密碼」。

舉例而言，假如用 0 2 4  當位移，那麼 `attackatdawn`  (attack at dawn) 這句話，就會被加密成

```
a + 0 = a
t + 2 = v
t + 4 = x
a + 0 = a
c + 2 = e
k + 4 = m
a + 0 = a
t + 2 = v
d + 4 = h
w + 0 = w
n + 2 = p
```

因此、 'attackatdawn' 這句話在編碼後，會變成 `avxaemavhwp` 這個句子，由於密鑰的長度變長了，而且同一個字常會被編碼為不同的字，
因此比「凱撒密碼」稍微難破解了一點，但仍然不是很安全的。

上述的位移量，如果用英文字母 0:a 1:b 2:c ... 等方式來記憶，可以編出很容易記的密碼，例如上述的 0 2 4 編成英文的話，就會是 ace，
於是人們就可以很容易的記住此一密鑰。

但是、由於「維吉尼亞密碼」相當容易使用，因此在戰爭上也曾經被採用，像是美國在南北戰爭時，南軍就曾使用「黃銅密碼盤」產生「維吉尼亞密碼」
進行通訊，南軍經常使用的位移密鑰所對應的英文為「Manchester Bluff」、「Complete Victory」、「Come Retribution」等。但是由於這個編碼方法
並不是很安全的，因此北軍常常都會破解南軍的密碼，這對北軍的勝利也有不少的幫助。

範例三：XOR 密碼

XOR 是二進位運算中的基本邏輯閘，其運作原理很簡單，當兩個位元相同時就輸出 0，不相同時就輸出 1。
XOR 用來作加解密的好處是當我們對某位元連續與某樣式位元連續作兩次 XOR 運算時，就會得到原來的位元，
也就是 M XOR K XOR K = M，因此我們只要用金鑰 K 對某訊息作 XOR 運算之後就可以得到密文 C，然後再
用 K 對密文 C 作一次 XOR 運算又可以得到原來的 M 訊息。

換句話說、利用 XOR 的方法可以很快速的加密或還原一個二進位訊息，舉例而言，假如我們想將下列的
二進位訊息傳送給對方，那麼用 '10101111' 當作 XOR 加密金鑰，就可以很快的進行加解密動作，
如下所示：

```
原始訊息：11101110 00000111 10000001 11000001
加密金鑰：10101111 10101111 10101111 10101111  
---------------------------------------------- (第一次 XOR 加密)
密文訊息：01000001 10101000 00101110 01101110
加密金鑰：10101111 10101111 10101111 10101111  
---------------------------------------------- (第二次 XOR 解密)
解密訊息：11101110 00000111 10000001 11000001
```

您可以清楚的看到，解密後的訊息也就是原來的訊息，因此用相同的加密金鑰與相同的程序，就可以達到
加解密的功能。

以下是我們用此種方法進行加解密的一個簡單 C 語言程式實作：

```CPP
#include <stdio.h>

int encrypt(char plan[], char cipher[], char key, int len) {
  int i;
  for (i=0; i<len; i++) {
    cipher[i] = plan[i] ^ key;
  }
}

int decrypt(char cipher[], char plan[], char key, int len) {
  int i;
  for (i=0; i<len; i++) {
    plan[i] = cipher[i] ^ key;
  }
}

int main() {
  char plan[] = "Zero-hour is July/4th 3.30 am";
  char cipher[100], plan2[100];
  char key = 0x6D;
  int  len = strlen(plan);
  
  printf("明文=%s\n", plan);
  encrypt(plan, cipher, key, len);
  printf("密文=%s\n", cipher);
  decrypt(cipher, plan2, key, len);
  printf("還原=%s\n", plan2);
}
```

執行結果：

```
明文=Zero-hour is July/4th 3.30 am
密文=@MM'BYM^C^]M
還原=Zero-hour is July/4th 3.30 am
```

當然、這種簡單的加密方法也不會很安全的，雖然我們可以將加密金鑰的長度加長，例如從 8 位元加長
到 128 位元，但是這種方法還是很容易遭到頻率統計法的破解，因此現在也很少被使用了。

範例四：搭配偽隨機數的 XOR 密碼

但是，XOR 密碼在理論上有相當的重要性，原因是如果金鑰的長度與明文一樣長，而且只用一次的話，這種
One-time pad 理論上是非常安全，絕對無法破解的。

透過這種特性，如果我們利用某個金鑰，作為亂數種子，產生一組偽隨機數作為 One-time pad 的話，那整個
加密方法就會變得更難破解，只要金鑰與偽隨機數的演算法不被他人知道就行了。

```CPP
#include <stdio.h>
#define BYTE unsigned char

int pseudoRandom(char key, char pseudoKey[], int len) {
  int i;
  printf("偽隨機數=");
  pseudoKey[0] = key;
  for (i=1; i<len; i++) {
    BYTE b = (BYTE) pseudoKey[i-1];
    BYTE bnew = (b * 7) % 255;
    pseudoKey[i] = (char) bnew;
    printf("%2x ", bnew);
    b = bnew;
  }
  printf("\n");
}

int encrypt(char plan[], char cipher[], char pseudoKey[], int len) {
  int i;
  for (i=0; i<len; i++) {
    cipher[i] = plan[i] ^ pseudoKey[i];
  }
}

int decrypt(char cipher[], char plan[], char pseudoKey[], int len) {
  int i;
  for (i=0; i<len; i++) {
    plan[i] = cipher[i] ^ pseudoKey[i];
  }
}

int main() {
  char plan[] = "Zero-hour is July/4th 3.30 am";
  char cipher[100], plan2[100], pseudoKey[100];
  char key = 0x6D;
  int  len = strlen(plan);
  
  printf("明文=%s\n", plan);
  pseudoRandom(key, pseudoKey, len);
  encrypt(plan, cipher, pseudoKey, len);
  printf("密文=%s\n", cipher);
  decrypt(cipher, plan2, pseudoKey, len);
  printf("還原=%s\n", plan2);
}

```

執行結果

```
D:\Dropbox\Public\pmag\201308\code>gcc cipher2.c -o cipher2

D:\Dropbox\Public\pmag\201308\code>cipher2
明文=Zero-hour is July/4th 3.30 am
偽隨機數=fd f1 9d 4f 2b 2e 43 d6 df 1f d9 f4 b2 e2 34 6d fd f1 9d 4f 2b 2e 43 d
 df 1f d9 f4
密文=7?瀢CA6?v肴?X疻?m樖???v?鶄
還原=Zero-hour is July/4th 3.30 am
```

在以上的幾種密碼當中，採用了「偽隨機數」的版本會相對比較難破解一點，但是在電腦發達的今天，這些密碼都是有可能被輕易破解的。
因此現代的加密系統通常不會採用這幾種加密法，而是改用像 RSA、DES、3-DES、RC4 等方法，這些方法比起前幾種方法都更難破解。

不過、要瞭解密碼學，我想從簡單的加密法開始，會比較容易理解，這些簡單加密法的問題與破解方法，告訴了我們為何要採用更複雜加密方法
的原因，也為現代的密碼學提供了理論的基礎。

因此、在下一篇文章中，筆者將會示範如何用程式破解上述的密碼，我們下期見！


### 參考文獻
* 維基百科:[大五碼]
* 維基百科:[五大中文套裝軟體]
* 維基百科:[飛錢]
* 維基百科:[喬家大院]
* 維基百科:[異或密碼]
* 維基百科:[密碼學]
* 維基百科:[凱撒密碼]
* 維基百科:[維吉尼亞密碼]
* Wikipedia:[Enigma]
* Wikipedia:[XOR_cipher]
* Wikipedia:[Vigenere Cipher]
* Wikipedia:[Vernam_cipher]
* Wikipedia:[One-time pad]


[密碼學]:http://zh.wikipedia.org/wiki/%E5%AF%86%E7%A2%BC%E5%AD%B8
[大五碼]:https://zh.wikipedia.org/zh-tw/%E5%A4%A7%E4%BA%94%E7%A2%BC
[五大中文套裝軟體]:https://zh.wikipedia.org/wiki/%E4%BA%94%E5%A4%A7%E4%B8%AD%E6%96%87%E5%A5%97%E8%A3%9D%E8%BB%9F%E9%AB%94
[飛錢]:http://zh.wikipedia.org/wiki/%E9%A3%9B%E9%8C%A2
[喬家大院]:http://zh.wikipedia.org/zh-tw/%E4%B9%94%E5%AE%B6%E5%A4%A7%E9%99%A2_(%E7%94%B5%E8%A7%86%E5%89%A7
[異或密碼]:http://zh.wikipedia.org/wiki/%E5%BC%82%E6%88%96%E5%AF%86%E7%A0%81
[維吉尼亞密碼]:http://zh.wikipedia.org/wiki/%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A%E5%AF%86%E7%A0%81
[凱撒密碼]:http://zh.wikipedia.org/wiki/%E6%81%BA%E6%92%92%E5%AF%86%E7%A0%81
[Enigma]:http://en.wikipedia.org/wiki/Enigma_machine
[XOR_cipher]:http://en.wikipedia.org/wiki/XOR_cipher
[Vigenere Cipher]:http://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher
[Vernam_cipher]:http://en.wikipedia.org/wiki/Vernam_cipher
[One-time pad]:http://en.wikipedia.org/wiki/One-time_pad
