# 翻譯小學數學測驗題

檔案： mtMath.js

```javascript
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
}

var mtMap = {
  "小明":"ShaoMin", "小華":"ShaoHua", "小莉":"ShaoLi", "大雄":"DaShon", 
  "他":"he", "你":"you", "我":"me", 
  "蘋果":"apple", "橘子":"tangerine", "柳丁":"orange", "番茄":"tomato",
  "有":"have", "給":"give", "剩":"own",
  "還":"still", "又":"and", "了":"_",
  "個":"_", "隻":"_", "條":"_",
  "幾":"n?", "這":"this", "那":"that", 
  "請問":"Q", "？":"_."
}

var wi = 0;
var mtWords=[];

function isTag(tag) {
  var tagWords=tagMap[tag];
  if (typeof tagWords === "undefined") 
    return false;
  else
    return (tagWords.indexOf(words[wi])>=0);
}

function mt(w) {
  var wt = mtMap[w];
  if (typeof wt === 'undefined')
    return w;
  else
    return wt;
}

function next(tag) {
//  c.log("tag="+tag+" word="+words[wi]);
  var w = words[wi];
  if (isTag(tag)) {
    mtWords.push(mt(w));
    wi++;
    return w;
  } else {
    console.log("w=", w, "tag", tag); 
    throw Error("Error !");    
  }
}

function T() {
  while (wi < words.length) {
    S();
  }
}

// S=Q? NP* v? V v? NP* .
function S() {
  if (isTag("Q")) next("Q");
    
  while (!isTag("V") && !isTag("v")) {
    NP();
  }
  if (isTag("v")) next("v");    
    next("V");
  if (isTag("v")) next("v");    
  while (!isTag(".")) {
    NP();
  }
  next(".");
}

// NP = D d N
function NP() {
  if (isTag("D")) {
    next("D");
    next("d");
  }
  next("N");
}

var words="小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？".split(" ");
c.log("中文：", words.join(" "));
T(words);
c.log("英文：", mtWords.join(" "));
```

執行結果

```
NQU-192-168-60-101:js csienqu$ node mtMath1
中文： 小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
英文： ShaoMin have 5 _ apple ， give _ ShaoHua 3 _ apple ， Q he still own n? _ apple _.

```
