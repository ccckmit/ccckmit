// ref : http://cpmarkchang.logdown.com/posts/278457-neural-network-recurrent-neural-network
var ai6 = require('../../source/ai6.js')
var NN = ai6.NN
var j6 = ai6.j6

let rnn = function (x) {
  let r = 0.05
  let [wp, wc, wb] = j6.runif(3, -0.5, 0.5)
  let l = x.length
  let nIn = j6.V.new(l) // Array(l).fill(0)
  let nOut = Array(l).fill(0)
  for (let h = 0; h < 10000; h++) {
    // forward
    for (let i = 0; i < l - 1; i++) {
      nIn[i] = (wc * x[i]) + (wp * nOut[i]) + wb
      nOut[i + 1] = NN.sigmoid(nIn[i])
    }
    // backward
    for (let i = 0; i < l - 1; i++) {
      let dc
      for (let j = 0; j < i + 1; j++) {
        let k = (i - j)
        if (j === 0) { // k = i
          dc = nOut[k + 1] - x[k + 1] // dc = nOut[i+1] - x[i+1]
        } else {
          dc = wp * nOut[k + 1] * (1 - nOut[k + 1]) * dc
        }
        wc = wc - (r * dc * x[k]) // x[k] 的影響力
        wb = wb - (r * dc)
        wp = wp - (r * dc * nOut[k]) // h 的影響力
      }
    }
  }
  // forward
  for (let i = 0; i < l - 1; i++) {
    nIn[i] = (wc * x[i]) + (wp * nOut[i]) + wb
    nOut[i + 1] = NN.sigmoid(nIn[i])
  }
  console.log('x=%j', x)
  console.log('nOut=%j', nOut)
}

rnn([0, 0, 1, 0, 0, 1, 0, 0, 1])
