module.exports = function (ai6) {
// https://github.com/junku901/machine_learning 有 web 版
// https://github.com/mljs
// https://github.com/silklabs/node-caffe (caffe 的 node-bind)
  var ML = ai6.ML = {}

  ML.KNN = require('./knn')(ai6)
  ML.KMean = require('./kmean')(ai6)
  return ML
}
