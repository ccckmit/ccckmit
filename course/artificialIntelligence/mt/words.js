var W = module.exports = {}

W.getWordSet = function (text) {
  var words = W.text2words(text)
  var wordSet = W.words2set(words)
  return Array.from(wordSet)
}

W.words2map = function (words) {
  var map = {}
  for (var i = 0; i < words.length; i++) {
    map[words[i]] = i
  }
  return map
}

W.words2vector = function (w, size, w2i) {
  let vector = Array(size).fill(0)
  for (let i = 0; i < w.length; i++) {
    let wi = w2i[w[i]]
    vector[wi] = 1
  }
  return vector
}

W.text2words = function (text) {
  text = text.replace(/\r?\n/g, ' ↓ ')
  return text.toLowerCase().split(/[ \t]+/).filter(word => word.length > 0)
}

W.text2chars = function (text) {
  text = text.replace(/\r?\n/g, '↓')
  return text.split('')
}

W.words2set = function (words) {
  var wordSet = new Set()
  for (let word of words) {
    wordSet.add(word)
  }
  return wordSet
}

W.oneHotMap = function (words) {
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

W.prob2word = function (tProb, words, vecWordMap) {
  var max = Math.max.apply(null, tProb)
  var tIndex = tProb.indexOf(max)
  var tVector = Array(words.length).fill(0)
  tVector[tIndex] = 1
  var tWord = vecWordMap[tVector] // Object.keys(v).find(key => Vector[key].toString() === zeros.toString());  
  return tWord
}
