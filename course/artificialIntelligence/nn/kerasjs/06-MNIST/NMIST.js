// 本範例的資料是從 (ipnb) ipython notebook 這種打包檔讀出來的。
// 打包檔在此： https://github.com/transcranial/keras-js/tree/master/notebooks/demos
// 更多關於 ipnb: https://ipython.org/ipython-doc/1/interactive/notebook.html
// Python 版參考： https://github.com/fchollet/keras/blob/master/keras/datasets/imdb.py
const KerasJS = require('keras-js')
const ops = require('ndarray-ops')
const Tensor = KerasJS.Tensor
const lodash = require('lodash')
const range = lodash.range
// const findIndex = lodash.findIndex
// const random = lodash.random

var self = {}

var MODEL_FILEPATHS = {
  model: '../data/mnist_cnn/mnist_cnn.json',
  weights: '../data/mnist_cnn/mnist_cnn_weights.buf',
  metadata: '../data/mnist_cnn/mnist_cnn_metadata.json'
}
/*
const LAYER_DISPLAY_CONFIG = {
  conv2d_1: { heading: '32 3x3 filters, padding valid, 1x1 strides', scalingFactor: 2 },
  activation_1: { heading: 'ReLU', scalingFactor: 2 },
  conv2d_2: { heading: '32 3x3 filters, padding valid, 1x1 strides', scalingFactor: 2 },
  activation_2: { heading: 'ReLU', scalingFactor: 2 },
  max_pooling2d_1: { heading: '2x2 pooling, 1x1 strides', scalingFactor: 2 },
  dropout_1: { heading: 'p=0.25 (only active during training phase)', scalingFactor: 2 },
  flatten_1: { heading: '', scalingFactor: 2 },
  dense_1: { heading: 'output dimensions 128', scalingFactor: 4 },
  activation_3: { heading: 'ReLU', scalingFactor: 4 },
  dropout_2: { heading: 'p=0.5 (only active during training phase)', scalingFactor: 4 },
  dense_2: { heading: 'output dimensions 10', scalingFactor: 8 },
  activation_4: { heading: 'Softmax', scalingFactor: 8 }
}

self.model = new KerasJS.Model({
  filepaths: MODEL_FILEPATHS,
  filesystem: true
})

self.predictedClass = function () {
  if (this.output.reduce((a, b) => a + b, 0) === 0) {
    return -1
  }
  return this.output.reduce((argmax, n, i) => (n > this.output[argmax] ? i : argmax), 0)
}

self.run = function () {
  const ctx = document.getElementById('input-canvas').getContext('2d')
  // center crop
  const imageDataCenterCrop = utils.centerCrop(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height))
  const ctxCenterCrop = document.getElementById('input-canvas-centercrop').getContext('2d')
  ctxCenterCrop.canvas.width = imageDataCenterCrop.width
  ctxCenterCrop.canvas.height = imageDataCenterCrop.height
  ctxCenterCrop.putImageData(imageDataCenterCrop, 0, 0)
  // scaled to 28 x 28
  const ctxScaled = document.getElementById('input-canvas-scaled').getContext('2d')
  ctxScaled.save()
  ctxScaled.scale(28 / ctxCenterCrop.canvas.width, 28 / ctxCenterCrop.canvas.height)
  ctxScaled.clearRect(0, 0, ctxCenterCrop.canvas.width, ctxCenterCrop.canvas.height)
  ctxScaled.drawImage(document.getElementById('input-canvas-centercrop'), 0, 0)
  const imageDataScaled = ctxScaled.getImageData(0, 0, ctxScaled.canvas.width, ctxScaled.canvas.height)
  ctxScaled.restore()
  // process image data for model input
  const { data } = imageDataScaled
  this.input = new Float32Array(784)
  for (let i = 0, len = data.length; i < len; i += 4) {
    this.input[i / 4] = data[i + 3] / 255
  }
  this.model.predict({ input: this.input }).then(outputData => {
    this.output = outputData.output
    this.getIntermediateResults()
  })
}

self.predict = function () {
  self.model.predict({ input: self.input }).then(outputData => {
    self.output = outputData.output
    self.stepwiseCalc()
    console.log('stepwiseOutput=', self.stepwiseOutput)
    self.modelRunning = false
  })
}

var testImage = 

self.model.ready().then(() => {
//  self.randomInput() // 隨機選取一個樣本中的 input
  self.textInput(testText)
  console.log('inputText=%s', self.inputText)
  self.predict()
})
*/