var Complex = require('./complex')
var p = Complex.parse

var SFT = function (f) {
  let N = f.length
  let F = []
  for (let n=0; n<N; n++) F[n] = p('0+0i')
  for (let x=0; x<N; x++) {
    for (let n=0; n<N; n++) {
      let exp = Complex.expi((-2.0*Math.PI*x)/N*n)
      let fexp = f[x].mul(exp)
      F[n] = F[n].add(fexp)
    }
  }
  return F
}

var iSFT = function (F) {
  let N = F.length
  let f = []
  for (let x=0; x<N; x++) f[x] = p('0+0i')
  for (let n=0; n<N; n++) {
    for (let x=0; x<N; x++) {
      let exp = Complex.expi((2.0*Math.PI*x)/N*n)
      let Fexp = F[n].mul(exp)
      Fexp.r /= N; Fexp.i /= N;
      f[x] = f[x].add(Fexp)
    }
  }
  return f
}

var steps = function(from, to, step = 1) {
	var a=[];
	for (var t=from; t<=to; t+=step)
		a.push(t);
	return a;
}

// var a = p('1+0i'), b = p('0+1i')
// var f = [a,b,a,b,a,b,a,b]

var x = steps(0, 10*Math.PI, Math.PI/8)
var f = x.map(Complex.expi)
// var f = x.map((x)=>p('1+0i'))
// var x = steps(0, 100)
// var f = x.map((xi)=>(xi%2===0)?p('1+0i'):p('0+0i'))

console.log('f=%s', f)
F = SFT(f)
console.log('F=SFT(f)=%s', F)
f2 = iSFT(F)
console.log('f2=iSFT(F)=%s', f2)
