let j6 = require('../../lib/j6')
let NN = j6.NN
var LSTM = new NN.LSTM(6, 7, 2)
LSTM.trainer.DSR({
  targets: [2, 4],
  distractors: [3, 5],
  prompts: [0, 1],
  length: 10
})
