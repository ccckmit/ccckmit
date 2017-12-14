# 貓狗世界的英文 -- 自然語言理解

閱讀: [自動產生英文語句](genen.md)

輸入貓狗世界隨機產生的一個語句，請你寫一個程式推論出是誰被吃了，還有是誰吃了誰。

或者是誰在追誰？

範例：

```
node understand.js a dog chase a cat
貓被追
狗追了貓


node understand.js a dog eat the cat
貓被吃
狗吃了貓
```

解答： 

```javascript
var e2c={dog:"狗", cat:"貓"};

function understand(s) {
  var c1 = e2c[s[1]], c4=e2c[s[4]];
  if (s[2] === "eat") {
    console.log("%s 被吃了", c4);
    console.log("%s 吃了 %s", c1, c4);
    return;
  } else if (s[2] === "chase") {
    console.log("%s 被追了", c4);
    console.log("%s 追了 %s", c1, c4);
    return;
  } 
}

understand(process.argv.slice(2));
```

執行結果

```
NQU-192-168-60-101:ccc csienqu$ node understand.js a dog chase a cat
貓 被追了
狗 追了 貓
NQU-192-168-60-101:ccc csienqu$ node understand.js a dog eat a cat
貓 被吃了
狗 吃了 貓
```

解答2： 


```javascript
var e2c={dog:"狗", cat:"貓", eat:"吃", chase:"追", a:"一隻"};

function find(s, from, words) {
  for (var i=from; i<s.length; i++) {
    if (words.indexOf(s[i]) >=0)
      return i;
  }
  return -1;
}

function understand(s) {
  var vi = find(s, 0, ["eat", "chase"]);
  var si = find(s, 0, ["dog", "cat"]);
  var oi = find(s, vi, ["dog", "cat"]);
  console.log("s=%s v=%s o=%s", e2c[s[si]], e2c[s[vi]], e2c[s[oi]]);
}

understand(process.argv.slice(2));
```

執行結果

```
nqu-192-168-61-142:code mac020$ node understand2.js a dog chase a cat
s=狗 v=追 o=貓

```