# Vue.js 基礎

* [Vue js /Ajax / Axios 範例使用紀錄](https://medium.com/@Kumaheika/vue-js-ajax-%E7%AF%84%E4%BE%8B%E4%BD%BF%E7%94%A8%E7%B4%80%E9%8C%84-8eecdba4b9e3)
  * https://github.com/Kumaheika/project_002_FoodMap

## 起手式

```js
var vue = new Vue ({
  el: '#app', //網頁最外層的 id，所有 vue 操控的部分，皆要寫在裡面
  data: {
    //網頁用到的資料都放在這
  },
  created: function () {
    // 網頁載入完成，先執行的 function 內容寫在這(像 jQ 的 .ready())
  },
  methods: {
    //各種要用的 function 寫在這
  },
  computed: {
    //計算屬性，好用，但此範例沒用到 XDD
  }
});
```

