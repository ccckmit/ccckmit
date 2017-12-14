var util = require('util');
var nu=require('./numeric');  			// 注意，./ 代表 circle 與此程式放在同一個資料夾底下。

var title=function(str) {
  console.log("> "+exp+"\n"+nu.prettyPrint(eval(exp))+"\n");
}
var run=function(exp) {
  console.log("> "+exp+"\n"+nu.prettyPrint(eval(exp))+"\n");
}

// Numerical analysis in Javascript
run("A = [[1,2,3],[4,5,6]]");
run("x = [7,8,9]");
run("b = nu.dot(A,x)");
run("y = [10,1,2]");
run("nu['+'](x,y)");
run("nu['>'](x,y)");
run("nu.add(x,y)");
run("nu.add([1,2],[3,4],[5,6],[7,8])");
run("A = [[1,2,3],[4,5,6],[7,1,9]]");
run("nu.inv(A)");
run("pi = 3.141592653589793");
run("nu.precision = 10"); 
run("pi");
run("nu.precision = 4");
run("pi");
run("nu.identity(100)");
run("I4 = nu.identity(4)");
run("nu.largeArray = 2; I4");
run("nu.largeArray =50; I4");

// Math Object functions
run("nu.exp([1,2])");
run("nu.exp([[1,2],[3,4]])");
run("nu.abs([-2,3])");
run("nu.acos([0.1,0.2])");
run("nu.asin([0.1,0.2])");
run("nu.atan([1,2])");
run("nu.atan2([1,2],[3,4])");
run("nu.ceil([-2.2,3.3])");
run("nu.floor([-2.2,3.3])");
run("nu.log([1,2])");
run("nu.pow([2,3],[0.25,7.1])");
run("nu.round([-2.2,3.3])");
run("nu.sin([1,2])");
run("nu.sqrt([1,2])");
run("nu.tan([1,2])");

// Utility functions
run("nu.dim([1,2])");
run("nu.dim([[1,2,3],[4,5,6]])");
run("nu.same([1,2],[1,2])");
run("nu.same([1,2],[1,2,3])");
run("nu.same([1,2],[[1],[2]])");
run("nu.same([[1,2],[3,4]],[[1,2],[3,4]])");
run("nu.same([[1,2],[3,4]],[[1,2],[3,5]])");
run("nu.same([[1,2],[2,4]],[[1,2],[3,4]])");
run("nu.rep([3],5)");
run("nu.rep([2,3],0)");
run("sum = nu.mapreduce('accum += xi','0'); sum([1,2,3])");
run("sum([[1,2,3],[4,5,6]])");
run("nu.any([false,true])");
run("nu.any([[0,0,3.14],[0,false,0]])");
run("nu.any([0,0,false])");
run("nu.all([false,true])");
run("nu.all([[1,4,3.14],['no',true,-1]])");
run("nu.all([0,0,false])");
run("add = nu.pointwise(['x[i]','y[i]'],'ret[i] = x[i]+y[i];'); add([1,2],[3,4])");
run("nu.diag([1,2,3])");
run("nu.identity(3)");
run("nu.random([2,3])");
run("nu.linspace(1,5)");
run("nu.linspace(1,3,5)");

// Arithmetic operations
run("nu.addVV([1,2],[3,4])");
run("nu.addVS([1,2],3)");
run("nu.add(1,[2,3])");
run("nu.add([1,2,3],[4,5,6])");
run("nu.sub([1,2],[3,4])");
run("nu.mul([1,2],[3,4])");
run("nu.div([1,2],[3,4])");
run("v = [1,2,3,4]; nu.addeq(v,3); v");
run("nu.subeq([1,2,3],[5,3,1])");
run("nu.neg([1,-2,3])");
run("nu.isFinite([10,NaN,Infinity])");
run("nu.isNaN([10,NaN,Infinity])");

