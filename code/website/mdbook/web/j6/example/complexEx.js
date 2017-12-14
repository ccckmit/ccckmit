var R = require("../j6");

var c1=p('1+2i'), c2=p('2+1i');
print('%s * %s=%s', c1, c2, c1.mul(c2));
print('3 * %s=%s', c1, p('3').mul(c1));
print('3 * 3=%s', p('3').mul(3));
