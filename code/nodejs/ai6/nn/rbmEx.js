var ai6 = require('../../source/ai6')

var data = [
[1, 1, 1, 0, 0, 0],
[1, 0, 1, 0, 0, 0],
[1, 1, 1, 0, 0, 0],
[0, 0, 1, 1, 1, 0],
[0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 1, 0]]

var rbm = new ai6.NN.RBM({
  input: data,
  nVisible: 6,
  nHidden: 2
})

rbm.train({
  lr: 0.6,
  k: 1,
  epochs: 500
})

var v = [
  [1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0]]

console.log(rbm.reconstruct(v).mstr())
console.log(rbm.sampleHgivenV(v)[0].mstr())
