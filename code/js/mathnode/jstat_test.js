var st=require("./jstat_ccc");
var nu=require("./numeric");

var log = console.log;

var math = exports;

var run=function(exp) {
  console.log("> "+exp+"\n"+nu.prettyPrint(eval(exp))+"\n");
}

var str = nu.prettyPrint;

var mat2str = function(m) {
	var str="[";
	for (var i=0; i<m.length; i++) {
		str += (i==0?"[":" [");
		for (var j=0; j<m[0].length-1; j++)
			str += m[i][j]+",";
		str += m[i][j]+"]\n";
	}
	str += "]";
	return str;
}

log("========================Vector==================");
run("st.sum([1,2,3])");
run("st(1,5,5).sum()");
run("st([[1,2],[3,4]]).sum()");
run("st( 1, 5, 5 ).sum(function( result ) { log('result='+result) })");
run("st([[1,2],[3,4]]).sum(true)");
run("st([[1,2],[3,4]]).sum(true,function( result ) { log('result='+result) })");
run("st.sumsqrd([1,2,3])");
run("st( 1, 5, 5 ).sumsqrd()");
run("st([[1,2],[3,4]]).sumsqrd()"); // === [ 10, 20 ]
run("st([[1,2],[3,4]]).sumsqrd( true )");
run("st.sumsqerr([1,2,3])");
run("st( 1, 5, 5 ).sumsqerr()"); // === 10
run("st([[1,2],[3,4]]).sumsqerr()"); // === [ 2, 2 ]
run("st([[1,2],[3,4]]).sumsqerr( true )"); // === 0
run("st.product([1,2,3])"); // === 6
run("st( 1, 5, 5 ).product()"); // === 120
run("st([[1,2],[3,4]]).product()"); // === [ 3, 8 ]
run("st([[1,2],[3,4]]).product( true )"); // === 24
run("st.min([1,2,3])"); // === 1
run("st( 1, 5, 5 ).min()"); // === 1
run("st([[1,2],[3,4]]).min()"); // === [ 1, 2 ]
run("st([[1,2],[3,4]]).min( true )"); // === 1
run("st.max([1,2,3])"); // === 3
run("st( 1, 5, 5 ).max()"); // === 5
run("st([[1,2],[3,4]]).max()"); // === [ 3, 4 ]
run("st([[1,2],[3,4]]).max( true )"); // === 4
run("st.mean([1,2,3])"); // === 2
run("st( 1, 5, 5 ).mean()"); // === 3
run("st([[1,2],[3,4]]).mean()"); // === [ 2, 3 ]
run("st([[1,2],[3,4]]).mean( true )"); // === 2.5
run("st.meansqerr([1,2,3])"); // === 0.66666...
run("st( 1, 5, 5 ).meansqerr()"); // === 2
run("st([[1,2],[3,4]]).meansqerr()"); // === [ 1, 1 ]
run("st([[1,2],[3,4]]).meansqerr( true )"); // === 0
run("st.geomean([4,1,1/32])"); // === 0.5
run("st([4,1,1/32]).geomean()"); // === 0.5
run("st([[1,2],[3,4]]).geomean()"); // === [ 1.732..., 2.828... ]
run("st([[1,2],[3,4]]).geomean( true )"); // === 2.213...
run("st.median([1,2,3])"); // === 2
run("st( 1, 5, 5 ).median()"); // === 3
run("st([[1,2],[3,4]]).median()"); // === [ 2, 3 ]
run("st([[1,2],[3,4]]).median( true )"); // === 2.5
run("st.cumsum([1,2,3])"); // === [1,3,6]
run("st( 1, 5, 5 ).cumsum()"); // === [1,3,6,10,15]
run("st([[1,2],[3,4]]).cumsum()"); // === [[1,4],[2,6]]
run("st([[1,2],[3,4]]).cumsum( true )"); // === [[1,3],[3,7]]
run("st.diff([1,2,2,3])"); // === [1,0,1]
run("st([1,2,2,3]).diff()"); // === [1,0,1]
run("st([[1,2],[3,4],[1,4]]).diff()"); // === [[2,-2],[2,0]]
run("st([[1,2],[3,4],[1,4]]).diff(true)"); // === [0,2]
run("st.mode([1,2,2,3])"); // === 2
run("st.mode([1,2,3])"); // === [1,2,3]
run("st([1,2,2,3]).mode()"); // === 2
run("st([[1,2],[3,4],[1,4]]).mode()"); // === [1,4]
run("st([[1,2],[1,2]]).mode( true )"); // === [[1,2],[1,2]]
run("st.range([1,2,3])"); // === 2
run("st([1,2,3]).range()"); // === 2
run("st([[1,2],[3,4]]).range()"); // === [2,2]
run("st([[1,2],[3,5]]).range( true )"); // === true
run("st.variance([1,2,3,4])"); // === 1.25
run("st.variance([1,2,3,4],true)"); // === 1.66666...
run("st([1,2,3,4]).variance()"); // === 1.25
run("st([[1,2],[3,4]]).variance()"); // === [1,1]
run("st([[1,2],[3,5]]).variance( true )"); // === 0.140625
run("st.stdev([1,2,3,4])"); // === 1.118...
run("st.stdev([1,2,3,4],true)"); // === 1.290...
run("st([1,2,3,4]).stdev()"); // === 1.118...
run("st([1,2,3,4]).stdev(true)"); // === 1.290...
run("st([[1,2],[3,4]]).stdev()"); // === [1,1]
run("st([[1,2],[3,5]]).stdev( true )"); // === 0.25
run("st.meandev([1,2,3,4])"); // === 1
run("st([1,2,3,4]).meandev()"); // === 1
run("st([[1,2],[3,4]]).meandev()"); // === [1,1]
run("st([[1,2],[3,5]]).meandev( true )"); // === 0.25
run("st.meddev([1,2,3,4])"); // === 1
run("st([1,2,3,4]).meddev()"); // === 1
run("st([[1,2],[3,4]]).meddev()"); // === [1,1]
run("st([[1,2],[3,5]]).meddev( true )"); // === 0.25
run("st.coeffvar([1,2,3,4])"); // === 0.447...
run("st([1,2,3,4]).coeffvar()"); // === 0.447...
run("st([[1,2],[3,4]]).coeffvar()"); // === [0.5,0.333...]
run("st([[1,2],[3,5]]).coeffvar( true )"); // === 0.142...
run("st.quartiles(st.seq(1,100,100))"); // === [25,50,75]
run("st(1,100,100).quartiles()"); // === [25,50,75]
run("st(1,100,100,function( x ) { return [x,x]; }).quartiles()"); // === [[25,50,75],[25,50,75]]
run("seq = st.seq( 0, 10, 11 ); st.covariance( seq, seq )"); // === 11;
run("seq = st.seq( 0, 10, 11 ); st.corrcoeff( seq, seq )"); // === 1;

