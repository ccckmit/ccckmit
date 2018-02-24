// 本範例的資料是從 (ipnb) ipython notebook 這種打包檔讀出來的。
// 打包檔在此： https://github.com/transcranial/keras-js/tree/master/notebooks/demos
// 更多關於 ipnb: https://ipython.org/ipython-doc/1/interactive/notebook.html
// Python 版參考： https://github.com/fchollet/keras/blob/master/keras/datasets/imdb.py
const KerasJS = require('keras-js')
const ops = require('ndarray-ops')
const Tensor = KerasJS.Tensor
const lodash = require('lodash')
const findIndex = lodash.findIndex
const random = lodash.random

var self = {}

var MODEL_FILEPATHS = {
  model: '../data/imdb_bidirectional_lstm/imdb_bidirectional_lstm.json',
  weights: '../data/imdb_bidirectional_lstm/imdb_bidirectional_lstm_weights.buf',
  metadata: '../data/imdb_bidirectional_lstm/imdb_bidirectional_lstm_metadata.json'
}

self.model = new KerasJS.Model({
  filepaths: MODEL_FILEPATHS,
  filesystem: true
})

self.wordIndex = require('../data/imdb_bidirectional_lstm/imdb_dataset_word_index_top20000.json')
self.wordDict = require('../data/imdb_bidirectional_lstm/imdb_dataset_word_dict_top20000.json')
self.testSamples = require('../data/imdb_bidirectional_lstm/imdb_dataset_test.json')

self.stepwiseCalc = function () {
  const fcLayer = this.model.modelLayersMap.get('dense_2')
  const forwardHiddenStates = this.model.modelLayersMap.get('bidirectional_2').forwardLayer.hiddenStateSequence
  const backwardHiddenStates = this.model.modelLayersMap.get('bidirectional_2').backwardLayer.hiddenStateSequence
  const forwardDim = forwardHiddenStates.tensor.shape[1]
  const backwardDim = backwardHiddenStates.tensor.shape[1]
  const start = findIndex(this.input, idx => idx >= INDEX_FROM)
  if (start === -1) return
  let stepwiseOutput = []
  for (let i = start; i < MAXLEN; i++) {
    let tempTensor = new Tensor([], [forwardDim + backwardDim])
    ops.assign(tempTensor.tensor.hi(forwardDim).lo(0), forwardHiddenStates.tensor.pick(i, null))
    ops.assign(
      tempTensor.tensor.hi(forwardDim + backwardDim).lo(forwardDim),
      backwardHiddenStates.tensor.pick(MAXLEN - i - 1, null)
    )
    stepwiseOutput.push(fcLayer.call(tempTensor).tensor.data[0])
  }
  this.stepwiseOutput = stepwiseOutput
}

const MAXLEN = 200
const START_WORD_INDEX = 1
const OOV_WORD_INDEX = 2
const INDEX_FROM = 3

self.randomInput = function () {
  self.isSampleText = true
  const randSampleIdx = random(0, self.testSamples.length - 1)
  const values = self.testSamples[randSampleIdx].values
  self.sampleTextLabel = self.testSamples[randSampleIdx].label === 0 ? 'negative' : 'positive'
  const words = values.map(idx => {
    if (idx === 0 || idx === 1) {
      return ''
    } else if (idx === 2) {
      return '<OOV>'
    } else {
      return self.wordDict[idx - INDEX_FROM]
    }
  })
  self.inputTextParsed = words.filter(w => !!w)
  self.inputText = words.join(' ').trim()
  self.input = new Float32Array(values)
  return self.input
}

self.textInput = function (text) {
  this.input = new Float32Array(MAXLEN)
  // by convention, use 2 as OOV word
  // reserve 'index_from' (=3 by default) characters: 0 (padding), 1 (start), 2 (OOV)
  // see https://github.com/fchollet/keras/blob/master/keras/datasets/imdb.py
  this.inputText = text
  this.inputTextParsed = this.inputText.trim().toLowerCase().split(/[\s\.,!?]+/gi)  
  let indices = this.inputTextParsed.map(word => {
    const index = this.wordIndex[word]
    return !index ? OOV_WORD_INDEX : index + INDEX_FROM
  })
  indices = [START_WORD_INDEX].concat(indices)
  indices = indices.slice(-MAXLEN)
  // padding and truncation (both pre sequence)
  const start = Math.max(0, MAXLEN - indices.length)
  for (let i = start; i < MAXLEN; i++) {
    this.input[i] = indices[i - start]
  }
}

self.predict = function () {
  self.model.predict({ input: self.input }).then(outputData => {
    self.output = outputData.output
    self.stepwiseCalc()
    console.log('stepwiseOutput=', self.stepwiseOutput)
    self.modelRunning = false
  })
}

var testText =
`murder over new york is fun but not as good as most of the other fox <OOV> this film would have been better named charlie chan in new york the film's working title this is chance to play chan in the big apple there is a lot to like here though including guest star shemp howard of the three stooges br br this has one of my favorite chan <OOV> coincidence like ancient egg leave unpleasant <OOV> and <OOV> are good in this one and so is the supporting cast but there is little or no mysterious atmosphere which i look for in these films still it is good to see`

self.model.ready().then(() => {
//  self.randomInput() // 隨機選取一個樣本中的 input
  self.textInput(testText)
  console.log('inputText=%s', self.inputText)
  self.predict()
})