// Linear algebra
run("nu.dotVV([1,2],[3,4])");
run("nu.dotVM([1,2],[[3,4],[5,6]])");
run("nu.dotMV([[1,2],[3,4]],[5,6])");
run("nu.dotMMbig([[1,2],[3,4]],[[5,6],[7,8]])");
run("nu.dotMMsmall([[1,2],[3,4]],[[5,6],[7,8]])");
run("nu.dot([1,2,3,4,5,6,7,8,9],[1,2,3,4,5,6,7,8,9])");
run("nu.dot([1,2,3],[4,5,6])");
run("nu.dot([[1,2,3],[4,5,6]],[7,8,9])");
run("nu.solve([[1,2],[3,4]],[17,39])");
run("LU = nu.LU([[1,2],[3,4]])");
run("nu.LUsolve(LU,[17,39])");
run("nu.det([[1,2],[3,4]])");
run("nu.det([[6,8,4,2,8,5],[3,5,2,4,9,2],[7,6,8,3,4,5],[5,5,2,8,1,6],[3,2,2,4,2,2],[8,3,2,2,4,1]])");
run("nu.inv([[1,2],[3,4]])");
run("nu.transpose([[1,2,3],[4,5,6]])");
run("nu.transpose([[1,2,3,4,5,6,7,8,9,10,11,12]])");
run("nu.norm2([1,2])");
run("nu.tensor([1,2],[3,4,5])");

// Data manipulation
run("nu.parseDate(['1/13/2013','2001-5-9, 9:31'])");
run("nu.parseFloat(['12','0.1'])");
run("nu.parseCSV('a,b,c\\n1,2.3,.3\\n4e6,-5.3e-8,6.28e+4')");
run("nu.toCSV([[1.23456789123,2],[3,4]])");
// run("nu.getURL('tools/helloworld.txt').responseText");

// Complex linear algebra
run("z = new nu.T(3,4)");
run("z.add(5)");
run("w = new nu.T(2,8)");
run("z.add(w)");
run("z.mul(w)");
run("z.div(w)");
run("z.sub(w)");
run("z = new nu.T([1,2],[3,4])");
run("z.abs()");
run("z.conj()");
run("z.norm2()");
run("z.exp()");
run("z.cos()");
run("z.sin()");
run("z.log()");
run("A = new nu.T([[1,2],[3,4]],[[0,1],[2,-1]])");
run("A.inv()");
run("A.inv().dot(A)");
run("A.get([1,1])");
run("A.transpose()");
run("A.transjugate()");
run("nu.T.rep([2,2],new nu.T(2,3))");

// Eigenvalues
run("A = [[1,2,5],[3,5,-1],[7,-3,5]]");
run("B = nu.eig(A)");
run("C = B.E.dot(nu.T.diag(B.lambda)).dot(B.E.inv())");

// Singular value decomposition (Shanti Rao)

run("A = [[22,10,2,3,7],[14,7,10,0,8],[-1,13,-1,-11,3],[-3,-2,13,-2,4],[9,8,1,-2,4],[9,1,-7,5,-1],[2,-6,6,5,1],[4,5,0,-2,2]]");
run("nu.svd(A)");
 
// Sparse linear algebra

run("A = [[1,2,0],[0,3,0],[2,0,5]]; SA = nu.ccsSparse(A);");
run("A = nu.ccsSparse([[ 3, 5, 8,10, 8],[ 7,10, 3, 5, 3], [ 6, 3, 5, 1, 8], [ 2, 6, 7, 1, 2], [ 1, 2, 9, 3, 9]])");
run("nu.ccsFull(A)");
run("nu.ccsDot(nu.ccsSparse([[1,2,3],[4,5,6]]),nu.ccsSparse([[7,8],[9,10],[11,12]]))");
run("M = [[0,1,3,6],[0,0,1,0,1,2],[3,-1,2,3,-2,4]]; b = [9,3,2]; x = nu.ccsTSolve(M,b)");
run("nu.ccsDot(M,[[0,3],[0,1,2],x])");
run("LUP = nu.ccsLUP(A)");
run("nu.ccsFull(nu.ccsDot(LUP.L,LUP.U))");
run("x = nu.ccsLUPSolve(LUP,[96,63,82,51,89])");
run("X = nu.trunc(nu.ccsFull(nu.ccsLUPSolve(LUP,A)),1e-15)"); // Solve LUX = PA
run("nu.ccsLUP(A,0.4).P");
run("A = nu.ccsSparse([[1,2,0],[0,3,0],[0,0,5]])");
run("B = nu.ccsSparse([[2,9,0],[0,4,0],[-2,0,0]])");
run("nu.ccsadd(A,B)");
run("X = [[0,0,1,1,2,2],[0,1,1,2,2,3],[1,2,3,4,5,6]]");
run("SX = nu.ccsScatter(X)");
run("nu.ccsGather(SX)");

