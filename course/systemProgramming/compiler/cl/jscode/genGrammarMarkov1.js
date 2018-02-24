var R=require("./randomLib");

function S() {
	return NP()+" "+VP();
}

function NP() {
	return DET()+Q()+" "+N();
}

function VP() {
	return V()+" "+NP();
}

function N() {
	return R.sample(["人", "貓", "魚"]);
}

function V() {
	return R.sample(["養", "吃", "追", "餵"]);
}

function Q() {
	return R.sample(["隻", "位", "條"]);
}

function DET() {
	return R.sample(["這", "那", "1", "3"]);
}

console.log(S());
