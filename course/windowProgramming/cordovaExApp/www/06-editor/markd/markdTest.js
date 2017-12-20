var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

console.log(marked(`
# 陳鍾誠的課程

欄位       |  內容
----------|----------------------------
課程名稱   | 視窗程式設計 (使用 electron.js)
開課單位   | 金門大學資訊工程系
開課年度   | 106 年上學期
學員姓名   | 
教師姓名   | 陳鍾誠
上課教材   | [wiki](https://github.com/cccnqu/wp106a/wiki)
程式範例   | [example](example)
練習作業   | [exercise](exercise)
專案作品   | [project](project)
學習筆記   | [wiki](../../wiki)
疑問解答   | [issue](https://github.com/cccnqu/wp106a/issues)


I am using __markdown__.
`));