# 統一軟體開發過程(Unified Software Process, UP)

是 Rational Unified Process 的新版。

強調 Component Based, 企圖和 UML 完全整合！

Use-case model = A set of use-cases

Risk focused

## Major characteristics: 

1. Use-Case Driven : defined the function
2. Architecture-Centric： defined the form
3. Iterative and Incremental： Each cycle results in a product release.

## Four phases

1. Inception (初始階段) : 為系統建立商業案例並確定項目的邊界
2. Elaboration (細化階段) : 分析問題領域，編製項目計劃，淘汰項目中最高風險的元素。
3. Conception (構造階段) : 所有構件和應用程式功能被開發並集成為產品 (Beta release)。
4. Transition (交付階段) : 產品測試+用戶反饋的少量的調整。(確保可用)
    * 確定這一輪有那些問題，學到了甚麼經驗，準備下一輪的新版本。


Inception: 1. Actor&StackHolder? 2. Architecture&Prototype? 3. Plan&Cost&Risk?

## Core Workflows

過程工作流 (Process Workflow)  (以 Use-case 驅動，以 Architecture 為核心)

1. 商業建模(Business Modeling)
2. 需求(Requirements)
3. 分析和設計(Analysis & Design)
4. 實現(Implementation)
5. 測試(Test)
6. 部署(Deployment)

支持工作流 (Supporting Workflows) (日常開發事務)

1. 配置和變更管理(Configuration & Change Management)
2. 項目管理(Project Management)
3. 環境(Environment)

參考： [統一軟體開發過程](http://wiki.mbalib.com/zh-tw/%E7%BB%9F%E4%B8%80%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E8%BF%87%E7%A8%8B)

## Iteration

每個 Iteration 都做

1. Identify relevant use-cases
2. Create Design (Architecture + Class + Component + Sequence)
3. Implement the design
4. Verify code against use-cases
5. Release a product

好處

1. Give developers early feedback
2. Minimize risk of developing wrong system
3. Accomodate evoloving requirement

## 參考文獻
* [Unified Process (UP)](https://www.techopedia.com/definition/3885/unified-process-up)
* [Unified Process](https://en.wikipedia.org/wiki/Unified_Process)
* [統一軟體開發過程](http://wiki.mbalib.com/zh-tw/%E7%BB%9F%E4%B8%80%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E8%BF%87%E7%A8%8B)
* [Rational Unified Process Best Practices for Software Development Teams (PDF)](https://www.ibm.com/developerworks/rational/library/content/03July/1000/1251/1251_bestpractices_TP026B.pdf)
* [搞笑談軟工:還少一本書：The Unified Software Development Process](http://teddy-chen-tw.blogspot.tw/2011/02/unified-software-development-process.html)
* [Rational Unified Process Core Workflows(http://blog.softelegance.com/tag/rational-unified-process-core-workflows/)