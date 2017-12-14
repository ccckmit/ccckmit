var R = require("../j6");
var S = R.Symbol;

print('x+x=', S.run('x + x')) // => 2 x"

print('10!=', S.factor('10!').toString()); // => "2^8 3^4 5^2 7"

print('integral(x^2)=', S.eval('integral(x^2)').toString()); // => "1/3 x^3"

// composing...
print('integral(x)=', S.integral(S.eval('x')).toString()); // => "1/2 x^2"

var questions=[
'13579/99999 + 13580/100000',
'numerator(1/a+1/b)',
'denominator(1/(x-1)/(x-2))',
'rationalize(a/b+b/a)',
'A=1+i;B=sqrt(2)*exp(i*pi/4);A-B',
'simplify(cos(x)^2 + sin(x)^2)',
'simplify(a*b+a*c)',
'simplify(n!/(n+1)!)',
'(x-1)(x-2)^3',
'subst( u, exp(x), 2*exp(x) )',
'roots(3 x + 12 + y = 24)',
'roots(a*x^2+b*x+c)',
'roots(x^4 + x^3 + x^2 + x + 1)',
'roots(m*x^9 + n)',
'roots((x^4+x^3)*(x^4*x^2))',
'nroots(x^4+1)',
'velocity=17000*"mile"/"hr";time=8*"min"/(60*"min"/"hr");velocity/time',
'A=((a,b),(c,d));inv(A);adj(A);det(A);inv(A)-adj(A)/det(A)',
'd(x^2);r=sqrt(x^2+y^2);d(r,(x,y))',
'F=(x+2y,3x+4y);d(F,(x,y))',
'integral(x^2)',
'integral(x*y,x,y)',
// 'integral(e^(- 1/2 ((x-mu)/sigma)^2), x)',
// 'defint(x^2,y,0,sqrt(1-x^2),x,-1,1)', // very slow, why ?
// 'f=sin(t)^4-2*cos(t/2)^3*sin(t);f=circexp(f);defint(f,t,0,2*pi)', // very slow, why ?
];

print("=========== Q&A =============");

for (var i in questions) {
	var q = questions[i];
	print(q, "=", S.run(q.replace(/;/g, '\n')));
}
