## Metropolis-Hasting 演算法

「Metropolis-Hasting 演算法」(以下簡稱 MH 算法) 的設計，是建構在「馬可夫系統的細緻平衡條件」之上的，因此在說明「MH 算法」之前，必須先理解上述的「細緻平衡條件」，也就是對於圖中的每一條連線都必須達到「流入=流出」的均衡狀態。換句話說，就是符合下列條件。

$$P(x) Q(x  \to  y) = P(y) Q(y  \to  x)$$

Metropolis-Hasting 演算法 (MH 程序) 是一個不斷調整 Q(x→y) 的演算法，該算法所關注的焦點在於 (x, y) 通道上。

假如目前 x 的機率過高，而且從 x 流向 y 的粒子較多，那麼就應當讓粒子全部從 x 流向 y，也就是 Q(x→y) 的流量均可順利流出。但是如果從 y 流向 x 的粒子較多時，那麼我們就讓某些粒子卡住，不要流入 x。

但是究竟要流出多少粒子，卡住多少粒子呢？MH 方法利用下列的 A(x→y) 比例進行調節，以便能透過堵塞通道 Q(y→x) 的方法，讓系統趨向平衡。

$$A(x \to y) = \frac{P(x) Q(x \to y)}{P(y) Q(y \to x)}$$

因此，Metropolis 設計出了下列通道流量的調整公式，以便用疊代的方式調整狀態轉移機率矩陣 P(x \to y)。

$$Q_{t+1}(x \to y) = \begin{cases} Q_t(x \to y) & \;\;\; \text{if x} \neq y  , A(x \to y) \geq 1;\\Q_t(x \to y) A(x \to y) & \;\;\;\text{if x} \neq y , A(x \to y) < 1;\\ Q_t(x \to y) + \sum_{z:A(x \to z) < 1} Q_t(x \to z) (1 - A(x \to z)) & \;\;\;\text{if x = y.} \end{cases}$$

### Metropolis-Hasting 算法

在理解了平衡條件與 MH 程序的想法後，我們就可以正式撰寫出 Metropolis-Hasting 程序的演算法。

```
Algorithm Metropolis-Hasting(P(S)) output Q(S→S)
  foreach (x,y) in (S, S)
    Q(x→y) = 1/|S|
　while not converge
　　　foreach (x,y) in (S, S) // 計算 A 矩陣
　　　　　A(x→y) = (P(y) Q(y→x)) / (P(x) Q(x→y))

　　　foreach (x,y) in (S, S) // 計算下一代的轉移矩陣 Q
　　　　　if x = y
　　　　　　　Q'(x→y) = Q(x→y) + \sum_{z:A(x \to z) < 1} Q_t(x \to z) (1 - A(x \to z))
　　　　　else
　　　　　　　if A(x→y) >= 1
　　　　　　　　Q'(x→y) = Q(x→y)
　　　　　　　else
　　　　　　　　Q'(x→y) = Q(x→y) A(x→y)
　　　Q = Q'
　end while
End Algorithm
```

### MH 算法的進一步簡化

在上述的 MH 程序中，算式 `\sum_{z:A(x \to z) < 1} Q_t(x \to z) (1 - A(x \to z))` 是 $\sum_{z:A(x \to z) < 1} Q_t(x \to z) (1 - A(x \to z))$ 的 tex 數學式，該式的計算較為複雜，事實上，這個值就是為了讓 Q(x \to y) 能夠『規一化』的條件，也就是讓 $\sum_y Q(x \to y)=1$ 的差額補償值。因此我們也可以將上述演算法改寫如下。

```
Algorithm Metropolis-Hasting(P(S)) output Q(S,S)
  foreach (x,y) in (S, S)
    Q(x→y) = 1/|S|
　while not converge
　　　foreach (x,y) in (S, S) // 計算 A 矩陣
　　　　　Q'(x→y) = Q(x→y)
　　　　　A(x→y) = (P(y) Q(y→x)) / (P(x) Q(x→y))

　　　foreach (x,y) in (S, S) // 計算下一代的轉移矩陣 Q
　　　　　if A(x,y) < 1
　　　　　　　Q'(x→y) = Q(x→y) A(x→y)
　　　　　　　Q'(x→x) = Q(x→x) + Q(x→y) (1-A(x→y))

　　　Q = Q';
　end while
End Algorithm
```

### MH 算法的程式範例

檔案：metropolis.js

```javascript
// Metropolis Hasting 的範例
// 問題：機率式有限狀態機，P(s0)=0.3, P(s1)=0.5
// 目標：尋找「轉移矩陣」的穩態，也就是 Q(x→y)=? 時系統會達到平衡。

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

Metropolis-Hasting 程序可以用來學習具有『細緻平衡』特性的狀態轉移機率 Q(x→y)，一但取得了狀態轉移機率，整個系統的機率行為就確定下來了，透過這樣的程序，我們可以學習到一個馬可夫模型，然後再利用這個模型進行『預測』，以便讓程式的行為模擬該馬可夫系統的行為。Metropolis-Hasting 程序對這些可用隨機系統描述的行為而言，是一個重要的學習程序，因此被廣泛應用在機器翻譯、文件分類、分群或貝氏網路的學習等領域上，這是數學領域在電腦上應用的一個優良方法。

### 結語

在本章中我們看到了兩種「馬可夫模型」的學習方法，Gibbs Algorithm 可以在已知「狀態轉移矩陣」 P(x→y) 的情況下，學習每個狀態的機率 P(x)。

而 Metropolis-Hasting 程序則可以在已知每個狀態的機率 P(x) 的情況下，學習「狀態轉移矩陣」 P(x→y) 的機率值。

當然、這是在沒有隱變數情況下的學習，如果有隱變數的時候，我們就必須採用「隱馬可夫模型」的學習方法才行。


