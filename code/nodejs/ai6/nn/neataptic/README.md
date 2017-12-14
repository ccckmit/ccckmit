# Neataptic 神經網路套件

[Neataptic]:https://github.com/wagenaartje/neataptic
[xorEx.js]:xorEx.js
[hopfieldEx.js]:hopfieldEx.js
[lstmEx.js]:lstmEx.js
[narxEx.js]:narxEx.js
[lstmCbyc.js]:lstmCbyc.js
[lstm.js]:lstm.js
[lstmTrain.js]:lstmTrain.js
[lstmPredict.js]:lstmPredict.js


[Neataptic] 是 [wagenaartje](https://github.com/wagenaartje) 用 JavaScript 撰寫的神經網路 (Neural Network) 套件，主要是把感知器的反傳遞網路 Backpropagation 加上遺傳演化算法結合在一起。

但是如果我們暫時撇開《遺傳演化算法》不談，[Neataptic] 其實可以很好的完成《感知器 + Hopfield 容錯記憶網路 + LSTM 遞歸神經網路》的任務。

以下是我們用來示範 Neataptic 功能的一些範例程式。

範例     | 程式 | 說明 
--------|-----|--------------------------------
XOR 感知器 | [xorEx.js] | XOR 用單層神經網路無法完成，因此是測試多層網路的最基本範例。
容錯記憶網路 | [hopfieldEx.js] | Hopfield 神經網路，記住後，稍有錯誤還是可以提取回來。
LSTM 網路 | [lstmEx.js] | 遞歸網路 RNN 的延伸，長短期記憶模型，本範例用來學習 000100010001... 的固定樣式序列。
NARX 網路 | [narxEx.js] | [NARX](https://en.wikipedia.org/wiki/Nonlinear_autoregressive_exogenous_model) 網路，本範例還是用來學習 000100010001... 的固定樣式序列。
LSTM 語句產生 | [lstmCbyc.js] | 學習並重複產生該語句 (ex: Am I concious? Or am I not?)
通用文字模組 | [lstm.js] | 被 [lstmTrain.js] , [lstmPredict.js] 使用
通用文字學習 | [lstmTrain.js] | ex: node lstmTrain data/exp.txt exp.lstm.json
通用文字預測 | [lstmPredict.js] | ex: node lstmPredict exp.lstm.json 100

## 安裝方法

```
$ git clone https://github.com/ccckmit/ai6.git
$ cd ai6
$ npm install
$ cd book/nn/neataptic
```

然後你就可以開始執行下列範例了！

## 範例 : XOR 感知器

程式： [xorEx.js]

執行結果：

```
$ node xorEx

D:\Dropbox\github\ai6\book\nn\neataptic>node xorEx.js
[0, 0] => 0.1759039948193444
[0, 1] => 0.7190650459800166
[1, 0] => 0.8936360743294697
[1, 1] => 0.1589678929606128
```

## 範例 : Hopfield 容錯記憶網路

程式： [hopfieldEx.js]

執行結果：

```
$ node classified2d
0: avloss = 0.6926390656268775
1: avloss = 0.6079319150639381
2: avloss = 0.544738413662955
3: avloss = 0.4960600790068934
4: avloss = 0.4568650617104245
5: avloss = 0.4239681925366754
6: avloss = 0.3954026492236949
7: avloss = 0.36991470239945023
8: avloss = 0.34665083097033145
...
96: avloss = 0.016158735032651795
97: avloss = 0.015959671235881746
98: avloss = 0.015765543569039663
99: avloss = 0.015576178731016032
x=-0.4326 y=1.1909 label=1 w0=0.0043 w1=0.9957
x=3.0000 y=4 label=1 w0=0.0188 w1=0.9812
x=0.1253 y=-0.0376 label=1 w0=0.0084 w1=0.9916
x=0.2877 y=0.3273 label=1 w0=0.0139 w1=0.9861
x=-1.1465 y=0.1746 label=1 w0=0.0024 w1=0.9976
x=1.8133 y=1.0139 label=0 w0=0.9782 w1=0.0218
x=2.7258 y=1.0668 label=0 w0=0.9880 w1=0.0120
x=1.4117 y=0.5593 label=0 w0=0.9703 w1=0.0297
x=4.1832 y=0.3044 label=0 w0=0.9892 w1=0.0108
x=1.8636 y=0.1677 label=0 w0=0.9837 w1=0.0163
x=0.5000 y=3.2 label=1 w0=0.0090 w1=0.9910
x=0.8000 y=3.2 label=1 w0=0.0092 w1=0.9908
x=1.0000 y=-2.2 label=1 w0=0.0297 w1=0.9703
```

## 範例 : LSTM 01 序列記憶

程式： [lstmEx.js]

執行結果：

```
D:\Dropbox\github\ccc\course\ai6\book\nn\neataptic>node lstmEx
iteration 500 error 0.1943154782321371 rate 0.05
iteration 1000 error 0.19233348640050332 rate 0.05
iteration 1500 error 0.1894284988926231 rate 0.05
iteration 2000 error 0.17355676942961443 rate 0.05
iteration 2500 error 0.1276460523624396 rate 0.05
iteration 3000 error 0.09813105291227837 rate 0.05
iteration 3500 error 0.07907866945414652 rate 0.05
iteration 4000 error 0.06639723506046145 rate 0.05
iteration 4500 error 0.057299079889706485 rate 0.05
iteration 5000 error 0.05128957015820507 rate 0.05
iteration 5500 error 0.04784415549193767 rate 0.05
iteration 6000 error 0.04359995964360381 rate 0.05
s[0]=0 next=0.02618906821183275
s[1]=0 next=0.2596994965592306
s[2]=0 next=0.7876609870046056
s[3]=1 next=0.00003776187352897784
s[4]=0 next=0.037822070818615154
s[5]=0 next=0.3486835242452125
s[6]=0 next=0.8471095295847788
s[7]=1 next=0.000023611284930390403
s[8]=0 next=0.02272510397115269
s[9]=0 next=0.22632312738800156
s[10]=0 next=0.7465776770404702
```


## 範例 : LSTM 語句序列記憶

程式： [lstmCbyc.js]

執行結果：

```
previous=a next=m onehot=[1,0,0,0,0,0,0,0,0,0,0,0] [0,1,0,0,0,0,0,0,0,0,0,0]
previous=m next=  onehot=[0,1,0,0,0,0,0,0,0,0,0,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=i onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [0,0,0,1,0,0,0,0,0,0,0,0]
previous=i next=  onehot=[0,0,0,1,0,0,0,0,0,0,0,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=c onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [0,0,0,0,1,0,0,0,0,0,0,0]
previous=c next=o onehot=[0,0,0,0,1,0,0,0,0,0,0,0] [0,0,0,0,0,1,0,0,0,0,0,0]
previous=o next=n onehot=[0,0,0,0,0,1,0,0,0,0,0,0] [0,0,0,0,0,0,1,0,0,0,0,0]
previous=n next=c onehot=[0,0,0,0,0,0,1,0,0,0,0,0] [0,0,0,0,1,0,0,0,0,0,0,0]
previous=c next=i onehot=[0,0,0,0,1,0,0,0,0,0,0,0] [0,0,0,1,0,0,0,0,0,0,0,0]
previous=i next=o onehot=[0,0,0,1,0,0,0,0,0,0,0,0] [0,0,0,0,0,1,0,0,0,0,0,0]
previous=o next=u onehot=[0,0,0,0,0,1,0,0,0,0,0,0] [0,0,0,0,0,0,0,1,0,0,0,0]
previous=u next=s onehot=[0,0,0,0,0,0,0,1,0,0,0,0] [0,0,0,0,0,0,0,0,1,0,0,0]
previous=s next=? onehot=[0,0,0,0,0,0,0,0,1,0,0,0] [0,0,0,0,0,0,0,0,0,1,0,0]
previous=? next=  onehot=[0,0,0,0,0,0,0,0,0,1,0,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=o onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [0,0,0,0,0,1,0,0,0,0,0,0]
previous=o next=r onehot=[0,0,0,0,0,1,0,0,0,0,0,0] [0,0,0,0,0,0,0,0,0,0,1,0]
previous=r next=  onehot=[0,0,0,0,0,0,0,0,0,0,1,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=a onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [1,0,0,0,0,0,0,0,0,0,0,0]
previous=a next=m onehot=[1,0,0,0,0,0,0,0,0,0,0,0] [0,1,0,0,0,0,0,0,0,0,0,0]
previous=m next=  onehot=[0,1,0,0,0,0,0,0,0,0,0,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=i onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [0,0,0,1,0,0,0,0,0,0,0,0]
previous=i next=  onehot=[0,0,0,1,0,0,0,0,0,0,0,0] [0,0,1,0,0,0,0,0,0,0,0,0]
previous=  next=n onehot=[0,0,1,0,0,0,0,0,0,0,0,0] [0,0,0,0,0,0,1,0,0,0,0,0]
previous=n next=o onehot=[0,0,0,0,0,0,1,0,0,0,0,0] [0,0,0,0,0,1,0,0,0,0,0,0]
previous=o next=t onehot=[0,0,0,0,0,1,0,0,0,0,0,0] [0,0,0,0,0,0,0,0,0,0,0,1]
previous=t next=? onehot=[0,0,0,0,0,0,0,0,0,0,0,1] [0,0,0,0,0,0,0,0,0,1,0,0]
Characters=a,m, ,i,c,o,n,u,s,?,r,t, count=12
onehot={"a":[1,0,0,0,0,0,0,0,0,0,0,0],"m":[0,1,0,0,0,0,0,0,0,0,0,0]," ":[0,0,1,0,0,0,0,0,0,0,0,0],"i":[0,0,0,1,0,0,0,0,0,0,0,0],"c":[0,0,0,0,1,0,0,0,0,0,0,0],"o":[0,0,0,0,0,1,0,0,0,0,0,0],"n":[0,0,0,0,0,0,1,0,0,0,0,0],"u":[0,0,0,0,0,0,0,1,0,0,0,0],"s":[0,0,0,0,0,0,0,0,1,0,0,0],"?":[0,0,0,0,0,0,0,0,0,1,0,0],"r":[0,0,0,0,0,0,0,0,0,0,1,0],"t":[0,0,0,0,0,0,0,0,0,0,0,1]}
dataset.size=26, dataSet=[{"input":[1,0,0,0,0,0,0,0,0,0,0,0],"output":[0,1,0,0,0,0,0,0,0,0,0,0]},{"input":[0,1,0,0,0,0,0,0,0,0,0,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[0,0,0,1,0,0,0,0,0,0,0,0]},{"input":[0,0,0,1,0,0,0,0,0,0,0,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[0,0,0,0,1,0,0,0,0,0,0,0]},{"input":[0,0,0,0,1,0,0,0,0,0,0,0],"output":[0,0,0,0,0,1,0,0,0,0,0,0]},{"input":[0,0,0,0,0,1,0,0,0,0,0,0],"output":[0,0,0,0,0,0,1,0,0,0,0,0]},{"input":[0,0,0,0,0,0,1,0,0,0,0,0],"output":[0,0,0,0,1,0,0,0,0,0,0,0]},{"input":[0,0,0,0,1,0,0,0,0,0,0,0],"output":[0,0,0,1,0,0,0,0,0,0,0,0]},{"input":[0,0,0,1,0,0,0,0,0,0,0,0],"output":[0,0,0,0,0,1,0,0,0,0,0,0]},{"input":[0,0,0,0,0,1,0,0,0,0,0,0],"output":[0,0,0,0,0,0,0,1,0,0,0,0]},{"input":[0,0,0,0,0,0,0,1,0,0,0,0],"output":[0,0,0,0,0,0,0,0,1,0,0,0]},{"input":[0,0,0,0,0,0,0,0,1,0,0,0],"output":[0,0,0,0,0,0,0,0,0,1,0,0]},{"input":[0,0,0,0,0,0,0,0,0,1,0,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[0,0,0,0,0,1,0,0,0,0,0,0]},{"input":[0,0,0,0,0,1,0,0,0,0,0,0],"output":[0,0,0,0,0,0,0,0,0,0,1,0]},{"input":[0,0,0,0,0,0,0,0,0,0,1,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[1,0,0,0,0,0,0,0,0,0,0,0]},{"input":[1,0,0,0,0,0,0,0,0,0,0,0],"output":[0,1,0,0,0,0,0,0,0,0,0,0]},{"input":[0,1,0,0,0,0,0,0,0,0,0,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[0,0,0,1,0,0,0,0,0,0,0,0]},{"input":[0,0,0,1,0,0,0,0,0,0,0,0],"output":[0,0,1,0,0,0,0,0,0,0,0,0]},{"input":[0,0,1,0,0,0,0,0,0,0,0,0],"output":[0,0,0,0,0,0,1,0,0,0,0,0]},{"input":[0,0,0,0,0,0,1,0,0,0,0,0],"output":[0,0,0,0,0,1,0,0,0,0,0,0]},{"input":[0,0,0,0,0,1,0,0,0,0,0,0],"output":[0,0,0,0,0,0,0,0,0,0,0,1]},{"input":[0,0,0,0,0,0,0,0,0,0,0,1],"output":[0,0,0,0,0,0,0,0,0,1,0,0]}]
Network conns 1044 nodes 64
iteration 1 error 0.1294756839547586 rate 0.1
iteration 2 error 0.07651890652897507 rate 0.1
iteration 3 error 0.07349590194472756 rate 0.1
iteration 4 error 0.07176633947897101 rate 0.1
iteration 5 error 0.07012867138468276 rate 0.1
iteration 6 error 0.06853913651482586 rate 0.1
...
iteration 490 error 0.005137684922755738 rate 0.1
iteration 491 error 0.005002464523655839 rate 0.1
iteration 492 error 0.00507357028398807 rate 0.1
iteration 493 error 0.004861101292281021 rate 0.1
m
 
i
 
c
o
n
c
i
o
u
s
?
 
o
r
 
a
m
 
i
 
n
o
t
?
```

## 通用的文字預測程式

### 範例 1 : 狗世界的英文字串學習

輸入檔： [data/edog.txt](data/edog.txt)

```
a dog
little dog
little black dog
black dog
a little black dog
a little dog
```

訓練過程：

```
$ node lstmTrain data/edog.txt edog.lstm.json
seqText="a dog\r\nlittle dog\r\nlittle black dog\r\nblack dog\r\na little black
dog\r\na little dog"
words = ["[#start#]","a"," ","d","o","g","\r","\n","l","i","t","e","b","c","k"]
Network conns 2025 nodes 90
iteration 1 error 0.07841929704993059 rate 0.1
iteration 2 error 0.05948436172466311 rate 0.1
iteration 3 error 0.05491542447349242 rate 0.1
iteration 4 error 0.050032170796091714 rate 0.1
...
iteration 163 error 0.012938346303900537 rate 0.1
iteration 164 error 0.010822697178544552 rate 0.1
iteration 165 error 0.010313658161468101 rate 0.1
iteration 166 error 0.009602751808102253 rate 0.1
```

用訓練完成的網路產生字串

```
$ node lstmPredict edog.lstm.json 100
======== gen (prefix=[]) ===========
a dog
little dog
litle dog
a little dog
a dog
little dog
a litle dog
a litle dog
a little do
```

### 範例 2 : 狗世界的中文字串學習

輸入檔： [data/cdog.txt](data/cdog.txt)

```
一隻狗
小狗
小黑狗
黑狗
一隻小黑狗
一隻小狗
```

訓練過程：

```
$ node lstmTrain data/cdog.txt cdog.lstm.json
...
iteration 313 error 0.010488494419177973 rate 0.1
iteration 314 error 0.01030299447451737 rate 0.1
iteration 315 error 0.01012583958893957 rate 0.1
iteration 316 error 0.009957086658870906 rate 0.1
```

用訓練完成的網路產生字串

```
$ node lstmPredict cdog.lstm.json 100
======== gen (prefix=[]) ===========
一隻狗
小狗
小黑狗
一隻小狗
一隻小狗
小黑狗
一隻小狗
小黑狗
一隻小狗
一隻小狗
小黑狗
一隻小狗
一隻狗
小黑狗
一隻小狗
小黑狗
一隻小狗
一隻小狗
小黑
```

### 範例 3 : 數學運算式的學習

輸入檔： [data/exp.txt](data/exp.txt)

```
a
b
a+b
(a+b)+a
a+(b+a)
(a+b)+(b+a)
(a+(b+a))+b
((a+b)+a)+((b+a)+b)
```

訓練過程：

```
$ node lstmTrain data/exp.txt exp.lstm.json
...
iteration 384 error 0.01110337015812884 rate 0.1
iteration 385 error 0.010713149768480227 rate 0.1
iteration 386 error 0.012236864162624268 rate 0.1
iteration 387 error 0.012772430304249613 rate 0.1
iteration 388 error 0.010220229347676834 rate 0.1
iteration 389 error 0.00993338909862571 rate 0.1
```

用訓練完成的網路產生字串

```

$ node lstmPredict exp.lstm.json 100
======== gen (prefix=[]) ===========
a
b
a+b
(a+b)+a
a+(b+a)
(a+b)+(b+a)
(a+b)+(b+a)
(a+b)+((a+b)+a)+(b+a)
(a+b)+(b+a)+b
(a+(b+a
```