log("================ jStat usage ==============");
run("vector = st( 0, 1, 5 )");
run("vector = st( 0, 1, 5, function( x ) { return x * 2; })");
run("alpha=0.3; beta=0.5; betaGraph = st( 0, 1, 11, function( x, cnt ) { return [ st.beta.pdf( x, alpha, beta ), cnt ]; })");

log("=================R style function==================");
var nsample = function(n, exp) {
	samples = [];
	for (var i=0; i<n; i++)
		samples[i] = eval(exp);
	return samples;
}

log("======Uniform Distribution=======");
var dunif = st.uniform.pdf;
var punif = st.uniform.cdf;
var qunif = st.uniform.inv;
var runif = function(n,a,b) {
	return nsample(n, "st.uniform.sample(a,b)");
}

run("a=0, b=10, runif(10,a,b)");

log("======Normal Distribution=======");
var dnorm = st.norm.pdf;
var pnorm = st.norm.cdf;
var qnorm = st.norm.inv;
var rnorm = function(n,mean,sd) {
	return nsample(n, "st.normal.sample(mean,sd)");
}

run("mean=5, sd=2, rnorm(10,mean,sd)");

log("========================distribution==================");
log("=== Binomial ===");
run("k=3; n=10; p=0.7; x=st.binomial.pdf(k, n, p)");
run("c=st.normal.cdf(x, n, p)");
log("=== Uniform ===");
run("x=3; a=0; b=10; p=st.uniform.pdf(x, a, b)");
run("c=st.uniform.cdf(x, a, b)");
run("sx=st.uniform.sample(a,b)");
// run("rx=st.uniform.inv(c, a, b)"); // uniform.inv 沒定義
log("=== Normal ===");
run("x=3; mean=3; std=2; p=st.normal.pdf(x, mean, std)");
run("c=st.normal.cdf(x, mean, std)");
run("rx=st.normal.inv(c, mean, std)");
run("sx=st.normal.sample(mean, std)");
log("=== Beta ===");
run("alpha=0.3; beta=0.5; st.beta.pdf( 0.1, alpha, beta )");

