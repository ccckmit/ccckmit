# MCMC 蒙地卡羅馬可夫演算法

## 馬可夫系統

### 馬可夫系統的範例

對於一個具有「馬可夫特性」的「機率式有限狀態機」，我們可以用「機率轉移矩陣」進行描述，舉例而言：下圖顯示了一個只有兩個狀態的「馬可夫隨機系統」。

![圖、一個只有兩個狀態的馬可夫隨機系統](../img/markov2state.jpg)

在這樣的系統當中，我們若想要尋找他的穩定狀態，也就是 P(s0)=?, P(s1)=? 才能讓整個系統達到平衡的問題，我們可以採用「蒙地卡羅」 (Monte Carlo) 演算法，而採用「蒙地卡羅」型態的演算法解決馬可夫鏈問題，就稱為 MCMC (Monte Carlo Markov Chain)。

對於上述有「馬可夫隨機系統」，我們可以用「二元一次聯立方程式」求解 P(s0) 與 P(s1)，假如我們將 P(s0) 寫為 P0，P(s1) 寫為 P1，那麼整個系統達到平衡時，應該會有下列狀況。

```
P0*0.3 = P1*0.5 ; P0 的流出量 = P0 的流入量
P0+P1 = 1       ; 狀態不是 s0 就是 s1
```

如果我們求解上述方程式，就可以得到 (P0=5/8, P1=3/8)，此時整個系統會達到平衡。

### 馬可夫系統的平衡

假如我們模擬機率性粒子在馬可夫鏈中的移動行為，最後這些移動將達到一個平衡。在達到平衡後，從 x 狀態流出去的粒子數，將會等於流回該狀態的粒子數，也就是必須滿足下列『平衡條件』的要求。

$\sum_y P(x) P(x => y)  = \sum_y P(y) P(y => x)$

當隨機的粒子移動時，如果從 x 流出的粒子較多，自然會讓 P(x) 下降，最後仍然達到平衡，如果流入 x 的粒子比流出的多，那麼 P(x) 自然就會上升，只要我們能模擬流出流入的程序，最後整個馬可夫系統將會達到平衡。

## Gibbs 演算法

### Gibbs 演算法的程式範例

現在、我們希望用 Gibbs 演算法來尋找上述問題的穩態，一開始我們可以隨意設定一個初始的隨機分布，例如 (P0, P1) = (0.5, 0.5)。

接著我們就可以用疊代的方法，計算該系統的穩態，以下的 JavaScript 程式就模擬了這種過程。

檔案： gibbs.js

```javascript
// Gibbs Algorithm 的範例
// 問題：機率式有限狀態機，P(s0=>s1)=0.3, P(s1=>s0)=0.5 ; P(s0=>s0)=0.7, P(s1=>s1)=0.5
// 目標：尋找該「機率式有限狀態機」的穩態，也就是 P(s0) = ?, P(s1)=? 時系統會達到平衡。

function rand(a, b) {
  return (b-a)*Math.random() + a;
}

function gibbs() {
  var p = [ 0.5, 0.5 ]; // 初始機率分佈，隨意設定。
  do {
	console.log("p = %j", p);
    var pn = [ p[0]*0.7+p[1]*0.5, p[0]*0.3+p[1]*0.5 ];    // 下一輪的機率分布。
	var diff = [ pn[0]-p[0], pn[1]-p[1] ];                // 兩輪間的差異。
	var step = Math.sqrt(diff[0]*diff[0]+diff[1]*diff[1]);// 差異的大小
	p = pn;
  } while (step > 0.001);  // 假如差異夠小的時候，就可以停止了。
  console.log("5/8=%d 3/8=%d", 5/8, 3/8); // 印出標準答案，以便看看我們找到的答案是否夠接近。
}

gibbs();
```

執行結果：

```
D:\Dropbox\Public\web\ml\code\Gibbs>node gibbs
p = [0.5,0.5]
p = [0.6,0.4]
p = [0.62,0.38]
p = [0.624,0.376]
p = [0.6248,0.3752]
5/8=0.625 3/8=0.375
```

