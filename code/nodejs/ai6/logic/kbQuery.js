var fs = require('fs')
var ai6 = require('../../source/ai6')

var kb1 = new ai6.logic.KB()
var code = fs.readFileSync(process.argv[2], 'utf8').replace(/\n/gi, '')
kb1.load(code)
kb1.forwardChaining()

var r = require('readline').createInterface(process.stdin, process.stdout)
r.setPrompt('?- ')
r.prompt()

r.on('line', function (line) {
  var term = line.trim()
  kb1.addFact(term)
  kb1.forwardChaining()
  r.prompt()
}).on('close', function () {
  process.exit(0)
})
