# 謂詞邏輯的推論引擎

簡介

以 JavaScript 實作

推理引擎
檔案：myLib.js

檔案：pkb.js (Predicate Knowledge Base 的簡寫)

var ml = require("./myLib");

var Predicate = function() {}

Predicate.prototype.load = function(str) {
  var m = str.match(/^([^\(]*)\(([^\)]*)\)$/);
  this.name   = (m[1]==null)?"":m[1].trim();
  this.params = (m[2]==null)?"":m[2].trim().split(/[,]/);
  return this;
}

Predicate.prototype.toString = function() {
  return ml.format("%s%j", this.name, this.params).replace(/\"/gi, "").replace(/\[/gi, "(").replace(/\]/gi, ")");
}

Predicate.prototype.unify = function(fact) {
  var map = {};
  if (this.name != fact.name || this.params.length != fact.params.length) 
    return null;
  for (var i=0; i<this.params.length; i++) {
    var p  = this.params[i];
    var fp = fact.params[i];
    if (map[p] == null) { // 參數 p 沒有 bind，所以就 bind 上去
      if (p.match(/^[a-z]+ ![](../timg/b66e6870f9c0.jpg) /)!=null)
        map[p] = fp;
    } else { // 參數 p 已 bind，檢查是否有衝突。
      if (map[p] == fp)
        map[p] = fp; // 沒衝突，加入。
      else
        return null; // 有衝突，傳回 null;
    }
  }
  return map;
}

// 若每個變數都填入了，那麼就是滿足了 (satisfy)
Predicate.prototype.satisfy = function(map) {
  for (var i in this.params) {
    var p = this.params[i];
    if (map[p] == null)
      return false;
  }
  return true;
}

Predicate.prototype.mapping = function(map) {
  var term = new Predicate();
  term.name = this.name;
  term.params = [];
  for (var i in this.params) {
    var p = this.params[i];
    term.params.push(map[p]);
  }
  return term;
}

var Rule = function() {}

Rule.prototype.clone = function() {
  var r=new Rule();
  r.head = this.head;
  r.terms = this.terms;
  r.map = this.map;
  return r;
}

Rule.prototype.load = function(line) {
  var m = line.match(/^([^<=]*)(<=([^\{ ![](../timg/0568953a55be.jpg) /);
  var head = (m[1]==null)?"":m[1].trim();
  var terms= (m[3]==null)?"":m[3].trim().split(/[&]+/);
  this.head = new Predicate().load(head);
  this.terms = [];
  for (i=0; i<terms.length; i++) {
    this.terms.push(new Predicate().load(terms[i]));
  }
  this.map = {};
  return this;
}

Rule.prototype.toString = function() {
  return ml.format("%s<=%s%j", this.head, this.terms.join("&"), this.map);
}

Rule.prototype.resolve = function(fact) {
  var rmap = this.map;
//  ml.log("resolve:rule=%s, fact=%s", this, fact);
  for (var i in this.terms) {
    var term = this.terms[i];
    var tmap = term.unify(fact);
    if (tmap == null) continue;
//    ml.log("unify:%s;%s=%j", term, fact, tmap);
    var isConflict = false;
    for (var mi in tmap) {
      if (rmap[mi]!=null && rmap[mi] != tmap[mi])
        isConflict = true;
    }
    if (!isConflict) {
//      ml.log(" return map=%j", tmap);
      return tmap;
    }
  }
  return null;
}

var KB = function() {
  this.rules = [];
  this.facts = [];
  this.ruleMap = {};
  this.factMap = {};
  this.resolveMap = {};
}

KB.prototype.load = function(code) {
  code = code.replace(/\s/gi, "");
  var lines = code.split(/[\.]+ ?/);
  ml.log("%j", lines);
  for (var i in lines) {
    var line = lines[i].trim();
    if (line.length == 0) continue;
    if (line.indexOf("<=")>=0) {
      this.addRule(new Rule().load(line));
    } else
      this.addFact(new Predicate().load(line));
  }
  this.dump();
}

KB.prototype.dump = function() {
  ml.log("=====facts========");
  ml.log(this.facts.join("\n"));
  ml.log("========rules=======");
  ml.log(this.rules.join("\n"));
// ml.log("========resolveMap=======\n");
// ml.log(Object.keys(this.resolveMap).join("|"));
}
  
KB.prototype.addFact = function(fact) {
  if (this.factMap[fact.toString()] == null) {
    ml.log("addFact:%s", fact);
    this.facts.push(fact);
    this.factMap[fact.toString()] = fact;
    return true;
  } else 
    return false;
}

KB.prototype.addRule = function(rule) {
  if (this.ruleMap[rule.toString()] == null) {
    ml.log("addRule:%s", rule.toString());
    this.rules.push(rule);
    this.ruleMap[rule.toString()] = rule;
    return true;
  } else
    return false;
}

KB.prototype.genNew = function(rule, fact) {
  var fmap = rule.resolve(fact);
  if (fmap == null) return null;
  var rmap = ml.merge(rule.map, fmap);
  if (rule.head.satisfy(rmap)) {
    var newFact = rule.head.mapping(rmap);
    if (this.addFact(newFact))
      return newFact;
  } else {
    if (!ml.isEmpty(fmap)) {
    var newRule = rule.clone();
    newRule.map  = rmap
    if (this.addRule(newRule))
      return newRule;
    }
  }
  return null;
}

KB.prototype.forwardChaining = function() {
  do {
    ml.log("======forwardChaining============");
    var anyNew = false;
    for (var fi=0; fi < this.facts.length; fi++) {
      var fact=this.facts[fi];
      for (var ri in this.rules) {
        var rule = this.rules[ri];
        if (this.resolveMap[fi+","+ri] == null) {
          var newObj = this.genNew(rule, fact);
          if (newObj != null) {
            ml.log("  %s;%s\n", rule, fact);
            anyNew = true;
          }
        }
        else
          this.resolveMap[fi+","+ri]=true;
      }
    }
  } while (anyNew);
  this.dump();
}

KB.prototype.test = function() {
  var fxy = new Predicate().load("father(x,y)");
  var fjj = new Predicate().load("father(John,Johnson)");
  var rp = new Rule().load("parent(x,y)<=father(x,y)");
  var ra = new Rule().load("ancestor(x,z)<=ancestor(x,y)&parent(y,z)");
  var pgj = new Predicate().load("ancestor(George,John)");
  var pjj = new Predicate().load("parent(John,Johnson)");
  ra.map = ra.resolve(pgj);
  ra.map = ml.merge(ra.map, ra.resolve(pjj));
  ml.log("ra=%s", ra);
  ml.log(" satisfy=%d", ra.head.satisfy(ra.map));
}

module.exports = KB;
檔案：pkbReason.js

var fs = require('fs'); // 引用檔案物件
var kb = require('./pkb');

var kb1 = new kb();
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 讀取檔案
kb1.load(code);
kb1.forwardChaining();
規則檔：family.pkb

parent(x,y)   <= father(x,y).
parent(x,y)   <= mother(x,y).
ancestor(x,y) <= parent(x,y).
ancestor(x,z) <= ancestor(x,y) & parent(y,z).

father(John, Johnson).
mother(Mary, Johnson).
father(George, John).
father(John, Jake).
執行結果

C:\Dropbox\Public\web\ai\code\PKB>node pkbReason family.pkb
["parent(x,y)<=father(x,y)","parent(x,y)<=mother(x,y)","ancestor(x,y)<=parent(x,
y)","ancestor(x,z)<=ancestor(x,y)&parent(y,z)","father(John,Johnson)","mother(Ma
ry,Johnson)","father(George,John)","father(John,Jake)",""]
addRule:parent(x,y)<=father(x,y){}
addRule:parent(x,y)<=mother(x,y){}
addRule:ancestor(x,y)<=parent(x,y){}
addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){}
addFact:father(John,Johnson)
addFact:mother(Mary,Johnson)
addFact:father(George,John)
addFact:father(John,Jake)
=====facts========
father(John,Johnson)
mother(Mary,Johnson)
father(George,John)
father(John,Jake)
========rules=======
parent(x,y)<=father(x,y){}
parent(x,y)<=mother(x,y){}
ancestor(x,y)<=parent(x,y){}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){}
======forwardChaining============
addFact:parent(John,Johnson)
  parent(x,y)<=father(x,y){};father(John,Johnson)

addFact:parent(Mary,Johnson)
  parent(x,y)<=mother(x,y){};mother(Mary,Johnson)

addFact:parent(George,John)
  parent(x,y)<=father(x,y){};father(George,John)

addFact:parent(John,Jake)
  parent(x,y)<=father(x,y){};father(John,Jake)

addFact:ancestor(John,Johnson)
  ancestor(x,y)<=parent(x,y){};parent(John,Johnson)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Johnson"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};parent(John,Johnson)

addFact:ancestor(Mary,Johnson)
  ancestor(x,y)<=parent(x,y){};parent(Mary,Johnson)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"Mary","z":"Johnson"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};parent(Mary,Johnson)

addFact:ancestor(George,John)
  ancestor(x,y)<=parent(x,y){};parent(George,John)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"George","z":"John"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};parent(George,John)

addFact:ancestor(John,Jake)
  ancestor(x,y)<=parent(x,y){};parent(John,Jake)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Jake"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};parent(John,Jake)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"John","y":"Johnson"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(John,Johnson)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"Mary","y":"Johnson"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(Mary,Johnson)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"John"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(George,John)

addFact:ancestor(George,Johnson)
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Johnson"};ancestor(Ge
orge,John)

