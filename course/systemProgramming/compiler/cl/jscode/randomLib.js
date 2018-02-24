var o={};

o.random = function(a,b) { 
    return a+Math.random()*(b-a); 
}

o.randomInt = function(a,b) { 
    return Math.floor(o.random(a,b)); 
}

o.sample = function(array) { 
    return array[o.randomInt(0,array.length)]; 
}

module.exports = o;