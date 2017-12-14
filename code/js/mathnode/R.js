var st=require("./jstat_ccc");
var nu=require("./numeric");

var log = console.log;

R = nu;

R.run = function run(exp) {
  log("> "+exp+"\n"+nu.prettyPrint(eval(exp))+"\n");
}

var run = R.run;

R.rseed = nu.seedrandom.seedrandom;
R.random = nu.seedrandom.random;

nu.largeArray = 10000;

log("=================R style function==================");
var nsample = function(n, exp) {
	samples = [];
	for (var i=0; i<n; i++)
		samples[i] = eval(exp);
	return samples;
}

log("======Uniform Distribution=======");
R.dunif = st.uniform.pdf;
R.punif = st.uniform.cdf;
R.qunif = st.uniform.inv;
R.runif = function(n,a,b) {
	return nsample(n, "st.uniform.sample(a,b)");
}

R.run("a=0, b=10, R.runif(10,a,b)");

log("======Normal Distribution=======");
R.dnorm = st.norm.pdf;
R.pnorm = st.norm.cdf;
R.qnorm = st.norm.inv;
R.rnorm = function(n,mean,sd) {
	return nsample(n, "st.normal.sample(mean,sd)");
}

R.run("mean=5, sd=2, R.rnorm(10,mean,sd)");

log("======Histogram=======");
R.seq = function(min, max, len) {
	var step = (max-min)/len;
	var array = [];
	for (var i=0; i<len; i++)
		array[i] = min + i*step;
	return array;
}

R.hist = function(x, nclass) {
	var min = st.min(x);
	var max = st.max(x);
	var range = (max-min)*1.000001;
	var step = range/nclass;
//	log("min="+min);
//	log("max="+max);
//	log("range="+range);
//	log("step="+step);
	var counts = R.seq(0, 0, nclass);
//	log("counts="+counts);
//	log("x="+x);
	for (var i in x) {
		cell = Math.floor((x[i]-min)/step);
		counts[cell] += 1;
//		log("x[i]="+x[i]+" cell="+cell);
	}
	return counts;
}

R.run("x = R.runif(1000, 0, 10)");
R.run("c = R.hist(x, 10)");

module.exports = R;
