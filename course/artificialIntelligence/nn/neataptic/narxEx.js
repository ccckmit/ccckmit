// ref : https://github.com/wagenaartje/neataptic
var neataptic = require('neataptic')
var net = new neataptic.Architect.NARX(1, 5, 1, 3, 3)
// Train a sequence: 00100100..
net.train([
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] },
  { input: [1], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [0] },
  { input: [0], output: [1] }
])

var s = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
for (var i = 0; i < s.length; i++) {
  console.log('s[%d]=%d next=%d', i, s[i], net.activate([s[i]]))
}
