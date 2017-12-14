// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var neataptic = require('neataptic')
// var Neat = neataptic.Neat
var Methods = neataptic.Methods
var Config = neataptic.Config
var Architect = neataptic.Architect
// var Network = neataptic.Network
// var Node = neataptic.Node

/** Turn off warnings */
Config.warnings = false

/** Unique characters */
function getCharSet (text) {
  var characters = text.split('').filter(function (item, i, ar) { return ar.indexOf(item) === i })
  return characters
}

/** One-hot encode them */
function oneHotEncoding (characters) {
  var onehot = {}
  for (let i = 0; i < characters.length; i++) {
    var zeros = Array.apply(null, Array(characters.length)).map(Number.prototype.valueOf, 0)
    zeros[i] = 1
    var character = characters[i]
    onehot[character] = zeros
  }
  return onehot
}

/** Prepare the data-set */
function text2dataSet (text, onehot) {
  var dataSet = []
  for (let i = 1; i < text.length; i++) {
    var previous = text[i - 1]
    var next = text[i]
    console.log('previous=%s next=%s onehot=%j %j', previous, next, onehot[previous], onehot[next])
    dataSet.push({ input: onehot[previous], output: onehot[next] })
  }
  return dataSet
}

function writeSentence (text, onehot, dataSet) {
  var outputText = []
  var output = network.activate(dataSet[0].input)
  outputText.push(text[0])

  for (let i = 0; i < text.length; i++) {
    var max = Math.max.apply(null, output)
    var index = output.indexOf(max)

    var zeros = Array.apply(null, Array(characters.length)).map(Number.prototype.valueOf, 0)
    zeros[index] = 1

    var character = Object.keys(onehot).find(key => onehot[key].toString() === zeros.toString())
    outputText.push(character)
    console.log(character)

    output = network.activate(zeros)
  }
}

var text = `Am I concious? Or am I not?`.toLowerCase() // Text to learn
var characters = getCharSet(text)
var onehot = oneHotEncoding(characters)
var dataSet = text2dataSet(text, onehot)
var network = new Architect.LSTM(characters.length, 10, characters.length)

console.log('Characters=%s, count=%d', characters, Object.keys(onehot).length)
console.log('onehot=%j', onehot)
console.log('dataset.size=%d, dataSet=%j', dataSet.length, dataSet)
console.log('Network conns', network.connections.length, 'nodes', network.nodes.length)

network.train(dataSet, {
  log: 1,
  rate: 0.1,
  cost: Methods.Cost.MSE,
  error: 0.005,
  clear: true
})

// writeSentence(text, onehot, dataSet)

writeSentence(text, onehot, dataSet)
