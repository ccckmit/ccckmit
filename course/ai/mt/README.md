# 簡易的深度學習機器翻譯系統

搞了好幾天，終於弄出一版《基於 LSTM 深度學習的機器翻譯系統》。

有了這次經驗，終於可以體會為何深度學習的機器翻譯為何感覺那麼的順暢了。

順暢的主要原因是： 透過 LSTM 去講故事，而不是一個字一個字的對翻！

LSTM 本來就是用來做《序列學習》的，所以講出來的東西通常都很順暢，只要在選字上面選對了，之後用 LSTM 產生出來就會是《很順暢的翻譯》了 ...

## 安裝方法

記得檢查你的 node.js 是否比 7.6 版還新，一定要大於 7.6 版，否則無法成功執行！

```
$ git clone https://github.com/ccckmit/ai6.git
$ cd ai6
$ npm install
$ cd book/mt/
```

## 執行方法

訓練階段

```
$ node mtTrain data/e2cDogCat.txt data/e2cDogCat.json

Lstm.setting.words=["[#start#]","一","隻","狗","=","a","dog","↓","貓","cat","小","puppy","kitten","黑","black","[#end#]"]
Lstm.setting.w2i={"[#start#]":0,"一":1,"隻":2,"狗":3,"=":4,"a":5,"dog":6,"↓":7,"貓":8,"cat":9,"小":10,"puppy":11,"kitten":12,"黑":13,"black":14,"[#end#]":15}
Network conns 4608 nodes 176
iteration 1 error 0.14293759569898304 rate 0.1
iteration 2 error 0.07522323385036442 rate 0.1
iteration 3 error 0.06458491480240852 rate 0.1
iteration 4 error 0.057082455586521925 rate 0.1
...

iteration 29 error 0.011055015583765218 rate 0.1
iteration 30 error 0.010528333640657356 rate 0.1
iteration 31 error 0.010034839611344567 rate 0.1
iteration 32 error 0.009572102658143247 rate 0.1
Network conns 17408 nodes 336
iteration 1 error 0.07548083477579114 rate 0.1
iteration 2 error 0.05634446473695932 rate 0.1
iteration 3 error 0.04999356582740921 rate 0.1
iteration 4 error 0.04600692322456007 rate 0.1
iteration 5 error 0.04324447514472449 rate 0.1
iteration 6 error 0.04115684679871102 rate 0.1
iteration 7 error 0.03948834398834224 rate 0.1
...
iteration 185 error 0.011420131758988615 rate 0.1
iteration 186 error 0.011057974053230687 rate 0.1
iteration 187 error 0.010670960617216422 rate 0.1
iteration 188 error 0.01030410947451134 rate 0.1
iteration 189 error 0.009888661334289672 rate 0.1
```

翻譯測試

```
$node mtPredict data/e2cDogCat.json data/e2cDogCat.tst

===== predict:狗 一 隻 ====
(candidates)
5:word=a p=0.9675929042338679
6:word=dog p=0.651197279526269
11:word=puppy p=0.34488781754980025
狗 一 隻 => ["a","dog"]
===== predict:貓 一 隻 ====
(candidates)
5:word=a p=0.9573172342185491
9:word=cat p=0.6693535645546473
12:word=kitten p=0.29080718467235533
貓 一 隻 => ["a","cat"]
===== predict:小 狗 ====
(candidates)
11:word=puppy p=0.8816297491653885
14:word=black p=0.2537686513486649
小 狗 => ["puppy","puppy"]
===== predict:小 貓 ====
(candidates)
12:word=kitten p=0.8904682215496627
14:word=black p=0.24907451747999074
小 貓 => ["kitten"]
===== predict:黑 狗 ====
(candidates)
6:word=dog p=0.5348350146046399
11:word=puppy p=0.400661487464102
14:word=black p=0.9720736605632396
黑 狗 => ["black","dog"]
===== predict:黑 貓 ====
(candidates)
9:word=cat p=0.5963227762532141
12:word=kitten p=0.376897778038657
14:word=black p=0.971442756043665
黑 貓 => ["black","cat"]
===== predict:小 黑 狗 ====
(candidates)
11:word=puppy p=0.8912656214318012
14:word=black p=0.9588802424577825
小 黑 狗 => ["black","puppy"]
===== predict:小 黑 貓 ====
(candidates)
12:word=kitten p=0.9011758221961413
14:word=black p=0.9579783108177898
小 黑 貓 => ["black","kitten"]
===== predict:小 黑 狗 一 隻 ====
(candidates)
5:word=a p=0.9459956693253705
11:word=puppy p=0.8389577328277058
14:word=black p=0.8335305818213015
小 黑 狗 一 隻 => ["a","black","puppy"]
===== predict:小 黑 貓 一 隻 ====
(candidates)
5:word=a p=0.946425261448292
12:word=kitten p=0.8607427612653558
14:word=black p=0.8303666695707616
小 黑 貓 一 隻 => ["a","black","kitten"]
===== predict:小 狗 一 隻 ====
(candidates)
5:word=a p=0.9523506169668698
11:word=puppy p=0.8179899179533968
小 狗 一 隻 => ["a","puppy"]
===== predict:小 貓 一 隻 ====
(candidates)
5:word=a p=0.9527557035000438
12:word=kitten p=0.8429873174585635
小 貓 一 隻 => ["a","kitten"]
===== predict:小 狗 一 條 ====
(candidates)
5:word=a p=0.564735665083913
11:word=puppy p=0.8522144572352616
小 狗 一 條 => ["a","puppy"]
===== predict:黑 貓 一 隻 ====
(candidates)
5:word=a p=0.9426766270340676
9:word=cat p=0.6255859310509793
12:word=kitten p=0.2894828006231555
14:word=black p=0.879574926785496
黑 貓 一 隻 => ["a","black"]
===== predict:黑 狗 一 隻 ====
(candidates)
5:word=a p=0.9421771740340766
6:word=dog p=0.5637208034064847
11:word=puppy p=0.29607964806210296
14:word=black p=0.881951768037879
黑 狗 一 隻 => ["a","black","dog"]
```
