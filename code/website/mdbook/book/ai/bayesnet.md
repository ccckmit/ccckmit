# 貝氏網路 (Bayesian Network)

貝氏網路是用來描述機率因果關係的網路，對於一個已知的貝氏網路 (Bayesian Network)，其中的某個樣本 $$(x_1, ..., x_n)$$  的機率可以用下列算式表示

$$P(x_1, ..., x_n) = \prod_{i=1}^{n} P(x_i | parent(X_i))$$

貝氏網路也可以被視為某種隱馬可夫模型，其中某些節點是可觀察節點 (X)，某些節點是隱含節點 (Z) ，我們可以透過蒙地卡羅馬可夫算法計算某個分布 $$P(x_1, ..., x_n)$$ 的機率值。

## 參考文獻

* [A Brief Introduction to Graphical Models and Bayesian Networks](http://www.cs.ubc.ca/~murphyk/Bayes/bnintro.html)
* [A brief introduction to Bayes' Rule](http://www.cs.ubc.ca/~murphyk/Bayes/bayesrule.html)
* <http://www.cs.ubc.ca/~murphyk/Software/BNT/Talks/BNT_mathworks.ppt>


