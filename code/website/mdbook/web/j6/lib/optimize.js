module.exports = function (j6) {
// 線性最小平方迴歸 : 線性代數, Larson, 翁慶昌 5/e , 131 頁
// https://en.wikipedia.org/wiki/Least_squares
j6.minSquare = function(x,y) {
	var Xt = [R.newV(x[0].length, 1)].concat(x), X = Xt.tr(); // X = [1,x]t
	var Yt = [ y ], Y = Yt.tr();               // Y = [y]t
	var A = Xt.mdot(X).inv().mdot(Xt).mdot(Y);    // A = (XtX)-1 Xt Y
	return A.tr()[0].reverse();
}

// 多項式最小平方迴歸 : https://en.wikipedia.org/wiki/Polynomial_least_squares
}