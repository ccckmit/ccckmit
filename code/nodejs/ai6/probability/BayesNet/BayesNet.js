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

BayesNet.prototype.sample = function() {
  var bn = new BayesNet();
  bn.addNode("B", ["0","1"], [], {"":0.001});
  bn.addNode("E", ["0","1"], [], {"":0.002});
  bn.addNode("A", ["0","1"], ["B","E"], {"00":0.001, "01":0.29, "10":0.94, "11":0.95});
  bn.addNode("J", ["0","1"], ["A"], {"1":0.90, "0":0.05});
  bn.addNode("M", ["0","1"], ["A"], {"1":0.70, "0":0.01});
  return bn;
}

module.exports = BayesNet;