// °Ñ¦Ò¤åÄm¡GNumerical example to understand Expectation-Maximization -- http://ai.stanford.edu/~chuongdo/papers/em_tutorial.pdf
// What is the expectation maximization algorithm? (PDF) -- http://stats.stackexchange.com/questions/72774/numerical-example-to-understand-expectation-maximization

var log=console.log;
var R = require("../j6");

function EM() {
// 1st:  Coin B, {HTTTHHTHTH}, 5H,5T
// 2nd:  Coin A, {HHHHTHHHHH}, 9H,1T
// 3rd:  Coin A, {HTHHHHHTHH}, 8H,2T
// 4th:  Coin B, {HTHTTTHHTT}, 4H,6T
// 5th:  Coin A, {THHHTHHHTH}, 7H,3T
// so, from MLE: pA(heads) = 0.80 and pB(heads)=0.45
  var e = [ [5,5], [9,1], [8,2], [4,6], [7,3] ];
  var pA = [0.6,0.4], pB = [0.5,0.5];
  var gen=0, delta=9.9999;
  for (var gen=0; gen<1000 && delta > 0.001; gen++) {
    log("pA=%s pB=%s delta=%d", pA, pB, delta.toFixed(4));
    var sumA=[0,0], sumB=[0,0];
    for (var i in e) {
      var lA = R.xplog(e[i], pA);
      var lB = R.xplog(e[i], pB);
      var a  = lA.exp(), b = lB.exp();
      var wA = a/(a+b), wB=b/(a+b);
      var eA = wA.mul(e[i]);
      var eB = wB.mul(e[i]);
      sumA   = sumA.add(eA);
      sumB   = sumB.add(eB);
    }
    var npA = sumA.mul(1.0/sumA.sum());
    var npB = sumB.mul(1.0/sumB.sum());
    var dA  = npA.sub(pA);
    var dB  = npB.sub(pB);
    var delta = [dA, dB].max();
    pA = npA; pB=npB;
  }
}

EM();