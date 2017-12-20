/* eslint-disable camelcase */
// view-source:view-source:http://cs.stanford.edu/people/karpathy/convnetjs/demo/classify2d.html
var convnetjs = require('convnetjs')

function buildNet () {
  var layer_defs = []
  layer_defs.push({type: 'input', out_sx: 1, out_sy: 1, out_depth: 2})
  layer_defs.push({type: 'fc', num_neurons: 6, activation: 'tanh'})
  layer_defs.push({type: 'fc', num_neurons: 2, activation: 'tanh'})
  layer_defs.push({type: 'softmax', num_classes: 2})

  net = new convnetjs.Net()
  net.makeLayers(layer_defs)
  return net
}

function train () {
  var N = labels.length
  for (var loops = 0; loops < 100; loops++) {
    var x = new convnetjs.Vol(1, 1, 2)
    var avloss = 0.0
    for (var iters = 0; iters < 20; iters++) {
      for (var ix = 0; ix < N; ix++) {
        x.w = data[ix]
        var netx = trainer.train(x, labels[ix])
        avloss += netx.loss
      }
    }
    avloss /= N * iters
    console.log('%d: avloss = %d', loops, avloss)
  }
}

function predicts (data, labels) {
  for (var i = 0; i < data.length; i++) {
    var x = data[i][0]
    var y = data[i][1]
    var label = labels[i]
    var netx = new convnetjs.Vol(1, 1, 2)
    netx.w = [x, y]
    var a = net.forward(netx, false)
    console.log('x=%s y=%d label=%d w0=%s w1=%s', x.toFixed(4), y.toFixed(4), label, a.w[0].toFixed(4), a.w[1].toFixed(4))
  }
}

function originalData () {
  var data = []
  var labels = []
  data.push([-0.4326, 1.1909]); labels.push(1)
  data.push([3.0, 4.0]); labels.push(1)
  data.push([0.1253, -0.0376]); labels.push(1)
  data.push([0.2877, 0.3273]); labels.push(1)
  data.push([-1.1465, 0.1746]); labels.push(1)
  data.push([1.8133, 1.0139]); labels.push(0)
  data.push([2.7258, 1.0668]); labels.push(0)
  data.push([1.4117, 0.5593]); labels.push(0)
  data.push([4.1832, 0.3044]); labels.push(0)
  data.push([1.8636, 0.1677]); labels.push(0)
  data.push([0.5, 3.2]); labels.push(1)
  data.push([0.8, 3.2]); labels.push(1)
  data.push([1.0, -2.2]); labels.push(1)
//  var N = labels.length
  return {data: data, labels: labels} // , N: N
}

var {data, labels, N} = originalData()
var net = buildNet()
let trainer = new convnetjs.SGDTrainer(net, {learning_rate: 0.01, momentum: 0.1, batch_size: 10, l2_decay: 0.001})
train()
predicts(data, labels)
