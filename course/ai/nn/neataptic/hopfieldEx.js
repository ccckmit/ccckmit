// ref : https://wagenaartje.github.io/neataptic/docs/builtins/hopfield/
var neataptic = require('neataptic')
var _ = require('lodash')

var network = neataptic.Architect.Hopfield(10)
var trainingSet = [
  { input: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], output: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
  { input: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], output: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0] }
]

network.train(trainingSet)

var testSet = [
  {input: [0, 1, 0, 1, 0, 1, 0, 1, 1, 1], output: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]},
  {input: [1, 1, 1, 1, 1, 0, 0, 1, 0, 0], output: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0]}
]

for (var i = 0; i < testSet.length; i++) {
  var {input, output} = testSet[i]
  var predict = network.activate(input)
  console.log('input:%j predict:%j', input, predict)
  if (_.isEqual(predict, output)) {
    console.log(' => predict === output')
  } else {
    console.log(' => predict !== output')
  }
}
