## 使用 EM 演算法進行分群 - GMM (Gaussian mixture model) 

### 使用 R 產生 3 群高斯樣本，然後混合起來

```r
> x1=rnorm(1000, mean=10, sd=2)
> y1=rnorm(1000, mean=10, sd=2)
> x2=rnorm(1000, mean=2, sd=1)
> y2=rnorm(1000, mean=2, sd=1)
> x3=rnorm(1000, mean=10, sd=2)
> y3=rnorm(1000, mean=0, sd=1)
> plot(c(x1,x2,x3), c(y1,y2,y3))
```

顯示結果

![](../img/gmm_data_plot.jpg)

### EM 演算法的程式



### 參考文獻

* [GMM：高斯混合模型](http://www.cs.nccu.edu.tw/~whliao/acv2008/08gmm.pdf)
* [漫谈 Clustering (3): Gaussian Mixture Model](http://blog.pluskid.org/?p=39)

