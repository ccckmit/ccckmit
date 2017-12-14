var R = require("../j6");

// spline
var xSpline = R.spline([1,2,3,4,5],[1,2,1,3,2]).at(R.linspace(1,5,10))
print('xSpline=', xSpline.mstr());