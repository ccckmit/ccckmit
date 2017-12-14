// view-source:http://cs.stanford.edu/people/karpathy/convnetjs/demo/mnist.html
var convnetjs = require('convnetjs')
var Jimp = require('jimp')

function loadNet (json) { // load pretrained CNN network
  var net = new convnetjs.Net()
  net.fromJSON(json)
  return net
}

function predict (net, x) {
  var prob = net.forward(x)
  console.log('prob = %j', prob)
  var yhat = net.getPrediction()
  return yhat
}

function image2sample (image) { // convert image data into CNN input
  var p = image.data
  var x = new convnetjs.Vol(28, 28, 1, 0.0)
  var W = 28 * 28
  for (var i = 0; i < W; i++) {
    var ix = i * 4
    x.w[i] = p[ix] / 255.0
  }
  x = convnetjs.augment(x, 24)
  return x
}

var classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

async function imagePredict (file) { // predict
  try {
    var image = await Jimp.read(file)
    var image28 = image.resize(28, 28)
    var x = image2sample(image28.bitmap)
    var pretrainedJson = require('./mnist/mnist_snapshot.json')
    var net = loadNet(pretrainedJson)
    var yhat = predict(net, x)
    console.log('yhat=%j class=%s', yhat, classes[yhat])
  } catch (error) { throw error }
}

imagePredict(process.argv[2])
