# Git 版本控制

## 版本管理 -- git

* ProGit 電子書 -- https://git-scm.com/book/zh-tw/v1 (讚！)
* [初心者 Git 上手攻略](https://www.slideshare.net/lkiral/git-34157836) (讚！)
* [寫給大家的 Git 教學](https://www.slideshare.net/littlebtc/git-5528339)
* [連猴子都能懂的Git入門指南| 貝格樂（Backlog）](https://backlogtool.com/git-tutorial/tw/)
* [Git由超淺入超深](https://www.slideshare.net/lambmei/git-44632221)

## 使用 git 時光機

```
  69  git clone https://github.com/cccnqu/otrak.git
  70  cd otrak
  71  ls
  72  npm install
  73  mocha
  74  git checkout 5fca86d
  75  mocha
  76  git checkout master
  77  mocha
  78  git checkout 5fca86d
  79  mocha
  80  git checkout master
  81  mocha
```

## git 歷史

RCS => CVS => SVN => Git

* http://learngitbranching.js.org/
* [Visual Studio Toolbox: Git Fundamentals](https://blogs.msdn.microsoft.com/robertgreen/2017/08/01/visual-studio-toolbox-git-fundamentals/)
* [Git 工作流程](http://www.ruanyifeng.com/blog/2015/12/git-workflow.html)

## ProGit 閱讀筆記

* [2.3 Git 基礎 - 檢視提交的歷史記錄](https://git-scm.com/book/zh-tw/v1/Git-%E5%9F%BA%E7%A4%8E-%E6%AA%A2%E8%A6%96%E6%8F%90%E4%BA%A4%E7%9A%84%E6%AD%B7%E5%8F%B2%E8%A8%98%E9%8C%84)

## 教學影片

* ["Don'ts" In VCS](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/5758085530923) (在版本管理系統中別做甚麼事？)
* [Two Main Types Of VCS](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/5758085540923)
* [GIT Workflow](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/5758085570923)
* [GIT Demo: Intro To Git](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/6433687490923)
* [GIT Demo: Github](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/6433687510923)
* [GIT Recap: Local Repositories](https://classroom.udacity.com/courses/ud805/lessons/3666138591/concepts/5758085600923)

## 筆記

如何移除 github 的 ssh 設定

https://stackoverflow.com/questions/11067818/how-do-you-reset-the-stored-credentials-in-git-credential-osxkeychain


From Terminal:

```
 $ git credential-osxkeychain erase
 host=github.com
 protocol=https
 <press return>
```

## 參考文獻

* [為你自己學 Git](http://gitbook.tw/)