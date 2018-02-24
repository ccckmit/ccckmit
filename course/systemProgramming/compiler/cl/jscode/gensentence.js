var R=require("./randomLib");

/*
S = NP VP
NP = DET N
VP = V NP
N = dog | cat
V = chase | eat
DET = a | the
*/

function S() {
	return NP()+" "+VP();
}

function NP() {
	return DET()+" "+N();
}

function VP() {
	return V()+" "+NP();
}

function N() {
	return R.sample(["dog", "cat"]);
}

function V() {
	return R.sample(["chase", "eat"]);
}

function DET() {
	return R.sample(["a", "the"]);
}

console.log(S());
