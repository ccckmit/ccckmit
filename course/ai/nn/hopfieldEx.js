// ref : https://wagenaartje.github.io/neataptic/docs/builtins/hopfield/
var ai6 = require('../../source/ai6')
var _ = ai6.j6._

var network = ai6.NN.Hopfield(10)
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
