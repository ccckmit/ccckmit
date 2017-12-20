var ml   = require("./myLib");
var prob = require("./prob");

var BayesNet = function() {
  this.nodes = {};
}

BayesNet.prototype.addNode = function(name, values, parents, ptable) {
  var node = { name:name, values:values, parents:parents, ptable:ptable };
  this.nodes[name] = node;
  return node;
}

BayesNet.prototype.vars = function() { return Object.keys(this.nodes); }

BayesNet.prototype.p = function(name, value, cond) { // P(name=value|cond)
  var node = this.nodes[name];
  var ptable = node.ptable;
  var p1=ptable[cond];
  if (p1==null) 
    ml.error("node.ptable[cond]==null node=%j cond=%s", node, cond);
  var prob = null;
  if (value == "1") 
    prob=ptable[cond];
  else if (value == "0")
    prob=1.0-ptable[cond];
  else
    ml.error("value is not (0,1)!");
  ml.log("  p(%s=%s|%s)=%d", node.name, value, cond, prob);
  return prob;
}

BayesNet.prototype.showp = function(name, value, cond) {
  var node = this.nodes[name];
  ml.log("P(%s=%s|%s=%s)=%d", name, value, node.parents, cond, this.p(name, value, cond));
}

BayesNet.prototype.parentValues = function(node, e) {
  var values = [];
  for (var i in node.parents) {
    var parent = node.parents[i];
    if (e[parent]== null) 
      ml.error("e[%s] is null", parent);
    values.push(e[parent]);
  }
  return values;
}

BayesNet.prototype.enumAsk = function(q, e) { // 傳回一個機率分布
  var pset = {};
  var vars = this.vars();
  ml.log("enumAsk(q=%j e=%j) vars=%j", q, e, vars);
  for (var v in this.nodes[q].values) {
    var ev = ml.clone(e);
    ev[q]  = v;
    pset[v]= this.enumAll(vars, 0, ev);
  }
  ml.log("pset=%j", pset);
  return prob.normalize(pset);
}

BayesNet.prototype.enumAll = function(vars, i, e) { // 傳回一個機率值
  if (i>=vars.length) return 1.0;
  ml.log("enumAll: i=%d e=%j", i, e);
  var y = vars[i];
  var ynode = this.nodes[y];
  var yparents = this.parentValues(ynode, e).join("");
  var prob = 0.0;
  if (e[y] != null) { // y 是證據變數 (y has value in e)
    var pye = this.p(y, e[y], yparents);
    prob = pye*this.enumAll(vars, i+1, e);
  } else {            // y 不是證據變數
    for (var value in ynode.values) {
      var pye = this.p(y, value, yparents);
      var ey = ml.clone(e);
      ey[y] = value;
      prob += pye*this.enumAll(vars, i+1, ey);
    }
  }
  return prob;
}

var bn = new BayesNet();

bn.addNode("B", ["0","1"], [], {"":0.001});
bn.addNode("E", ["0","1"], [], {"":0.002});
bn.addNode("A", ["0","1"], ["B","E"], {"00":0.001, "01":0.29, "10":0.94, "11":0.95});
bn.addNode("J", ["0","1"], ["A"], {"1":0.90, "0":0.05});
bn.addNode("M", ["0","1"], ["A"], {"1":0.70, "0":0.01});

var q = bn.enumAsk("B", {"J":"1", "M":"1"}); // 答案應該是 P(B|j,m)={0.284, 0.716}.
ml.log("q=%j", q);
