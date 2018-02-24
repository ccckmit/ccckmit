// ex: node mtPredict data/mt1by1.json data/mt1by1.tst
var Lstm = require('./lstmMt')
var fs = require('fs')

var lstmJson = fs.readFileSync(process.argv[2], 'utf8')
Lstm.fromJSON(lstmJson)
var testText = fs.readFileSync(process.argv[3], 'utf8')
var s = testText.split(/\r?\n/)
// var s = ['狗', '一 隻 狗', '小 狗', '小 貓', '一 隻 小 貓', '一 隻 小 黑 貓']
// var s = ['狗', '一隻 狗', '一隻 貓', '一隻 黑 貓']
// var s = ['狗', '一 隻 狗', '一 隻 貓', '一 隻 黑 貓']
for (let i = 0; i < s.length; i++) {
  var t = Lstm.predict(s[i])
  console.log('%s => %j', s[i], t)
}
