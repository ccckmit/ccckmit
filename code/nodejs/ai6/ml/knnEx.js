var ai6 = require('../../source/ai6')
var KNN = ai6.ML.KNN
var QA = [
  {Q: [0, 0], A: ['L']},
  {Q: [0, 1], A: ['L']},
  {Q: [1, 0], A: ['L']},
  {Q: [1, 1], A: ['L']},
  {Q: [8, 0], A: ['H']},
  {Q: [8, 1], A: ['H']},
  {Q: [9, 0], A: ['H']},
  {Q: [9, 1], A: ['H']}
]

KNN.loadQA(QA)

var distance = function (a, b) {
  var dist = ai6.j6.euclidDistance(a, b)
  return dist
}

var k = 3
var neighbors = KNN.kNearestNeighbors([1, 2], distance, k)
console.log(JSON.stringify(neighbors))
