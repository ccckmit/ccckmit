# 神經網路基礎原理

梯度到底是甚麼？

問題：只能調整一單位距離，走哪個方向下降最快？

f(x,y) => f(x+dx, y+dy)

$$\sqrt{dx^2+dy^2} = df$$

df 很小且固定 (例如 0.0001) 的情況下

請問 dx , dy 應該各是多少，才能讓 f(x,y)-f(x+dx, y+dy) 最大！

答案是往梯度方向調整！

梯度是曲面的切平面上，下降最快的坡面！

(請注意，上述梯度的一單位距離不是坡面的距離，而是 x,y 平面的距離)

範例：

假如 f(x,y) = 3x ，那麼梯度為 (3, 0) ，所以應該往 (-1, 0) 方向調整。(才會下降最快)

假如 f(x,y) = 3x+2y ，那麼梯度為 (3, 2) ，所以應該往 (-3, -2) 的方向調整。

假如 f(x,y) = xy ，那麼梯度為 (y, x) ，假如目前在 (1, 4) 

那麼梯度為 (4, 1) ，所以應該往 (-4, -1) 的方向調整。


[Hacker's guide to Neural Networks](http://karpathy.github.io/neuralnets/)

[the data science blog](https://ujjwalkarn.me/blog/)
[A Quick Introduction to Neural Networks](https://ujjwalkarn.me/2016/08/09/quick-intro-neural-networks/)
[Machine Learning & Deep Learning Tutorials](https://github.com/ujjwalkarn/Machine-Learning-Tutorials/blob/master/README.md)

這裡有很棒的《深度學習》好文章阿！

http://colah.github.io/

https://christopherolah.wordpress.com/


## 書

http://neuralnetworksanddeeplearning.com/

http://www.deeplearningbook.org/


## 梯度下降

[Optimization Method -- Gradient Descent & AdaGrad](http://cpmarkchang.logdown.com/posts/275500-optimization-method-adagrad)

[SGD，Adagrad，Adadelta，Adam等优化方法总结和比较](http://ycszen.github.io/2016/08/24/SGD%EF%BC%8CAdagrad%EF%BC%8CAdadelta%EF%BC%8CAdam%E7%AD%89%E4%BC%98%E5%8C%96%E6%96%B9%E6%B3%95%E6%80%BB%E7%BB%93%E5%92%8C%E6%AF%94%E8%BE%83/)

## 捲積神經網路

[An Intuitive Explanation of Convolutional Neural Networks](https://ujjwalkarn.me/2016/08/11/intuitive-explanation-convnets/)

-- 目前看到 figure 15

[捲積神经网络的直观解释](http://blog.csdn.net/qq_31780525/article/details/71435620)

[深度學習的捲積神經網路 -- (使用JavaScript / node.js實作)](https://www.slideshare.net/ccckmit/javascript-nodejs)

## 循環神經網路

[Recurrent Neural Networks Tutorial, Part 1 – Introduction to RNNs](http://www.wildml.com/2015/09/recurrent-neural-networks-tutorial-part-1-introduction-to-rnns/)

[Recurrent Neural Networks Tutorial, Part 2 – Implementing a RNN with Python, Numpy and Theano](http://www.wildml.com/2015/09/recurrent-neural-networks-tutorial-part-2-implementing-a-language-model-rnn-with-python-numpy-and-theano/)

[Recurrent Neural Networks Tutorial, Part 3 – Backpropagation Through Time and Vanishing Gradients](http://www.wildml.com/2015/10/recurrent-neural-networks-tutorial-part-3-backpropagation-through-time-and-vanishing-gradients/)

[Recurrent Neural Network Tutorial, Part 4 – Implementing a GRU/LSTM RNN with Python and Theano](http://www.wildml.com/2015/10/recurrent-neural-network-tutorial-part-4-implementing-a-grulstm-rnn-with-python-and-theano/)

https://github.com/dennybritz/rnn-tutorial-rnnlm/

[Recurrent Neural Network系列1--RNN（循环神经网络）概述](http://www.cnblogs.com/zhbzz2007/p/6257247.html)

[Recurrent Neural Network系列2--利用Python，Theano实现RNN](http://www.cnblogs.com/zhbzz2007/p/6291652.html

[Recurrent Neural Network系列3--理解RNN的BPTT算法和梯度消失](http://www.cnblogs.com/zhbzz2007/p/6339346.html)


```
def bptt(self, x, y):
    T = len(y)
    # Perform forward propagation
    o, s = self.forward_propagation(x)
    # We accumulate the gradients in these variables
    dLdU = np.zeros(self.U.shape)
    dLdV = np.zeros(self.V.shape)
    dLdW = np.zeros(self.W.shape)
    delta_o = o
    delta_o[np.arange(len(y)), y] -= 1.
    # For each output backwards...
    for t in np.arange(T)[::-1]:
        dLdV += np.outer(delta_o[t], s[t].T)
        # Initial delta calculation: dL/dz
        delta_t = self.V.T.dot(delta_o[t]) * (1 - (s[t] ** 2))
        # Backpropagation through time (for at most self.bptt_truncate steps)
        for bptt_step in np.arange(max(0, t-self.bptt_truncate), t+1)[::-1]:
            # print "Backpropagation step t=%d bptt step=%d " % (t, bptt_step)
            # Add to gradients at each previous step
            dLdW += np.outer(delta_t, s[bptt_step-1])              
            dLdU[:,x[bptt_step]] += delta_t
            # Update delta for next step dL/dz at t-1
            delta_t = self.W.T.dot(delta_t) * (1 - s[bptt_step-1] ** 2)
    return [dLdU, dLdV, dLdW]
```


[Recurrent Neural Network系列4--利用Python，Theano实现GRU或LSTM](http://www.cnblogs.com/zhbzz2007/p/6647405.html)

[Recurrent.js](https://github.com/karpathy/recurrentjs/blob/master/src/recurrent.js)