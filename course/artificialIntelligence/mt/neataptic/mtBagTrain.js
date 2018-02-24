// ex: node mtTrain mtDog.txt mtDog.json
var Lstm = require('./lstmMtBag')
var fs = require('fs')

var text = fs.readFileSync(process.argv[2], 'utf8')
Lstm.mode = 'word'
Lstm.train(text)
fs.writeFileSync(process.argv[3], Lstm.toJSON())
