// view-source:view-source:view-source:http://cs.stanford.edu/people/karpathy/convnetjs/demo/mnist.html
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
  var x = new convnetjs.Vol(32, 32, 3, 0.0)
  for (var dc = 0; dc < 3; dc++) {
    var i = 0
    for (var xc = 0; xc < 32; xc++) {
      for (var yc = 0; yc < 32; yc++) {
        var ix = i * 4 + dc
        x.set(yc, xc, dc, p[ix] / 255.0 - 0.5)
        i++
      }
    }
  }
  return x
}

var classes = ['airplane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']

async function imagePredict (file) { // predict
  try {
    var image = await Jimp.read(file)
    var image32 = image.resize(32, 32)
    var x = image2sample(image32.bitmap)
    var pretrainedJson = require('./cifar10/cifar10_snapshot.json')
    var net = loadNet(pretrainedJson)
    var yhat = predict(net, x)
    console.log('yhat=%j class=%s', yhat, classes[yhat])
  } catch (error) { throw error }
}

imagePredict(process.argv[2])
