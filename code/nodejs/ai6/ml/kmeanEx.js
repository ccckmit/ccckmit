var ai6 = require('../../source/ai6')
var KMean = ai6.ML.KMean
var data = [
  [0, 0], [0, 1], [1, 0], [1, 1],
  [8, 0], [8, 1], [9, 0], [9, 1],
  [5, 7], [4, 6], [5, 6], [4, 7]
]

KMean.run(data, 3, 10)
