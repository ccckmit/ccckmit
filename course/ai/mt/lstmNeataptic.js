// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var neataptic = require('neataptic')
var Group = neataptic.Group
var Layer = neataptic.Layer
var Methods = neataptic.Methods

neataptic.Config.warnings = false

module.exports = class Lstm {
  constructor () {
    this.setting = {
      mode: 'char',
      startWord: '[#start#]',
      endWord: '[#end#]'
    }
  }

  // ex: dataTrain(dataSet, {in:10, hidden:8, out:10})
  dataTrain (dataSet, size) {
/*    
    var inputLayer = new Layer.Dense(size.in)
    var lstmLayer1 = new Layer.LSTM(size.hidden)
    var middleLayer = new Layer.Dense(size.in + size.out) // new Layer.Dense(size.in + size.out)
    var lstmLayer2 = new Layer.LSTM(size.hidden + size.out)
    var outputLayer = new Layer.Dense(size.out)
    inputLayer.connect(lstmLayer1, Methods.Connection.ALL_TO_ALL) // 是 ALL_TO_ALL
    lstmLayer1.connect(middleLayer, Methods.Connection.ALL_TO_ALL) // 是 ALL_TO_ALL
    // LSTM 預設 inputToOutput 為 true，因為 C[t-1] => C[t] ，所以要加下列這行。
    // 參考： http://colah.github.io/posts/2015-08-Understanding-LSTMs/
    inputLayer.connect(middleLayer, Methods.Connection.ALL_TO_ALL)

    middleLayer.connect(lstmLayer2, Methods.Connection.ALL_TO_ALL)
    lstmLayer2.connect(outputLayer, Methods.Connection.ALL_TO_ALL) // 是 ALL_TO_ALL
    middleLayer.connect(outputLayer, Methods.Connection.ALL_TO_ALL)
    var network = neataptic.Architect.Construct([inputLayer, lstmLayer1, middleLayer, lstmLayer2, outputLayer])
*/    
    var network = new neataptic.Architect.LSTM(size.in, size.hidden, size.hidden, size.out)
    console.log('Network conns', network.connections.length, 'nodes', network.nodes.length)

    network.train(dataSet, {
      log: 1,
      rate: 0.1,
      cost: neataptic.Methods.Cost.MSE,
      error: 0.01,
      iterations: 300,
      clear: true
    })
    return network
  }

  activate (x) {
    return this.network.activate(x)
  }

  probPrint (p, gap) {
    var words = this.setting.words
    for (let i = 0; i < words.length; i++) {
      if (p[i] > gap) console.log('%d:word=%s p=%d', i, words[i], p[i])
    }
  }

  toJSON () {
    this.setting.network = this.network.toJSON()
    var json = JSON.stringify(this.setting, null, 2)
    return json
  }

  fromJSON (json) {
    var S = JSON.parse(json)
    this.setting = S
    this.network = neataptic.Network.fromJSON(S.network)
  }
}

/*
Layer.LSTM 的實作：

    var input = from.connect(memoryCell, method, weight);
    connections = connections.concat(input);

    connections = connections.concat(from.connect(inputGate, method, weight));
    connections = connections.concat(from.connect(outputGate, method, weight));
    connections = connections.concat(from.connect(forgetGate, method, weight));

    inputGate.gate(input, Methods.Gating.INPUT);

Architect.LSTM 的實作：
      // Set up gates
      inputGate.gate(input, Methods.Gating.INPUT);
      forgetGate.gate(forget, Methods.Gating.SELF);
      outputGate.gate(output, Methods.Gating.OUTPUT);

兩者顯然不一樣！

似乎 weight 就是留給這個目的用的！

*/

/* 但作者說：

https://github.com/wagenaartje/neataptic/issues/25

function LSTM(inputSize, hiddenSize, outputSize){
  var input = new Layer.Dense(inputSize);
  var hidden = new Layer.LSTM(hiddenSize);
  var output = new Layer.Dense(outputSize);

  input.connect(hidden, Methods.Connection.ALL_TO_ALL);
  hidden.connect(output, Methods.Connection.ALL_TO_ALL);

  // option.inputToOutput is set to true for Architect.LSTM
  if(true)
    input.connect(output, Methods.Connection.ALL_TO_ALL);

  return Architect.Construct([input, hidden, output]);
}

和下列是一樣的！

var network = new Architect.LSTM(1,6,1);

試試看！*/
