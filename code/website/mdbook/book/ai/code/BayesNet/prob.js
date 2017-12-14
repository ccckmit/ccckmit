var prob = {}

prob.sum = function(p) {
  var s = 0.0;
  for (var v in p) {
    s+=p[v];
  }
  return s;
}

prob.normalize = function(p) {
  var s = this.sum(p);
  var np = {};
  for (var v in p) {
    np[v] = p[v]/s;
  }
  return np;
}

module.exports = prob;