# 第 2 章 - 基本語法

在上一個章節中，我們學習了圖像式的設計法，以及交談式的 node.js 操作，開始理解了《變數》與《運算式》這些概念。

現在、讓我們將開始真正用《寫程式》的方法來認識 JavaScript 這個語言！

## 第一個程式

檔案： hello.js

```javascript
console.log("Hello!");
```

上述的 console.log( .... ) 是一個函數，會印出參數內的字串到畫面上！

因此 console.log("Hello!") 就會把 Hello! 這個字串印到畫面上，其執行結果如下：

```
D:\cccwd2\file\jsh\code>node hello.js
Hello!
```

我們會使用 `node <程式名稱>` 這樣的指令來執行某程式，例如上述的 node hello.js 就會執行 hello.js 這個程式。

其實 .js 這個附檔名可以省略不用打，因此您也可以用 node hello 直接執行 hello.js 檔案，如下所示：

```
D:\cccwd2\file\jsh\code>node hello
Hello!
```

## if 判斷

JavaScript 的 if 語句，和 C, Java, C# 等語言幾乎一模一樣。舉例而言，下列程式可以根據 score 所設的定分數，來印出「及格」或「不及格」的訊息，只要大於 60 分，就算是及格了。

檔案：score.js

```javascript
var score = 61;

if (score >= 60)
  console.log("及格");
else
  console.log("不及格");
```

寫完上述程式之後，請務必將檔案儲存成 UTF8 的格式 (Unicode 8 位元模式) ，我的習慣是採用 Notepad++ 這個編輯器，然後選擇《編碼/編譯成UTF-8碼(檔首無BOM)》這個選項後，儲存檔案即可。這樣，程式就可以正常印出「繁體中文」！

如果您沒有儲存成 UTF8 的格式，而是用預設的 ANSI 格式，那麼印出來的中文就會看不到 (或者變成亂碼)，如下圖所示，這是因為 node.js 預設採用 UTF8 編碼的緣故。

因此請務必要將檔案儲存成 UTF8 格式，這樣會比較不容易出錯。

練習：請執行完上述程式之後，將 score 改為 56，再重新執行一次，看看會印出甚麼？


## while 迴圈

JavaScript 的迴圈 (包含 for 和 while) 與 C 語言是非常像的，以下是一個 JavaScript 的 while 迴圈範例。

當條件符合的時候，while 迴圈會一直執行，以下程式會在 i<=10 的時候不斷執行，直到 i 比 10 大為止。

檔案：while.js

```javascript
i=1;
while (i<=10) {
  console.log("i=", i);
  i = i + 1;
}
```

執行結果：

```
D:\jsbook>node while
i= 1
i= 2
i= 3
i= 4
i= 5
i= 6
i= 7
i= 8
i= 9
i= 10
```

如果我們在從 1 數到 10 的過程當中，把變數 i 進行累加，那麼就可以得到累加總和， 1+..+10 = 55 的結果如下。

檔案：whilesum.js

```javascript
sum=0;
i=1;
while (i<=10) {
  sum = sum + i;
  console.log("i=", i, " sum=", sum);
  i = i + 1;
}
```

執行結果

```
D:\jsbook>node whilesum
i= 1  sum= 1
i= 2  sum= 3
i= 3  sum= 6
i= 4  sum= 10
i= 5  sum= 15
i= 6  sum= 21
i= 7  sum= 28
i= 8  sum= 36
i= 9  sum= 45
i= 10  sum= 55
```

## for 迴圈

雖然 while 迴圈也會做很多次，但是在《重複做 n 次》或《從 a 數到 b》這樣的問題上，我們有更方便的 for 迴圈可以使用！

以下是一個 for 迴圈的範例，該範例會從 1 數到 10。

檔案：for.js

```javascript
for (i=1;i<=10;i++) {
  console.log("i=", i);
}
```

其中的 for (i=1;i<=10;i++) 這句話可以分解為 3 部分，其中 i=1 只會在一開始執行一次，然後每次都會檢查 i<=10 的條件，每次檢查完若通過，則會進行 i++ 的動作，所謂的 i++ 就是 i=i+1 的縮寫。

上述程式的執行結果如下：

```
D:\jsbook>node for.js
i= 1
i= 2
i= 3
i= 4
i= 5
i= 6
i= 7
i= 8
i= 9
i= 10
```

當然、像是 1+2+...+10 這樣的事情也可以用 for 迴圈來做，for 的寫法會比 while 更短更簡潔，以下是採用 for 進行 1+...+10 的範例。

檔案：sum.js

```javascript
sum=0;
for (i=1;i<=10;i++) {
  sum = sum + i;
  console.log("i=", i, " sum=", sum);
}
```

執行結果：

```
D:\jsbook>node sum.js
i= 1  sum= 1
i= 2  sum= 3
i= 3  sum= 6
i= 4  sum= 10
i= 5  sum= 15
i= 6  sum= 21
i= 7  sum= 28
i= 8  sum= 36
i= 9  sum= 45
i= 10  sum= 55
```

另外、 javascript 也從 C 語言那裏繼承了 continue 與 break 等語句，遇到 continue 時會回到迴圈開頭，忽略後面語句。而遇到 break 時則會跳出迴圈。

檔案：forbreak.js

```javascript
for (i=1;i<=10;i++) {
  if (i == 3) continue;
  if (i == 8) break;
  console.log("i="+i);
}
```

在上述程式中，當 i==3 時，會執行 continue，繼續執行下一輪迴圈，因此不會印出 i=3。

當 i==8 時，會執行 break 而跳出迴圈，因此後面的 i=8, i=9, i=10 都將不會印出。

執行結果：

```
D:\jsbook>node forbreak.js
i=1
i=2
i=4
i=5
i=6
i=7
```

## 小結

在本章中我們開始學習了一些簡單的程式語法，包含 if, while, for 等等，雖然這些程式很小，但應該可以讓讀者對《程式到底是如何運作的》有所體會。

接下來，我們將繼續學習更多的 JavaScript 語法和結構，像是《函數、陣列、物件》等等！

## 習題

1. 請寫一個程式計算 10! ，也就是 `10*9*8*....*1` 。
2. 請寫一個程式印出九九乘法表。
3. 請寫一個程式求某個大於 1 的數 n 之平方根 。
4. 請寫一個函數 m357(a,b) 列出 a 到 b 之間為 3,5,7 任一數之倍數的所有數值？
    * 範例： m357(10,15) => 10, 12, 14, 152
5. 請將分數轉換為等第 90+=A, 80+=B, 70+=C, 69-=D
    * 範例： degree(85) => 'B'
6. 給定兩個數字，請算出它們的最大公因數？ 
    * 範例： commonFactor(12,15) => 3
7. 將一個10進位的數字換成二進位數字？ 
    * 範例 binary(6) => "110"
8. 請檢查某數是否為質數？ 範例： isPrime(17) => true
9. 給你兩個數字，請算出這兩個數字之間有幾個質數(包含輸入的兩個數字)？ 
    * 範例： countPrime(3, 7) => 3
