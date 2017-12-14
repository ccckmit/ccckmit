# 第 6 章 - Koa 伺服端框架

## static server

檔案： koaStatic.js

```js
const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve('.'));

app.listen(3000);

console.log('listening on port 3000');
```

在該檔案的資料夾下放入 hello.html 如下

```
<html>
<body>
hello, 妳好！
<a href="http://tw.yahoo.com">yahoo!</a>
</body>
</html>

```

執行： 

```
$ node koaStatic.js
listening on port 3000
```

然後在瀏覽器中檢視 http://localhost:3000/hello.html 你會看到該檔案。

## introduction

在 Node.js 當中，目前最常被使用的 server 端框架應該是 Express.js ，但是我最喜歡的是 Koa.js 。

Express.js 是比較早出來的 Node.js 伺服端框架，因此使用者比較多，但是自從 JavaScript 新標準 ECMAScript 6.0 出來之後，提出了新的 yield/Generator 語法，於是 Express.js 的創建者決定運用這種語法創造一個新的框架替代 Express.js ，這個新框架就是 Koa.js 。

所以、Koa 基本上就是支援 yield/Generator/async/await 語法的 Express.js ，但是由於 Koa 是 2015 年才出現的框架，因此還是有很多人持續使用著 Express.js 。

要學習 Koa 框架，最好的辦法就是直接去看 Koa 官方專案的範例，透過範例來學習 Koa 框架我認為是最快的方式。

Koa 的官方網站上有十幾個經典範例，您可以從下列網址查看這些範例。

* <https://github.com/koajs/examples/>

如果想了解 koa2 的 async/await 到底是怎麼實做出來的，可以參考下列文章：

* [callback, promise, fetch, yield, async/await 發展簡易介紹](https://noootown.wordpress.com/2016/11/13/callback-promise-fetch-yield-async-await/)
* [ES next中async/await proposal实现原理是什么？](https://www.zhihu.com/question/39571954)
* [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
* [理解 Javascript 的 async await](http://3dobe.com/archives/252/)
* 標準： [Async Functions](https://tc39.github.io/ecmascript-asyncawait/)

## Koa@2

Koa@2 支援了 async/await 的 ES2017 語法，現在應該也有不少人開始採用了，想使用請參考下列文章：

* [「新手向」koa2从起步到填坑](http://www.jianshu.com/p/6b816c609669)
* [创建koa2工程](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001471087582981d6c0ea265bf241b59a04fa6f61d767f6000)

Learn Koa2 from examples of f6 prject. 

* [Koa2 f6 project](https://github.com/ccckmit/f6)

## 習題

1. 請用 koa 寫一個靜態檔案伺服器 (參考 koaStream.js 範例)
2. Koa 官網中 koa-blog 範例的資料由於儲存在記憶體中，因此電腦一旦關機之後，資料就會消失。因此請您修改該專案，改將資料儲存在 mongodb 當中，這樣資料就可以永久儲存了！

## reference
* [Koa 1 舊版](koa1.md)
