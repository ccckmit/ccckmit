var j6 = require('../j6')
var p = j6.parse
var c1 = p('5+2i')
var v1 = [1, 3, 2]
var v2 = [2, 3, c1]
var m = [[1, 2], [3, p('1+2i')]]
var c = console

c.log('=========== Operator ===============')
c.log('add(3,5)=%s', j6.add(3, 5))
c.log('oadd(3,5+2i)=%s', j6.oadd(c1, 3))
c.log('v1=%s v2=%s m=%s', v1, v2, m)
c.log('add(%s, %s)=%s', v1, v2, j6.add(v1, v2))
c.log('%s.sqrt()=%s', v1, j6.sqrt(v1))
c.log('%s.osqrt()=%s', v2, j6.osqrt(v2))
c.log('v1.sum()=%s', j6.sum(v1))
c.log('v2.osum()=%s', j6.osum(v2))
c.log('v1.product()=%s', j6.product(v1))
c.log('m.osum()=%s', j6.osum(m))
c.log('m.oproduct()=%s', j6.oproduct(m))
c.log('v1.max()=%s', j6.max(v1))
c.log('v1.min()=%s', j6.min(v1))
c.log('=========== Map Reduce===============')
c.log('map1(v1,x^2)=%s', j6.map1(v1, (x) => x * x))
c.log('map2(v1,v1,x+y)=%s', j6.map2(v1, v1, (x, y) => x + y))
c.log('reduce(v1,add,0)=%s', j6.reduce(v1, (x, y) => x + y, 0))
c.log('max(v1)=%s', j6.max(v1))
c.log('min(v1)=%s', j6.min(v1))
c.log('add(v1,v2)=%s', j6.add(v1, v1))
c.log('sin(v1)=%s', j6.sin(v1))
c.log('=========== Eval ===============')
var exp = (x) => (3 * (x * x)) + 5
c.log('%s.map1(%s)=%s', v1, exp, j6.map1(v1, exp))
c.log('norm(%s)=%d', v1, j6.norm(v1))
c.log('=========== repeat ===============')
c.log('trepeat([3,2,2],0)=%s\n', j6.trepeat([3, 2, 2]))
c.log('trandom([2,2],[0,1])=%s\n', j6.trepeat([2, 2], () => j6.random(0, 1)))
