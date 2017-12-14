var util = require("util");
var log = console.log;
var printf = function() {
  return process.stdout.write(util.format.apply(null, arguments)); 
}

function equal(a, b) {
  return JSON.stringify(a)===JSON.stringify(b);
}

log(equal({a:1, b:2}, {a:1, b:2}));


function GPS(state, goal) { // State: 目前狀態，Goal : 目標狀態
  while (!equals(state,goal)) {
    var d = distance(state, goal);
    var rule = chooseRule();
    GPS(rule.cond);
    state = apply(state, rule);
  }
}
