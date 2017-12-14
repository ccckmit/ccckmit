# 隱馬可夫模型

在「馬可夫鏈」這一章中，我們已經介紹過「馬可夫模型」的概念。

然而，對於某個機率現象而言，往往不是所有的隨機變數都可觀察到，我們通常只能觀察到部分的隨機變數，也就是系統當中有某些不可觀察的隱含變數。於是我們必須假設有某些不可觀察的隨機變數 Z 的存在。

隱馬可夫模型 (Hidden Markov Model，HMM) 是用來描述具有隱含變數的隨機過程模型，此模型在人工智慧的許多子領域有很強的應用。

在正常的馬可夫模型中，狀態對於觀察者來說是直接可見的。這樣狀態的轉換概率便是全部的參數。而在隱馬可夫模型中,狀態並不是直接可見的，但受狀態影響的某些變數則是可見的。每一個狀態在可能輸出的符號上都有一概率分佈。因此輸出符號的序列能夠透露出狀態序列的一些資訊。

下圖顯示了 HMM 模型的概念，其中的 X 是隱含變數，Y 是可觀察變數，a 是轉換機率 (transition probabilities)，b 是輸出概率 (output probabilities)。

![](hmm1.jpg)

如果將狀態轉換與輸出區分開來，上圖的連線可以進一步詳細區分為輸出線與轉換線，形成下列模型。

![](hmm2.jpg)

如果以時間順序為觀察重點，則 HMM 模型可以用下列圖形表示。其中隱含變數  ![](../timg/837c9f1adf5d.jpg)  是決定狀態的關鍵，影響了輸出變數  ![](../timg/95be3b202f70.jpg)  與下一個狀態  ![](../timg/ffd39f7b6d8a.jpg) 。

![](hmm3.jpg)

對於 HMM 模型而言，有三個重要的問題，都有對應的演算法可用。

1. 針對已知的模型，計算某一特定輸出序列的概率：可使用 Forward Algorithm 或 Backward Algorithm 解決.
2. 針對已知的模型，尋找最可能的能產生某一特定輸出序列的隱含狀態的序列：可以使用 Viterbi Algorithm 解決.
3. 針對某輸出序列，尋找最可能的狀態轉移以及輸出概率：通常使用最大可能性法則 (Maximum Likelihood) 的演算法，像是 Baum-Welch algorithm (又稱為 Forward-backward Algorithm) 解決，此種演算法是 EM 演算法的一種特例。


## 參考文獻

* [維基百科:隱馬爾可夫模型](http://zh.wikipedia.org/zh-tw/%E9%9A%90%E9%A9%AC%E5%B0%94%E5%8F%AF%E5%A4%AB%E6%A8%A1%E5%9E%8B)
* [Wikipedia:Hidden Markov model](http://en.wikipedia.org/wiki/Hidden_Markov_model)
* <http://www.shokhirev.com/nikolai/abc/alg/hmm/hmm.html>
