/**
 * Created by joonkukang on 2014. 1. 15..
 */
var j6 = require('../../lib/j6')

j6.precision = 4
var startTime = new Date()
var x = [
  [0.4, 0.5, 0.5, 0.0, 0.0, 0.0],
  [0.5, 0.3, 0.5, 0.0, 0.0, 0.0],
  [0.4, 0.5, 0.5, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.5, 0.3, 0.5, 0.0],
  [0.0, 0.0, 0.5, 0.4, 0.5, 0.0],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.0]]
var y = [
  [1, 0],
  [1, 0],
  [1, 0],
  [0, 1],
  [0, 1],
  [0, 1]]

var mlp = new j6.NN.MLP({
  'input': x,
  'label': y,
  'nIns': 6,
  'nOuts': 2,
  'hiddenLayerSizes': [4, 4, 5]
})

// mlp.set('log level',1);

mlp.train({
  'lr': 0.6,
  'epochs': 20000
})

var a = [
  [0.5, 0.5, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0],
  [0.5, 0.5, 0.5, 0.5, 0.5, 0.0]]

console.log(mlp.predict(a))

var stopTime = new Date()
console.log('millseconds=', stopTime - startTime)
