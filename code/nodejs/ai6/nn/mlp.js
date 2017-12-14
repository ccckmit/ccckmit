/* eslint-disable camelcase */
module.exports = function (ai6) {
  var NN = ai6.NN

  var MLP = function (settings) {
    this.x = settings['input']
    this.y = settings['label']
    this.sigmoidLayers = []
    this.nLayers = settings['hiddenLayerSizes'].length
    for (var i = 0; i < this.nLayers + 1; i++) {
      var inputSize = (i === 0) ? settings['nIns'] : settings['hiddenLayerSizes'][i - 1]
      var inputLayer = (i === 0) ? this.x : this.sigmoidLayers[this.sigmoidLayers.length - 1].sampleHgivenV()
      var nOut = (i === this.nLayers) ? settings['nOuts'] : settings['hiddenLayerSizes'][i]
      var sigmoidLayer = new NN.NetLayer({
        input: inputLayer,
        nIn: inputSize,
        nOut: nOut,
        activation: NN.sigmoid,
        W: (typeof settings['w_array'] === 'undefined') ? undefined : settings['w_array'][i],
        b: (typeof settings['b_array'] === 'undefined') ? undefined : settings['b_array'][i]
      })
      this.sigmoidLayers.push(sigmoidLayer)
    }
  }

  MLP.prototype.train = function (settings) {
  //  var lr = settings['lr'] || 0.6
    var epochs = settings['epochs'] || 1000
    var currentProgress = 1
    for (var epoch = 0; epoch < epochs; epoch++) {
      NN.gradientOptimizer(this.x, this.y, this.sigmoidLayers, NN.dSigmoid)
      var progress = (1.0 * (epoch / epochs)) * 100
      if (progress > currentProgress) {
        console.log('MLP', progress.toFixed(0), '% Completed.')
        currentProgress += 8
      }
    }
    console.log('MLP Final Cross Entropy : ', this.getReconstructionCrossEntropy())
  }

  MLP.prototype.getReconstructionCrossEntropy = function () {
    var yPredict = this.predict(this.x)
    return NN.binaryCrossEntropy(this.y, yPredict)
  }

  MLP.prototype.predict = function (x) {
    var inputLayers = NN.feedForward(x, this.sigmoidLayers)
    return inputLayers[inputLayers.length - 1]
  }

  return MLP
}
