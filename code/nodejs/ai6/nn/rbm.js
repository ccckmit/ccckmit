/* eslint-disable camelcase */
module.exports = function (ai6) {
  var j6 = ai6.j6
  var NN = ai6.NN

  var RBM = function (settings) {
    if (typeof settings === 'undefined') return
    Object.assign(this, settings)
    var a = 1.0 / this.nVisible
    this.W = this.W || j6.M.random(this.nVisible, this.nHidden, -a, a)
    this.hbias = this.hbias || j6.V.new(this.nHidden)
    this.vbias = this.vbias || j6.V.new(this.nVisible)
  }

  RBM.prototype.train = function (settings) {
    var lr = settings.lr || 0.8
    var k = settings.k || 1
    var epochs = settings.epochs || 1500
    this.input = settings.input || this.input

    var currentProgress = 1
    for (let i = 0; i < epochs; i++) {
      this.cdk(k, lr)
      var progress = (1.0 * i / epochs) * 100
      if (progress > currentProgress) {
        console.log('RBM', progress.toFixed(0), '% Completed.')
        currentProgress += 8
      }
    }
    console.log('RBM Final Cross Entropy : ', this.getReconstructionCrossEntropy())
  }

  /* CD - k . Contrastive Divergence */
  RBM.prototype.cdk = function (k, lr) {
    var ph = this.sampleHgivenV(this.input)
    var phMean = ph[0]
    var phSample = ph[1]
    var chainStart = phSample
    var gibbsVH, nvSamples, nhMeans, nhSamples // nvMeans,
    for (let j = 0; j < k; j++) {
      if (j === 0) {
        gibbsVH = this.gibbsHVH(chainStart)
        nvSamples = gibbsVH[1]
        nhMeans = gibbsVH[2]
        nhSamples = gibbsVH[3] // nvMeans = gibbsVH[0]
      } else {
        gibbsVH = this.gibbsHVH(nhSamples)
        nvSamples = gibbsVH[1]
        nhMeans = gibbsVH[2]
        nhSamples = gibbsVH[3] // nvMeans = gibbsVH[0]
      }
    }
    // ((input^t*phMean)-(nvSample^t*nhMeans))*1/input.length
    var deltaW = this.input.tr().mdot(phMean).msub(nvSamples.tr().mdot(nhMeans)).mul(1.0 / this.input.length)
    // deltaW = (input*phMean)-(nvSample^t * nhMeans)*1/input.length
    var deltaVbias = this.input.msub(nvSamples).colMean()
    // deltaHbias = (phSample - nhMeans).mean(row)
    var deltaHbias = phSample.msub(nhMeans).colMean()
    // W += deltaW*lr
    this.W = this.W.add(deltaW.mul(lr))
    // vbias += deltaVbias*lr
    this.vbias = this.vbias.add(deltaVbias.mul(lr))
    // hbias += deltaHbias*lr
    this.hbias = this.hbias.add(deltaHbias.mul(lr))
  }

  RBM.prototype.propup = function (v) {
    // sigmoid(v*W+hbias)
    return v.mdot(this.W).maddv(this.hbias).map1(NN.sigmoid)
  }

  RBM.prototype.propdown = function (h) {
    return h.mdot(this.W.tr()).maddv(this.vbias).map1(NN.sigmoid)
  }

  RBM.prototype.sampleHgivenV = function (v0_sample) {
    var h1_mean = this.propup(v0_sample)
    var h1_sample = NN.binarySample(h1_mean)
    return [h1_mean, h1_sample]
  }

  RBM.prototype.sampleVgivenH = function (h0_sample) {
    var v1_mean = this.propdown(h0_sample)
    var v1_sample = NN.binarySample(v1_mean)
    return [v1_mean, v1_sample]
  }

  RBM.prototype.gibbsHVH = function (h0_sample) {
    var v1 = this.sampleVgivenH(h0_sample)
    var h1 = this.sampleHgivenV(v1[1])
    return [v1[0], v1[1], h1[0], h1[1]]
  }

  RBM.prototype.reconstruct = function (v) {
    var h = v.mdot(this.W).maddv(this.hbias).map1(NN.sigmoid)
    return h.mdot(this.W.tr()).maddv(this.vbias).map1(NN.sigmoid)
  }

  RBM.prototype.getReconstructionCrossEntropy = function () {
    var reconstructedV = this.reconstruct(this.input)
    return NN.binaryCrossEntropy(this.input, reconstructedV)
  }

  return RBM
}
