# K-Mean 分群演算法

* <http://ccckmit.wikidot.com/ai:kmeans>

## 簡介

K-Means 是 J. B. MacQueen 於1967年所提出的分群演算法，必須事前設定群集的數量 k，然後找尋下列公式的極大值，以達到分群的最佳化之目的。

$argmin \sum_{i=1}^{k} \sum_{\mathbf x_j \in S_i} \big\| \mathbf x_j - \boldsymbol\mu_i \big\|^2$

其中的 $\mu_i$ 是 Si 群體的平均。

## 演算法

* 1. 隨機指派群集中心：(圖一)
	* 在訓練組資料中「隨機」找出K筆紀錄來作為初始種子(初始群集的中心)
* 2. 產生初始群集：(圖二)
	* 計算每一筆紀錄到各個隨機種子之間的距離，然後比較該筆紀錄究竟離哪一個隨機種子最近，然後這筆紀錄就會被指派到最接近的那個群集中心，此時就會形成一個群集邊界，產生了初始群集的成員集合
* 3. 產生新的質量中心：(圖三)
	* 根據邊界內的每一個案例重新計算出該群集的質量中心，利用新的質量中心取代之前的隨機種子，來做為該群的中心

 
$S_i^{(t)} = \left\{ \mathbf x_j : \big\| \mathbf x_j - \mathbf m^{(t)}_i \big\| \leq \big\| \mathbf x_j - \mathbf m^{(t)}_{i^*} \big\| \text{ for all }i^*=1,\ldots,k \right\}$

* 4. 變動群集邊界：(圖四)
	* 指定完新的質量中心之後，再一次比較每一筆紀錄與新的群集中心之間的距離，然後根據距離，再度重新分配每一個案例所屬的群集

$\mathbf m^{(t+1)}_i = \frac{1}{|S^{(t)}_i|} \sum_{\mathbf x_j \in S^{(t)}_i} \mathbf x_j$

* 5. 持續反覆 3, 4 的步驟，一直執行到群集成員不再變動為止

[=image K-MeanEx1.jpg](=image K-MeanEx1.jpg.html)
= 圖一、隨機指派群集中心

[=image K-MeanEx2.jpg](=image K-MeanEx2.jpg.html)
= 圖二、產生初始群集

[=image K-MeanEx3.jpg](=image K-MeanEx3.jpg.html)
= 圖三、產生新的質量中心

[=image K-MeanEx4.jpg](=image K-MeanEx4.jpg.html)
= 圖四、變動群集邊界


## 參考文獻
* J. B. MacQueen (1967): "Some Methods for classification and Analysis of Multivariate Observations", Proceedings of 5-th Berkeley Symposium on Mathematical Statistics and Probability, Berkeley, University of California Press, 1:281-297
* J. A. Hartigan (1975) "Clustering Algorithms". Wiley.
* J. A. Hartigan and M. A. Wong (1979) "A K-Means Clustering Algorithm", Applied Statistics, Vol. 28, No. 1, p100-108.
* [http://www.stanford.edu/~darthur D. Arthur]，[http://www.stanford.edu/~sergeiv S. Vassilvitskii] (2006): "How Slow is the k-means Method?," Proceedings of the 2006 Symposium on Computational Geometry (SoCG).
* http://en.wikipedia.org/wiki/K-means_clustering
* http://zh.wikipedia.org/wiki/K平均演算法
* http://140.118.9.173/salo/data%20mining/Ch5 群集演算法.pdf
* 漫谈 Clustering (1): k-means -- http://blog.pluskid.org/?p=17
