# 第 1 章 - 程式入門

```
沒有程式，電腦只是一台垃圾而已！
```

## 程式是甚麼？

現代的電腦種類很多，除了最常見的桌上型電腦之外，像是一百元的那種計算機，每個人都有的手機，還有嵌入在冷氣微波爐裡的控制器等等，都算是一台電腦。

但是、這些電腦如果沒有程式在上面跑，那你絕對不會想要用它 (事實上是根本沒辦法用它)。

舉例而言，假如您買的電腦，上面沒有灌《作業系統或開機程式》 (像是 Windows, Linux, Mac OSX, Android, iOS) 的話，那麼這台電腦開機後，畫面上只會出現一片漆黑而已。

而這些《作業系統和開機程式》，都是電腦一開始啟動就需要執行的程式。

您看到的電腦，通常不是只有硬體，而是上面有跑程式的《軟體+硬體》所組成的一台完整機器。

所以、《程式很重要、程式很重要、程式很重要》，.....

如果你會寫程式，那麼你可以控制電腦！

如果你只會玩電動，那就只能被電腦控制！

如果你又會寫程式又會玩電動，而且還可以寫電動給自己玩，甚至改人家的電動程式，那麼就可以達到人機合一的《鋼鐵人境界》！

### 一小時學會圖像式程式設計

現在、就讓我們開始學習寫程式吧！

為了降低難度，我們先利用 code.org 裡的憤怒鳥遊戲，來學習撰寫《視覺化的程式設計》，請先看完下列影片！

