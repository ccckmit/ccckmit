// ref: https://jsfiddle.net/wagenaartje/k23zbf0f/1/
var W = require('./words')
var LstmClass = require('./lstm')
var Lstm = module.exports = new LstmClass()

Lstm.predict = function (line, maxLen = 10) {
  var sWords = W.text2words(line)
  var genList = Lstm.genSentence(sWords, [], maxLen)
  var genText = (Lstm.setting.mode === 'char') ? genList.join('') : genList.join(' ')
  console.log('======== gen (line=%s) ===========', line)
  console.log('%s', genText)
}

Lstm.getSeqWords = function (seqText) {
  console.log('seqText=%j', seqText)
  var seqWords = (Lstm.setting.mode === 'char') ? W.text2chars(seqText) : W.text2words(seqText)
  return [Lstm.setting.startWord].concat(seqWords)
}

Lstm.train = function (seqText) {
/*
  console.log('seqText=%j', seqText)
  var seqWords = (Lstm.setting.mode === 'char') ? W.text2chars(seqText) : W.text2words(seqText)
  seqWords = [Lstm.setting.startWord].concat(seqWords)
  var wordSet = W.words2set(seqWords)
  var words = Lstm.setting.words = Array.from(wordSet)
*/
  var seqWords = Lstm.getSeqWords(seqText)
  var wordSet = W.words2set(seqWords)
  var words = Lstm.setting.words = Array.from(wordSet)
  console.log('words = %j', words)
  var {wordVecMap, vecWordMap} = W.oneHotMap(words)
  Lstm.setting.wordVecMap = wordVecMap
  Lstm.setting.vecWordMap = vecWordMap

  var seqData = Lstm.seqDataSet(seqWords, Lstm.setting.wordVecMap)
  Lstm.network = Lstm.dataTrain(seqData, {in: words.length, hidden: Math.min(words.length, 100), out: words.length}) // Lstm.setting.words
}

Lstm.seqDataSet = function (sWords, wordVecMap) {
  var dataSet = []
  for (let i = 1; i < sWords.length; i++) {
    var sVector = wordVecMap[sWords[i - 1]]
    var tVector = wordVecMap[sWords[i]]
    dataSet.push({ input: sVector, output: tVector })
  }
  return dataSet
}

Lstm.genSentence = function (sWords, stops = [], maxLen = 10) {
  var genList = []
  var lastWord = Lstm.setting.startWord
  var word
  for (let i = 0; i < sWords.length; i++) {
    genList.push(sWords[i])
    let prob = Lstm.network.activate(Lstm.setting.wordVecMap[sWords[i]])
    word = W.prob2word(prob, Lstm.setting.words, Lstm.setting.vecWordMap)
    lastWord = word
  }
  for (let i = 0; i < maxLen; i++) {
    genList.push(word)
    let prob = Lstm.network.activate(Lstm.setting.wordVecMap[lastWord])
    word = W.prob2word(prob, Lstm.setting.words, Lstm.setting.vecWordMap)
    if (stops.indexOf(word) >= 0) break
    lastWord = word
  }
  genList.push(word)
  return genList
}

/*
Lstm.genLines = function (sLines, stops = [], maxLen = 100, postTriggers = [], preTrigger = []) {
  for (let line of sLines) {
    let prefix = preTrigger.concat(W.text2words(line)).concat(postTriggers)
    var genList = Lstm.genSentence(prefix, stops, maxLen)
    var genText = (Lstm.setting.mode === 'char') ? genList.join('') : genList.join(' ')
    console.log('======== gen (prefix=%j) ===========', prefix)
    console.log('%s', genText)
  }
}
Lstm.predict = function (maxLen = 10) {
//  console.log('Lstm.setting=%j', Lstm.setting)
  var sLines = ['']
  Lstm.genLines(sLines, [], maxLen)
}

*/