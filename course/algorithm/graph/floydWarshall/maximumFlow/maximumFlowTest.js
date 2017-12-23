/**
 * Created by prabod on 2/14/16.
 */
'use strict'
var fordFulkerson = require('./maximumFlow');
var graph = [
    [0, 16,13, 0,  0, 0], 
    [0, 0, 10, 12, 0, 0], 
    [0, 4, 0,  0, 14, 0], 
    [0, 0, 9,  0,  0, 20], 
    [0, 0, 0,  7,  0, 4], 
    [0, 0, 0,  0,  0, 0]
];
console.log("The maximum possible flow is " + fordFulkerson(graph, 0, 5));