您可以看到上述程式所找到的答案 [0.6248,0.3752] 與我們用「聯立方程式」求出來的答案 [5/8, 3/8] 之間非常接近，這代表上述的 Gibbs 程式可以求出系統的穩態。

當然、上述的算法只是一個極度簡化的範例，還不能完全代表 Gibbs Algorithm，現在讓我們用比較抽象但通用的講法來說明 Gibbs 演算法。

### Gibbs 演算法的數學描述

Gibbs 取樣程序的使用時機是在聯合分布 P(X,Y) 未知，但是單一變數的條件機率 P(X|Y), P(Y|X), P(X), P(Y) 已知的情況。在此種情況下，我們可以利用亂數產生的樣本，統計聯合機率分布。

該程序首先取得一個分布 Y0 作為初始值，然後利用蒙地卡羅法透過 (X, Y0) 產生 X1 分布，接著再利用 (X1, Y)  產生 Y1 分布。於是我們得到下列這個疊代程序 

```
Algorithm GibbsSampling(X, Y)
　Y[0] = random initialize a distribution
　for i = 1 to N
　　generate X[i] from P(X | Y[i-1])
　　generate Y[i] from P(Y | X[i]) 
　return {X[N], Y[N]}
End Algorithm
```

以上疊代程序是針對兩個隨機變數的情況，假如我們希望延伸到 k 個隨機變數的情況，可以修改演算法如下。

```
Algorithm GibbsSampling(X[1...k])
　X = random initialize a distribution
　for i = 1 to N
　　generate X'[1] from X and P(X[1] | X[2], ..., X[k])
    ...
　　generate X'[j] from X and P(X[i] | X[1], ..., X[j-1], X[j+1],...,X[k])
    ...
　　generate X'[k] from X and P(X[k] | X[1], ..., X[k-1])
    X = X'
  end
　return X
End Algorithm
```

Gibbs 取樣程序是『蒙地卡羅馬可夫算法』(MCMC) 的一個案例，也是 Metropolis-Hasting 取樣程序的一個特例，我們可以利用 Gibbs 或 Metropolis-Hasting 取樣程序計算貝氏網路的聯合機率分布。

## Metropolis-Hasting 演算法

「Metropolis-Hasting 演算法」(以下簡稱 MH 算法) 的設計，是建構在「馬可夫系統的細緻平衡條件」之上的，因此在說明「MH 算法」之前，必須先理解「細緻平衡條件」。

### 馬可夫系統的細緻平衡條件

讓我們再度回顧上述那個只有兩個狀態的馬可夫系統，如下圖所示。

![圖、一個只有兩個狀態的馬可夫隨機系統](../img/markov2state.jpg)

在這個只有兩個狀態的簡單馬可夫系統中，我們曾經利用下列方程式手動計算求取解答。

```
P0*0.3 = P1*0.5 ; P0 的流出量 = P0 的流入量
P0+P1 = 1       ; 狀態不是 s0 就是 s1
```

上述方程式的第一條，代表狀態 s0<=>s1 這條線的流出量等於流入量，也就是符合下列條件：

```
P(s0)*P(s0=>s1) = P(s1)*P(s1=>s0)
```

假如一個「馬可夫系統」裏的每條線都能達成這樣的平衡，那麼整個系統顯然也是處於一個穩定狀態。

當我們想學習的是「狀態轉移矩陣」的機率 P(x => y) 而非 P(x) 時，只依靠 $\sum_y P(x) P(x => y)  = \sum_y P(y) P(y => x)$ 這個平衡條件是不夠的，此時我們可以要求系統符合下列的『細緻平衡條件』。

$P(x) P(x => y)  = P(y) P(y => x)$

只要符合細緻平衡條件要求，就能夠利用此一條件設計出學習程序，以便透過反覆的疊代運算找出讓 P(x=>y) 達成平衡的數值，這就是整個 Metropolis-Hasting 程序的想法。

