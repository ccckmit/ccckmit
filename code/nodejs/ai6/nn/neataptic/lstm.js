// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var neataptic = require('neataptic')
var Methods = neataptic.Methods
var Config = neataptic.Config
var Architect = neataptic.Architect

var LSTM = module.exports = {
  mode: 'char',
  startWord: '[#start#]'
}

LSTM.init = function () {
  Config.warnings = false
}

LSTM.text2words = function (text) {
  return text.toLowerCase().split(/\s+/).filter(word => word.length > 0)
}

LSTM.text2chars = function (text) {
  return text.split('')
}

LSTM.words2set = function (words) {
  var wordSet = new Set()
  for (let word of words) {
    wordSet.add(word)
  }
  return wordSet
}

LSTM.oneHotMap = function (words) {
  let wordVecMap = {}
  let vecWordMap = {}
  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    let vector = Array(words.length).fill(0)
    vector[i] = 1
    wordVecMap[word] = vector
    vecWordMap[vector] = word
  }
  return {wordVecMap: wordVecMap, vecWordMap: vecWordMap}
}

LSTM.seqDataSet = function (sWords, wordVecMap) {
  var dataSet = []
  for (let i = 1; i < sWords.length; i++) {
    var sVector = wordVecMap[sWords[i - 1]]
    var tVector = wordVecMap[sWords[i]]
    dataSet.push({ input: sVector, output: tVector })
  }
  return dataSet
}

LSTM.dataTrain = function (dataSet, words) {
  var network = new Architect.LSTM(words.length, Math.min(words.length, 100), words.length)

  console.log('Network conns', network.connections.length, 'nodes', network.nodes.length)

  network.train(dataSet, {
    log: 1,
    rate: 0.1,
    cost: Methods.Cost.MSE,
    error: 0.01,
    clear: true
  })

  return network
}

LSTM.prob2word = function (tProb, words, vecWordMap) {
  var max = Math.max.apply(null, tProb)
  var tIndex = tProb.indexOf(max)
  var tVector = Array(words.length).fill(0)
  tVector[tIndex] = 1
  var tWord = vecWordMap[tVector] // Object.keys(v).find(key => Vector[key].toString() === zeros.toString());  
  return tWord
}

LSTM.train = function (seqText) {
  console.log('seqText=%j', seqText)
  var seqWords = (LSTM.mode === 'char') ? LSTM.text2chars(seqText) : LSTM.text2words(seqText)
  seqWords = [LSTM.startWord].concat(seqWords)
  var wordSet = LSTM.words2set(seqWords)
  LSTM.words = Array.from(wordSet)
  console.log('words = %j', LSTM.words)
  var {wordVecMap, vecWordMap} = LSTM.oneHotMap(LSTM.words)
  LSTM.wordVecMap = wordVecMap
  LSTM.vecWordMap = vecWordMap

  var seqData = LSTM.seqDataSet(seqWords, LSTM.wordVecMap)
  LSTM.network = LSTM.dataTrain(seqData, LSTM.words)
}

LSTM.genSentence = function (sWords, stops = [], maxLen = 10) {
  var genList = []
  var lastWord = LSTM.startWord
  var word
  for (let i = 0; i < sWords.length; i++) {
    genList.push(sWords[i])
    let prob = LSTM.network.activate(LSTM.wordVecMap[sWords[i]])
    word = LSTM.prob2word(prob, LSTM.words, LSTM.vecWordMap)
    lastWord = word
  }
  for (let i = 0; i < maxLen; i++) {
    genList.push(word)
    let prob = LSTM.network.activate(LSTM.wordVecMap[lastWord])
    word = LSTM.prob2word(prob, LSTM.words, LSTM.vecWordMap)
    if (stops.indexOf(word) >= 0) break
    lastWord = word
  }
  genList.push(word)
  return genList
}

LSTM.genLines = function (sLines, stops = [], maxLen = 100, postTriggers = [], preTrigger = []) {
  for (let line of sLines) {
    let prefix = preTrigger.concat(LSTM.text2words(line)).concat(postTriggers)
    var genList = LSTM.genSentence(prefix, stops, maxLen)
    var genText = (LSTM.mode === 'char') ? genList.join('') : genList.join(' ')
    console.log('======== gen (prefix=%j) ===========', prefix)
    console.log('%s', genText)
  }
}

LSTM.toJSON = function () {
  var obj = {
    mode: LSTM.mode,
    words: LSTM.words,
    wordVecMap: LSTM.wordVecMap,
    vecWordMap: LSTM.vecWordMap,
    network: LSTM.network.toJSON()
  }
  var json = JSON.stringify(obj, null, 2)
  return json
}

LSTM.fromJSON = function (json) {
  var obj = JSON.parse(json)
  LSTM.mode = obj.mode
  LSTM.words = obj.words
  LSTM.wordVecMap = obj.wordVecMap
  LSTM.vecWordMap = obj.vecWordMap
  LSTM.network = neataptic.Network.fromJSON(obj.network)
}
