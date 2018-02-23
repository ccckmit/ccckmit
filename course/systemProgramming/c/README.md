# C 語言

## 學習資源

* [菜鳥教程 C 語言入門](http://www.runoob.com/cprogramming/c-tutorial.html)

建議使用 gcc 開發工具，在 Linux 中預設就會有，在 Mac 中必須安裝 xcode command line tools，在 windows 中則可以安裝 mingw 或用 Dev C++ 之後，設定 path。

編輯器我目前使用 Visual Studio Code (vscode) 。

在 windows 與 mac 中要學習 Linux 系統程式設計，可以安裝虛擬機後再安裝 Ubuntu Linux，或者安裝 docker machine 亦可。

## 筆記

* auto -- https://stackoverflow.com/questions/2192547/where-is-the-c-auto-keyword-used
  * auto is a modifier like static. It defines the storage class of a variable. However, since the default for local variables is auto, you don't normally need to manually specify it.
* register -- https://stackoverflow.com/questions/578202/register-keyword-in-c
  * It's a hint to the compiler that the variable will be heavily used and that you recommend it be kept in a processor register if possible.