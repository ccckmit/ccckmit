var GA={
	population:[],
	mutationRate:0.1,
}

function random(a,b) {
  return a+Math.random()*(b-a);
}

function randomInt(a,b) {
  return Math.floor(random(a,b));
}

function randomChoose(array) {
  return array[randomInt(0, array.length)];
}

GA.run=function(size, maxGen) {
	GA.population = GA.newPopulation(size);
	for (t = 0; t < maxGen; t++) {
		console.log("============ generation", t, "===============")
		GA.population = GA.reproduction(GA.population);
		GA.dump();
	}
}

var fitnessCompare=(c1,c2)=>c1.fitness - c2.fitness;

GA.newPopulation=function(size) {
  var newPop=[];
  for (var i=0; i<size; i++) {
    var chromosome = GA.randomChromosome();
		newPop[i] = { chromosome:chromosome, 
		           fitness:GA.calcFitness(chromosome) };
  }
	newPop.sort(fitnessCompare);
	return newPop;
}

// 輪盤選擇法: 落點在 i*i ~ (i+1)*(i+1) 之間都算是 i
GA.selection = function() {
	var n = GA.population.length;
	var shoot  = randomInt(0, n*n/2);
	var select = Math.floor(Math.sqrt(shoot*2));
	return GA.population[select];
}

GA.reproduction=function() {
	var newPop = []
	for (var i = 0; i < GA.population.length; i++) {
		var parent1 = GA.selection();
		var parent2 = GA.selection();
		var chromosome = GA.crossover(parent1, parent2);
		var prob = random(0,1);
		if (prob < GA.mutationRate) 
			chromosome = GA.mutate(chromosome);
		newPop[i] = { chromosome:chromosome, fitness:GA.calcFitness(chromosome) };
	}
	newPop.sort(fitnessCompare);
	return newPop;
}

GA.dump = function() {
	for (var i=0; i<GA.population.length; i++) {
		console.log(i, GA.population[i]);
	}
}

var KeyGA = GA;

KeyGA.key = "1010101010101010";

KeyGA.randomChromosome=function() {
	var bits=[];
	for (var i=0; i<KeyGA.key.length; i++) {
		var bit = randomInt(0,2);
		bits.push(bit);
	}
	return bits.join('');
}

KeyGA.calcFitness=function(c) {
	var fitness=0;
	for (var i=0; i<KeyGA.key.length; i++) {
		fitness += (c[i]===KeyGA.key[i])?1:0;
	}
  return fitness;
}

KeyGA.crossover=function(c1,c2) {
	var cutIdx = randomInt(0, c1.chromosome.length);
	var head   = c1.chromosome.substr(0, cutIdx);
	var tail   = c1.chromosome.substr(cutIdx);
	return head + tail;
}

KeyGA.mutate=function(chromosome) {
	var i=randomInt(0, chromosome.length);
	cMutate=chromosome.substr(0, i)+
	        randomChoose(['0','1'])+
					chromosome.substr(i+1);
	return cMutate;
}

KeyGA.run(100, 100);
