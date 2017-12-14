var Tensor = require('adnn/tensor')
var ad = require('adnn/ad')
var nn = require('adnn/nn')
var opt = require('adnn/opt')

var nInputs = 6
var nHidden = [4, 4, 5]
var nOutput = 2

console.log('buildNet')
// Definition using basic layers
var net = nn.sequence([
  nn.linear(nInputs, nHidden[0]),
//  nn.tanh,
  nn.sigmoid,
  nn.linear(nHidden[0], nHidden[1]),
  nn.sigmoid,
//  nn.linear(nHidden[1], nHidden[2]),
//  nn.tanh,
//  nn.linear(nHidden[2], nOutput),
  nn.linear(nHidden[1], nOutput),
  nn.softmax
])

var data = [
  {input: [0.4, 0.5, 0.5, 0.,  0.,  0.], output: [1]},
  {input: [0.5, 0.3, 0.5, 0.,  0.,  0.], output: [1]},
  {input: [0.4, 0.5, 0.5, 0.,  0.,  0.], output: [1]},
  {input: [0.,  0.,  0.5, 0.3, 0.5, 0.], output: [0]},
  {input: [0.,  0.,  0.5, 0.4, 0.5, 0.], output: [0]},
  {input: [0.,  0.,  0.5, 0.5, 0.5, 0.], output: [0]}
]

var tensor1d = function (array) {
  return new Tensor([array.length]).fromFlatArray(array)
}

var loadData = function (data) {
  var tensorData = []
  for (var i = 0; i < data.length; i++) {
    var x = tensor1d(data[i].input)
    var y = tensor1d(data[i].output)
    tensorData.push({
      input: x,
      output: y
    })
  }
  return tensorData
}

console.log('loadData')
var trainingData = loadData(data)

console.log('nnTrain')
opt.nnTrain(net, trainingData, opt.classificationLoss, {
  batchSize: 2, // batch 超過 3 就無法成功， why ?
  iterations: 1000,
  method: opt.sgd({ stepSize: 1, stepSizeDecay: 0.999 }),
//  verbose: true
})

console.log('predict')
// Predict class probabilities for new, unseen features
for (let i = 0; i < trainingData.length; i++) {
  var input = trainingData[i].input
  var probs = net.eval(input)
  console.log('input=%j\noutput=%j', input, probs)
}
