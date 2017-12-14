# 前端網頁

前端的網頁技術，主要是結合 HTML/CSS/JavaScript 三者的技術，這三種技術也是前端工程師必備的知識。

除了用 HTML 呈現，用 CSS 排版，然後用 JavaScript 操控顯示之外， JavaScript 還得負責與後端的 server 進行通訊，以便將使用者輸入的訊息傳給 server ，或者接收由 server 傳來的訊息以顯示新的畫面資訊 (這些畫面資訊主要還是 HTML 、圖片與 Canvas 畫布中的圖形)。

Server 由於可以存取檔案與資料庫，因此可以不斷提供訊息給瀏覽器，不需要一次就將所有訊息往瀏覽器丟，只要在使用者想要該資訊時才提供出來就可以了。

## 前端網頁的框架

jQuery / Angular.js / React.js / Vue.js 等等都是前端網頁的常用框架。

在此我們將只原生 JavaScript (有人戲稱為 Vanilla.js) 與 jQuery 等兩種，因為我也沒有學過 Angular.js / React.js / Vue.js 這些進階的框架。

## jQuery 前端查詢操控者

| 教學 | 主題  | 影片  |
|--------|-----|------|
| 範例 | [jQuery 查詢節點範例](jquery_example.md)  |  |
| 外部 | jQuery入門教程超清HD 1—What is jQuery 中文 | [影片](https://www.youtube.com/watch?v=3ycso7P9rCw&list=PL4PF5uRyx54KUcyLSgrVU28mjRcuXzvih) |
| 專案 | [井字遊戲](ox.md)  |  |
| 挑戰 | 人與電腦對戰井字遊戲 |  |
| 專案 | [五子棋](gomoku.md)  |  |
| 習題 | 為五子棋加上輸贏判斷 |  |
| 挑戰 | [人與電腦對戰五子棋](gomoku_ai.md) |  |
| 專案 | [英文單字測驗系統](/code/js/elearn/elearn.html)  |  |
| 專案 | [線上英翻中系統](/mt/mt.html) |  |

## 原生 JavaScript

在 [Vanilla.js](http://vanilla-js.com/) 網站上，開了一個玩笑，創造出一個空無一物的套件，關於這件事情可以參考 [《精通VanillaJS》](http://www.ithome.com.tw/voice/106182) 一文。

上述我用 jQuery 寫的那些應用，其實改用《原生 JavaScript》也都可以輕易地做出來，因此使用 jQuery 只是讓語法更短一點，不過由於《原生 JavaScript》一直在進步，所以也短不了多少了。

因此我現在通常改用《[Vanilla.js](http://vanilla-js.com/) + [PureCSS](http://purecss.io/) 樣板》取代之前使用的《[jQuery](https://jquery.com/) + [Bootstrap](http://getbootstrap.com/)》之組合，感覺比較不會那麼擁腫。


