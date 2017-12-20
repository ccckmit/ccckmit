# 軟體工程簡介

* [約耳測試: 邁向高品質的12個步驟](http://chinesetrad.joelonsoftware.com/Articles/TheJoelTest.html)

## 起源

一個人：

想 => 寫 => 測

* 想 = 分析
* 寫 = 實作
* 測 = 測試

很多人： ???

* A: 想 => 寫 => 測
* B: 想 => 寫 => 測
* C: 想 => 寫 => 測
* C: 想 => 寫 => 測

想得不一樣怎麼處理？

加入客戶 :

(客戶) 需求 => (開發者) 分析 => 實作 => 測試 => (客戶)  上線

## 流程

分析 => 設計 => 實作 => 測試 => 上線

Model => Requirement => Analysis => Implementation => Testing => Release

更詳細： RUP, XP, Scrum 

## Life Cycle

1. [瀑布模式](https://en.wikipedia.org/wiki/Waterfall_model)
2. [螺旋迭代開發](https://zh.wikipedia.org/wiki/%E8%9E%BA%E6%97%8B%E6%A8%A1%E5%9E%8B)

## 為何需要軟體工程？

1 程式寫不下去了

為何寫不下去？

程式碼開始變亂 ...

程式人甚麼時候會開始思考《架構的問題》 ....
我的經驗是：當你發現程式開始變亂而且寫不下去的時候 ....

(軟體工程始終來自於錯亂 ....)

軟體重構 ， 架構師 ...

2 想不清楚該怎麼開始？

專題： .... 

你知道第一步應該做甚麼嗎

其他組員的第一步應該做甚麼呢？

3 一直在做重複的事情

debug, debug, debug, ....

4 你卡我，我卡你 

程式碼覆蓋、版本管理、你沒做出來我就不能呼叫 ....


## 軟體工程門派

傳統： 
1. 非物件導向 => 結構化分析

最近：

1. UML/RUP
    * Use-Case => Class => Sequence => ....
2. 敏捷 agile (TDD)
    * XP
    * Scrum
3. github flow: 以 git/github 為核心的《開放原始碼》開發方式
    * 大教堂與市集
    * fork/pull request
    * brench => test => merge => ....
4. DevOps : Development 和 Operations 的組合詞

## 主題

1. 需求
2. UML
3. Database : 正規化 vs 文件導向

## 工具

1. IDE : Visual Studio, Eclipse, Visual Studio Code, ....
2. Version Control : git/github, ....
3. Test : TDD:mocha, CI/Jenkins+Travis CI, ...

## 可維護/可擴充

1. 架構 Architecture
2. 重構 Refactor
3. 設計模式 Design Pattern

## 未包含

1. 研究類 : 軟體工程不處理研發中技術。
2. 學習類 : 請學會技術之後再開始開發，以降低風險。 (或採用熟悉的技術)

## 個案：作業系統

[Linux 0.0.1]:https://github.com/joeangel/linux-0.0.1
[Linux]:https://github.com/torvalds/linux
[MINIX]:http://www.minix3.org/

* 微軟 Window : 大教堂模式
    * 傳統模式：大版本長周期，以年為單位。
    * 正規軍： 100 人團體
    * 沿革： Win 1.0 => 2.0 => 3.0 => 3.1 => 95 => 98 => 2000 => XP => Vista => 7 => 8 => 10
* 開源 Linux : 市集模式
    * 敏捷模式：小版本短周期，以日為單位。
    * 特種部隊： Linus Torvalds + 十幾個常貢獻的夥伴。
    * 沿革：MINUX => [Linux 0.0.1] => ..... => [Linux]

## 個案：科學計算

* Matlab :
* Python : 
* R : 
* j6 : 

小開發嘗試： probability.js + statistics.js + vector.js + chart.js + ....

