# 測試

## 單元測試

* [【單元測試】改變了我程式設計的思維方式](http://www.codedata.com.tw/java/unit-test-four-dimensions)
* [【單元測試】的四面向](http://www.codedata.com.tw/java/unit-test-four-dimensions)

## TDD/BDD 測試驅動開發

先寫測試案例，然後才寫被測試模組與函數。

## Mocha -- 單元測試框架

* https://mochajs.org/
* 前端的 mocha 測試 -- http://callmenick.com/post/basic-front-end-testing-with-mocha-chai
* [阮一峰:测试框架 Mocha 实例教程](http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html)
## Chai -- TDD, BDD 的檢查器

* http://chaijs.com/

## SuperTest -- 前端測試框架

* https://github.com/visionmedia/supertest
* [Koa and supertest example](https://gist.github.com/yamalight/370306d4027d70dcf29650be9db30f91)

## istanbul -- 涵蓋度測試

* https://istanbul.js.org/
  * https://github.com/istanbuljs/nyc (the Istanbul command line interface)
  * https://istanbul.js.org/docs/tutorials/mocha/ (說明如何用 nyc + mocha 進行涵蓋度測試)

## debug -- 印除錯訊息與執行時間

* https://github.com/visionmedia/debug

## 測試爬蟲

講很多和測試有關的 Node.js 書： [Node.js 实战心得](http://wiki.jikexueyuan.com/project/node-lessons/)

* superagent : http://visionmedia.github.io/superagent/
    * 操控爬蟲
* cheerio : https://github.com/cheeriojs/cheerio
    * Node.js 版的 jquery，可抓取網頁內欄位。

## 無顯示瀏覽器 (headless browser) 

* http://phantomjs.org/
    * [浏览器端测试：mocha，chai，phantomjs](http://wiki.jikexueyuan.com/project/node-lessons/mocha-chai-phantomjs.html)
* https://github.com/GoogleChrome/puppeteer
    * [Automating Google Chrome with Node.js](https://tutorialzine.com/2017/08/automating-google-chrome-with-node-js]
    * [Puppeteer初探--爬取并生成《ES6标准入门》PDF](https://segmentfault.com/a/1190000010736797)
    * [Puppeteer再探--自动把SF文章推荐到掘金](https://segmentfault.com/a/1190000010813724)

Puppeteer 的功能

* Generate screenshots and PDFs of pages.
* Crawl a SPA and generate pre-rendered content (i.e. "SSR").
* Scrape content from websites.
* Automate form submission, UI testing, keyboard input, etc.
* Create an up-to-date, automated testing environment. Run your tests directly in the latest version of Chrome using the latest JavaScript and browser features.
* Capture a timeline trace of your site to help diagnose performance issues.

## Benchmark (花費時間報告，速度比較)

* https://github.com/bestiejs/benchmark.js
* http://jsperf.com/ (分享 benchmark)

## CI 持續整合

* https://travis-ci.org/
* [持续集成平台：travis](http://wiki.jikexueyuan.com/project/node-lessons/travis.html)

## PC 端測試

* https://baike.baidu.com/item/QTP
* https://learngeb-ebook.readbook.tw/intro/selenium.html

## 手機 APP 測試

* http://appium.io/
  * [Appium (1)：App 測試自動化框架](https://medium.com/@kentchen_tw/appium-1-app-%E6%B8%AC%E8%A9%A6%E8%87%AA%E5%8B%95%E5%8C%96%E6%A1%86%E6%9E%B6-c929d8f7a439)
