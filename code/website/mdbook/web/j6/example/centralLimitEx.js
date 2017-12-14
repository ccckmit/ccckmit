var R = require("../j6");

function hist(x,k) {
	var mk = x.fillVM(k,x.length/k);
	return mk.colSum().hist();
}

var centralLimit = function(x) {
	print('hist(x,1)=',  x.hist().str(0));
	print(R.astr(x.hist(), 0));
	print('hist(x,2)=',  hist(x,2).str(0));
	print('hist(x,10)=', hist(x,10).str(0));
	print('hist(x,20)=', hist(x,20).str(0));
}

var x = R.samples([0,1], 100000, {replace:true});
centralLimit(x);

var xu = R.runif(100000, 0, 10);
centralLimit(xu);
