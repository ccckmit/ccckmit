/* eslint-disable camelcase */
module.exports = function (ai6) {
  var NN = ai6.NN
  var j6 = ai6.j6
  var T = j6.T
  var M = j6.M

  var CRBM = module.exports = function (settings) {
    NN.RBM.call(this, settings)
  }

  CRBM.prototype = new NN.RBM()

  CRBM.prototype.propdown = function (h) {
  //  var self = this
  //    var preSigmoidActivation = math.addMatVec(math.mulMat(h,math.transpose(self.W)),self.vbias)
    var preSigmoidActivation = h.mdot(this.W.tr()).maddv(this.vbias)
    return preSigmoidActivation
  }

  CRBM.prototype.sampleVgivenH = function (h0_sample) {
    var self = this
    var a_h = self.propdown(h0_sample)
    var a = T.map1(a_h, function (x) { return 1.0 / (1 - Math.exp(-x)) })
    var b = T.map1(a_h, function (x) { return 1.0 / x })
    var v1_mean = a.msub(b)
    var U = M.random(v1_mean.rows(), v1_mean.cols(), 0, 1)
    var c = T.map1(a_h, function (x) { return 1 - Math.exp(x) })
    var d = T.map1(U.mmul(c), function (x) { return 1 - x })
    var v1_sample = T.map2(T.map1(d, Math.log), a_h, function (x, y) {
      if (y === 0) y += 1e-14 // Javascript Float Precision Problem.. This is a limit of javascript.
      return x / y
    })
    return [v1_mean, v1_sample]
  }

  CRBM.prototype.getReconstructionCrossEntropy = function () {
    var reconstructedV = this.reconstruct(this.input)
    return NN.binaryCrossEntropy(this.input, reconstructedV)
  }

  CRBM.prototype.reconstruct = function (v) {
    var self = this
    var reconstructedV = self.sampleVgivenH(self.sampleHgivenV(v)[0])[0]
    return reconstructedV
  }

  return CRBM
}

/*
    var self = this
    var reconstructedV = self.reconstruct(self.input)
    var a = T.map2(self.input, reconstructedV, function (x, y) {
      return x * Math.log(y)
    })

    var b = T.map2(self.input, reconstructedV, function (x, y) {
      return (1 - x) * Math.log(1 - y)
    })

    var crossEntropy = -a.madd(b).colSum().mean()
    // math.meanVec(math.sumMatAxis(math.addMat(a,b),1))
    return crossEntropy
*/
