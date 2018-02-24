var convnetjs = require('convnetjs')

let layerDefs = []
layerDefs.push({ type: 'input', out_sx: 1, out_sy: 1, out_depth: 3 })
layerDefs.push({ type: 'fc', num_neurons: 5, activation: 'relu' })
layerDefs.push({ type: 'fc', num_neurons: 5, activation: 'relu' })
layerDefs.push({ type: 'regression', num_neurons: 1 })
let net = new convnetjs.Net()
net.makeLayers(layerDefs)
let trainer = new convnetjs.SGDTrainer(net, { learning_rate: 0.001, method: 'sgd', batch_size: 1, l2_decay: 0.001, l1_decay: 0.001 })

let start = new Date()
for (var i = 0; i < 100000; i++) {
  var x = new convnetjs.Vol([0.1, 0.2, 0.3]) // out_depth=3, 設定 input 初始值
  trainer.train(x, [0.5])
}
var end = new Date()
console.log(end - start)
var predictedValues = net.forward(x)
console.log(predictedValues.w[0])