// Coordinate matrices
run("lu = nu.cLU([[0,0,1,1,1,2,2],[0,1,0,1,2,1,2],[2,-1,-1,2,-1,-1,2]])");
run("nu.cLUsolve(lu,[5,-8,13])");
run("g = nu.cgrid(5)");
run("coordL = nu.cdelsq(g)");
run("L = nu.sscatter(coordL)"); // Just to see what it looks like
run("lu = nu.cLU(coordL); x = nu.cLUsolve(lu,[1,1,1,1,1,1,1,1,1]);");
run("nu.cdotMV(coordL,x)");
run("G = nu.rep([5,5],0); for(i=0;i<5;i++) for(j=0;j<5;j++) if(g[i][j]>=0) G[i][j] = x[g[i][j]]; G");
run("nu.imageURL(nu.mul([G,G,G],200))");
run("nu.cgrid(6,'L')");
run("nu.cgrid(5,function(i,j) { return i!==2 || j!==2; })");
 
// Cubic splines
run("nu.spline([1,2,3,4,5],[1,2,1,3,2]).at(nu.linspace(1,5,10))");
run("nu.spline([1,2,3,4,5],[1,2,1,3,2],0,0).at(nu.linspace(1,5,10))");
run("nu.spline([1,2,3,4],[0.8415,0.04718,-0.8887,0.8415],'periodic').at(nu.linspace(1,4,10))");
run("nu.spline([1,2,3],[[0,1],[1,0],[0,1]]).at(1.78)");
run("xs = [0,1,2,3]; nu.spline(xs,nu.sin(xs)).diff().at(1.5)");
run("xs = nu.linspace(0,30,31); ys = nu.sin(xs); s = nu.spline(xs,ys).roots()");

// Fast Fourier Transforms

run("z = (new nu.T([1,2,3,4,5],[6,7,8,9,10])).fft()");
run("z.ifft()");
	  
// Quadratic Programming (Alberto Santini)

run("nu.solveQP([[1,0,0],[0,1,0],[0,0,1]],[0,5,0],[[-4,2,0],[-3,1,-2],[0,0,1]],[-8,2,0])");

