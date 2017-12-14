let j6 = require('../../lib/j6')
let NN = j6.NN
var myPerceptron = new NN.Perceptron(2, 3, 1)
var myTrainer = new NN.Trainer(myPerceptron)

myTrainer.XOR() // { error: 0.004998819355993572, iterations: 21871, time: 356 }

console.log('[0, 0] => %d', myPerceptron.activate([0, 0])) // 0.0268581547421616
console.log('[0, 1] => %d', myPerceptron.activate([1, 0])) // 0.9829673642853368
console.log('[1, 0] => %d', myPerceptron.activate([0, 1])) // 0.9831714267395621
console.log('[1, 1] => %d', myPerceptron.activate([1, 1])) // 0.02128894618097928