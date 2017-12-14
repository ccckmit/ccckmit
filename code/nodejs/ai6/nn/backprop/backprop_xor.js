var NN = require("./backprop");

pat = [
  [[0,0], [0]],
  [[0,1], [1]],
  [[1,0], [1]],
  [[1,1], [0]]
];

// create a network with two input, two hidden, and one output nodes
nn = new NN().init(2, 2, 1);
// train it with some patterns
nn.train(pat, 1000, 0.5, 0.1);
// test it
nn.test(pat);
