# 筆記

## 整套做法

* 軟體開發： 版本管理 + 測試驅動開發（TDD/BDD)
  * Node.js : git + 測試套件 (mocha + chai)
  * Node.js 網站： git + 伺服框架 (express) + e2e 測試 (puppeteer) + 打包發行 (webpack/gulp) + CSS 樣版 (bootstrap)
  * Vue.js 網站： （承上） + vue.js + vuex  = Vue.js 全家桶
  * Vuetify 樣版 : 建構在 Vue.js 全家桶上 （Vuetify.com 是很好的整合範例）
  * Nuxt.js 網站： 將 Vue.js 全家桶整合，打包後可將前端放在 CDN。 