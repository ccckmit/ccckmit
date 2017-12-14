# 編譯數學運算式為中間碼

檔案： parseExp2.js

```
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

var tempIdx = 0;
var getTemp=function() {
    return tempIdx++;
}
// E = T ([+-/*] E)*
function E() {
    var t = T();
    while (isNext("OP")) {
        var op = next("OP");
        var e = E();
        var result = getTemp();
        console.log(" T%d=T%d%sT%d", result, t, op, e);
        t = result;
    }
    return t;
}

// T = N | (E)
function T() {
    if (isNext("N")) {
        var t = getTemp();
        var number = next("N");
        console.log(" T%d=%d", t, number);
        return t;
    } else {
        next("(");
        var e = E();
        next(")");
        return e;
    }
}

var words="3+(5*4)-2";
c.log("%j", words);
E(words);
```

執行

```
NQU-192-168-60-101:js csienqu$ node parseExp2
"3+(5*4)-2"
tag=N word=3
 T0=3
tag=OP word=+
tag=( word=(
tag=N word=5
 T1=5
tag=OP word=*
tag=N word=4
 T2=4
 T3=T1*T2
tag=) word=)
tag=OP word=-
tag=N word=2
 T4=2
 T5=T3-T4
 T6=T0+T5

```
