// ex: node mtPredict mtDog.json
var Lstm = require('./lstmMt')
var fs = require('fs')

var lstmJson = fs.readFileSync(process.argv[2])
Lstm.fromJSON(lstmJson)
var s = ['', '一', '小', '黑', '一 隻']
for (let i = 0; i < s.length; i++) {
  Lstm.predict('↓ ' + s[i])
}
