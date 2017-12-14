# 剖析小學數學測驗題的語法

檔案：

```
/* 語法
S = Q? NP* v? V v? NP* .
NP = (D d)? N

範例：
  小明 有 5 個 蘋果 ， 
  給 了 小華 3 個 蘋果 ， 
  請問 他 還 剩 幾 個 蘋果 ？
*/

var c = console;

var tagMap={
  N : ["小明", "小華", "小莉", "大雄", 
       "他", "你", "我", 
       "蘋果", "橘子", "柳丁", "番茄"],
  V : ["有", "給", "剩"],
  v : ["還", "又", "了"],
  D : ["幾", "這", "那", "5", "3"],
  d : ["個", "隻", "條"],
  Q : ["請問"],
  "." : ["，", "？", "。"]
};

var wi = 0;

function isTag(tag) {
  var tagWords=tagMap[tag];
  if (typeof tagWords === "undefined") 
    return false;
  else
    return (tagWords.indexOf(words[wi])>=0);
}

function next(tag) {
  c.log("tag="+tag+" word="+words[wi]);
  if (isTag(tag)) {
    return words[wi++];
  }
  throw Error("Error !");
}

function T() {
  while (wi < words.length) {
    S();
  }
}

// S=Q? NP? v? V v? NP* .
function S() {
  if (isTag("Q"))  next("Q");
  while (!isTag("V")&&!isTag("v")) {
    NP();
  }
  if (isTag("v"))  next("v");
  next("V");
  if (isTag("v"))  next("v");
  while (!isTag(".")) {
    NP();
  }
  next(".");
}

// NP = (D d)? N
function NP() {
  if (isTag("D")) {
    next("D");
    next("d");
  }
  next("N");
}

var words="小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？".split(" ");
c.log("%j", words);
T(words);
```

執行結果：

```
nqu-192-168-61-142:jscode mac020$ node parseMath
["小明","有","5","個","蘋果","，","給","了","小華","3","個","蘋果","，","請問","他","還","剩","幾","個","蘋果","？"]
tag=N word=小明
tag=V word=有
tag=D word=5
tag=d word=個
tag=N word=蘋果
tag=. word=，
tag=V word=給
tag=v word=了
tag=N word=小華
tag=D word=3
tag=d word=個
tag=N word=蘋果
tag=. word=，
tag=Q word=請問
tag=N word=他
tag=v word=還
tag=V word=剩
tag=D word=幾
tag=d word=個
tag=N word=蘋果
tag=. word=？
nqu-192-168-61-142:jscode mac020$ 

```