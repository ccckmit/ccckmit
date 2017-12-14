# Browserify 的範例

```
$ npm install -g browserify
$ browserify unique.js -o web/unique.js
```

web/unique.js 將會是瀏覽器可以直接引用的檔案！

若要讓某個模組可以在瀏覽器內全域使用，應該使用全域變數引用該模組！

例如： 我想讓 marked 可以在瀏覽器內被使用，可以寫下列程式：

檔案： markedMain.js

```js
marked = require('marked')
```

然後用下列指令：

```
$ browserify markedMain.js -o web/marked.js
```

接著在 HTML 內用下列語法引入：

```html
<script src="web/marked.js">

```

