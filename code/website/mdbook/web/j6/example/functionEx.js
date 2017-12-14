var R = require("../lib/function");
var F = R, V = R, A = R;

var v1 = [1,2,3];
var exp = (x)=>3*x*x+5;
print('%s.eval(%d)=%s', exp, 1, F.eval(exp, 1));
print('(%s).diff(1)=', exp, F.diff(exp, 1));
print('(%s).integral(0,1)=', exp, F.integral(exp, 0,1));

var f1 = (x,y)=>2*x+y;

print('pdiff(%s, [1,0], 0)=', f1, F.pdiff(f1, [1,0], 0));
print('pdiff(%s, [0,1], 1)=', f1, F.pdiff(f1, [0,1], 1));
print('pdiff(%s, [1,1], 1)=', f1, F.pdiff(f1, [1,1], 1));

var f2 = (x,y)=>x*y-x*x;
print('grad(%s, [1,0], 0)=', f2, F.grad(f2, [1,0], 0));
/*
var F1 = (x,y,z)=>[3*x*x*x*z,4*x*y*z,y*z*z]; // F1=[3x^3z,4xyz,yz^2]
print('div(%s, [1,0,0])=%s', F1, R.fdiv(F1, [0,1,1])); // div(F1) = 9x^2+4xz+2yz = 2
*/

var P = R.Polynomial;
var p1 = new P([1,2]), p2=new P([2,2,4]), p3=new P([1,-6,21,-52]);
print('=========== Polynomial ===============');
print('p1=%s p2=%s', p1, p2);
print('p1+p2=%s', p1.add(p2));
print('p1-p2=%s', p1.sub(p2));
print('p1*p2=%s', p1.mul(p2));
print('p1(3)=', p1.eval(3));
print('p2(2)=', p2.eval(2));
print('p2.root()=%s', p2.root());
print('p3.root()=%s', p3.root());
