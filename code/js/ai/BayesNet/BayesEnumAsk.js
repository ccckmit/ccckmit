var ml   = require("./myLib");
var prob = require("./prob");
var BayesNet = require("./BayesNet");

function enumAsk(bn, q, e) { // 傳回一個機率分布
  var pset = {};
  var vars = bn.vars();
  ml.log("enumAsk(q=%j e=%j) vars=%j", q, e, vars);
  for (var v in bn.nodes[q].values) {
    var ev = ml.clone(e);
    ev[q]  = v;
    pset[v]= enumAll(bn, vars, 0, ev);
  }
  ml.log("pset=%j", pset);
  return prob.normalize(pset);
}

function enumAll(bn, vars, i, e) { // 傳回一個機率值
  if (i>=vars.length) return 1.0;
  ml.log("enumAll: i=%d e=%j", i, e);
  var y = vars[i];
  var ynode = bn.nodes[y];
  var yparents = bn.parentValues(ynode, e).join("");
  var prob = 0.0;
  if (e[y] != null) { // y 是證據變數 (y has value in e)
    var pye = bn.p(y, e[y], yparents);
    prob = pye*enumAll(bn, vars, i+1, e);
  } else {            // y 不是證據變數
    for (var value in ynode.values) {
      var pye = bn.p(y, value, yparents);
      var ey = ml.clone(e);
      ey[y] = value;
      prob += pye*enumAll(bn, vars, i+1, ey);
    }
  }
  return prob;
}

var bn = require("./BayesSample");
var q  = enumAsk(bn, "B", {"J":"1", "M":"1"}); // 答案應該是 P(B|j,m)={0.284, 0.716}.
ml.log("q=%j", q);
