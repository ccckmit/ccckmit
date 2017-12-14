module.exports = function (j6) {

/* eslint-disable no-undef */
j6.cosineSimilarity = function (v1, v2) {
  return v1.vdot(v2) / (v1.norm() * v2.norm())
}

j6.euclidDistance = function (v1, v2) { // sqrt((v1-v2)*(v1-v2)T)
  let dv = v1.sub(v2)
  return Math.sqrt(dv * (dv.tr()))
}

j6.manhattanDistance = function (v1, v2) { // sum(|v1-v2|)
  return v1.sub(v2).abs().sum()
}

j6.chebyshevDistance = function (v1, v2) { // max(|v1-v2|)
  return v1.sub(v2).abs().max()
}
}