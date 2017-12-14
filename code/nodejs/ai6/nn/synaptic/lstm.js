// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var neataptic = require('synaptic')
var Methods = neataptic.Methods
var Config = neataptic.Config
var Architect = neataptic.Architect

var LSTM = module.exports = {}

LSTM.init = function () {
  Config.warnings = false
}

LSTM.text2words = function (text) {
  return text.toLowerCase().replace(/([\W])/g, ' $1 ').split(/\s+/)
//  return text.toLowerCase().replace(/([\S])/g, ' $1 ').split(/\s+/)
}

LSTM.words2set = function (words) {
  var wordSet = new Set()
  for (let word of words) {
    wordSet.add(word)
  }
  return wordSet
}
/*
LSTM.union = function (setA, setB) {
  var union = new Set(setA)
  for (var elem of setB) {
    union.add(elem)
  }
  return union
}
*/
/** One-hot encode them */
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
    console.log('Seq: sWord[%d]=%s %j sWord[%d]=%s %j', i - 1, sWords[i - 1], sVector, i, sWords[i], tVector)
    dataSet.push({ input: sVector, output: tVector })
  }
  return dataSet
}

LSTM.training = function (dataSet, wordSet) {
  console.log('dataSet=%j', dataSet)

  var lstm = new Architect.LSTM(wordSet.size, 10, wordSet.size)

  var trainer = new Trainer(lstm)

  trainer.DSR({
    targets: targets,
    distractors: distractors,
    prompts: prompts,
    length: wordSet.size,
    rate: .17,
    iterations: 250000
  })

  console.log('Network conns', network.connections.length, 'nodes', network.nodes.length)

  network.train(dataSet, {
    log: 1,
    rate: 0.1,
    cost: Methods.Cost.MSE,
//    error: 0.005,
    error: 0.01,
    clear: true
  })

  return network
}

LSTM.prob2word = function (tProb, wordSet, vecWordMap) {
  var max = Math.max.apply(null, tProb)
  var tIndex = tProb.indexOf(max)
  var tVector = Array(wordSet.size).fill(0)
  tVector[tIndex] = 1
  var tWord = vecWordMap[tVector] // Object.keys(v).find(key => Vector[key].toString() === zeros.toString());  
  return tWord
}

LSTM.train = function (seqText) {
  var seqWords = LSTM.text2words(seqText)
  console.log('seqWords = %j', seqWords)
  LSTM.wordSet = LSTM.words2set(seqWords)
  var words = Array.from(LSTM.wordSet)
  console.log('words = %j', words)
  var {wordVecMap, vecWordMap} = LSTM.oneHotMap(words)
  LSTM.wordVecMap = wordVecMap
  LSTM.vecWordMap = vecWordMap

  var seqData = LSTM.seqDataSet(seqWords, LSTM.wordVecMap)
  LSTM.network = LSTM.training(seqData, LSTM.wordSet)
}

LSTM.genSentence = function (sWords) {
  var genList = []
  var lastWord = ''
  var word
  for (let i = 0; i < sWords.length; i++) {
    var sWord = sWords[i]
//    console.log('source:word=%s', sWord)
    genList.push(sWords[i])
    let prob = LSTM.network.activate(LSTM.wordVecMap[sWords[i]])
    word = LSTM.prob2word(prob, LSTM.wordSet, LSTM.vecWordMap)
    lastWord = word
  }
  while (true) {
    genList.push(word)
    let prob = LSTM.network.activate(LSTM.wordVecMap[lastWord])
    word = LSTM.prob2word(prob, LSTM.wordSet, LSTM.vecWordMap)
    if (word === '.') break
//    console.log('target:word=%s', word)
    lastWord = word
  }
  genList.push(word)
  return genList.join('')
//  network.activate(wordVecMap['.'])
}

LSTM.genLines = function (sLines, triggers = []) {
  console.log('sLines=%j', sLines)
  for (let line of sLines) {
    console.log('======== gen ===========')
    let sWords = LSTM.text2words(line).concat(triggers)
    console.log('sWords = %j', sWords)
    var gen = LSTM.genSentence(sWords)
    console.log('gen = %s', gen)
  }
}

/*
LSTM.sentenceMt = function (sWords) {
  console.log('======== MT ===========')
  for (let i = 0; i < sWords.length; i++) {
    var sWord = sWords[i]
    console.log('source:word=%s', sWord)
    let prob = LSTM.network.activate(LSTM.wordVecMap[sWords[i]])
    let word = LSTM.prob2word(prob, LSTM.wordSet, LSTM.vecWordMap)
  }
  var lastWord = '='
  while (true) {
//  for (let i = 0; i < sWords.length; i++) {
    let prob = LSTM.network.activate(LSTM.wordVecMap[lastWord])
    let word = LSTM.prob2word(prob, LSTM.wordSet, LSTM.vecWordMap)
    console.log('target:word=%s', word)
    if (word === '.') break
    lastWord = word
  }
//  network.activate(wordVecMap['.'])
}
*/
