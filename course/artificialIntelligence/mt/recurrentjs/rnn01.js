// 關鍵：把步伐從 0.01 調到更小的 0.0002 ，然後加多代數 maxLoop 從 100 到 1000
// 如果 cost 跑到 0.000.... 的話就是對了 (大約有 50% 的機率正確！
var R = require('./recurrent')
var hiddenSizes = [10, 10] // 把 hiddenSizes 從 [4, 4] 調到 [10, 10] 之後，就幾乎每次都正確了！
var model = R.initRNN(1, hiddenSizes, 2)

var forward = function (model, trainData, x, y) {
  var G = new R.Graph()
  var log2ppl = 0.0
  var cost = 0.0
  var n = x.length
  var prevOut = {}

  for (let i = 0; i < n; i++) {
    let out = R.forwardRNN(G, model, hiddenSizes, x[i], prevOut)
    var logprobs = out.o // interpret output as logprobs
    var probs = R.softmax(logprobs) // compute the softmax probabilities
    var target = trainData[i].output[0] // y[i].w[0]
    console.log('probs=%j target=%d', probs.w, target)
    log2ppl += -Math.log2(probs.w[target]) // accumulate base 2 log prob and do smoothing
    cost += -Math.log(probs.w[target])
    // write gradients into log probabilities
    logprobs.dw = probs.w    // dw = w 參考： https://en.wikipedia.org/wiki/Cross_entropy#Cross-entropy_error_function_and_logistic_regression
    logprobs.dw[target] -= 1 // dw = w-1 為何 target 的 dw 要減 1，非 target 不用？
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
//  s.step(model, 0.01, 0.00001, 5.0) 
  s.step(model, 0.0002, 0.00001, 5.0) // 關鍵：把步伐從 0.01 調到更小的 0.0002 ，然後加多代數 maxLoop 從 100 到 1000
}

var trainData = [
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
  { input: [1], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
  { input: [1], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
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

var maxLoops = 1000
for (let i = 0; i < maxLoops; i++) {
  var f = forward(model, trainData, x, y)
  backward(f.G, model)
}
