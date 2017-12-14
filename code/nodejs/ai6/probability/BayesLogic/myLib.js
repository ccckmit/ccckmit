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

module.exports = ml;
