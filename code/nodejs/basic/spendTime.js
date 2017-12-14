var R = []

function sum(n) {
  var s=0;
  for (var i=1; i<=n; i++) {
	  s += i;
	}
	return s;
}

var FMAX = 10;
for (var i=0; i<FMAX; i++) {
  R[i]=sum;
}

var LOOPS = 10000000;

function spendTime1(n) { 
	var startTime = new Date();
	for (var i=0; i<LOOPS; i++) {
		s = sum(n); // 快
	}
	var stopTime = new Date();
	return stopTime - startTime;
}

function spendTime2(n) {
	var startTime = new Date();
	for (var i=0; i<LOOPS; i++) {
		var s = R[LOOPS%FMAX](n); // 慢:因為多型
	}
	var stopTime = new Date();
	return stopTime - startTime;
}

function spendTime3(n) {
	var startTime = new Date();
	for (var i=0; i<LOOPS; i++) {
		var f = R[LOOPS%FMAX];
		var s = f(n); // 快: Why? 一樣有多型阿？
	}
	var stopTime = new Date();
	return stopTime - startTime;
}

console.log("spendTime1:sum=", spendTime1(3));
console.log("spendTime2:R[i](n)=", spendTime2(3));
console.log("spendTime3:f=R[i],f(n)=", spendTime3(3));

/*
console.log("spendTime2()=", spendTime2());
function spendTime2() {
	var startTime = new Date();
	for (var i=0; i<LOOPS; i++) {
		var s = R.f100(3);
		if (R.f100!==R.f200)
			R.f100 = R.f200;
	}
	var stopTime = new Date();
	return stopTime - startTime;
}

*/