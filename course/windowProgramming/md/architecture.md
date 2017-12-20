# Electron.js 的架構

## 程式結構

Electron 使用瀏覽器當視覺化介面，每個專案都會有一個主程式 （通常是 main.js)，和一些網頁檔案 (像是以下的 index.html) ，

```
your-app/
├── package.json
├── main.js
└── index.html
```

[01-hello/a]:https://github.com/cccnqu/wp106a/tree/master/example/01-hello/a

您可以觀察一下最簡單的 [01-hello/a] 專案的結構，就會逐漸理解 electron.js 的設計理念了！

## 執行架構

通常 Electron.js 可以分為兩類『行程』，分別是 Main Process 與 Renderer Process ， 其扮演角色與功能如下：

1. Main Process (例如上面的 main.js) :  這是真正的主程式，主行程，一個 Main Process 可能會啟動很多個網頁。
2. Renderer Process (例如上面的 index.html) : 那些被啟動的網頁都屬於 Renderer Process。

我們必須在 package.json 當中描述到底哪個程式是啟動時要執行的主程式 (Main Process)，然後在主程式裏再用 BrowserWindow() 呼叫去開出一些網頁 （Renderer Process） 作為介面。

請再仔細看一下 [01-hello/a] 專案，以便理解這樣的執行架構！

## 補充

一般的網頁通常會被限制在『沙箱』（Sandbox) 架構底下，不能直接做『存擋或呼叫作業系統』等動作，但 electron 中類似網頁的頁面，並不受限於『沙箱』架構，因而可以直接透過 javascript 進行『存擋或呼叫 electron.js 的專屬 API』，甚至也可以呼叫 dll 或作業系統的功能等等。

這是 electron.js 和一般網站最大的不同點！

## 參考文獻

* https://electron.atom.io/docs/tutorial/quick-start/

