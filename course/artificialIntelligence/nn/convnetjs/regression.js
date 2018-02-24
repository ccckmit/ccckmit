/* eslint-disable camelcase */
// view-source:http://cs.stanford.edu/people/karpathy/convnetjs/demo/regression.html
var convnetjs = require('convnetjs')
// 預測 x*sin(x) 曲線 (擬合問題)
function genData (N) {
  var data = []
  var labels = []
  for (var i = 0; i < N; i++) {
    var x = Math.random() * 10 - 5
    var y = x * Math.sin(x)
    data.push([x])
    labels.push([y])
  }
  return {data: data, labels: labels}
}

function buildNet () {
  let layer_defs = []
  layer_defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: 1})
  layer_defs.push({type: 'fc', num_neurons: 20, activation: 'relu'})
  layer_defs.push({type: 'fc', num_neurons: 20, activation: 'sigmoid'})
  layer_defs.push({type: 'regression', num_neurons: 1})

  let net = new convnetjs.Net()
  net.makeLayers(layer_defs)
  return net
}

function train () {
  var N = data.length
  for (var loops = 0; loops < 100; loops++) {
    var netx = new convnetjs.Vol(1, 1, 1)
    var avloss = 0.0
    for (var iters = 0; iters < 20; iters++) {
      for (var ix = 0; ix < N; ix++) {
        netx.w = data[ix]
        var stats = trainer.train(netx, labels[ix])
        avloss += stats.loss
      }
    }
    avloss /= N * iters
    console.log('%d: avloss = %d', loops, avloss)
  }
}

function curve () {
  var netx = new convnetjs.Vol(1, 1, 1)
  for (var x = -5; x <= 5; x += 0.5) {
    netx.w[0] = x
    var a = net.forward(netx)
    var y = a.w[0]
    console.log('x=%d y=%d', x, y)
  }
}

function list (data, labels) {
  for (var i = 0; i < data.length; i++) {
    var x = data[i][0]
    var y = labels[i][0]
    console.log('x=%s label=%s', x.toFixed(4), y.toFixed(4))
  }
}

function predicts (data, labels) {
  for (var i = 0; i < data.length; i++) {
    var x = data[i][0]
    var y = labels[i][0]
    var netx = new convnetjs.Vol(1, 1, 1)
    netx.w = [x]
    var a = net.forward(netx)
    var yp = a.w[0]
    console.log('x=%s label=%s predict=%s', data[i][0].toFixed(4), y.toFixed(4), yp.toFixed(4))
  }
}

var {data, labels} = genData(20)
list(data, labels)

var net = buildNet()
let trainer = new convnetjs.SGDTrainer(net, {learning_rate: 0.01, momentum: 0.0, batch_size: 1, l2_decay: 0.001})
train()
// curve()
console.log('============predicts============')
predicts(data, labels)
