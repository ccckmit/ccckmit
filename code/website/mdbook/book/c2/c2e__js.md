#習題：中翻英系統

這題和 [英翻中系統](mt__js.md) 有個差別，因為中文的詞彙間沒有空白，因此要查詢詞彙需要一些技巧。

由於中文詞彙通常在四個字以下，所以可以嘗試從 4 字，3 字，2 字，1 字 這樣一直查下來，查到就進行翻譯動作。

這種方法隱含了長詞優先規則。

用法範例：

    $ node c2e.js 一隻狗追一隻貓

    a dog chase a cat

###解答 1： c2e.js

```javascript
var log = console.log;

var dic = { "狗":"dog", "貓":"cat", "一隻":"a", "追":"chase", "吃":"eat" };

function mt(s) {
  var array = [];
  for (var i=0; i<s.length; i++) {
    for (var len=4; len>0; len--) {
      var str = s.substr(i, len);
      var toWord = dic[str];
      if (typeof toWord !== "undefined") {
        array.push(toWord);
        break;
      }
    }
  }
  return array;
}

var a = mt(process.argv[2]);
log(a);
```

上面版本會列出所有詞的翻譯，但有可能重疊，所以我又改成了下列版本:

###解答 2： c2e2.js

```javascript
var log = console.log;

var dic = { "狗":"dog", "貓":"cat", "一隻":"a", "追":"chase", "吃":"eat" };

function mt(s) {
  var array = [];
  for (var i=0; i<s.length; ) {
    for (var len=4; len>0; len--) {
      var str = s.substr(i, len);
      var toWord = dic[str];
      if (typeof toWord !== "undefined") {
        array.push(toWord);
        break;
      }
    }
    i=i+Math.max(1,len);
  }
  return array
}

var a = mt(process.argv[2]);
log(a);
```