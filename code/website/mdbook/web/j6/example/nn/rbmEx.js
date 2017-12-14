/**
 * Created by joonkukang on 2014. 1. 15..
 */
var j6 = require('../../lib/j6')
j6.precision = 4
var startTime = new Date()

var data = [
[1, 1, 1, 0, 0, 0],
[1, 0, 1, 0, 0, 0],
[1, 1, 1, 0, 0, 0],
[0, 0, 1, 1, 1, 0],
[0, 0, 1, 1, 0, 0],
[0, 0, 1, 1, 1, 0]]

var rbm = new j6.NN.RBM({
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

j6.print(rbm.reconstruct(v).mstr())
j6.print(rbm.sampleHgivenV(v)[0].mstr())
var stopTime = new Date()
console.log('millseconds=', stopTime - startTime)
