var st=require("./jstat_ccc");
var nu=require("./numeric");

var log = console.log;

var math = exports;

math.run = function run(exp) {
  log("> "+exp+"\n"+nu.prettyPrint(eval(exp))+"\n");
}

math.rseed = nu.seedrandom.seedrandom;
math.random = nu.seedrandom.random;

math.dnorm = st.dnorm;
math.pnorm = st.pnorm;
// math.qnorm = ???
math.rnorm = function rnorm(n) {
	var seq=st.seq(0, n, n);
	return st.dnorm(seq);
}

var run = math.run;

nu.largeArray =10000;

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

