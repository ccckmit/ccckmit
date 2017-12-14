var R = require("../j6");

var b = [[1,2],[3,4]];
var a = [[1,0],[0,1]];
                     
print("tadd(a,b)=", R.tadd(a,b).str());

var ab = R.tproduct(a,b);
print("tproduct(a,b)=", ab.str());

print("rowSum(ab)=", R.rowSum(ab));
print("colSum(ab)=", R.colSum(ab));

print("tcontract(ab,0,1)=", R.tcontract(ab,0,1).str());
// [[1,1],[1,1]].tmul(b) = [[b,b],[b,2b]]