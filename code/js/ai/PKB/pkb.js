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
      if (p.match(/^[a-z]+$/)!=null && fp.match(/^[A-Z].*$/)!=null)
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
  var m = line.match(/^([^<=]*)(<=([^\{$]*))$/);
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
