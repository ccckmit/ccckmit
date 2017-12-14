var ai6 = require('../../source/ai6')

var code = 'A<=B. B<=C&D. C<=E. D<=F. E. F. Z<=C&D&G.'
var kb1 = new ai6.logic.KB()
kb1.load(code)
kb1.forwardChaining()
