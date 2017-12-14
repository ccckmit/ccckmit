## EM 演算法

EM 演算法 (Expectation-maximization Algorithm) 可以總結成下列公式

$$h^{t+1} = \arg\max_h \; \sum_z P(Z=z | x, h^t) L(x,Z=z|h^t)$$

說明：h : 機率模型, Z : 隱變數, x : 觀察值

E-step 計算隱變數 z 的條件熵期望值，因此稱為 Expectation，這也就是算式  $$\sum_z P(Z=z | x, h^t) L(x,Z=z|h^t)$$  的意義。

M-step 則是尋找一個讓條件熵最大化的機率模型 h，因此稱為 Maximization，也就是 $$argmax_h(...)$$ 的步驟。

### 一個簡單的範例

假如有一個機率源 h 會產生二進位的亂數 (0 or 1)，已知此機率源產生 0 的機率為(h1,...h5) = (0,0.3,0.5,0.7,1.0) 等五種情況之ㄧ，假如我們觀察該機率源所產生的隨機亂數序列為 x[1..n] = (0,1,1,1,0,1,1,1,1,0,....)，那麼我們在每個時間點應該假設該機率源的分布 h 為何種分布最好呢？

說明：假如這是一場賭局，我們只能從 (h1,...h5) 當中選擇一個機率源模型，當第 n 個觀察值進來時，我們應該將賭金押在哪一個機率源才對呢？

在這樣的模型下，沒有任何隱變數存在，因此 z 為空集合，不需考慮。於是 EM 目標函數退化成下列公式。

$$\begin{align} h^{t+1} &= \arg\max_h \; \sum_z P(z|x,h^t) L(x,z|h^t) \\               &= \arg\max_h \; \frac{P(\emptyset,x,h^t)}{P(x,h^t)} L(x|h^t) \\               &= \arg\max_h \; L(x|h^t) \\               &= \arg\max_h \; \log \frac{P(x,h^t)}{P(h)} \\               &= \arg\max_h \; (\log P(x,h^t) - \log P(h)) \\               &= \arg\max_h \; \log P(x,h^t) \\               &= \arg\max_h \; \log (P(x_i=0,h)^{N(0)} P(x_i=1,h)^{N(1)}) \\               &= \arg\max_h \; N(0) \log P(x_i=0,h) + N(1) \log P(x_i=1,h) \\               &= \arg\max_h \; \sum_{x_i} P(x_i) \log P(x_i,h) \end{align}$$

於是，EM 的目標是尋找產生 x 序列機率最大的假設 h，也就是讓 $$\sum_{x_i} P(x_i) \log P(x_i,h)$$ 最大的 h，在這個問題上，$$\arg\max_h(...)$$ 的程序很容易做，只要讓
首先，我們可以列出每個機率源產生該序列的機率：

當 x[1] 進來時，我們應該押 h1, 
當 x[2] 進來時，我們應該押 h3 或 h4
當 x[3] 進來時，我們應該押 h3, 
當 x[4] 進來時，我們應該押 h5
...
當 x[10] 進來時，我們應該押 h5


P(h|x)=P(x,h)/P(x)

P(x|h)=P(x,h)/P(h)

那麼在此範例中，P(x), P(h), P(x,h) 各為多少呢？

P(h) 可以直接根據最大商法則設定為平均分布，也就是 $$P(h1)=P(h2)=P(h3)=P(h4)=P(h5)=0.2$$

P(x) 可以直接根據最大商法則設定為平均分布，也就是 $$P(x) = P(x[1..n]) = 0.5^N_x(0) 0.5^N_x(1) = 0.5^n$$

$$P(x,h) = P(x[1..n], h) = p(h,x=0)^{N_x[0]} p(h,x=1)^{N_x[1]}$$

### 使用 EM 進行分群 (Clustering)

E-M是使用高斯分配(Gaussian Distribution，也就是常態分配)來描述該案例隸屬於某群集的機率密度，利用此機率函數來來取代剛性群集的距離函數

E 步驟：(期望) 計算似然函數，使用 x 相對於 z 的條件機率分布。

$$Q(\theta|\theta^{(t)}) = E_{Z|x,\theta^{(t)}}\left[ \log L (\theta;x,Z)  \right]$$


M 步驟：(最大化) 找出最佳化的參數

$$\theta^{(t+1)} =argmax \ Q(\theta|\theta^{(t)})$$

其中m是平均值，而s表示標準差。

$$F(q,\theta) =E_q [ \log L (\theta ; x,Z) ] + H(q) = -D_{\text{KL}}\big(q \big\|p_{Z|X}(\cdot|x;\theta ) \big) + \log L(\theta;x)$$

Then the steps in the EM algorithm may be viewed as:

Expectation step : Choose q to maximize F

$$q^{(t)} = argmax \ F(q,\theta^{(t)})$$


Maximization step : Choose θ to maximize F:

$$\theta^{(t+1)} = argmax \ F(q^{(t)},\theta)$$

### 參考文獻
* <http://en.wikipedia.org/wiki/Expectation-maximization_algorithm>
* <http://en.wikipedia.org/wiki/Baum-Welch_algorithm>
* <http://en.wikipedia.org/wiki/Inside-outside_algorithm>
* <http://blog.pluskid.org/?tag=clustering>
* <http://stats.stackexchange.com/questions/72774/numerical-example-to-understand-expectation-maximization>
* [Motion Segmentation using EM - a short tutorial (PDF)](http://www.cs.huji.ac.il/~yweiss/emTutorial.pdf)
* [What is the expectation maximization algorithm? (PDF)](http://ai.stanford.edu/~chuongdo/papers/em_tutorial.pdf) (讚！)
