var R = require("../j6");
var v = [1,3,5];

var x = R.rnorm(10, 0, 0.1);
print("x=", x.str());

var t1 = R.ttest({x:x, mu:0});
R.report(t1);

