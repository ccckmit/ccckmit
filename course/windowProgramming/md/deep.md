# 深入 electron.js 

## 經驗教訓

以下 diff 比較下 mdeditor 的兩個版本，前一版用 fileHistoryMenu = new Menu() ，後一版用 html select，

* https://github.com/cccnqu/wp106a/commit/e58fea0ef9332c59fe2639c0efe2a1bec5367aed#diff-c9fa1dca5b693de06a574229518c9636

前一版比較漂亮順暢，但是卻會出錯，因為 Menu 屬於 Main Process ，從 renderer 呼叫後又回呼到 renderer 本身，這是行不通的！

以下是錯誤之所在

在 renderer 網頁中引入 editor.js 時，下列程式會造成錯誤：

```js
  fileHistoryMenu = new Menu()
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // fileHistoryMenu.popup(remote.getCurrentWindow())
    remote.app.fileHistoryMenu.popup(remote.getCurrentWindow())
  }, false)

// ...
    remote.app.fileHistoryMenu.append(
      new MenuItem(
        {
          label: fileName,
          click () {
            loadFile(fileName)
            E.viewHtml()
          }
        }
      )
    )
```

這是因為 Menu 是 Main Process 的元件，在 renderer 中使用 remote.app.fileHistoryMenu.append 之後又回呼 renderer，就會產生錯誤！

因為無法從 main (remote) 呼叫 renderer 而導致失敗！

因為 fileHistoryMenu 是 new Menu() 建立的，屬於 main (remote) process .

## 重要觀念

* [Deep dive into Electron’s main and renderer processes](https://medium.com/@ccnokes/deep-dive-into-electrons-main-and-renderer-processes-7a9599d5c9e2)

> The basic rule is: if a module is GUI or low-level system related, then it should be only available in the main process. 

> if you have a page with 2 webviews in it, you’ll have 3 renderer processes — one for the parent hosting the 2 webviews, and then one for each webview. 

![](https://cdn-images-1.medium.com/max/1000/1*-zqAENneDn62xAKmrPTqnA.png)

## 關於 remote

* https://github.com/electron/electron/blob/master/docs/api/remote.md

> The remote module provides a simple way to do inter-process communication (IPC) between the renderer process (web page) and the main process.

> In Electron, GUI-related modules (such as dialog, menu etc.) are only available in the main process, not in the renderer process. 

> In order to use them from the renderer process, the ipc module is necessary to send inter-process messages to the main process. 

> With the remote module, you can invoke methods of the main process object without explicitly sending inter-process messages

## Lifetime of Remote Objects

> Electron makes sure that as long as the remote object in the renderer process lives (in other words, has not been garbage collected), the corresponding object in the main process will not be released. When the remote object has been garbage collected, the corresponding object in the main process will be dereferenced.


## Passing callbacks to the main process

> Code in the main process can accept callbacks from the renderer - for instance the remote module - but you should be extremely careful when using this feature.