* [Hour of Code - Introduction](https://youtu.be/bQilo5ecSX4)

然後開始做『Hour of Code』的練習。

* <https://studio.code.org/hoc/1>

以下是這個『Hour of Code』練習的第一個畫面！

![](Code.org.png)


我曾經在大學資工系的第一堂程式設計上，讓同學們進行上述『Hour of Code』練習，很多同學可以在兩個小時內破完這 20 關。

以下是第 15 關的解答畫面，殭屍成功的找到了向日葵！

![](code_org15.png)


如果您按下《顯示程式碼》，會看到以下的 JavaScript 程式，您將會發現其實自己已經學會寫程式了，只不過是採用圖像式的設計方法而已！

```
while (notFinished()) {
  if (isPathRight()) {
    turnRight();
  }
  if (isPathForward()) {
    moveForward();
  }
}
```

是不是很神奇呢？

但是、真正的程式設計師，通常不能只依靠上述那種《視覺化的設計方法》，而必須要有能力《寫程式》，這就是我們接下來要學的事情了！

## JavaScript 程式語言

我們將學習一種稱為 JavaScript 的程式語言，這種語言早期被用在網頁裡寫一些《功能表》之類的顯示互動功能，但是自從 2009 年 node.js 出現之後，讓 JavaScript 開始往伺服器 server 端發展，現在已經成為非常重要的《網站程式開發語言》。

用 JavaScript 程式語言開發網站的好處是：《前後端都可以同樣的採用 JavaScript》這個語言，因此可以用一個語言打遍天下，而不像 Python, Ruby, Java 或 ASP.NET (C#, VB) 等語言需要在前端使用 JavaScript，後端還要學另一種語言。

而那種同時會寫《前端+後端》程式的人，通常被稱為《全堆疊工程師》(full stack engineer)。

## Node.js 開發環境

Node.js 是 Ryan Dahl 基於 Google 的 V8 引擎於 2009 年釋出的一個 JavaScript 開發平台，主要聚焦於 Web 程式的開發，通常用被來寫網站。

但是、要開發網站就勢必要把「 HTML, CSS, Web」等等技術扯進來，這對那些單純想用 JavaScript 做為第一門語言的學習者而言，勢必是非常困擾的。有鑑於此，我們將撰寫一系列用 Node.js 學基礎 JavaScript 語法的文章，以便讓初學者也能透過 Node.js 這個環境學會 JavaScript 語言。

### node.js 的安裝

您可以 node.js 的官方網站中下載並安裝此一開發環境，網址如下：

* <http://nodejs.org/>

![](NodeJsOrg.png)


在筆者撰寫本書時， node.js 穩定版為 v4.4.4，而目前開發版本為 v6.1.0，筆者通常會選擇安裝《穩定版》(除非有最新功能的特殊需求，筆者才會選擇目前開發版)。

您可以下載後一直按下一步就可以安裝完成了。(筆者所使用的環境是 Windows 8，所以下載時會得到 windows 版的安裝檔，例如 node-v4.4.4-x64.msi 這樣的檔案)。

筆者在 Windows 8 中安裝完成之後，可以在應用程式區域找到 node.js 的相關程式。

![](NodeJsInstallWin.png)

在上圖中，我們點選了 `node.js command prompt` 啟動了一個命令列環境，然後用編輯器(我是用 notepad++) 寫了一個 hello.js 的程式如下。

檔案： hello.js

```javascript
console.log("hello!");
```

我們將 hello.js 檔案放在 `D:\jsbook\` 這個資料夾裏面，然後在 `node.js command prompt` 裡面用下列操作，

```
Your environment has been set up for using Node.js 5.1.0 (x64) and npm.

C:\Users\user>d:

D:\>cd jsbook

D:\jsbook>dir
 磁碟區 D 中的磁碟是 Data
 磁碟區序號:  9EBE-C367

 D:\jsbook 的目錄

2016/07/02  上午 09:13    <DIR>          .
2016/07/02  上午 09:13    <DIR>          ..
2016/07/02  上午 09:13                22 hello.js
               1 個檔案              22 位元組
               2 個目錄  104,252,784,640 位元組可用

D:\jsbook>node hello.js
hello!
```

您會看到當我們用 `node hello.js` 這個指令執行該程式時，畫面中會出現該程式的執行結果，印出 `hello!` 訊息！

### 變數與指定

您也可以點選上圖中綠色圖示的 《node.js》交談環境，接著輸入一些簡單的指令，這個環境可以讓您很容易的與 node.js 互動，試驗一下 JavaScript 指令的執行結果。

要學習一個程式語言，通常必須從變數宣告開始，變數可以想像成用來存放一些值的容器。舉例而言，當我們寫下 x=5 的時候，就是在 x 這個變數裏，放入 5 這個數值，同樣的我們也可以設定變數 y 為 3。

為了學習這些慨念，請您打開《node.js》 交談環境這個綠色圖示的程式，然後輸入下列指令看看：

```
> x=5
5
> y=3
3
> x+y
8
> s="hello"
'hello'
> w=" world!"
' world!'
> s+w
'hello world!'
> x+w
'5 world!'
> x+y+w
'8 world!'
> 3+5*x-8
20
> y/x
0.6
>

```

您可以看到在上述操作中，我們宣告了 x,y,s,w 等變數，其中 `x=3, y=5, s="hello", w=" world!"` ，由於 x,y 都被指定為整數，因此可以進行加減乘除的運算，而 s,w 則被指定為字串，因此只能執行連接運算，在 JavaScript 中的字串連接也是採用加法符號 `+` 表示的。


## Node.js 的交談操作

### 基本型態

JavaScript 的變數，可以是「數值 (Number)、字串 (String) 、布林 (Boolean) 、陣列 (Array) 或物件 (Object)」等型態，其中的陣列與物件是複合型態，其他三種為基本型態，以下是一些關於這些基本型態的操作指令。

```
> pi=3.14159
3.14159
> e=2.71828
2.71828
> 4*pi
12.56636
> score=70
70
> isPass=true
true
> typeof(score)
'number'
> typeof(pi)
'number'
> typeof(isPass)
'boolean'
> s="hello"
'hello'
> typeof(s)
'string'
>
```

### 循序性 1

在典型的程式中，指令是一個接著一個按順序執行的，先執行第一個、接下來執行第二個，.....

以下是示範指令循序執行的一個操作範例，您可以在命令列中啟動 node 後開始輸入這些指令。

```
$ node
> a=1
1
> a=a+1
2
> a=a+1
3
> a=a+1
4
> a=a+1
5
> a
5
```

在這裡，有些人會感到疑惑，因為 a=a+1 這個句子有點詭異。這個問題純粹是對 = 符號的誤解所產生的，請讀者注意，在 javascript 語言中，一個等號代表《指定》，兩個等號 == 才代表《判斷是否相等》。以下是我上課時學生發生的一個問題以及解答，在此列出給您參考！

```
疑問：學程式一開始對 x=x+1 這個句子的迷惑？

今天上大一第一門程式設計課，有位同學問了一個我遺忘了好久的問題。

程式裏的 x=x+1 是什麼意思呢？這樣不是應該不成立嗎？

後來我想起了自己剛學程式時也困惑了一陣子。

在數學裡，如果 x=x+1 的話，那麼整個數學系統就全面崩潰了。

這個方程式根本就沒有解。

但是在程式裏，假如 x 原本是 2 ，那麼 x=x+1 就是：

『把 x 中的 2 取出來之後，和 1 相加完得到結果為 3，再把 3 塞回去給 x』

於是 x 就變成了 3 。

這個問題往往發生在那些數學太好的同學身上，但是如果因此而讓他學不會程式，老師也沒有解釋的話，那就太冤枉了。
```

### 循序性 2

當然、這種指定運算可以進行各種指定，不是只能用來 +1 的，以下是更多的循序指定運算。

```
> a=1
1
> b=2
2
> c=a+b
3
> c=c+b
5
> c=c+a
6

```

### 兩變數交換 1

如果我們想要讓兩個變數互換過來，必須用幾個中介變數才能完成，以下我們就利用 t1, t2 兩個變數作為中介，將 x 和 y 互相交換！

```
> x=3; y=5
5
> x
3
> y
5
> t1=x; t2=y
5
> t1
3
> t2
5
> x=t2; y=t1
3
> x
5
> y
3

```

### 兩變數交換 2

上述交換我們用了兩個變數，但其實用一個變數也就夠了，只是邏輯上會變得比較難懂，讀者可能得逐步追蹤每個變數值的狀況，才能清楚的理解為何可以用一個變數就讓 x, y 交換過來！

```
> x=3; y=5
5
> x
3
> y
5
> t=x; x=y; y=t
3
> x
5
> y
3
```

### 加減乘除 

現代電腦其實不過就是一部記憶體很大，速度又很快的《計算機》而已，既然是《計算機》，所做的事情也差不多就是《加減乘除》而已，您可以在 node 裡面進行這些《加減乘除》運算。

```
> i=1
1
> i=i+1
2
> i
2
> i++
2
> i
3
> i++
3
> i
4
> i++
4
> i
5
> a = 5
5
> a--
5
> a
4
> a--
4
> a
3
> a--
3
> a
2
> a=a-3
-1
> a
-1
> a=3*5+8/2
19
> b=4
4
> c=b*a
76
> d=a+b+c
99
> 33%8
1
> 33%10
3
> 33%9
6
> a=33%8
1
> a
1
> r=33%8
1
> d=33/8
4.125
> d*8
33
> 
```

### 布林判斷 

在上面的操作中，我們看到一個等號 = 代表指定，因此請讀者千萬不要和代表《相等判斷》的 == 符號給混淆了！

《相等判斷》可以用兩個等號 == ，也可以用三個等號 === 來代表，但這兩種相等有一點點不同，三個等號代表完全相等，也就是《變數值和型態》兩者都相等，但是兩個等號 == 代表《變數值經型態轉換後會相等》，因此 "3" == 3 會傳回 true，但是 "3"===3 則會傳回 false 。

```
C:\Users\user>node
> 3=5  // 請注意，一個等號代表《指定》，你不能指定常數 3 變成其他東西，只能指定變數，像是 x=5 ..
3=5
ReferenceError: Invalid left-hand side in assignment
    at Object.exports.createScript (vm.js:24:10)
    at REPLServer.defaultEval (repl.js:137:25)
    at bound (domain.js:250:14)
    at REPLServer.runBound [as eval] (domain.js:263:12)
    at REPLServer. (repl.js:392:12)
    at emitOne (events.js:82:20)
    at REPLServer.emit (events.js:169:7)
    at REPLServer.Interface._onLine (readline.js:210:10)
    at REPLServer.Interface._line (readline.js:546:8)
    at REPLServer.Interface._ttyWrite (readline.js:823:14)
> 3==5 // 兩個等號才代表《判斷》，由於 3 與 5 不相等，因此會輸出 false (假的，不是真的)
false
> 3===5
false
> 3=="3"
true
> 3==="3"
false
> x=3
3
> 3===x
true
> 3==x
true
> 3>3
false
> 3>=3
true
> true && true
true
> true && false
false
> false && false
false
> true || true
true
> false || true
true
> false || false
false
> (3>2) && (3>1)
true
> (3>2) && (3>4)
false
> (3>2) || (3>4)
true
> !(3>2)
false
> !(3>4)
true
> 3 != "3"
false
> 3 !== "3"
true
> !true
false
> !false
true
> "hello"=="hello"
true
> "hello"=="hi"
false
> true==true
true
> true==false
false
> true==(1>3)
false
```

## 亂數

有些時候，我們希望程式有點《隨機性》，這時候就可以引入《亂數》，在 javascript 語言 Math 函式庫裏的 random() 函數會傳回一個 0 到 1 之間的亂數，以下是該函數所產生的一系列亂數。

```
$ node
> Math.random()
0.6770120605360717
> Math.random()
0.42311601690016687
> Math.random()
0.8769011830445379
> Math.random()
0.48077693535014987
> Math.random()
0.5951373421121389
> Math.random()
0.2052019238471985
```

## 小結

在本章中，我們從 code.org 開始，學習了圖像式的程式設計方法，然後開始用 node.js 學習基本的 javascript 指令，逐步建立基礎的程式設計觀念。在下一章當中，我們將介紹 if, for, while 等流程控制語法的概念，開始學習如何寫 JavaScript 的程式。


