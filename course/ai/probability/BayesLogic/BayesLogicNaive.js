var ml = require("./myLib");
var BL = require("./BayesLogic");

BL.prototype.parentP = BL.prototype.P;

// NaiveBayes inference
BL.prototype.P = function(Q, E) { // P(Q,E) = P(Q<=E)
//  ml.log("P(%s, %s)", Q, E);
  var prob = this.parentP(Q, E);
  if (prob != null) return prob;
  var q = ml.split(Q, "&");
  var e = ml.split(E, "&");
  prob=1.0;
  switch (e.length) {
    case 0: // P(q1...qn) = P(q1..qn-1|qn)*P(qn)
      if (q.length == 1)
        throw ml.format("pmap[%s] is not found!", qs);
      var n = q.length-1;
      var qhead = q.slice(0, n); // qhead = q1..qn-1
      var qn = q[n];
      return this.P(qhead.join("&"), qn)*this.P(qn,"");
    case 1: // P(q1,...qn|e) = P(q1|e)*...*P(qn|e) ; 這就是 Naive 的地方！
      for (var i in q) {
        prob *= this.pmap[q[i]+"<="+E];
      }
      return prob;
    default: // >= 2 : P(q|e)=P(q,e)/P(e)
      return this.P(Q+"&"+E, "")/this.P(E, "");
  }
}

var bl = new BL();
bl.test();
