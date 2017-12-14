var BayesNet = require("./BayesNet");

var bn = new BayesNet();
bn.addNode("B", ["0","1"], [], {"":0.001});
bn.addNode("E", ["0","1"], [], {"":0.002});
bn.addNode("A", ["0","1"], ["B","E"], {"00":0.001, "01":0.29, "10":0.94, "11":0.95});
bn.addNode("J", ["0","1"], ["A"], {"1":0.90, "0":0.05});
bn.addNode("M", ["0","1"], ["A"], {"1":0.70, "0":0.01});

module.exports = bn;