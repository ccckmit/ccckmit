var W = require('./words')
var LstmClass = require('./lstm')
var Lstm = module.exports = new LstmClass()

Lstm.predict = function (sentence) {
  console.log('===== predict:%s ====', sentence)
  var p = Lstm.sentenceMt(sentence)
  Lstm.probPrint(p, 0.2)
  return p
}

Lstm.sentenceMt = function (sentence) {
  var sVector = Lstm.text2vector(sentence)
  return Lstm.network.activate(sVector)
}

Lstm.train = function (text) {
  var words = Lstm.setting.words = W.getWordSet(text)
  console.log('Lstm.setting.words=%j', Lstm.setting.words)
  Lstm.setting.w2i = W.words2map(Lstm.setting.words)
  console.log('Lstm.setting.w2i=%j', Lstm.setting.w2i)
  var dataSet = Lstm.mtDataSet(text.split(/\r?\n/))
//  console.log('dataSet=%s', JSON.stringify(dataSet))
  Lstm.network = Lstm.dataTrain(dataSet, {in: words.length, hidden: Math.min(words.length, 100), out: words.length}) // Lstm.dataTrain}Lstm.setting.words
}

Lstm.text2vector = function (text) {
  let words = W.text2words(text)
  let vector = W.words2vector(words, Lstm.setting.words.length, Lstm.setting.w2i)
  return vector
}

Lstm.s2tData = function (sLine, tLine) {
  return {
    input: Lstm.text2vector(sLine),
    output: Lstm.text2vector(tLine)
  }
}

Lstm.mtDataSet = function (lines) {
//  console.log('lines=%j', lines)
  var dataSet = []
  for (let i = 0; i < lines.length; i++) {
    var parts = lines[i].split('=')
    if (parts.length < 2) continue
    var [sLine, tLine] = parts
//    console.log('s=%s t=%s', sLine, tLine)
    var s2tData = Lstm.s2tData(sLine, tLine)
//    console.log('s2tData=%j', s2tData)
    dataSet.push(s2tData)
  }
  return dataSet
}
