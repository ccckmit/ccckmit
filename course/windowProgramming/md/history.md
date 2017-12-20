# Electron.js 專案的歷史

[Cheng Zhao]:http://cheng.guru/

Electron.js 是 Github 所釋出的一套《網頁型桌面程式開發工具》，採用 javascript 語言，並且使用和 node.js 幾乎一樣的執行環境。

Electron.js 和 node.js 都是建構在 Google 所釋出的 JavaScript V8 立即編譯 (JIT) 引擎上的。

Electron.js 是從 [Node-webkit](https://github.com/nwjs/nw.js) 專案修改過來的，Node-webkit 專案的發起人是任職於 Intel 開源技術中心 (OTC) 的「王文睿」 (Roger Wang)，以下是位於 CSDN 上的一則專訪，說明了王文睿創建 node-webkit 時的想法。

* [【开源专访】Node-Webkit作者王文睿：桌面应用的全新开发方式](http://www.csdn.net/article/2014-01-08/2818066-Node-Webkit)

後來 github 的員工 [Cheng Zhao] 把 node-webkit 改寫之後成為 electron.js 初版。 (Cheng Zhao 曾經是 Intel 「王文睿」的 node-webkit 小組的實習生，對 node-webkit 相當熟悉，而且負責修改了很多程式)。

在介面部分， [Cheng Zhao] 把 node-webkit 中原本使用的 webkit 瀏覽器替換成 Google 的 Chromium ，因為 Chromium 比 webkit 更好用完整。

* [From node-webkit to Electron 1.0](http://cheng.guru/blog/2016/05/13/from-node-webkit-to-electron-1-0.html)


後來 Github 開發 Atom Editor 的小組想要使用像 node-webkit 這樣的平台來開發，於是 [Cheng Zhao] 連絡上 @nathansobo 並於結束 Intel 的實習生涯後加入了 github 公司。

[Cheng Zhao] 之所以離開 Intel 投入 github 的原因，除了職務層級的問題之外，主要是因為在 github 可以真正主導新版 node-webkit 專案的開發，不需要受制於上級。

[Cheng Zhao] 加入 github 的 Atom Editor 專案之後，創建了衍生自 node-webkit v0.3.6 版的 Atom Shell 專案，這個專案後來改名為 Electron 。

## 參考文獻
* [Cheng Zhao]
* [【开源专访】Node-Webkit作者王文睿：桌面应用的全新开发方式](http://www.codedata.com.tw/javascript/node-webkit-great-tool-for-gui)
