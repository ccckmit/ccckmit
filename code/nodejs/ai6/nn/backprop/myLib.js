var util = require("util");

var ml = {};

ml.log = console.log;

ml.format = function() {
  return util.format.apply(null, arguments);
}

ml.error = function() {
  util.print("Error:");
  ml.log(util.format.apply(null, arguments));
  process.exit(1);
}

ml.split = function(str, sp) {
  var tokens = str.split(sp);
  if (tokens[tokens.length-1]=="")
    tokens.pop();
  return tokens;
}

ml.erase = function(array, v) {
  var anew = [];
  for (var i in array) {
    if (array[i] != v)
      anew.push(array[i]);
  }
  return anew;
}

ml.isEmpty = function(map) {
  for(var i in map) { 
    return false; 
  }
  return true;
}

ml.clone = function(map) {
  var o={};
  for (var key in map) {
    o[key] = map[key];
  }
  return o;
}

ml.merge = function(map1,map2) {
  var map = {};
  for (var key in map1)
    map[key] = map1[key];
  for (var key in map2)
    map[key] = map2[key];
  return map;
}

ml.numbersToStr=function(array, precision) {
  var rzStr = "";
  for (var i=0; i<array.length; i++) {
	  if (array[i]>=0)
  	  rzStr+=" "+array[i].toFixed(precision)+" ";
		else
  	  rzStr+=array[i].toFixed(precision)+" ";
	}
	return rzStr;
}

// ­×§ï¦Û http://indiegamr.com/generate-repeatable-random-numbers-in-js/
/*
ml.seed = 37927;
ml.rand = function(max, min) {
    max = max || 1;
    min = min || 0;

    ml.seed = (ml.seed * 9301 + 49297) % 233280;
    var rnd = ml.seed / 233280;
    return min + rnd * (max - min);
}
*/

ml.rand=function(a, b) {
  return (b-a)*Math.random() + a;
}

ml.makeArray=function(n, fill) {
  var a = [];
  for (var i=0; i<n; i++)
    a.push(fill);
  return a;
}

ml.makeMatrix=function(I, J, fill) {
  var m = [];
  for (var i=0; i<I; i++)
    m.push(ml.makeArray(J, fill));
  return m;
}

ml.tanh=function(x) {
  return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
}

module.exports = ml;
