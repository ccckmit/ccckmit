# 樣版引擎

網站的 server 端為了要把『網頁＋資料』融合呈現出來，通常會使用『樣版引擎』。

如果要在前端融合呈現，樣版引擎也可以放在前端的瀏覽器內，由 javascript 呼叫。

因此有許多 javascript 的樣版引擎被開發出來，像是 swig, pug (jade), ejs, mustache, handlebar.js 等等。

以下是幾個樣板的範例：

1 - EJS

```
<% if (user) { %>
    <h2><%= user.name %></h2>
<% } %>
```

2 - PUG

```
doctype html
html(lang="en")
  head
    title= pageTitle
    script(type='text/javascript').
      if (foo) bar(1 + 5)
  body
    h1 Pug - node template engine
    #container.col
      if youAreUsingPug
        p You are amazing
      else
        p Get on it!
      p.
        Pug is a terse and simple templating language with a
        strong focus on performance and powerful features.
```

甚至你也可以自己用『正規表達式』很快地寫一個樣版引擎：

檔案：miniTemplateTest.js

```javascript
var templateEngine = function (template, obj) {
  return template.replace(/\{\{(.*?)\}\}/gmi, function (match, p1) {
    if (p1 != null) return eval('obj.'+p1)
  })
}

var template = '<p>Hello, my name is {{name}}. I\'m {{profile.age}} years old.</p>'

console.log(templateEngine(template, {
  name: "ccc",
  profile: { age: 43 }
}))
```

測試:

```
結果：
=========================================
$ node miniTemplateTest.js
<p>Hello, my name is ccc. I'm 43 years old.</p>
```

但是在 ECMA Script 6 (ES6) 提出了『模板字符串』（template string）之後，我們其實可以用『模板字符串』來取代樣版引擎，只是通常不能直接在『模板字符串』內寫程式，而是要採用『子樣板=>樣板=>母樣板』這樣的順序逐步建立樣板，而不能在像很多樣版引擎一樣，直接內崁程式在裡面就是了。

以下是一個『模板字符串』的範例：

檔案： es6template.js

```javascript
var name = 'ccc'
var profile = { age: 43 }

console.log(`<p>Hello, my name is ${name}. I'm ${profile.age} years old.</p>`)
```

執行：

```
bash-3.2$ node es6template.js
<p>Hello, my name is ccc. I'm 43 years old.</p>
```

更多關於 ES6 『模板字符串』的訊息，請參考下列文章：

* <http://es6.ruanyifeng.com/#docs/string#模板字符串>

## 『模板字符串』結合 koa@2 的簡易留言板

* 專案： <https://github.com/ccckmit/road2koa/tree/master/07-blogEs6>
    * 第一版 -- <https://github.com/ccckmit/road2koa/blob/master/07-blogEs6/app.js>
    * 再簡化 -- <https://github.com/ccckmit/road2koa/blob/master/07-blogEs6/app2.js>

