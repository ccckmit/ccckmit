/*
自建網路： https://wagenaartje.github.io/neataptic/
https://wagenaartje.github.io/neataptic/docs/architecture/layer/

var input = new Layer.Dense(2);
var hidden1 = new Layer.LSTM(5);
var hidden2 = new Layer.GRU(3);
var output = new Layer.Dense(1);

input.connect(hidden1);
hidden1.connect(hidden2);
hidden2.connect(output);

var myNetwork = Architect.Construct([input, hidden1, hidden2, output]);

自建網路： https://github.com/wagenaartje/neataptic/issues/25

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

*/

var W = require('./words')
var sLstm = require('./lstmSeq')
var mtLstm = module.exports = require('./lstm')

sLstm.seqTrain = sLstm.train

sLstm.train = function (seqText) {
  let lines = seqText.split(/\r?\n/)
  let sList = []
  for (let line of lines) {
    let parts = line.split('=')
    if (parts.length < 2) continue
    let sLine = parts[0]
    sList.push(sLine.trim())
  }
  let sText = sList.join(' ↓ ')
  console.log('sText=%s', sText)
  sLstm.seqTrain(sText)
}

mtLstm.train = function (seqText) {
  sLstm.train(seqText)
  let lines = seqText.split(/\r?\n/)
  for (let line of lines) {
    let parts = line.split('=')
    if (parts.length < 2) continue
    let sLine = parts[0]
    let tLine = parts[1]
    let sWords = sLine.split(/\s+/)
    let tWords = tLine.split(/\s+/)
    for (let t = 0; t < sWords.length; t++) {
      var p = sLstm.network.activate(sLstm.setting.wordVecMap[sWords[t]])
      // var h = sLstm.network.hidden
      var c = sLstm.network.hidden
    }
  }
  let sText = sList.join(' ↓ ')
  console.log('sText=%s', sText)
}
