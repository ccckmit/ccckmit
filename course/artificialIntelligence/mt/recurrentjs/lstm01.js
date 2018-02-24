var R = require('./recurrent')
var hiddenSizes = [6]
var model = R.initLSTM(1, hiddenSizes, 2)

var forward = function (model, trainData, x, y) {
  var G = new R.Graph()
  var log2ppl = 0.0
  var cost = 0.0
  var n = x.length
  var prevOut = {}

// R.forwardRNN(G, model, hidden_sizes, x, prev);

  for (let i = 0; i < n; i++) {
    let out = R.forwardLSTM(G, model, hiddenSizes, x[i], prevOut)
    var logprobs = out.o // interpret output as logprobs
    var probs = R.softmax(logprobs) // compute the softmax probabilities
    var target = trainData[i].output[0] // y[i].w[0]
    console.log('probs=%j target=%d', probs.w, target)
    log2ppl += -Math.log2(probs.w[target]) // accumulate base 2 log prob and do smoothing
    cost += -Math.log(probs.w[target])
    // write gradients into log probabilities
    logprobs.dw = probs.w    // dw = w 參考： https://en.wikipedia.org/wiki/Cross_entropy#Cross-entropy_error_function_and_logistic_regression
    logprobs.dw[target] -= 1 // dw = w-1 為何 target 的 dw 要減 1，非 target 不用？ (答案：這就是指導者)
    prevOut = out
  }
  var ppl = Math.pow(2, log2ppl / (n - 1))
  console.log('ppl = %d cost= %d', ppl, cost)

  return {'G': G, 'ppl': ppl, 'cost': cost}
}

var backward = function (G, model) {
  G.backward()
  var s = new R.Solver()
  // perform RMSprop update with, step size of 0.01, L2 regularization of 0.00001, and clipping the gradients at 5.0 elementwise
  s.step(model, 0.01, 0.00001, 5.0)
}

var trainData = [
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
  { input: [1], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] }
]

var x = []
var y = []
for (let i = 0; i < trainData.length; i++) {
  x[i] = new R.Mat(1, 1)
  x[i].w[0] = trainData[i].input[0]
  y[i] = new R.Mat(2, 1)
  y[i].w[trainData[i].output[0]] = 1
}

console.log('x=%j\ny=%j', x, y)

var maxLoops = 100
for (let i = 0; i < maxLoops; i++) {
  var f = forward(model, trainData, x, y)
  backward(f.G, model)
}
