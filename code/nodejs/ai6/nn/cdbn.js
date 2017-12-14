/* eslint-disable camelcase */
module.exports = function (ai6) {
  var NN = ai6.NN

  var CDBN = function (settings) {
    var self = this
    self.x = settings['input']
    self.y = settings['label']
    self.sigmoidLayers = []
    self.rbmLayers = []
    self.nLayers = settings['hiddenLayerSizes'].length
    self.hiddenLayerSizes = settings['hiddenLayerSizes']
    self.nIns = settings['nIns']
    self.nOuts = settings['nOuts']

    self.settings = {
      'log level': 1 // 0 : nothing, 1 : info, 2: warn
    }
    // Constructing Deep Neural Network
    var i
    for (i = 0; i < self.nLayers; i++) {
      var inputSize, layerInput
      if (i === 0) {
        inputSize = settings['nIns']
      } else {
        inputSize = settings['hiddenLayerSizes'][i - 1]
      }

      if (i === 0) {
        layerInput = self.x
      } else {
        layerInput = self.sigmoidLayers[self.sigmoidLayers.length - 1].sampleHgivenV()
      }

      var sigmoidLayer = new NN.NetLayer({
        input: layerInput,
        nIn: inputSize,
        nOut: settings['hiddenLayerSizes'][i],
        activation: NN.sigmoid
      })
      self.sigmoidLayers.push(sigmoidLayer)

      var rbmLayer
      if (i === 0) {
        rbmLayer = new NN.CRBM({
          input: layerInput,
          nVisible: inputSize,
          nHidden: settings['hiddenLayerSizes'][i]
        })
      } else {
        rbmLayer = new NN.RBM({
          input: layerInput,
          nVisible: inputSize,
          nHidden: settings['hiddenLayerSizes'][i]
        })
      }
      self.rbmLayers.push(rbmLayer)
    }
    self.outputLayer = new NN.NetLayer({
      input: self.sigmoidLayers[self.sigmoidLayers.length - 1].sampleHgivenV(),
      nIn: settings['hiddenLayerSizes'][settings['hiddenLayerSizes'].length - 1],
      nOut: settings['nOuts'],
      activation: NN.sigmoid
    })
  }

  CDBN.prototype.__proto__ = NN.DBN.prototype

  return CDBN
}
