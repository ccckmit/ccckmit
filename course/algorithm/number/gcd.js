// Euclid's Algorithm 
// https://stackoverflow.com/questions/32042240/euclids-algorithm-javascript

var gcd = function(a, b) {  
  if (!b) return a
  return gcd(b, a % b)
}

console.log(gcd(462, 910))