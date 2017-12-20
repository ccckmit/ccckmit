// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var neataptic = require('neataptic')

neataptic.Config.warnings = false

module.exports = class Lstm {
  constructor () {
    this.setting = {
      mode: 'char',
      startWord: '[#start#]'
    }
  }

  // ex: dataTrain(dataSet, {in:10, hidden:8, out:10})
  dataTrain (dataSet, size) {
    var network = new neataptic.Architect.LSTM(size.in, size.hidden, size.out)
    console.log('Network conns', network.connections.length, 'nodes', network.nodes.length)
    network.train(dataSet, {
      log: 1,
      rate: 0.1,
      cost: neataptic.Methods.Cost.MSE,
      error: 0.01,
      clear: true
    })
    return network
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
