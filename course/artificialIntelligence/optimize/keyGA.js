var ai6 = require('../../source/ai6')
var j6 = ai6.j6
var KeyGA = ai6.Optimize.geneticAlgorithm

KeyGA.key = '1010101010101010'

KeyGA.randomChromosome = function () {
  var bits = []
  for (var i = 0; i < KeyGA.key.length; i++) {
    var bit = j6.randomInt(0, 1)
    bits.push(bit)
  }
  return bits.join('')
}

KeyGA.calcFitness = function (c) {
  var fitness = 0
  for (var i = 0; i < KeyGA.key.length; i++) {
    fitness += (c[i] === KeyGA.key[i]) ? 1 : 0
  }
  return fitness
}

KeyGA.crossover = function (c1, c2) {
  var cutIdx = j6.randomInt(0, c1.chromosome.length)
  var head = c1.chromosome.substr(0, cutIdx)
  var tail = c2.chromosome.substr(cutIdx)
  return head + tail
}

KeyGA.mutate = function (chromosome) {
  var i = j6.randomInt(0, chromosome.length)
  var cMutate = chromosome.substr(0, i) + j6.sample(['0', '1']) + chromosome.substr(i + 1)
  return cMutate
}

KeyGA.run(100, 100)
