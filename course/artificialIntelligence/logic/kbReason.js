var fs = require('fs')
var ai6 = require('../../source/ai6')

var kb1 = new ai6.logic.KB()
var code = fs.readFileSync(process.argv[2], 'utf8').replace(/\n/gi, '')

kb1.load(code)
kb1.forwardChaining()
