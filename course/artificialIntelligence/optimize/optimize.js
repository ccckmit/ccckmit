module.exports = function (ai6) {
  var Opt = ai6.Optimize = {}

  Opt.Solution = require('./solution')(ai6)
  Opt.hillClimbing = require('./hillClimbing')
  Opt.simulatedAnnealing = require('./simulatedAnnealing')
  Opt.geneticAlgorithm = require('./geneticAlgorithm')(ai6)
  return Opt
}
