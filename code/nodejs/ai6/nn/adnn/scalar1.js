var ad = require('adnn/ad')

function dist(x1, y1, x2, y2) {
  var xdiff = ad.scalar.sub(x1, x2);
  var ydiff = ad.scalar.sub(y1, y2);
  return ad.scalar.sqrt(ad.scalar.add(
    ad.scalar.mul(xdiff, xdiff),
    ad.scalar.mul(ydiff, ydiff)
  ));
}

// Can use normal scalar inputs
var out = dist(0, 1, 1, 4);
console.log(out);   // 3.162...

// Use 'lifted' inputs to track derivatives
var x1 = ad.lift(0);
var y1 = ad.lift(1);
var x2 = ad.lift(1);
var y2 = ad.lift(4);
var out = dist(x1, y1, x2, y2);
console.log(ad.value(out));   // still 3.162...
out.backprop();   // Compute derivatives of inputs
console.log(ad.derivative(x1)); // -0.316...