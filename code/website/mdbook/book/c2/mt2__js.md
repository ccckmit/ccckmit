#英中互翻

**檔案： mt2.js**

```c
var log = console.log;

var dic = { dog:"狗", cat:"貓", a: "一隻", chase:"追", eat:"吃",
        "狗":"dog", "貓":"cat", "一隻":"a", "追":"chase", "吃":"eat" };

function mt(w) {
  var array = [];
  for (i in w) {
    var word = w[i];
    var toWord = dic[word];
    array.push(toWord);
  }
  return array;
}

var a = mt(process.argv.slice(2));
log(a);
```
**執行結果**

    nqu-192-168-61-142:code mac020$ node mt2.js a dog chase a cat
    [ '一隻', '狗', '追', '一隻', '貓' ]
    nqu-192-168-61-142:code mac020$ node mt2.js 一隻 狗 追 一隻 貓
    [ 'a', 'dog', 'chase', 'a', 'cat' ]
    nqu-192-168-61-142:code mac020$ node mt2.js 一隻 狗 chase  一隻 貓
    [ 'a', 'dog', '追', 'a', 'cat' ]
    nqu-192-168-61-142:code mac020$ node mt2.js 一隻 狗 咬  一隻 貓
    [ 'a', 'dog', undefined, 'a', 'cat' ]
