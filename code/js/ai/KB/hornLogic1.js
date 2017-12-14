var c = console;

var code = "A :- B. B :- C, D. C :- E. D :- F. E. F.";

function nonull(s) {
  return (s == null)?"":s.trim();
}

var fact=function(term, value) {
  this.term  = term;
  this.value = value;
}

var rule=function(line) {
  var m = line.match("^([^:-]*)(:-(.*))?$");
  this.head = nonull(m[1]);
  this.terms = nonull(m[3]).split(",");
  this.satisfy = false;
  c.log("head=%s terms=%j", this.head, this.terms);
}

var kb = function() {
  this.rules = [];
  this.facts = {};
  
  this.load=function(code) {
    var lines = code.split(".");
    c.log("%j", lines);
    for (var i in lines) {
      if (lines[i].trim().length > 0) {
        var r = new rule(lines[i]);
        this.rules.push(r);
      }
    }
  }
  
  this.check = function(rule) {
    for (var i in rule.terms) {
      var term = rule.terms[i].trim();
      var fact = this.facts[term];
      if (term.length == 0) {
        continue;
      } else if (fact != null) {
        if (fact.value==true)
	  continue;
	else
	  return false;
      } else
	return false;
    }
    return true;
  }
  
  this.forwardChaining = function() {
    do {
      var anySatisfy = false;
      for (var i in this.rules) {
        var rule = this.rules[i];
	if (!rule.satisfy) {
//          c.log("d[%s]=%j", i, rule);
	  if (this.check(rule)) {
            var newFact = new fact(rule.head, true);
	    this.facts[rule.head] = newFact;
	    c.log("fact(%s)", newFact.term);
	    rule.satisfy = true;
	    anySatisfy = true;
	  }
	}
      }
    } while (anySatisfy);
  }
}

var kb1 = new kb();
kb1.load(code);
kb1.forwardChaining();

