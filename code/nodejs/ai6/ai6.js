var ai6 = module.exports = {
  j6: require('j6')
}

require('./ml/ml')(ai6)
require('./nn/nn')(ai6)
require('./optimize/optimize')(ai6)
require('./logic/logic')(ai6)