// Unconstrained optimization
run("sqr = function(x) { return x*x; }; nu.uncmin(function(x) { return sqr(10*(x[1]-x[0]*x[0])) + sqr(1-x[0]); },[-1.2,1]).solution");
run("f = function(x) { return sqr(-13+x[0]+((5-x[1])*x[1]-2)*x[1])+sqr(-29+x[0]+((x[1]+1)*x[1]-14)*x[1]); }; x0 = nu.uncmin(f,[0.5,-2]).solution");
run("f = function(x) { return sqr(1e4*x[0]*x[1]-1)+sqr(Math.exp(-x[0])+Math.exp(-x[1])-1.0001); }; x0 = nu.uncmin(f,[0,1]).solution");
run("f = function(x) { return sqr(x[0]-1e6)+sqr(x[1]-2e-6)+sqr(x[0]*x[1]-2)}; x0 = nu.uncmin(f,[0,1]).solution");
run("f = function(x) { return sqr(1.5-x[0]*(1-x[1]))+sqr(2.25-x[0]*(1-x[1]*x[1]))+sqr(2.625-x[0]*(1-x[1]*x[1]*x[1])); }; x0 = nu.uncmin(f,[1,1]).solution");
run("f = function(x) { var ret = 0,i; for(i=1;i<=10;i++) ret+=sqr(2+2*i-Math.exp(i*x[0])-Math.exp(i*x[1])); return ret; }; x0 = nu.uncmin(f,[0.3,0.4]).solution");
run("y = [0.14,0.18,0.22,0.25,0.29,0.32,0.35,0.39,0.37,0.58,0.73,0.96,1.34,2.10,4.39]; f = function(x) { var ret = 0,i; for(i=1;i<=15;i++) ret+=sqr(y[i-1]-(x[0]+i/((16-i)*x[1]+Math.min(i,16-i)*x[2]))); return ret; }; x0 = nu.uncmin(f,[1,1,1]).solution");
run("y = [0.0009,0.0044,0.0175,0.0540,0.1295,0.2420,0.3521,0.3989,0.3521,0.2420,0.1295,0.0540,0.0175,0.0044,0.0009]; f = function(x) { var ret = 0,i; for(i=1;i<=15;i++) ret+=sqr(x[0]*Math.exp(-x[1]*sqr((8-i)/2-x[2])/2)-y[i-1]); return ret; }; x0 = nu.div(nu.round(nu.mul(nu.uncmin(f,[1,1,1]).solution,1000)),1000)");
run("f = function(x) { return sqr(x[0]+10*x[1])+5*sqr(x[2]-x[3])+sqr(sqr(x[1]-2*x[2]))+10*sqr(x[0]-x[3]); }; x0 = nu.div(nu.round(nu.mul(nu.uncmin(f,[3,-1,0,1]).solution,1e5)),1e5)");
run("f = function(x) { return sqr(10*(x[1]-x[0]*x[0]))+sqr(1-x[0])+90*sqr(x[3]-x[2]*x[2])+sqr(1-x[2])+10*sqr(x[1]+x[3]-2)+0.1*sqr(x[1]-x[3]); }; x0 = nu.uncmin(f,[-3,-1,-3,-1]).solution");
run("y = [0.1957,0.1947,0.1735,0.1600,0.0844,0.0627,0.0456,0.0342,0.0323,0.0235,0.0246]; u = [4,2,1,0.5,0.25,0.167,0.125,0.1,0.0833,0.0714,0.0625]; f = function(x) { var ret=0, i; for(i=0;i<11;++i) ret += sqr(y[i]-x[0]*(u[i]*u[i]+u[i]*x[1])/(u[i]*u[i]+u[i]*x[2]+x[3])); return ret; }; x0 = nu.uncmin(f,[0.25,0.39,0.415,0.39]).solution");
run("y = [0.844,0.908,0.932,0.936,0.925,0.908,0.881,0.850,0.818,0.784,0.751,0.718,0.685,0.658,0.628,0.603,0.580,0.558,0.538,0.522,0.506,0.490,0.478,0.467,0.457,0.448,0.438,0.431,0.424,0.420,0.414,0.411,0.406]; f = function(x) { var ret=0, i; for(i=0;i<33;++i) ret += sqr(y[i]-(x[0]+x[1]*Math.exp(-10*i*x[3])+x[2]*Math.exp(-10*i*x[4]))); return ret; }; x0 = nu.uncmin(f,[0.5,1.5,-1,0.01,0.02]).solution");
run("f = function(x) { var ret=0, i,ti,yi,exp=Math.exp; for(i=1;i<=13;++i) { ti = 0.1*i; yi = exp(-ti)-5*exp(-10*ti)+3*exp(-4*ti); ret += sqr(x[2]*exp(-ti*x[0])-x[3]*exp(-ti*x[1])+x[5]*exp(-ti*x[4])-yi); } return ret; }; x0 = nu.uncmin(f,[1,2,1,1,1,1],1e-14).solution; f(x0)<1e-20;");
run("z = []; cb = function(i,x,f,g,H) { z.push({i:i, x:x, f:f, g:g, H:H }); }; x0 = nu.uncmin(function(x) { return Math.cos(2*x[0]); },[1],1e-10,function(x) { return [-2*Math.sin(2*x[0])]; },100,cb)");
run("z");
	  
// Solving ODEs
run("sol = nu.dopri(0,1,1,function(t,y) { return y; })");
run("sol.at([0.3,0.7])");
run("nu.dopri(0,10,[3,0],function (x,y) { return [y[1],-y[0]]; }).at([0,0.5*Math.PI,Math.PI,1.5*Math.PI,2*Math.PI])");
run("nu.dopri(0,20,[2,0],function(t,y) { return [y[1], (1-y[0]*y[0])*y[1]-y[0]]; }).at([18,19,20])");
run("sol = nu.dopri(0,2,1,function (x,y) { return y; },1e-8,100,function (x,y) { return y-1.3; })");
run("sol = nu.dopri(0,2,1,function(x,y) { return y; },undefined,50,function(x,y) { return [y-1.5,Math.sin(y-1.5)]; })");
	   
// Seedrandom (David Bau)
run("nu.seedrandom.seedrandom(3); nu.seedrandom.random()");
run("nu.seedrandom.random()");
