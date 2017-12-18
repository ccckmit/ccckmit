function mpower(a, n, p) {
  let r = a
  for (let i=2; i<=n; i++) {
    r = (r * a) % p
  }
  return r
}

var p = 61, q = 53, N = p*q // lcm(61,53)=780
let e = 17 , d = 413

// var p = 37, q = 67, N = p * q
// let e = 23, d = 

var M1 = [65, 22, 37, 18, 29]
var M2 = []
for (let m of M1) {
  let c = mpower(m, e, N)
  let m2 = mpower(c, d, N)
  M2.push(m2)
}

console.log('M1=', M1)
console.log('M2=', M2)
