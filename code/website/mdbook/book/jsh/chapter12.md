# 第 12 章 - 完整案例 RLab

在我還是學生的時候，那時候我們還不知道甚麼是網路，因此只能在電腦上寫自己的程式，幾乎所有的程式都是從頭到尾自己寫，除了使用《系統預設的函式庫》以外，就沒有別的資源可以用了。

但是、這30年來，程式語言的長相雖然並沒有非常大的改變，不過網路資源卻有了很大的改變。

原本由微軟主導的開發環境，逐漸變成《微軟、蘋果、Google》三強鼎立的局面。

除了這些商業公司之外，更重要的是開放原始碼的蓬勃發展，像是本書所採用的 node.js 就是個開放原始碼的系統。

現在、只要你會善用《開放原始碼》與《各種套件》，那麼很少需要從頭打造整個系統了。

於是、程式人的角色，往往從《手工業》變成了《組裝業》，我們愈來愈常使用外部的各種套件與模組，自己寫的程式往往只是將這些模組《黏合再一起形成我們所想要系統》而已！

在本章中，筆者希望透過自己創建 rlab 這個《科學計算套件》的過程，分享一下參與這種《程式組裝業》所需要具備的能力！

在科學計算領域，商用的軟體目前以 matlab 為主流，而開放原始碼軟體則有 R 、Octave 與 Python 的 (numpy, scipy) 等軟體。

不過、截至目前為止，我仍然沒找到以javascript語言為主的完整《科學計算》套件，因此我決定自己打造一個。

科學計算軟體通常必須支援《矩陣+機率統計》等功能，因此我們將使用 numeric.js 作為矩陣功能的主要模組, 用 jstat.js 作為機率統計功能的主要模組，然後再移植包裝一些較小的模組，組合建構出 rlab 這個科學計算套件，以下就是我們建構套件的過程。

## 矩陣套件 numeric.js


在我所用過的 javascript 矩陣套件當中，numeric.js 是最完整的一個，因此 rlab 科學計算套件的建構，將會以 numeric.js 作為矩陣部分的核心。

以下是 numeric.js 套件的 npm 網址：

* <https://www.npmjs.com/package/numeric>

雖然 npm 套件管理器中已經包含了 numeric.js 套件，但是很多套件都有自己的官方網站， numeric.js 也不例外，以下是 numeric.js 的官網。

* <http://www.numericjs.com/>

我們可以透過 npm install numeric 這個指令，安裝這個套件，然後寫個小程式 numericTest.js 來測試一下這個套件。

檔案： numericTest.js

```javascript
var numeric = require("numeric");

function print(name, m) {
  console.log("===================="+name+"=======================");
  console.log(numeric.prettyPrint(m));
}

var A = [[1,2,3],[3,2,2],[4,3,5]];
print("A", A);

var iA = numeric.inv(A);
print("iA", iA);

var AiA = numeric.dot(A, iA);
print("A*iA", AiA);
```

安裝與執行結果：

```
D:\jsbook>npm install numeric
D:\jsbook
`-- numeric@1.2.6

npm WARN enoent ENOENT: no such file or directory, open 'D:\jsbook\package.json'

npm WARN jsbook No description
npm WARN jsbook No repository field.
npm WARN jsbook No README data
npm WARN jsbook No license field.

D:\jsbook>node numericTest.js
====================A=======================
[[          1,          2,          3],
 [          3,          2,          2],
 [          4,          3,          5]]
====================iA=======================
[[    -0.5714,     0.1429,     0.2857],
 [          1,          1,         -1],
 [    -0.1429,    -0.7143,     0.5714]]
====================A*iA=======================
[[          1,          0,          0],
 [ -1.665e-16,          1,  -2.22e-16],
 [ -4.441e-16,  4.441e-16,          1]]

