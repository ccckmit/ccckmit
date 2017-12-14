## 實作：布林邏輯的推論引擎

### 程式碼：推理引擎

```javascript
檔案：kb.js (Knowledge Base 的簡寫)

var log = console.log;

var kb = function() {
  this.rules = [];
  this.facts = {};
  this.dict  = {};
}

var kbp = kb.prototype;

kbp.load = function(code) {
  var lines = code.split(/[\.]+ ?/);
  log("%j", lines);
  for (var i in lines) {
    if (lines[i].trim().length > 0)
      this.addRule(lines[i]);
  }
}
  
kbp.isFact=function(term) {
  if (term.length == 0)
    return true;
  return this.facts[term];
}

kbp.check = function(rule) {
  for (var i in rule.terms) {
    var term = rule.terms[i].trim();
    if (this.isFact(term))
      continue;
    else
      return false;
  }
  return true;
}

kbp.addFact = function(term) {
  this.facts[term] = true;
  log("addFact(%s)", term);
}

kbp.addRule = function(line) {
  var m = line.match(/^([^<=]*)(<=(.*))?$/);
  var head = (m[1]==null)?"":m[1].trim();
  var terms= (m[3]==null)?"":m[3].trim().split(/&+/);
  log("rule:head=%s terms=%j", head, terms);
  var rule = { head:head, terms:terms, satisfy:false };
  this.rules.push(rule);
  this.dict[head] = { headHits: [rule], bodyHits:[] };  
}

kbp.forwardChaining = function() {
  do {
    var anySatisfy = false;
    for (var i in this.rules) {
      var rule = this.rules[i];
      if (!rule.satisfy) {
        if (this.check(rule)) {
          this.addFact(rule.head);
          rule.satisfy = true;
          anySatisfy = true;
        }
      }
    }
  } while (anySatisfy);
  log("facts=%j", Object.keys(this.facts));
}

kbp.trySatisfy = function(goal) {
  log("trySatisfy(%s)", goal);
  var word = this.dict[goal];
  if (word == null) return false;
  var headHits = word.headHits;
  for (var i in headHits) {
    var rule = headHits[i];
    if (rule.satisfy) {
      this.addFact(goal);
      return true;
    } else {
      var isSatisfy = true;
      for (var ti in rule.terms) {
        var term = rule.terms[ti];
        var satisfy = this.trySatisfy(term);
        if (!satisfy) isSatisfy = false;
      }
      rule.satisfy = isSatisfy;
      if (isSatisfy) {
        this.addFact(goal);
        return true;
      }
    }
  }
  return false;
}

kbp.backwardChaining = function(goal) {
  this.trySatisfy(goal);
  log("facts=%j", Object.keys(this.facts));
}

module.exports = kb;
```

### 簡易的測試程式

檔案：kbTest.js

```javascript
var fs = require('fs'); // 引用檔案物件
var kb = require('./kb');

var code = "A<=B. B<=C&D. C<=E. D<=F. E. F. Z<=C&D&G.";
var kb1 = new kb();
kb1.load(code);
kb1.forwardChaining();
// kb1.backwardChaining("A");
// kb1.backwardChaining("Z");
```

### 執行結果

```
C:\Dropbox\Public\web\ai\code\KB>node kbTest
["A<=B","B<=C&D","C<=E","D<=F","E","F","Z<=C&D&G",""]
rule:head=A terms=["B"]
rule:head=B terms=["C","D"]
rule:head=C terms=["E"]
rule:head=D terms=["F"]
rule:head=E terms=""
rule:head=F terms=""
rule:head=Z terms=["C","D","G"]
addFact(E)
addFact(F)
addFact(C)
addFact(D)
addFact(B)
addFact(A)
facts=["E","F","C","D","B","A"]
```

### 結語

以上我們用 JavaScript 實作了一個簡易的布林邏輯推論引擎，採用洪氏邏輯的語法，以及前向推論 (forwardChaining) 的方式。(程式中也有附上後向推論的函數 backwardChaining，讀者可自行測試)。
