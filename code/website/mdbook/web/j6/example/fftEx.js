var R = require("../j6");
var p = R.parse;

function SFT(f) {
	var N = f.length;
	var F = R.fill(N, 0);
	for (var x=0; x<N; x++) {
		for (var n=0; n<N; n++) {
			F[n] = F[n].add(f[x].mul(R.polarToComplex(1, -2*Math.PI*x*n/N)));
		}
	}
	return F;
}

// 慢速傅立葉反轉換
function iSFT(F) {
	var N = f.length;
	var F = R.fill(N, 0);
	for (var x=0; x<N; x++) {
		for (var n=0; n<N; n++) {
			var Fexp = F[n].mul(R.polarToComplex(1, 2.0*Math.PI*x/N*n));
//			f[x] = f[x].add(F[n].mul(Fexp.mul(1/N)));
			f[x] = f[x].add(F[n].mul(Fexp.div(N)));
		}
	}
	return f;
}

var f = [p('0+1i'), p('1+0i'), p('0+1i'), p('1+0i'), p('0+1i'), p('1+0i'), p('0+1i'), p('1+0i')];

print("f=", f.str());
var F = SFT(f);
print("F=", F.str());
var iF = iSFT(F);
print("iF=", iF.str());
