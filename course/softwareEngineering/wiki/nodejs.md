# Node.js 

## 典型做法 (boilerplate)

* [A boilerplate for Node.js web applications](https://github.com/sahat/hackathon-starter) (讚！）

## 投影片

* [用JavaScript 實踐《軟體工程》的那些事兒！](https://www.slideshare.net/ccckmit/javascript-73015924)
* [用十分鐘瞭解JavaScript的模組 -- 《還有關於npm套件管理的那些事情》](https://www.slideshare.net/ccckmit/javascript-npm)
* [用十分鐘瞭解 《JavaScript的程式世界》](https://www.slideshare.net/ccckmit/javascript-65883956)

## Node.js 基礎

* 以登入功能為例 -- userManager.login(id, password)
    * 使用者進入登入畫面
    * 使用者輸入帳號密碼
    * UI 將帳號密碼傳給《使用者管理員》
    * 《使用者管理員》檢查帳號密碼是否正確
    * 《使用者管理員》傳回檢查結果
    * 檢查成功，UI 導入系統進入畫面，若失敗 (帳號密碼不對)，則提示重新輸入。(三次錯誤則拒絕登入)


## 除錯

* node-inspector : https://github.com/node-inspector/node-inspector
* require('debug')(<type>) -- https://www.npmjs.com/package/debug
* visual studio code -- debug 

## 語法檢查

* standard.js -- https://github.com/standard/standard
    * https://standardjs.com/rules.html

## 測試 Test

* https://macacajs.com/ -- 用户端软件的测试解决方案
  * [Macaca Electron 驱动开发实录](https://cnodejs.org/topic/572c6ee4afd3b34a17ff409d)
  * https://github.com/meowtec/macaca-electron-test-sample-weibo/blob/master/test/weibo.test.js

### 基礎測試

* Test
    * Mocha : https://mochajs.org/
    * TDD, BDD : http://chaijs.com/
    * AVA : https://github.com/avajs/ava
    * Jasmine : https://github.com/jasmine/jasmine

### Electron 桌面網頁型視窗程式測試

* Spectron : https://github.com/electron/spectron

### web server 測試

* supertest : 可測試 server 的回傳內容是否正確
  * https://github.com/visionmedia/supertest
  * http://book.apebook.org/minghe/koa-action/test/supertest.html
* cheerio : 可用 jquery style 的方式處理字串
  * https://github.com/cheeriojs/cheerio

### 瀏覽器測試 (headless browser)

* PhantomJS : http://phantomjs.org/
* selenium : http://www.seleniumhq.org/
* Puppeteer : https://github.com/GoogleChrome/puppeteer
  * Headless Chrome : https://developers.google.com/web/updates/2017/04/headless-chrome
  * 優點：使用 async/await

### 覆蓋測試

* https://coveralls.io/

### LoadTest

* https://github.com/alexfernandez/loadtest

### 自行撰寫測試程式

https://github.com/mikolalysenko/ndarray-experiments/blob/master/experiment.js

### 使用系統測試功能

[Easy profiling for Node.js Applications](https://nodejs.org/en/docs/guides/simple-profiling/)

[Node.js 性能调优之CPU篇(一)——perf+火焰图](https://zhuanlan.zhihu.com/p/27147421) 

[Performance testing our NodeJS API](https://raygun.com/blog/performance-testing-nodejs-api/)

以下參數目前似乎只有 linux 能用！

```
$ node --perf_basic_prof <file> 
```

### Test-Case Generator

* https://github.com/niteshpsit/test-generator
    * Test Cases Generator For RESTful APIS or node apis , token or cookies based
* [How can I dynamically generate test cases in javascript/node?](https://stackoverflow.com/questions/22465431/how-can-i-dynamically-generate-test-cases-in-javascript-node)

### 持續整合

* Jenkins : https://jenkins.io/
* TravisCI : https://travis-ci.org/ 

### 偽裝 Mock

* Mock :
    * http://sinonjs.org/
    * [Sinon指南: 使用Mocks, Spies 和 Stubs编写JavaScript测试](http://zcfy.cc/article/sinon-tutorial-javascript-testing-with-mocks-spies-stubs-422.html)


## 專案建置 Build

Gulp : concat, minify, uglify, sass=>css,
Grunt
Webpack
Make

## 部署代碼

* https://github.com/voxpupuli/puppet-nodejs

## 監控代碼 (Code Monitor)

* https://github.com/remy/nodemon
    * Monitor for any changes in your node.js application and automatically restart the server - perfect for development
* https://github.com/mikeal/watch
    * watch -- Utilities for watching file trees in node.js

## 問題跟蹤 (Bug Tracker)

* https://github.com/wachunga/omega