/*
run("matrix = st([[ 1, 2, 3 ],[ 4, 5, 6 ],[ 7, 8, 9 ]]); str(matrix)");
run("stat1 = st([[ 1, 2 ],[ 3, 4 ]]), stat2 = st( stat1 );");
run("st([[ 1, 2 ],[ 3, 4 ]], function( x ) {  return x * 2; })");
run("vector = st( 0, 1, 5 )");
run("vector = st( 0, 1, 5, function( x ) { return x * 2; })");
run("alpha=0.3; beta=0.5; betaGraph = st( 0, 1, 11, function( x, cnt ) { return [ st.beta.pdf( x, alpha, beta ), cnt ] })");
run("st.rand( 3 ))");
run("st().rand( 3 )");
run("matrix = [[1,2,3],[4,5,6]]");
run("st.rows( matrix )"); // === 2;
run("st.cols( matrix )"); // === 3;
run("st( matrix ).cols()"); // === 3;
run("st( matrix ).rows()"); // === 2;	
run("st.dimensions( matrix )"); // === { cols: 3, rows: 2 };
run("st.row( matrix, 0 )"); // === [1,2,3];
run("st.col( matrix, 0 )"); // === [[1],[3]];


    jStat( matrix ).col( 0 ) === jStat([[1],[3]]);
    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.diag( matrix ) === [[1],[5],[9]];
    jStat( matrix ).diag() === jStat([[1],[5],[9]]);
    var matrix = [[1,2,3],[4,5,6],[7,8,9]];
    jStat.antidiag( matrix ) === [[3],[5],[7]];
    var matrix = [[1,2],[3,4]];
    jStat.transpose( matrix ) === [[1,3],[2,4]];
    jStat( matrix ).transpose() === [[1,3],[2,4]];
    var matrix = [[1,2],[3,4]];
    jStat.map( matrix, function( x ) {
        return x * 2;
    });
    // returns [[2,4],[6,8]]
    var matrix = [[1,2],[3,4]];
    jStat( matrix ).alter( function( x ) {
        return x * 2;
    });
    jStat.create( 2, function( row, col ) {
        return row + col;
    });
    // returns [[0,1],[1,2]]
    jStat.zeros( 2 );
    jStat().ones( 2 );
    jStat.rand( 3 );
    jStat.identity( 2 );
    var tmp = [1,2,3];
    jStat.clear( tmp );
    jStat.symmetric([[1,2],[2,1]]) === true

*/

/*
run("st.seq(1, 10, 2)");
run("st.Normal(0,1).getQuantile(0.95)");
run("st.pbeta(0.5, 2.3, 4.1)");
run("seq=st.seq(-5,5,10)");
run("st.dnorm(seq, 0.0, 1.0)");
run("st.pnorm(seq, 0.0, 1.0)");
run("st.dlnorm(seq, 0.0, 1.0)");

log(math.rnorm(100));
// produce the plot (no formatting)
// st.plot(range, densities);

*/