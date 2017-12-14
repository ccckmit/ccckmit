var c = console;

function nonull(s) {
  return (s == null)?"":s.trim();
}

function split(str, sep) {
  if (str.length==0) 
    return [];
  else {
    var tokens=str.split(sep);
    var array = [];
    for (var i in tokens) {
      if (tokens[i].trim().length > 0)
        array.push(tokens[i]);
    }
    return array;
  }
}

function fields(obj) {
  var a = [];
  for (var field in obj) {
    a.push(field);
  }
  return a;
}

var fact=function(term, value) {
  this.term  = term;
  this.value = value;
}

var rule=function(line) {
  var m = line.match("^([^<=]*)(<=(.*))?$");
  this.head = nonull(m[1]);
  this.terms = split(nonull(m[3]), ",");
  for (var i in this.terms) {
    this.terms[i] = this.terms[i].trim();
  }
  this.satisfy = false;
  c.log("head=%s terms=%j", this.head, this.terms);
}

var kb = function() {
  this.rules = [];
  this.facts = {};
  this.dict  = {};
  
  this.load=function(code) {
    var lines = split(code, ".");
    c.log("%j", lines);
    for (var i in lines) {
      if (lines[i].trim().length > 0) {
        var r = new rule(lines[i]);
        this.rules.push(r);
        this.dict[r.head] = { headHits: [r], bodyHits:[] };
      }
    }
  }
  
  this.isFact=function(term) {
    if (term.length == 0)
      return true;
    var fact = this.facts[term];
    if (fact == null)
      return false;
    else
      return fact.value;
  }
  
  this.check = function(rule) {
    for (var i in rule.terms) {
      var term = rule.terms[i].trim();
      if (this.isFact(term))
        continue;
      else
        return false;
    }
    return true;
  }
  
  this.addFact = function(term) {
    var newFact = new fact(term, true);
    this.facts[term] = newFact;    
    c.log("addFact(%s)", newFact.term);
  }
  
  this.forwardChaining = function() {
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
    c.log("facts=%j", fields(this.facts));
  }

  this.trySatisfy = function(goal) {
    c.log("trySatisfy(%s)", goal);
    var word = this.dict[goal];
    if (word == null) return false;
    var headHits = word.headHits;
    for (var i in headHits) {
      var rule = headHits[i];
      if (rule.satisfy) {
        this.facts[goal] = new fact(goal, true);
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
  
  this.backwardChaining = function(goal) {
    this.trySatisfy(goal);
    c.log("facts=%j", fields(this.facts));
  }
}

module.exports = kb;
