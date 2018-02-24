// ex: node seqTrain cdog.txt cdog.json
var Lstm = require('./lstmSeq')
var fs = require('fs')

var text = fs.readFileSync(process.argv[2], 'utf8')
Lstm.mode = (process.argv.length > 4) ? process.argv[4] : 'char'
Lstm.train(text)
fs.writeFileSync(process.argv[3], Lstm.toJSON())
