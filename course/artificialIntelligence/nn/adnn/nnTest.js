var nn = require('adnn/nn');
var Tensor = require('adnn/tensor');

var net = nn.linear(10, 10);

// Feed an input through a network by calling its 'eval' method
var input = new Tensor([10]).fillRandom();
net.eval(input);

// Networks have associated parameters, which is a list of tensors.
net.getParameters();   // May be empty for certain networks

// When training is enabled, NNs will compute partial derivatives w.r.t.
//    their parameters. Otherwise, they do not (for efficiency).
net.setTraining(true);

// NNs can also be serialized to JSON objects and deserialized back.
// This saves their structure as well as their current parameter values.
net = nn.deserializeJSON(net.serializeJSON());

console.log('net=%j', net)