## Metropolis-Hasting 演算法的設計理念

Metropolis-Hasting 演算法 (MH 程序) 是一個不斷調整 P(x=>y) 的演算法，該算法所關注的焦點在於 (x, y) 通道上。

假如目前 x 的機率過高，而且從 x 流向 y 的粒子較多，那麼就應當讓粒子全部從 x 流向 y，也就是 P(x=>y) 的流量均可順利流出。但是如果從 y 流向 x 的粒子較多時，那麼我們就讓某些粒子卡住，不要流入 x。

但是究竟要流出多少粒子，卡住多少粒子呢？MH 方法利用下列的 A(x=>y) 比例進行調節，以便能透過堵塞通道 P(y=>x) 的方法，讓系統趨向平衡。

$A(x=>y) = \frac{P(x) P(x=>y)}{P(y) P(y=>x)}$

因此，Metropolis 設計出了下列通道流量的調整公式，以便用疊代的方式調整狀態轉移機率矩陣 P(x=>y)。

$P_{t+1}(x=>y) = \begin{cases} P_t(x=>y) & \;\;\; \text{if x \neq y  , A(x=>y) \geq 1;}\\P_t(x=>y) A(x=>y) & \;\;\;\text{if x \neq y , A(x=>y) < 1;}\\ P_t(x=>y) + \sum_{z:A(x=>z) < 1} P_t(x=>z) (1 - A(x=>z)) & \;\;\;\text{if x = y.} \end{cases}$


### Metropolis-Hasting 算法

在理解了平衡條件與 MH 程序的想法後，我們就可以正式撰寫出 Metropolis-Hasting 程序的演算法。

```
Algorithm Metropolis-Hasting(P(S)) output P(S=>S)
  foreach (x,y) in (S, S)
    P(x=>y) = 1/|S|
　while not converge
　　　foreach (x,y) in (S, S) // 計算 A 矩陣
　　　　　A(x=>y) = (P(y) P(y=>x)) / (P(x) P(x=>y))

　　　foreach (x,y) in (S, S) // 計算下一代的轉移矩陣 Q
　　　　　if x = y
　　　　　　　Q(x=>y) = P(x=>y) + sum { P(x=>z) (1 - A(x=>z)) for all z where A(x=>z) < 1 }
　　　　　else
　　　　　　　if A(x=>y) >= 1
　　　　　　　　Q(x=>y) = P(x=>y)
　　　　　　　else
　　　　　　　　Q(x=>y) = P(x=>y) A(x=>y)
      foreach (x,y) in (S,S) // 將 Q 複製給 P
  　　　P(x=>y) = Q(x=>y)
　end while
End Algorithm
```

### MH 算法的進一步簡化

在上述的 MH 程序中，sum { P(x=>z) (1 - A(x=>z)) for all z where A(x=>z) < 1 }  的計算較為複雜，事實上，這個值就是為了讓 Q(x=>y) 能夠『規一化』的條件，也就是讓 $\sum_y Q(x=>y)=1$ 的差額補償值。因此我們也可以將上述演算法改寫如下。

```
Algorithm Metropolis-Hasting(P(S)) output Q(S,S)
  foreach (x,y) in (S, S)
    P(x=>y) = 1/|S|
　while not converge
　　　foreach (x,y) in (S, S) // 計算 A 矩陣
　　　　　Q(x=>y) = P(x=>y)
　　　　　A(x=>y) = (P(y) P(y=>x)) / (P(x) P(x=>y))

　　　foreach (x,y) in (S, S) // 計算下一代的轉移矩陣 Q
　　　　　if A(x,y) < 1
　　　　　　　Q(x=>y) = P(x=>y) A(x=>y)
　　　　　　　Q(x=>x) = Q(x=>x) + P(x=>y) (1-A(x=>y))

      foreach (x,y) in (S,S) // 將 Q 複製給 P
  　　　P(x=>y) = Q(x=>y)
　end while
End Algorithm
```

