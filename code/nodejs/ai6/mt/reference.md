# 機器翻譯參考文獻

目前看來 recurrent.js 最容易，先從 recurrent.js 改起！


  var forwardLSTM = function(G, model, hidden_sizes, x, prev) {
      ...
    // one decoder to outputs at end
    var output = G.add(G.mul(model['Whd'], hidden[hidden.length - 1]),model['bd']);

    // return cell memory, hidden representation and output
    return {'h':hidden, 'c':cell, 'o' : output};
  }

  傳回的 hidden[hidden.length-1] 就是隱層的狀態，可以拿來用！
  output 是輸出，但 cell 是甚麼？


## 簡介


[Hacker's guide to Neural Networks](http://karpathy.github.io/neuralnets/)

[Neural Networks, Manifolds, and Topology](http://colah.github.io/posts/2014-03-NN-Manifolds-Topology/)

[神经机器翻译（NMT）相关资料整理](http://www.cnblogs.com/zhbzz2007/p/6276712.html)

## 用 RNN 做翻譯

[The Unreasonable Effectiveness of Recurrent Neural Networks](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)

[Deep Learning, NLP, and Representations](http://colah.github.io/posts/2014-07-NLP-RNNs-Representations/)

[Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/)

經典論文： [Learning Phrase Representations using RNN Encoder–Decoder
for Statistical Machine Translation](https://arxiv.org/pdf/1406.1078v1.pdf) , Cho et al.

[Minimal character-level language model with a Vanilla Recurrent Neural Network, in Python/numpy](https://gist.github.com/karpathy/d4dee566867f8291f086)

想辦法把上面的程式改為 JavaScript

[Machine Learning is Fun Part 5: Language Translation with Deep Learning and the Magic of Sequences](https://medium.com/@ageitgey/machine-learning-is-fun-part-5-language-translation-with-deep-learning-and-the-magic-of-sequences-2ace0acca0aa)

[机器学习原来这么有趣！第五章：Google 翻译背后的黑科技：神经网络和序列到序列学习](https://zhuanlan.zhihu.com/p/24590838)

[Google’s Neural Machine Translation System: Bridging the Gap
between Human and Machine Translation](https://arxiv.org/pdf/1609.08144.pdf)

[Understanding LSTM Networks](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) , colah's blog

[Tensorflow 官方 Sequence-to -Sequence Models 學習](http://cyruschiu.github.io/2017/02/24/learning-Tensoflow-Seq2Seq-for-translate/)

[TensorFlow Models](https://github.com/tensorflow/models)

RNN 會根據距離指數下降的遺忘事情，但是 LSTM 透過長期記憶來解決這個問題。

[Attention and Augmented Recurrent Neural Networks](http://distill.pub/2016/augmented-rnns/)


[http://distill.pub/](http://distill.pub/)

PyTorch : [Translation with a Sequence to Sequence Network and Attention](http://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html)

[Torch implementation of seq2seq machine translation with GRU RNN and attention](https://github.com/spro/torch-seq2seq-attention)

[神经网络机器翻译Neural Machine Translation(2): Attention Mechanism](http://blog.csdn.net/u011414416/article/details/51057789)

[注意力机制（Attention Mechanism）在自然语言处理中的应用](http://blog.csdn.net/jdbc/article/details/52948351) (讚！)

[机器翻译核心技术 分类：神经网络机器翻译](http://www.jiqifanyi.cn/category/neural-machine-translation/)

[Neural Machine Translation Advised by Statistical Machine Translation](http://www.jiqifanyi.cn/2016/12/14/neural-machine-translation-advised-by-statistical-machine-translation/)

神经机器翻译流利但有时翻译不准，统计机器翻译准确但不够流利，两者各有优劣。

## 用 CNN 做機器翻譯

[A novel approach to neural machine translation](https://code.facebook.com/posts/1978007565818999/a-novel-approach-to-neural-machine-translation/)

[Facebook AI Research Sequence-to-Sequence Toolkit](https://github.com/facebookresearch/fairseq)

[Convolutional Sequence to Sequence Learning](https://arxiv.org/abs/1705.03122)

[Why Convolutional Neural Networks are a Great Architecture for Machine Translation](https://medium.com/ai-society/why-convolutional-neural-networks-are-a-great-architecture-for-machine-translation-9258ca1263a8)

[A CONVOLUTIONAL ENCODER MODEL FOR NEURAL MACHINE TRANSLATION](https://michaelauli.github.io/papers/convenc.pdf)

[Conv Nets: A Modular Perspective](http://colah.github.io/posts/2014-07-Conv-Nets-Modular/)