```

您可以看到上述程式中，我們用 numeric.inv(A) 這行指令輕鬆地就計算出了反矩陣，這種函數如果要自己寫，其實會很花時間的，但是用了套件之後，我們輕輕鬆鬆的就可以做完這些《矩陣運算》的動作。

當然、不只這些，numeric.js 套件其實還蠻完整的，您可以參考下列網址中的內容，進一步瞭解這個套件到底提供了哪些函數？

* <http://www.numericjs.com/documentation.html>

## 統計套件 jstat.js

雖然 numeric.js 套件在矩陣上很好用，但是不支援機率統計的功能，因此我們找到了 jstat.js 這個套件，其 npm 網址如下：

* <https://www.npmjs.com/package/jstat>

您可以從中找出此專案在 github 上的連結，網址如下：

* <https://github.com/jstat/jstat>

該專案有自己的說明文件，位於下列網址：

* <http://jstat.github.io/>

透過這個說明文件，我們可以瞭解這個套件該如何使用。

jstat 裡面雖然也支援了一些《向量矩陣》之類的功能，但是這方面的能力並不夠強大，所以我們在《向量矩陣》方面還是會採用 numeric.js ，但是在《機率分布》還有《統計檢定》方面則會使用 jstat.js 套件的內容。

以下是 jstat 這兩個部份的說明文件：

* 機率分布 -- <http://jstat.github.io/distributions.html>
* 統計檢定 -- <http://jstat.github.io/test.html>

現在、我們已經具有足夠的資源，可以開始建構我們的 rlab 科學計算套件了！

## 科學計算套件 -- RLab.js

我們所建構好的 rlab 專案，也同樣放上了 npm 和 github，其網址如下：

* rlab on npm -- <https://www.npmjs.com/package/rlab>
* rlab on github -- <https://github.com/ccckmit/rlab>

您只要用下列指令就可以安裝 rlab 套件。

```
npm install rlab
```

安裝好之後，您可以寫些小程式來測試看看。

首先是機率部分的測試，以下是程式碼

檔案：probabilityEx.js

```javascript
var R = require("rlab");
var dice = R.steps(1,6);
log("sample(1:6, 10)", R.samples(dice, 10));
log("runif(10,0,1)=", R.runif(10, 0, 1).str());
log("rnorm(10,5,1)=", R.rnorm(10, 5, 1).str());
log("dnorm(5,5,1)=", R.dnorm(5, 5, 1));
log("pnorm(5,5,1)=", R.pnorm(5, 5, 1));
log("qnorm(0.5,5,1)=", R.qnorm(0.5, 5, 1));
log("rbinom(10, 5, 0.5)=", R.rbinom(10,5,0.5));
log("dbinom(4, 5, 0.5)=", R.dbinom(4,5,0.5));
log("dbinom(5, 5, 0.5)=", R.dbinom(5,5,0.5));
log("pbinom(4, 5, 0.5)=", R.pbinom(4,5,0.5));
log("qbinom(0.9, 5, 0.5)=", R.qbinom(0.9,5,0.5));
```

執行結果 :

```
$ node probabilityEx.js
sample(1:6, 10) [ 3, 5, 3, 2, 3, 3, 1, 2, 4, 3 ]
runif(10,0,1)= [0.9119,0.5899,0.6839,0.1350,0.6894,0.9512,0.8186,0.5826,0.4279,0
.5125]
rnorm(10,5,1)= [5.8961,5.4312,6.0002,5.3623,5.5281,4.4413,6.2144,5.7173,5.3111,1
.3146]
dnorm(5,5,1)= 0.3989422804014327
pnorm(5,5,1)= 0.5
qnorm(0.5,5,1)= 5
rbinom(10, 5, 0.5)= [ 2, 1, 2, 2, 4, 4, 1, 4, 3, 2 ]
dbinom(4, 5, 0.5)= 0.15625
dbinom(5, 5, 0.5)= 0.03125
pbinom(4, 5, 0.5)= 0.96875
qbinom(0.9, 5, 0.5)= 4
```

接著測試一下統計功能，以下是程式碼：

檔案 : statisticsEx.js

```javascript
var R = require("rlab");
var v = [1,3,5];
log("v.max()=", v.max());
log("v.min()=", v.min());
log("v.sum()=", v.sum());
log("v.normalize()=", v.normalize());
log("v.normalize().sum()=", v.normalize().sum());
log("v.product()=", v.product());
log("v.mean()=", v.mean());
log("v.range()=", v.range());
log("v.median()=", v.median());
log("v.variance()=", v.variance());
log("v.sd()=", v.sd(), " sd^2=", v.sd()*v.sd());
log("v.cov(v)=", v.cov(v), "v.cor(v)=", v.cor(v));
log("factorial(5)=", R.factorial(5));
```

執行結果:

```
$ node statisticsEx.js
v.max()= 5
v.min()= 1
v.sum()= 9
v.normalize()= [ 0.1111111111111111, 0.3333333333333333, 0.5555555555555556 ]
v.normalize().sum()= 1
v.product()= 15
v.mean()= 1
v.range()= 4
v.median()= 3
v.variance()= 2.6666666666666665
v.sd()= 1.632993161855452  sd^2= 2.6666666666666665
v.cov(v)= 4 v.cor(v)= 1
factorial(5)= 120
```

然後測試《檢定功能》，以下是程式碼

檔案 : testEx.js

```
var R = require("rlab");
var v = [1,3,5];

var x = R.rnorm(10, 0, 0.1);
log("x=", x.str());
log("x.sort()=", x.sort().str());

var t1=R.ttest({x:x, mu:0});
R.report(t1);
```

執行結果 :

```
$ node testEx.js
x= [-0.1405,0.0495,-0.1850,0.0824,0.0687,-0.0854,-0.1049,-0.1171,0.0947,-0.1592]

