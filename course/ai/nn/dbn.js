/* eslint-disable camelcase */
module.exports = function (ai6) {
  var NN = ai6.NN

  var DBN = function (settings) {
    this.x = settings['input']
    this.y = settings['label']
    this.sigmoidLayers = []
    this.rbmLayers = []
    this.hiddenLayerSizes = settings['hiddenLayerSizes']
    this.nLayers = settings['hiddenLayerSizes'].length
    this.nIns = settings['nIns']
    this.nOuts = settings['nOuts']

    // Constructing Deep Neural Network
    for (let i = 0; i < this.nLayers; i++) {
      var inputSize, layerInput
      inputSize = (i === 0) ? settings['nIns'] : settings['hiddenLayerSizes'][i - 1]
      layerInput = (i === 0) ? this.x : this.sigmoidLayers[this.sigmoidLayers.length - 1].sampleHgivenV()
      var sigmoidLayer = new NN.NetLayer({
        'input': layerInput,
        'nIn': inputSize,
        'nOut': settings['hiddenLayerSizes'][i],
        'activation': NN.sigmoid
      })
      this.sigmoidLayers.push(sigmoidLayer)

      var rbmLayer = new NN.RBM({
        'input': layerInput,
        'nVisible': inputSize,
        'nHidden': settings['hiddenLayerSizes'][i]
      })
      this.rbmLayers.push(rbmLayer)
    }
    this.outputLayer = new NN.NetLayer({
      'input': this.sigmoidLayers[this.sigmoidLayers.length - 1].sampleHgivenV(),
      'nIn': settings['hiddenLayerSizes'][settings['hiddenLayerSizes'].length - 1],
      'nOut': settings['nOuts'],
      'activation': NN.sigmoid
    })
  }

  DBN.prototype.pretrain = function (settings) {
    var lr = settings['lr'] || 0.6
    var k = settings['k'] || 1
    var epochs = settings['epochs'] || 2000

    for (let i = 0; i < this.nLayers; i++) {
      var layerInput, rbm
      if (i === 0) {
        layerInput = this.x
      } else {
        layerInput = this.sigmoidLayers[i - 1].sampleHgivenV(layerInput)
      }
      rbm = this.rbmLayers[i]
      rbm.logLevel = 0
      rbm.train({
        'lr': lr,
        'k': k,
        'input': layerInput,
        'epochs': epochs
      })

      console.log('DBN RBM', i, 'th Layer Final Cross Entropy: ', rbm.getReconstructionCrossEntropy())
      console.log('DBN RBM', i, 'th Layer Pre-Training Completed.')

      // Synchronization between RBM and sigmoid Layer
      this.sigmoidLayers[i].W = rbm.W
      this.sigmoidLayers[i].b = rbm.hbias
    }
    console.log('DBN Pre-Training Completed.')
  }

  DBN.prototype.finetune = function (settings) {
    var lr = 0.2
    var epochs = 1000
    if (typeof settings['lr'] !== 'undefined') lr = settings['lr']
    if (typeof settings['epochs'] !== 'undefined') epochs = settings['epochs']
    // Fine-Tuning Using MLP (Back Propagation)
    var pretrainedWArray = []
    var pretrainedBArray = [] // NetLayer W,b values already pretrained by RBM.
    for (let i = 0; i < this.nLayers; i++) {
      pretrainedWArray.push(this.sigmoidLayers[i].W)
      pretrainedBArray.push(this.sigmoidLayers[i].b)
    }
    // W,b of Final Output Layer are not involved in pretrainedWArray, pretrainedBArray so they will be treated as undefined at MLP Constructor.
    var mlp = new NN.MLP({
      'input': this.x,
      'label': this.y,
      'n_ins': this.nIns,
      'nOuts': this.nOuts,
      'hiddenLayerSizes': this.hiddenLayerSizes,
      'w_array': pretrainedWArray,
      'b_array': pretrainedBArray
    })
    mlp.train({
      'lr': lr,
      'epochs': epochs
    })
    for (let i = 0; i < this.nLayers; i++) {
      this.sigmoidLayers[i].W = mlp.sigmoidLayers[i].W
      this.sigmoidLayers[i].b = mlp.sigmoidLayers[i].b
    }
    this.outputLayer.W = mlp.sigmoidLayers[this.nLayers].W
    this.outputLayer.b = mlp.sigmoidLayers[this.nLayers].b
  }

  DBN.prototype.getReconstructionCrossEntropy = function () {
    var reconstructedOutput = this.predict(this.x)
    return NN.binaryCrossEntropy(this.y, reconstructedOutput)
  }

  DBN.prototype.predict = function (x) {
    var inputLayers = NN.feedForward(x, this.sigmoidLayers)
    return inputLayers[inputLayers.length - 1]
  }

  return DBN
}
