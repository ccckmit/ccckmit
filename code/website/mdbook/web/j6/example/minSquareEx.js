var R = require("../j6");

print("================ Y = 2X+3 ==============")
var x = R.steps(1,10,1);
var y = x.mul(2).add(3).add(R.rnorm(10,0,0.2));
print("x=%s\ny=%s", x, y);
var c = R.minSquare([x], y);
print("c=%s", c);


print("================ Y = X2+2X1+3 ==============")
var x1 = R.steps(1,10,1);
var x2 = x1.power(2);
var y = x2.add(x1.mul(2)).add(3).add(R.rnorm(10,0,0.2));
print("x1=%s\nx2=%s\ny=%s", x1, x2, y);
var c = R.minSquare([x1, x2], y);
print("c=%s", c);
