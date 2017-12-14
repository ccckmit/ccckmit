module.exports = function (j6) {
/* eslint-disable no-undef */
// =========== Function Operation ==============
j6.neg = function (fx) {
  return function (v) { return -1 * fx(v) }
}

j6.inv = function (fx) {
  return function (v) { return 1 / fx(v) }
}

j6.add = function (fx, fy) {
  return function (v) { return fx(v).add(fy(v)) }
}

j6.sub = function (fx, fy) {
  return function (v) { return fx(v).sub(fy(v)) }
}

j6.mul = function (fx, fy) {
  return function (v) { return fx(v).mul(fy(v)) }
}

j6.div = function (fx, fy) {
  return function (v) { return fx(v).div(fy(v)) }
}

j6.compose = function (fx, fy) {
  return function (v) { return fx(fy(v)) }
}

j6.eval = function (f, x) { return f(x) }

// f=(x,y)=>x*y+x*x;
// f0=fa(f); f0([x,y]);
j6.fa = function (f) {
  return function (x) { return f.apply(null, x) }
}

/*

// ================= Checking Rule =====================
j6.check = j6.assert = function (cond, msg) {
  if (cond) {
    if (j6.assertMessage) console.log('O:' + msg)
  } else {
    console.log('X:' + msg)
    if (j6.throwError) throw Error('check fail!')
  }
}

j6.assertMessage = true
j6.throwError = false
*/
// j6.be = function (msg, cond) { return j6.check(cond, msg) }

// j6.proto = function (o) { return Object.getPrototypeOf(o) }

// relation
j6.eq = function (a, b) {
  return (typeof a === typeof b) && a.toString() === b.toString()
}

j6.neq = function (a, b) { return !j6.eq(a, b) }
j6.leq = function (a, b) { return a <= b }
j6.geq = function (a, b) { return a >= b }
j6.lt = function (a, b) { return a < b }
j6.gt = function (a, b) { return a > b }
j6.near = function (a, b) { return Math.abs(a - b) < 0.0001 }


// =========== Integer ====================
j6.isPrime = function (n) {
  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return n % 1 === 0
}

j6.gcd = function (a, b) {
  if (!b) return a
  return j6.gcd(b, a % b)
}

j6.lcm = function (a, b) {
  return (a * b) / j6.gcd(a, b)
}

// ========= type checking =================
j6.yes = function (a) { return true }
j6.no = function (a) { return false }
j6.isBool = function (a) {
  return typeof a === 'boolean' || a instanceof Boolean
}
j6.isFunction = function (a) {
  return typeof a === 'function' || a instanceof Function
}
j6.isString = function (a) {
  return typeof a === 'string' || a instanceof String
}
j6.isObject = function (a) {
  return typeof a === 'object' || a instanceof Object
}
j6.isArray = function (a) { return a instanceof Array }
j6.isUndefined = function (a) { return typeof a === 'undefined' }
j6.isSet = function (a) { return a instanceof Set }
j6.isFloat = j6.isNumber = function (a) {
  return typeof a === 'number' || a instanceof Number
}
j6.isInteger = function (a) { return j6.isFloat(a) && a % 1 === 0 }
j6.isZero = function (a) { return a === 0 }
j6.isPositive = function (a) { return a > 0 }
j6.isNegative = function (a) { return a < 0 }
j6.isEven = function (a) { return (j6.isInteger(a) && a % 2 === 0) }
j6.isOdd = function (a) { return (j6.isInteger(a) && a % 2 === 1) }
}