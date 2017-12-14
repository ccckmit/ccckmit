# 實作：機率式邏輯推論

專案下載： [BayesLogic.zip](/code/js/ai/BayesLogic.zip)

## 貝氏邏輯推論

$$P(q_1...q_n) = P(q_1..q_{n-1}|q_n) P(q_n)$$

$$P(A|B) = P(B|A) \frac{P(A)}{P(B)}$$

## 天真貝氏推論 Naive Bayes Model

$$P(q_1,...,q_n|e) = P(q_1|e) ... P(q_n|e)$$

檔案： BayesLogic.js

```
var ml = require("./myLib");

var BL = function() {
  this.pmap = null;  
}

BL.prototype.P = function(Q, E) { // P(Q,E) = P(Q<=E)
  if (Q == E || Q.length==0) return 1.0;
  if (E.length == 0)
    return this.pmap[Q]; // P(Q)
  else
    return this.pmap[Q+"<="+E]; // P(Q<=E)
}

BL.prototype.ask = function(query) {
  ml.log("BL:ask(%s)", query);
  var QE=ml.split(query.trim(), "<=");
  QE.push("");
  var prob=this.P(QE[0], QE[1]);
  ml.log("  prob=%d", prob);
}

BL.prototype.test = function() {
  var bl = new BL();
  bl.pmap =  { "A":0.5, "B":0.3, "C":0.2, "D":0.7, 
             "A<=B":0.5, "A<=C":0.3, "A<=D":0.6, "A<=E":0.2, 
             "B<=A":0.2, "B<=C":0.3, "B<=D":0.5, "B<=E":0.6, 
             "C<=A":0.4, "C<=B":0.5, "C<=D":0.6, "C<=E":0.1, 
             "D<=A":0.2, "D<=B":0.3, "D<=C":0.5, "D<=E":0.6
	   };
  bl.ask("C");
  bl.ask("A<=C");
  bl.ask("A&B<=C");
  bl.ask("A<=C&D");
  bl.ask("A&B");
  bl.ask("C&A&B"); // 0.075
  bl.ask("A&B&C"); // 0.018
  // 對於 Naive Bayes Model 而言，為何叫 Naive 或 Idiot ？因為 P(C,A,B) != P(A,B,C) ....
  bl.ask("A&B<=C&D");
}

module.exports = BL;

```

檔案： BayesLogicNaive.js

```
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

```

執行結果

```
D:\Dropbox\cccwd\db\ai\code\BayesLogic>node BayesLogicNaive.js
BL:ask(C)
  prob=0.2
BL:ask(A<=C)
  prob=0.3
BL:ask(A&B<=C)
  prob=0.09
BL:ask(A<=C&D)
  prob=0.6
BL:ask(A&B)
  prob=0.15
BL:ask(C&A&B)
  prob=0.075
BL:ask(A&B&C)
  prob=0.018
BL:ask(A&B<=C&D)
  prob=0.3
```

## 貝氏網路

專案下載： [BayesNet.zip](/code/js/ai/BayesNet.zip)

