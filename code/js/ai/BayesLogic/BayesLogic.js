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
