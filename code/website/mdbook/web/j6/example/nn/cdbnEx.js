/* eslint-disable camelcase */
/**
 * Created by joonkukang on 2014. 1. 15..
 */
var j6 = require('../../lib/j6')
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

var cdbn = new j6.NN.CDBN({
  'input': x,
  'label': y,
  'nIns': 6,
  'nOuts': 2,
  'hiddenLayerSizes': [10, 12, 11, 8, 6, 4]
})

for (var i = 0; i < 6; i++) {
  console.log('ith layer W : ', cdbn.sigmoidLayers[i].W)
}

var pretrain_lr = 0.8
var pretrain_epochs = 2000
var k = 1
var finetune_lr = 0.84
var finetune_epochs = 10000

// Pre-Training using using RBM, CRBM.
cdbn.pretrain({
  'lr': pretrain_lr,
  'k': k,
  'epochs': pretrain_epochs
})

// Fine-Tuning dbn using mlp backpropagation.
cdbn.finetune({
  'lr': finetune_lr,
  'epochs': finetune_epochs
})

var a = [
  [0.5, 0.5, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0],
  [0.1, 0.2, 0.4, 0.4, 0.3, 0.6]]

console.log(cdbn.predict(a))
