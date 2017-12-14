# 習題：《狼、羊、甘藍菜》過河的問題

題目:有一個人帶著一匹狼、一頭羊和一棵甘藍菜打算過河到對岸去。他的船很小, 每次只能載兩個東西:

也就是 【人 + 狼】 【人 + 羊】, 或【人 + 甘藍菜】。

困難的地方是, 如果他先載了甘藍菜過去, 狼就會趁機把羊吃掉了。而如果他先把狼送過去, 羊也會趁他離開時把甘藍菜吃掉。 

請問：他應該怎麼樣做才能夠把這二種動物和甘藍菜都送到對岸呢? 請找出運送順序！

程式：請寫一個程式搜尋出這個問題的解答！


## 解答

檔案： shipSearch.js

```
var c = console;
var objs = ["人", "狼", "羊", "菜"];
var state= [   0,  0 ,   0,    0 ];

function neighbors(s) {
    var side = s[0];
    var next = [];
    checkAdd(next, move(s,0));
    for (var i=1; i<s.length; i++) {
        if (s[i]===side)
          checkAdd(next, move(s, i));
    }
    return next;
}

function checkAdd(next, s) {
    if (!isDead(s)) {
        next.push(s);
    }
}

function isDead(s) {
    if (s[1]===s[2] && s[1]!==s[0]) return true; // 狼吃羊
    if (s[2]===s[3] && s[2]!==s[0]) return true; // 羊吃菜
    return false;
}

// 人帶著 obj 移到另一邊
function move(s, obj) {
    var newS = s.slice(0); // 複製一份陣列
    var side = s[0];
    var anotherSide = (side===0)?1:0;
    newS[0] = anotherSide;
    newS[obj] = anotherSide;
    return newS; 
}

var visitedMap = {};

function visited(s) {
    var str = s.join('');
    return (typeof visitedMap[str] !== 'undefined');
}

function isSuccess(s) {
    for (var i=0; i<s.length; i++) {
      if (s[i]===0) return false;        
    }
    return true;
}

function state2str(s) {
    var str = "";
    for (var i=0; i<s.length; i++) {
        str += objs[i]+s[i]+" ";
    }
    return str;
}

var path = [];

function printPath(path) {
    for (var i=0; i<path.length; i++)
      c.log(state2str(path[i]));
}

function dfs(s) {
  if (visited(s)) return;
  path.push(s);
//  c.log('visit:', state2str(s));
  if (isSuccess(s)) {
      c.log("success!");
      printPath(path);
      return;
  }
  visitedMap[s.join('')] = true;
  var neighborsList = neighbors(s); 
  for (var i in neighborsList) { 
    dfs(neighborsList[i]);
  }
  path.pop();
}

dfs(state); 
```

執行結果

```
NQU-192-168-60-101:search csienqu$ node shipSearch
success!
人0 狼0 羊0 菜0 
人1 狼0 羊1 菜0 
人0 狼0 羊1 菜0 
人1 狼1 羊1 菜0 
人0 狼1 羊0 菜0 
人1 狼1 羊0 菜1 
人0 狼1 羊0 菜1 
人1 狼1 羊1 菜1 
```


