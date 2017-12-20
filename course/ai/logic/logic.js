module.exports = function (ai6) {
  var logic = ai6.logic = {}
  logic.KB = require('./kb')
  logic.PKB = require('./pkb')
  return logic
}
