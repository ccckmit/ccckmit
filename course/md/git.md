# git

## git 架站

* 展示 :  <https://rawgit.com/cccnqu/ccc/master/pub.html#main.md>
* 特定版本：  <https://cdn.rawgit.com/cccnqu/ccc/0ed60ef/pub.html#main.md>
* 經由：  <https://rawgit.com/>

## 安裝

Windows : 在 Windows 系統安裝 Git 相當地容易。 msysGit專案已提供相當容易安裝的程序。 只要從GitHub網頁下載安裝程式並執行即可：

* http://msysgit.github.com/

Mac : 有兩種很容易將Git安裝到Mac的方法。 最簡單的是使用圖形化界面的Git安裝程式，可從SourceForge下載

* http://sourceforge.net/projects/git-osx-installer/

在 windows 打開 git bash 之後，就可以採用 UNIX/Linux 形式的指令進行操作。

## 基本用法

範例

```
$ git clone https://github.com/cccnqu/wp106a.git
$ cd wp106a
... 編輯其中的檔案，或加入一堆檔案 ...
$ git add -A
$ git commit -m "modify directory structure"
$ git push origin master
```

這樣，您就完成了 clone 一個專案，修改後在上傳回 github 的動作了。

## 設定使用者

若您是使用自己專用的電腦，可以先設定《使用者資訊》，以下是範例：

```
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

更詳細的設定內容請參考： [ProGit: 1.5 開始 - 初次設定Git](https://git-scm.com/book/zh-tw/v1/%E9%96%8B%E5%A7%8B-%E5%88%9D%E6%AC%A1%E8%A8%AD%E5%AE%9AGit)

## github releases

你可以設定釋出某些版本，只要在 <user>/<repo>/releases 的網址上按幾下，填個資料就行了。

* https://github.com/ccckmit/bookApp/releases

## 參考書籍

* [ProGit 中文版](https://git-scm.com/book/zh-tw/v1)