x.sort()= [-0.0854,-0.1049,-0.1171,-0.1405,-0.1592,-0.1850,0.0495,0.0687,0.0824,
0.0947]
=========== report ==========
name    : ttest(X)
h       : H0:mu=0
alpha   : 0.0500
op      : =
pvalue  : 0.0003
ci      : [-0.2599,-0.1101]
df      : 9.0000
mean    : -0.1850
sd      : 0.1047
```

然後在測試矩陣功能，以下是程式碼

檔案 : matrixEx.js

```javascript
var M = require("rlab").M;
var v = [1,2,3];
log("v.sin()=", v.sin());
log("v.norm2()=", v.norm2());
log("v.norm2Squared()=", v.norm2Squared());

var A = [[1,2,3],[4,5,6],[7,3,9]];
var AiA = A.inv().dot(A);
log("AiA=\n", AiA.strM());
log("AiA.tr()=\n", AiA.tr().strM());
log("A=\n", A.str());
log("A.mul(0.1)=\n", A.mul(0.1).strM());
log("A.row(1)=", A.row(1));
log("A.col(1)=", A.col(1));
log("A.sumM()=", A.sumM());
log("A.rowSum()=", A.rowSum());
log("A.colSum()=", A.colSum());
log("A.mean(row)=", A.rowMean().str());
log("A.mean(col)=", A.colMean().str());

var D = M.diag(v);
log("D=", D);

var Eλ = M.eigR(A);
var E = Eλ.E, λ=Eλ.lambda;
log("E*[λ]*E-1=", E.dot(λ.diag()).dot(E.inv()).strM());
```

矩陣功能的執行結果 :

```
$ node matrixEx.js
v.sin()= [ 0.8414709848078965, 0.9092974268256817, 0.1411200080598672 ]
v.norm2()= 3.7416573867739413
v.norm2Squared()= 14
AiA=
 [[          1,   1.11e-16,  -1.11e-16],
 [          0,          1,  4.441e-16],
 [ -3.331e-16, -3.331e-16,          1]]
AiA.tr()=
 [[          1,          0, -3.331e-16],
 [   1.11e-16,          1, -3.331e-16],
 [  -1.11e-16,  4.441e-16,          1]]
A=
 [[1.0000,2.0000,3.0000],[4.0000,5.0000,6.0000],[7.0000,3.0000,9.0000]]
A.mul(0.1)=
 [[        0.1,        0.2,        0.3],
 [        0.4,        0.5,        0.6],
 [        0.7,        0.3,        0.9]]
A.row(1)= [ 4, 5, 6 ]
A.col(1)= [ 2, 5, 3 ]
A.sumM()= 40
A.rowSum(2)= [ 6, 15, 19 ]
A.colSum(2)= [ 12, 10, 18 ]
A.mean(row)= [2.0000,5.0000,6.3333]
A.mean(col)= [4.0000,3.3333,6.0000]
D= [ [ 1, 0, 0 ], [ 0, 2, 0 ], [ 0, 0, 3 ] ]
E*[λ]*E-1= [[          1,          2,          3],
 [          4,          5,          6],
 [          7,          3,          9]]
```
 
最後我們還自己加上了微分和積分的函數，測試程式如下：
 
檔案 : differentialEx.js

```javascript
var R = require("rlab");

var d = R.D.d, i=R.D.i, sin=R.sin, PI = R.PI, x2=(x)=>x*x;

log('d(x^2,2)=', d(x2, 2));
log('d(sin(x/4),pi/4)=', d(sin, PI/4));
log('i(x^2,0,1)=', i(x2,0,1));
log('i(sin(x),0,pi/2)=', i(sin,0,PI/2));
```

微積分部分的執行結果 :

```
D:\Dropbox\github\rlab\example>node differentialEx.js
d(x^2,2)= 4.000999999999699
d(sin(x/4),pi/4)= 0.7067531099743674
i(x^2,0,1)= 0.33283350000000095
i(sin(x),0,pi/2)= 0.9997035898637557
```

至於這樣的模組是如何上傳到 npm 與 github 的，請大家參考以下這篇投影片！

* [用十分鐘瞭解JavaScript的模組 -- 《還有關於npm套件管理的那些事情》](https://www.slideshare.net/ccckmit/javascript-npm)

## 結語

到目前為止，我們已經介紹完 javascript + node.js 的語法、函式庫、模組、檔案、資料庫、網路等等功能。

當您學會這些部分，您就已經學會 javascript 語言與 node.js 平台了。

不過、node.js 主要是用來寫網站伺服端 server 的，而 javascript 則是瀏覽器裏唯一的語言，因此是前端網頁開發的主力。兩者合併就可以成為強大的網站開發工具。

但是要學習網站開發，還需要像 HTML, CSS, jQuery, Koa 等方面的知識，我們將會在本書的續集當中，介紹如何用 node.js 開發網站的這個主題。

如果你想學習網站設計，那麼就請閱讀本書的續集 - [《專門為中學生寫的 JavaScript 程式書 - 網站設計篇》](https://www.gitbook.com/book/ccckmit/javascript-web) 吧！
 * 續集網址 -- <https://www.gitbook.com/book/ccckmit/javascript-web>

## 習題
1. 請開始邁向偉大的航道，寫一個《自己真正想寫》的 node.js 專案吧！
