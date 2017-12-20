// http://cs.stanford.edu/people/karpathy/convnetjs/ (有 web)
// -- https://www.npmjs.com/package/convnetjs-ts
// https://github.com/junku901/dnn (已吸收)
// https://github.com/cazala/mnist
// article : https://blog.webkid.io/neural-networks-in-javascript/
// npm install synaptic --save(讚! 吸收中)
// -- 記得要看 wiki (https://github.com/cazala/synaptic/wiki)
// -- https://blog.webkid.io/neural-networks-in-javascript/ 有 NMIST 手寫辨識範例
// https://wagenaartje.github.io/neataptic/ (讚！待吸收, Flexible neural network library with advanced neuroevolution)
// -- https://wagenaartje.github.io/neataptic/docs/tutorials/tutorials/
// Node tensorflow -- https://github.com/peterbraden/node-tensorflow (還不算完整)
//  var NN = ai6.NN = module.exports = require('synaptic')
// 書籍： https://page.mi.fu-berlin.de/rojas/neural/
module.exports = function (ai6) {
  var NN = ai6.NN = {}
  var T = ai6.j6.T

  // ref: https://wagenaartje.github.io/neataptic/docs/methods/activation/
  NN.sigmoid = function (x) {
    var sigmoid = (1.0 / (1 + Math.exp(-x)))
    if (sigmoid === 1) {
      //   console.warn('Something Wrong!! Sigmoid Function returns 1. Probably javascript float precision problem?\nSlightly Controlled value to 1 - 1e-14')
      sigmoid = 0.99999999999999 // Javascript Float Precision Problem.. This is a limit of javascript.
    } else if (sigmoid === 0) {
      //  console.warn('Something Wrong!! Sigmoid Function returns 0. Probably javascript float precision problem?\nSlightly Controlled value to 1e-14')
      sigmoid = 1e-14
    }
    return sigmoid // sigmoid cannot be 0 or 1;
  }

  NN.dSigmoid = function (x) {
    var a = NN.sigmoid(x)
    return a * (1.0 - a)
  }

  NN.logistic = NN.sigmoid

  NN.tanh = Math.tanh

  NN.relu = (x) => (x >= 0) ? x : 0

  NN.step = (x) => (x >= 0) ? 1 : 0

  NN.bipolar = (x) => (x >= 0) ? 1 : -1

  NN.gaussian = (x) => Math.exp(-x * x)

  NN.binarySample = function (m) {
    return m.map1((x) => (Math.random() < x) ? 1 : 0)
  }

  NN.binaryCrossEntropy = function (x, y) {
    var a = T.map2(x, y, function (px, py) {
      return px * Math.log(py)
    })
    var b = T.map2(x, y, function (px, py) {
      return (1 - px) * Math.log(1 - py)
    })
    var entropy = -a.madd(b).colSum().mean() // -(a+b).colMean()
    return entropy
  }

  NN.feedForward = function (x, netLayers) {
    var inputLayers = []
    inputLayers.push(x)
    for (let i = 0; i < netLayers.length; i++) {
      inputLayers.push(netLayers[i].output(inputLayers[i]))
    }
    return inputLayers
  }

  // 注意： y 是矩陣，像這樣：[[1,0],[1,0],[1,0],[0,1],[0,1],[0,1]]
  NN.backPropagate = function (y, netLayers, inputLayers, dActivation) {
    var n = netLayers.length - 1
    var delta = new Array(n + 1)
    var dOutput = netLayers[n].linearOutput(inputLayers[n]).map1(dActivation)
    var output = inputLayers[n + 1]
    // delta[n] = (y - output) 乘 dActivation(output)
    delta[n] = y.msub(output).mmul(dOutput)
    for (let i = n - 1; i >= 0; i--) {
      dOutput = netLayers[i].linearOutput(inputLayers[i]).map1(dActivation)
      // delta[i] = (delta[i+1] * Wt) 乘 dActivation(input[i])
      delta[i] = netLayers[i + 1].backPropagate(delta[i + 1]).mmul(dOutput)
    }
    return delta
  }

  NN.updateWeights = function (x, netLayers, inputLayers, delta) {
    var xlen = x.length
    for (let i = 0; i < netLayers.length; i++) {
      var deltaW = inputLayers[i].tr().mdot(delta[i]).map1((dw) => dw / xlen)
      var deltaB = delta[i].colMean()
      netLayers[i].W = netLayers[i].W.madd(deltaW)
      netLayers[i].b = netLayers[i].b.vadd(deltaB)
    }
  }

  NN.gradientOptimizer = function (x, y, netLayers, dActivation) {
    let inputLayers = NN.feedForward(x, netLayers)
    let delta = NN.backPropagate(y, netLayers, inputLayers, dActivation)
    NN.updateWeights(x, netLayers, inputLayers, delta) // update weights, bias
  }

  // ref : https://github.com/wagenaartje/neataptic/blob/master/src/layer.js
  var neataptic = require('neataptic')
  NN.NetLayer = require('./netLayer')(ai6)
  NN.RBM = require('./rbm')(ai6)
  NN.MLP = require('./mlp')(ai6)
  NN.DBN = require('./dbn')(ai6)
  NN.CRBM = require('./crbm')(ai6)
  NN.CDBN = require('./cdbn')(ai6)
  NN.Perceptron = neataptic.Architect.Perceptron
  NN.LSTM = neataptic.Architect.LSTM
  NN.NARX = neataptic.Architect.NARX
  NN.GRU = neataptic.Architect.GRU
  NN.Random = neataptic.Architect.Random
  NN.Hopfield = neataptic.Architect.Hopfield
  NN.Memory = neataptic.Architect.Memory
  NN.Dense = neataptic.Architect.Dense
  return NN
}

/*
  NN.softmaxVec = function (vec) {
    var max = vec.max()
    var preSoftmaxVec = vec.map((x) => Math.exp(x - max))
    var preSoftmaxSum = preSoftmaxVec.sum()
    return preSoftmaxVec.map((x) => (x / preSoftmaxSum))
  }

  NN.softmaxMat = function (m) {
    var len = m.length
    var r = []
    for (var i = 0; i < len; i++) {
      r[i] = NN.softmaxVec(m[i])
    }
    return r
  }
*/
