var LSTM = require('./lstm')
var fs = require('fs')

var seqText = fs.readFileSync(process.argv[2]).toString()
LSTM.mode = (process.argv.length > 4) ? process.argv[4] : 'char'
LSTM.train(seqText)
fs.writeFileSync(process.argv[3], LSTM.toJSON())