addFact:ancestor(George,Jake)
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Jake"};ancestor(Georg
e,John)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"John","y":"Jake"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(John,Jake)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"Johnson"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(George,Johnson)

addRule:ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"Jake"}
  ancestor(x,z)<=ancestor(x,y)&parent(y,z){};ancestor(George,Jake)

======forwardChaining============
=====facts========
father(John,Johnson)
mother(Mary,Johnson)
father(George,John)
father(John,Jake)
parent(John,Johnson)
parent(Mary,Johnson)
parent(George,John)
parent(John,Jake)
ancestor(John,Johnson)
ancestor(Mary,Johnson)
ancestor(George,John)
ancestor(John,Jake)
ancestor(George,Johnson)
ancestor(George,Jake)
========rules=======
parent(x,y)<=father(x,y){}
parent(x,y)<=mother(x,y){}
ancestor(x,y)<=parent(x,y){}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Johnson"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"Mary","z":"Johnson"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"George","z":"John"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"y":"John","z":"Jake"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"John","y":"Johnson"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"Mary","y":"Johnson"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"John"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"John","y":"Jake"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"Johnson"}
ancestor(x,z)<=ancestor(x,y)&parent(y,z){"x":"George","y":"Jake"}
結語

以上我們用 JavaScript 實作了一個簡易的謂詞邏輯推論引擎，採用洪氏邏輯的語法，以及前向推論 (forwardChaining) 的方式。

