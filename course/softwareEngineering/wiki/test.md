# 測試

* [約耳測試: 邁向高品質的12個步驟](http://chinesetrad.joelonsoftware.com/Articles/TheJoelTest.html)

## 錯誤的類型

IEEE 的定義

1. Failure : Observable incorrect behavior
2. Fault : Incorrect code
3. Error : Cause of a fault


## 測試的層次

單元測試 => 整合測試 => 系統測試

Unit test=> Integration test => System Test

單一模組 => 很多模組合起來 => 整個系統

# Verification

## 4 verification approach

1. Testing
    * 對某些輸入測試一遍！
    * 優點 (pros) No false positive, 缺點 (cons) Incomplete
2. Static verification
    * 對所有可能的輸入都測試一遍！
    * 優點 (pros) Consider all program behavior, 缺點 (cons) Generate false positives
3. Inspection
    * 人工檢查, Review, Walk through
    * 優點 (pros) Systematic, Thorough, 缺點 (cons) Informal, subjective (主觀)
4. Formal proof of correctness
    * 數學證明
    * 優點 (pros) Strong garantees, 缺點 (cons) Complex, expensive
    * [形式化驗證 (Formal Verification)](https://hackmd.io/s/H1xxp3pF0)

Bill Gates : 50% of my company employs are tester, and the rest spends 50% of their time testing.

Goodenouth & Gerhert : A test is successful if program fails

## Testing type

## 分類方法 - Granuality

1. Unit Testing
2. Integration Testing
3. System Testing

## 分類方法 - Functional

1. Functional Testing
2. Non-functional Testing
    * Relyability
    * Usability
    * Maintainability
    * X-ability

## 分類方法 - 全部

1. Acceptance Testing
    * 驗收測試
2. Regression Testing
    * 回歸測試：每次修改程式碼後，重複執行既有的全部或部分的相同測試。

## Alpha & Beta Testing

https://classroom.udacity.com/courses/ud805/lessons/1778878537/concepts/4450985580923

1. Developer Testing : 開發者測試
2. Alpha Testing : 內部測試
3. Beta Testing : 先期使用者測試 (封測) ！
4. Release : 正式上線使用

## 黑箱測試 v.s. 白箱測試

1. 黑箱測試 (Black-Box Testing)
    * 沒有看程式碼！
2. 白箱測試 (White-Box Testing)
    * 有看程式碼！
    * Executing the faulty statement is a necessary condition for revealing a fault.



## Systematic Approach

1. Functional Specification
    * add(int a, int b)
    * excel
2. Independent Testable Feature
3. Relevant Inputs
    * How long will it take to test add(int a, int b)
    * Random Testing
    * Partition Testing (Sparse part, Dense part) `(ex: split(str, size), size>=<0, len>=<size)`
    * Error tend to occor at the boundary of a sub domain (ex: -1, 0, MAX_INT, ....)
4. Test-Case Specification
    * Category-Partition Method
    * Model-based testing - 1. Finite State Machine 2. Decision Table ....
5. Test-Cases

## Category-Partition Method

* 1. Identify independently testable feature
* 2. Identify categories : 
    * split(str, size) , str.length, content, size.value
* 3. Partition categories into choices : 
    * length: 0, size-1, ... size: 
    * size: `>=<0`
* 4. Identify constraints among choices
    * eliminate meaningless combinations
    * reduce the number of test cases
    * Three types: property ... IF, ERROR, SINGLE
* 5. Produce/Evaluate test case specifications
    * can be automated
    * product test frames
* 6. Generate test cases from test case specifications
    * TSL generator
    * grep


實際案例： [ud805:Category Partition Demo](https://classroom.udacity.com/courses/ud805/lessons/3626359166/concepts/4353285510923)

# 常見錯誤

https://classroom.udacity.com/courses/ud805/lessons/1719379003/concepts/5470286680923

## 代價

分析 => 設計 => 實作 => 上線

bug 越晚發現代價愈高，分析錯誤代價最高 (幾何成長)。

設計修改 change 代價愈前期愈高，分析錯誤的代價比測試錯誤更高。

## 人員問題 People

1. 英雄主義 Heroics
2. 不良工作環境 Working environment
3. 不良人員管理 People management

## 流程問題 Process

1. 時程問題 Schedule：過度樂觀
2. 計畫因素 Planning : 計畫不符、被迫放棄或更改 ....

## 產品問題 Product

1. 金盤子問題：計畫需求 >>> 實際需求 (設計太多用不到的功能，系統過度膨脹)
2. 研究 v.s 產品

## 技術問題 Technology

1. 銀彈問題 Silver bullet：過度相信神奇科技
2. 在執行中期加入新工具 Switching Tool
3. 缺乏版本管理系統 No version control

## 參考文獻

[維基百科:回歸測試](https://zh.wikipedia.org/wiki/%E5%9B%9E%E5%BD%92%E6%B5%8B%E8%AF%95)

[科科和測試:回歸測試 (Regression Testing)](https://kkboxsqa.wordpress.com/2014/02/27/%E5%9B%9E%E6%AD%B8%E6%B8%AC%E8%A9%A6-regression-testing/)


