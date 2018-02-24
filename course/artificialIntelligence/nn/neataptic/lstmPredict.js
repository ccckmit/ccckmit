var LSTM = require('./lstm')
var fs = require('fs')

var argv = process.argv
var maxLen = (argv.length >= 4) ? parseInt(argv[3]) : 10
var json = fs.readFileSync(process.argv[2])
LSTM.fromJSON(json)
var sLines = ['']
LSTM.genLines(sLines, [], maxLen)
