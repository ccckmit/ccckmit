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