var neataptic = require('neataptic')
var W = require('./words')
var LstmClass = require('./lstmNeataptic')
// var LstmClass = require('./lstmRecurrentjs')
var Lstm = module.exports = new LstmClass()

Lstm.predict = function (sentence) {
  console.log('===== predict:%s ====', sentence)
  var tWords = Lstm.sentenceMt(sentence)
  return tWords
}

Lstm.line2words = function (sentence) {
  return W.text2words(Lstm.setting.startWord + ' ' + sentence + ' ' + Lstm.setting.endWord)
}

Lstm.s2tMt = function (sentence) {
  var sVector = Lstm.text2vector(sentence)
  return Lstm.s2tNetwork.activate(sVector)
}

Lstm.t2tMt = function (sentence, sVector) {
  let tWords = []
  let tVectorLast = Lstm.text2vector(Lstm.setting.startWord)
  for (let ti = 0; ; ti++) {
    let tVector = Lstm.activate(sVector.concat(tVectorLast))
    var t = tVector.indexOf(Math.max(...tVector))
    let tWord = Lstm.setting.words[t]
    if (tWord === Lstm.setting.startWord) continue
    if (tWord === Lstm.setting.endWord) break
//    console.log('tWord=%s', tWord)
    tWords.push(tWord)
    tVectorLast = tVector
  }
  return tWords
}

Lstm.sentenceMt = function (sentence) {
  let sVector = Lstm.s2tMt(sentence)
  console.log('(candidates)')
  Lstm.probPrint(sVector, 0.2)
  let tWords = Lstm.t2tMt(sentence, sVector)
  return tWords
}

Lstm.train = function (text) {
  Lstm.s2tNetwork = Lstm.s2tTrain(text)
  var words = Lstm.setting.words
  var dataSet = Lstm.mtDataSet(text.split(/\r?\n/))
//  console.log('dataSet=%s', JSON.stringify(dataSet))
  Lstm.network = Lstm.dataTrain(dataSet, {in: dataSet[0].input.length, hidden: Math.min(dataSet[0].input.length, 100), out: words.length}) // Lstm.dataTrain}Lstm.setting.words
}

Lstm.s2tTrain = function (text) {
  var words = Lstm.setting.words = W.getWordSet(Lstm.setting.startWord + ' ' + text + ' ' + Lstm.setting.endWord)
  console.log('Lstm.setting.words=%j', Lstm.setting.words)
  Lstm.setting.w2i = W.words2map(Lstm.setting.words)
  console.log('Lstm.setting.w2i=%j', Lstm.setting.w2i)
  var dataSet = Lstm.s2tDataSet(text.split(/\r?\n/))
//  console.log('dataSet=%s', JSON.stringify(dataSet))
  return Lstm.dataTrain(dataSet, {in: words.length, hidden: Math.min(words.length, 100), out: words.length}) // Lstm.dataTrain}Lstm.setting.words
}

Lstm.text2vector = function (text) {
  let words = W.text2words(text)
  let vector = W.words2vector(words, Lstm.setting.words.length, Lstm.setting.w2i)
  return vector
}

Lstm.mtDataSet = function (lines) {
  var dataSet = []
  for (let i = 0; i < lines.length; i++) {
    var parts = lines[i].split('=')
    if (parts.length < 2) continue
    var [sLine, tLine] = parts
//    console.log('s=%s t=%s', sLine, tLine)
    var sVector = Lstm.s2tMt(sLine)
    let tWords = Lstm.line2words(tLine)
    let tVectorLast = Lstm.text2vector(tWords[0])
    for (var ti = 0; ti < tWords.length; ti++) {
      let tVector = Lstm.text2vector(tWords[ti])
      let data = {input: sVector.concat(tVectorLast), output: tVector}
//      console.log('data = %j', data)
      dataSet.push(data)
      tVectorLast = tVector
    }
  }
  return dataSet
}

Lstm.s2tDataSet = function (lines) {
  var dataSet = []
  for (let i = 0; i < lines.length; i++) {
    var parts = lines[i].split('=')
    if (parts.length < 2) continue
    var [sLine, tLine] = parts
    var s2tData = {
      input: Lstm.text2vector(sLine),
      output: Lstm.text2vector(tLine)
    }
    dataSet.push(s2tData)
  }
  return dataSet
}

Lstm.toJSON = function () {
  this.setting.network = this.network.toJSON()
  this.setting.s2tNetwork = this.s2tNetwork.toJSON()
  var json = JSON.stringify(this.setting, null, 2)
  return json
}

Lstm.fromJSON = function (json) {
  var S = JSON.parse(json)
  this.setting = S
  this.network = neataptic.Network.fromJSON(S.network)
  this.s2tNetwork = neataptic.Network.fromJSON(S.s2tNetwork)
}
