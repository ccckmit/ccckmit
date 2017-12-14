// ex: node seqPredict cdog.json 100
var Lstm = require('./lstmSeq')
var fs = require('fs')

var argv = process.argv
var maxLen = (argv.length >= 4) ? parseInt(argv[3]) : 10
var lstmJson = fs.readFileSync(process.argv[2])
Lstm.fromJSON(lstmJson)
var s = ['', '']
for (let i = 0; i < s.length; i++) {
  Lstm.predict(s[i], maxLen)
}
