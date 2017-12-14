# 剖析數學運算式

檔案： parseExp.js

```javascript
/* 語法
E = T ([+-/*] E)*
T = N | (E)

範例：3+(5*4)-2
*/

var c = console;

var tagMap={
  N : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  OP: ["+", "-", "*", "-"]
};

var wi = 0;

function isNext(tag) {
    if (words[wi] === tag) return true;
    var tagWords=tagMap[tag];
    if (typeof tagWords === "undefined") 
        return false;
    else
        return (tagWords.indexOf(words[wi])>=0);
}

function next(tag) {
     c.log("tag="+tag+" word="+words[wi]);
    if (isNext(tag)) {
      return words[wi++];
    }
    throw Error("Error !");
}

// E = T ([+-/*] E)*
function E() {
    T();
    while (isNext("OP")) {
        next("OP");
        E();        
    }
}

// T = N | (E)
function T() {
    if (isNext("N")) {
        next("N");
    } else {
        next("(");
        E();
        next(")");
    }
}

var words="3+(5*4)-2";
c.log("%j", words);
E(words);
```

執行

```
NQU-192-168-60-101:js csienqu$ node parseExp
"3+(5*4)-2"
tag=N word=3
tag=OP word=+
tag=( word=(
tag=N word=5
tag=OP word=*
tag=N word=4
tag=) word=)
tag=OP word=-
tag=N word=2

```

