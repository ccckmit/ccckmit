// ref : https://github.com/wagenaartje/neataptic
var neataptic = require('neataptic')
var net = new neataptic.Architect.Perceptron(2, 4, 1)

// Train the XOR gate
net.train([{ input: [0, 0], output: [0] },
           { input: [0, 1], output: [1] },
           { input: [1, 0], output: [1] },
           { input: [1, 1], output: [0] }])

console.log('[0, 0] => %d', net.activate([0, 0])) // 0.0268581547421616
console.log('[0, 1] => %d', net.activate([1, 0])) // 0.9829673642853368
console.log('[1, 0] => %d', net.activate([0, 1])) // 0.9831714267395621
console.log('[1, 1] => %d', net.activate([1, 1])) // 0.02128894618097928