### MH 算法的程式範例

檔案：metropolis.js

```javascript
// Metropolis Hasting 的範例
// 問題：機率式有限狀態機，P(s0)=0.3, P(s1)=0.5
// 目標：尋找「轉移矩陣」的穩態，也就是 Q(x=>y)=? 時系統會達到平衡。

function rand(a, b) {
  return (b-a)*Math.random() + a;
}

function MetropolisHasting() {
  var P = [ 5.0/8, 3.0/8 ]; // 初始機率分佈，隨意設定。
  var Q = [ [0.5, 0.5], [0.5, 0.5] ]; // 初始機率分佈，隨意設定。
  var A = [ [0, 0], [0, 0]];
  do {
	console.log("Q = %j", Q);
    var Qn= [ [0,0], [0,0]];
	for (var x in Q) // 計算 A 矩陣
	  for (var y in Q[x]) {
	    Qn[x][y] = Q[x][y];
	    A[x][y] = (P[y]*Q[y][x]) / (P[x]*Q[x][y]); // 入出比 = 流入/流出
	  }
	
	console.log("A = %j", A);
	var diff = 0;
	for (var x in Q) 
	  for (var y in Q[x]) { // 計算下一代 Qn 矩陣
	    if (A[x][y] < 1) {  // 入出比 < 1 ，代表流入太少，流出太多
		  Qn[x][y] = Q[x][y] * A[x][y]; // 降低流出量
		  Qn[x][x] = Qn[x][x]+Q[x][y]*(1-A[x][y]); // 『規一化』調整
		  diff += Math.abs(Qn[x][y]-Q[x][y]); // 計算新舊矩陣差異
		}
	  }
	Q = Qn;
	console.log("diff = %d", diff);
  } while (diff > 0.001);  // 假如差異夠小的時候，就可以停止了。
}

MetropolisHasting();
```

執行結果

```
D:\Dropbox\Public\web\ml\code\Gibbs>node metropolis.js
Q = [[0.5,0.5],[0.5,0.5]]
A = [[1,0.6],[1.6666666666666667,1]]
diff = 0.2
Q = [[0.7,0.3],[0.5,0.5]]
A = [[1,1],[1,1]]
diff = 0
```

Metropolis-Hasting 程序可以用來學習具有『細緻平衡』特性的狀態轉移機率 P(x=>y)，一但取得了狀態轉移機率，整個系統的機率行為就確定下來了，透過這樣的程序，我們可以學習到一個馬可夫模型，然後再利用這個模型進行『預測』，以便讓程式的行為模擬該馬可夫系統的行為。Metropolis-Hasting 程序對這些可用隨機系統描述的行為而言，是一個重要的學習程序，因此被廣泛應用在機器翻譯、文件分類、分群或貝氏網路的學習等領域上，這是數學領域在電腦上應用的一個優良方法。

## 結語

在本章中我們看到了兩種「馬可夫模型」的學習方法，Gibbs Algorithm 可以在已知「狀態轉移矩陣」 P(x=>y) 的情況下，學習每個狀態的機率 P(x)。

而 Metropolis-Hasting 程序則可以在已知每個狀態的機率 P(x) 的情況下，學習「狀態轉移矩陣」 P(x=>y) 的機率值。

當然、這是在沒有隱變數情況下的學習，如果有隱變數的時候，我們就必須採用「隱馬可夫模型」的學習方法才行。

## 參考文獻

* [Wikipedia:Gibbs Sampling](http://en.wikipedia.org/wiki/Gibbs_sampling)
* 3.4 The Gibbs Sampling Algorithm, <http://sfb649.wiwi.hu-berlin.de/fedc_homepage/xplore/ebooks/html/csa/node28.html>
* Handbook of Computational Statistics - <http://sfb649.wiwi.hu-berlin.de/fedc_homepage/xplore/ebooks/html/csa/csahtml.html>


