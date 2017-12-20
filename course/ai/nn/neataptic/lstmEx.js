var neataptic = require('neataptic')
var net = new neataptic.Architect.LSTM(1, 6, 1)

// Train a sequence: 000100010001....
var trainData = [
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
  { input: [1], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] }
]
net.train(trainData, {
  log: 500,
  iterations: 6000,
  error: 0.03,
  clear: true,
  rate: 0.05
})

var s = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
for (var i = 0; i < s.length; i++) {
  console.log('s[%d]=%d next=%d', i, s[i], net.activate([s[i]]))
}
