// 參考文獻：Numerical example to understand Expectation-Maximization -- http://ai.stanford.edu/~chuongdo/papers/em_tutorial.pdf
// What is the expectation maximization algorithm? (PDF) -- http://stats.stackexchange.com/questions/72774/numerical-example-to-understand-expectation-maximization

var j6 = require('j6')

function EM () {
// 1st:  Coin B, {HTTTHHTHTH}, 5H,5T
// 2nd:  Coin A, {HHHHTHHHHH}, 9H,1T
// 3rd:  Coin A, {HTHHHHHTHH}, 8H,2T
// 4th:  Coin B, {HTHTTTHHTT}, 4H,6T
// 5th:  Coin A, {THHHTHHHTH}, 7H,3T
// so, from MLE: pA(heads) = 0.80 and pB(heads)=0.45
  var e, pA, pB, gen, delta
  e = [[5, 5], [9, 1], [8, 2], [4, 6], [7, 3]]
  pA = [0.6, 0.4]; pB = [0.5, 0.5]
  gen = 0; delta = 9.9999
  for (gen = 0; gen < 1000 && delta > 0.001; gen++) {
    console.log('pA=%s pB=%s delta=%d', pA, pB, delta.toFixed(4))
    var sumA = [0, 0]
    var sumB = [0, 0]
    for (var i in e) {
      var lA, lB, wA, wB, eA, eB, a, b
      lA = j6.xplog(e[i], pA); lB = j6.xplog(e[i], pB)
      a = lA.exp(); b = lB.exp()
      wA = a / (a + b); wB = b / (a + b)
      eA = wA.mul(e[i]); eB = wB.mul(e[i])
      sumA = sumA.add(eA); sumB = sumB.add(eB)
    }
    var npA = sumA.mul(1.0 / sumA.sum())
    var npB = sumB.mul(1.0 / sumB.sum())
    var dA = npA.sub(pA)
    var dB = npB.sub(pB)
    delta = [dA, dB].max()
    pA = npA; pB = npB
  }
}

EM()
