# Git 的合作方法

## 個人工作模式

master => branch (modify) => master

## Github Flow

* [Git Flow 是什麼？為什麼需要這種東西？](http://gitbook.tw/chapters/gitflow/why-need-git-flow.html)
* [使用 Git Flow](http://gitbook.tw/chapters/gitflow/using-git-flow.html)

參考： https://github.com/ituring/fizzbuzz/pulls

1. Fork 想參與的專案 p 為 pf
2. 將 pf clone 到本地資料夾 df
3. 對 df.master 創建特性分支 df.develop
4. 在 pf 創建 pf.develop 
5. 對 df.develop 修改測試後 push 回 pf
    * 需要幫助或意見時創建 pull request, 以 pull request 進行交流
    * 參考 https://github.com/ituring/fizzbuzz/pull/1
6. 審查確認正確後併入 master 發佈


