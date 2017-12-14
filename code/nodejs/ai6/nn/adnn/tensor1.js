var ad = require('adnn/ad');
var Tensor = require('adnn/tensor');

function dot(vec) {
  var sq = ad.tensor.mul(vec, vec);
  return ad.tensor.sumreduce(sq);
}

function dist(vec1, vec2) {
  return ad.scalar.sqrt(dot(ad.tensor.sub(vec1, vec2)));
}

var vec1 = ad.lift(new Tensor([3]).fromFlatArray([0, 1, 1]));
var vec2 = ad.lift(new Tensor([3]).fromFlatArray([2, 0, 3]));
var out = dist(vec1, vec2);
console.log(ad.value(out));   // 3
out.backprop();
console.log(ad.derivative(vec1).toFlatArray());  // [-0.66, 0.33, -0.66]