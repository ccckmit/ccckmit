/**
 * Created by joonkukang on 2014. 1. 15..
 */
var j6 = require('../../lib/j6')

var data = [
    [0.4, 0.5, 0.5, 0.0, 0.0, 0.7],
    [0.5, 0.3, 0.5, 0.0, 1.0, 0.6],
    [0.4, 0.5, 0.5, 0.0, 1.0, 0.9],
    [0.0, 0.0, 0.0, 0.3, 0.5, 0.0],
    [0.0, 0.0, 0.0, 0.4, 0.5, 0.0],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0]]

var crbm = new j6.NN.CRBM({
  input: data,
  nVisible: 6,
  nHidden: 5
})

crbm.train({
  lr: 0.6,
  k: 1,
  epochs: 1500
})

var v = [
  [0.5, 0.5, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0]]

console.log(crbm.reconstruct(v))
console.log(crbm.sampleHgivenV(v)[0])
