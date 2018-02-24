module.exports = function (ai6) {
  var j6 = ai6.j6

  var GA = module.exports = {}

  GA.run = function (size, maxGen) {
    GA.population = GA.newPopulation(size)
    for (var t = 0; t < maxGen; t++) {
      console.log('============ generation', t, '===============')
      GA.population = GA.reproduction(GA.population)
      GA.dump()
    }
  }

  var fitnessCompare = (c1, c2) => c1.fitness - c2.fitness

  GA.newPopulation = function (size) {
    var newPop = []
    for (var i = 0; i < size; i++) {
      var chromosome = GA.randomChromosome()
      newPop[i] = { chromosome: chromosome, fitness: GA.calcFitness(chromosome) }
    }
    newPop.sort(fitnessCompare)
    return newPop
  }

  // 輪盤選擇法: 落點在 i*i ~ (i+1)*(i+1) 之間都算是 i
  GA.selection = function () {
    var n = GA.population.length
    var shoot = j6.randomInt(0, (n * n) / 2 - 1)
    var select = Math.floor(Math.sqrt(shoot * 2))
    return GA.population[select]
  }

  GA.reproduction = function () {
    var newPop = []
    for (var i = 0; i < GA.population.length; i++) {
      var parent1 = GA.selection()
      var parent2 = GA.selection()
      var chromosome = GA.crossover(parent1, parent2)
      var prob = j6.random(0, 1)
      if (prob < GA.mutationRate) {
        chromosome = GA.mutate(chromosome)
      }
      newPop[i] = { chromosome: chromosome, fitness: GA.calcFitness(chromosome) }
    }
    newPop.sort(fitnessCompare)
    return newPop
  }

  GA.dump = function () {
    for (var i = 0; i < GA.population.length; i++) {
      console.log(i, GA.population[i])
    }
  }

  return GA
}
