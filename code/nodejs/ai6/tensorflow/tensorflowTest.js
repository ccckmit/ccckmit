var tf = require('tensorflow'),
    fs = require('fs');

// Define the graph
var g = new tf.Graph();
var shape = [2, 2]
var p1 = g.placeholder(tf.types.float, shape).named('p1');
var p2 = g.placeholder(tf.types.float, shape).named('p2');
var value = g.matmul(p1, p2).named('value');

// Optionally save it out (with corresponding APIs to load, instead
// of re-building the graph, for example when using the resulting model).
fs.writeFileSync('/tmp/hello.graph', g.save());

// Execute the graph
var session = new tf.Session(g);

var data = {};
data[p1] = new tf.Tensor([[1.0, 0.0],[0.0, 1.0]]);
data[p2] = new tf.Tensor([[3.0, 3.0],[3.0, 3.0]]);

var results = session.run([ value ], data);
console.log(results[value]);