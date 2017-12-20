// ex: node mtTrain mtDog.txt mtDog.json
var Lstm = require('./lstmMt')
var fs = require('fs')

var text = fs.readFileSync(process.argv[2], 'utf8')
Lstm.setting.mode = 'word'
Lstm.train(text)
fs.writeFileSync(process.argv[3], Lstm.toJSON())
