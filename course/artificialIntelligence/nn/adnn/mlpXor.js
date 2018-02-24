var Tensor = require('adnn/tensor')
var ad = require('adnn/ad')
var nn = require('adnn/nn')
var opt = require('adnn/opt')

var nInputs = 2
var nHidden = 5
var nClasses = 2

console.log('buildNet')
// Definition using basic layers
var net = nn.sequence([
  nn.linear(nInputs, nHidden),
  nn.tanh,
  nn.linear(nHidden, nClasses),
  nn.softmax
])

var data = [{ input: [0, 0], output: [0] },
            { input: [0, 1], output: [1] },
            { input: [1, 0], output: [1] },
            { input: [1, 1], output: [0] }]

var toTensor = function (dim, flatArray) {
  return new Tensor(dim).fromFlatArray(flatArray)
}

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
  batchSize: 1,
  iterations: 1000,
  method: opt.sgd({ stepSize: 1, stepSizeDecay: 0.999 })
})

console.log('predict')
// Predict class probabilities for new, unseen features
for (let i = 0; i < trainingData.length; i++) {
  var input = trainingData[i].input
  var probs = net.eval(input)
  console.log('input=%j probs=%j', input, probs)
}
