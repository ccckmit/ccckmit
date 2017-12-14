# 聯合分布

## 聯合密度函數

定義：離散聯合密度函數

> 表示符號： $$P_{XY}(x,y) = P[X=x, Y=y]$$
> 
> 必要條件：
> 
> 1. $$P_{XY}(x,y) \ge 0$$ ;
> 
> 2. $$\sum_{\forall x} \sum_{\forall y} P_{XY}(x,y) = 1$$ ;


定義 2：連續聯合密度函數

> 表示符號： $$P_{XY}(x,y)$$ (範圍：$$-\infty < x < \infty;-\infty < y < \infty;$$)
> 
> 必要條件：
> 
> 1. $$P_{XY}(x,y) \ge 0$$ ;
> 
> 2. $$\int_{-\infty}^{\infty} \int_{-\infty}^{\infty}  P_{XY}(x,y) dy dx = 1$$ ;
> 
> 3. $$P[a \le X \le b, c \le Y \le d,] = \int_{a}^{b} \int_{c}^{d}  P_{XY}(x,y) dy dx$$ ;

## 邊際密度函數

定義：離散邊際密度函數

> 1. 只有 X 的情況： $$P_{X}(x) = \sum_{\forall y} P_{XY}(x,y)$$
> 2. 只有 Y 的情況： $$P_{Y}(y) = \sum_{\forall x} P_{XY}(x,y)$$

定義：連續邊際密度函數

> 1. 只有 X 的情況： $$P_{X}(x) = \int_{-\infty}^{\infty} P_{XY}(x,y) dy$$
> 2. 只有 Y 的情況： $$P_{Y}(y) = \int_{-\infty}^{\infty} P_{XY}(x,y) dx$$

## 聯合分配的期望值

定義：聯合分配的期望值 E[H(X,Y)]

> 1. 離散的情況： $$E[H(X,Y)]=\sum_{\forall x} \sum_{\forall y} H(x,y) P_{XY}(x,y)$$
> 
> 2. 連續的情況： $$E[H(X,Y)]=\int_{-\infty}^{\infty} \int_{-\infty}^{\infty} H(x,y) P_{XY}(x,y) dy dx$$

定義：聯合分配中單一變數的期望值

> 1. 離散： $$E[X] = \sum_{\forall x} \sum_{\forall y} x P_{XY}(x,y) = \sum_{\forall x} x P_{X}(x) $$
> 
> 2. 離散： $$E[Y] = \sum_{\forall y} \sum_{\forall x} y P_{XY}(x,y) = \sum_{\forall y} \sum_{\forall y} y P_{Y}(y)$$
> 
> 3. 連續： $$E[X] = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} x P_{XY}(x,y) dy dx= \int_{-\infty}^{\infty} x P_{X}(x) dx$$
> 
> 4. 連續： $$E[Y] = \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} y P_{XY}(x,y) dy dx = \int_{-\infty}^{\infty} y P_{Y}(y) dy$$


## 共變異數 (Covariance, 協方差)

定義：共變異數 Cov(X,Y)
 
> $$\sigma_{XY} = Cov(X, Y) = E[(X - \mu_X)(Y - \mu_Y)]$$

定理：共變異數與期望值之關係

> $$Cov(X, Y) = E[X Y] - E[X] E[Y]$$

定理：相互獨立時的期望值

> 如果 X, Y 相互獨立 ，則 E[X Y] = E[X] E[Y] 。

## 相關係數 (Correlation)

定義：

> 相關係數 $$Cor(X,Y) = \rho_{X Y}$$
> 
> $$Cor(X,Y) =  \rho_{X Y} = \frac{Cov(X,Y)}{\sqrt{Var(X) Var(Y)}}$$


定理：

> $$-1 \le \rho_{XY} \le 1$$

定理：

> $$|\rho_{X Y}| = 1 \Leftrightarrow y = \beta_0 + \beta_1 X$$

實作：相關係數的R 程式

```R
> x = sample(1:10, 10)
> x
 [1]  1  8 10  5  3  7  9  4  2  6
> cor(x, x+1)
[1] 1
> cor(x, -x)
[1] -1
> cor(x, 0.5*x)
[1] 1
> cor(x, 0.5*x+1)
[1] 1
> cor(x, -0.5*x+1)
[1] -1
> y=sample(1:100, 10)
> y
 [1]  4 53 20 68 29 74 17 49 78 62
> cor(x,y)
[1] -0.06586336
> 
```

## 多變數聯合分布的情況

### 聯合分布與條件機率

> 定義：如果 X,Y 滿足下列條件，則稱 X, Y 兩者之間獨立：
> 
> $$P_{XY}(x,y) = P_{X}(x) P_{Y}(y)$$


### 多個變數的貝氏定理

> 1. $$P(A,B|C) = P(C|A,B) * \frac{P(A,B)}{P(C)}$$ ;
> 
> 2. $$P(A|B,C) = P(B,C|A) * \frac{P(A)}{P(B,C)}$$ ;
> 
> 3. $$P(A,B|C,D) = P(C,D|A,B) * \frac{P(A,B)}{P(C,D)}$$ ;

其他情況可以類推，只要能正確改寫 A , B 為任何隨機變數序列都行。

### 條件獨立與貝氏定理

假如 A 與 B 在給定 C 的情況下條件獨立，那麼以下算式成立：

> $$P(A,B|C) = P(A|C) * P(B|C) = P(C|A)* P(C|B)*\frac{P(A) P(B)}{P(C)^2}$$

## 結語

兩個位於樣本空間 S 的聯合隨機行為，會導致樣本空間變成其迪卡兒乘積 S×S，其樣本空間大小變成 $$|S|^2$$ 。

而 k 個位於樣本空間 S 的聯合隨機行為，會導致樣本空間變成其迪卡兒乘積 S×S×...×S ，其樣本空間大小變成 $$|S|^n$$ 。

如果兩個位於不同樣本空間 $$(S_X, S_Y)$$ 的聯合隨機行為，則會導致樣本空間變成 $$S_X \times S_Y$$ ，其樣本空間大小變為 $$|S_X| |S_Y|$$ 。

此時 X, Y 的機率密度函數將會採用以下的「邊際機率密度函數」之算法，以便將聯合樣本空間 $$(S_X, S_Y)$$  中的機率與單一樣本空間 $$S_X$$ 或 $$S_Y$$ 中的機率關聯起來。

> $$P(X=x) = P(x, *) = \sum_{y \in S_Y} P(x,y)$$ 
> 
> $$P(Y=y) = P(*, y) = \sum_{x \in S_X} P(x,y)$$ 

最後我們必須強調的是，樣本空間的選擇並沒有一定的標準，您可以視問題的需要來定義樣本空間，通常我們會盡量利用獨立的特性，讓樣本空間越小越好，否則將會很難計算。

