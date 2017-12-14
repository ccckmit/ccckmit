var j6 = require('../j6')
var p = j6.parse
var c1 = p('5+2i')
var v1 = [1,3,2], v2=[2,3,c1], m=[[1,2], [3,p('1+2i')]];

print('=========== Operator ===============');
print('add(3,5)=%s', j6.add(3, 5));
print('oadd(3,5+2i)=%s', j6.oadd(c1, 3));
print('v1=%s v2=%s m=%s', v1, v2, m);
print('add(%s, %s)=%s', v1, v2, j6.add(v1, v2));
print('%s.sqrt()=%s', v1, j6.sqrt(v1));
print('%s.osqrt()=%s', v2, j6.osqrt(v2));
print('v1.sum()=%s', j6.sum(v1))
print('v2.osum()=%s', j6.osum(v2))
print('v1.product()=%s', j6.product(v1))
print('m.osum()=%s', j6.osum(m))
print('m.oproduct()=%s', j6.oproduct(m))
print('v1.max()=%s', j6.max(v1))
print('v1.min()=%s', j6.min(v1))
print('=========== Map Reduce===============');
print('map1(v1,x^2)=%s', j6.map1(v1, (x)=>x*x));
print('map2(v1,v1,x+y)=%s', j6.map2(v1, v1, (x,y)=>x+y));
print('reduce(v1,add,0)=%s', j6.reduce(v1, (x,y)=>x+y, 0));
print('max(v1)=%s', j6.max(v1));
print('min(v1)=%s', j6.min(v1));
print('add(v1,v2)=%s', j6.add(v1,v1));
print('sin(v1)=%s', j6.sin(v1));
print('=========== Eval ===============');
var exp = (x)=>3*x*x+5;
print('%s.map1(%s)=%s', v1, exp, j6.map1(v1, exp));
print('norm(%s)=%d', v1, j6.norm(v1));
print('=========== repeat ===============');
print('repeat([3,2,2],0)=%s\n', j6.repeatDim([3,2,2]));
print('random([2,2],[0,1])=%s\n', j6.repeatDim([2,2],()=>j6.random(0,1)));

