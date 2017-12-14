// ============= Multi-Dimensional Array Operation ====================
module.exports = function (j6) {
var recursiveDim = function (a, d) { // dimension by recursion (tensor)
  if (j6.isArray(a)) {
    d.push(a.length)
    recursiveDim(a[0], d)
  }
}

var recursiveRepeat = function (dim, i, v) {
  if (i === dim.length) {
    return j6.isFunction(v) ? v() : v
  } else {
    let n = dim[i]
    let a = new Array(n)
    for (var k = 0; k < n; k++) {
      a[k] = recursiveRepeat(dim, i + 1, v)
    }
    return a
  }
}

var T = j6.T = {}

T.dim = function (a) {
  var d = []
  recursiveDim(a, d)
  return d
}

T.repeat = function (dim, value = 0) {
  return recursiveRepeat(dim, 0, value)
}

T.random = function (dim, a = 0, b = 1) {
  return T.repeat(dim, () => j6.random(a, b))
}

// ================== Map Reduce =========================
var map1 = T.map1 = function (a, f) {
  if (a instanceof Array) {
    var fa = new Array(a.length)
    for (var i = 0; i < a.length; i++) {
      fa[i] = map1(a[i], f)
    }
    return fa
  } else {
    return f(a)
  }
}

var map2 = T.map2 = function (a, b, f) {
  if (a instanceof Array) {
    var fa = new Array(a.length)
    var isArrayB = (b instanceof Array)
    for (var i = 0; i < a.length; i++) {
      var bi = isArrayB ? b[i] : b
      fa[i] = map2(a[i], bi, f)
    }
    return fa
  } else {
    return f(a, b)
  }
}

var reduce = T.reduce = function (a, f, init) {
  var result = init
  if (a instanceof Array) {
    for (var i in a) {
      result = f(result, reduce(a[i], f, init))
    }
  } else {
    result = f(result, a)
  }
  return result
}

T.all = function (a) {
  return (a instanceof Array) ? a.every(e => T.all(e)) : (a === true)
}

T.any = function (a) {
  return (a instanceof Array) ? a.some(e => T.any(e)) : (a === true)
}

// statistics
T.max = (a) => reduce(a, Math.max, -Number.MAX_VALUE)
T.min = (a) => reduce(a, Math.min, Number.MAX_VALUE)
T.sum = (a) => reduce(a, (x, y) => x + y, 0)
T.product = (a) => reduce(a, (x, y) => x * y, 1)
T.mean = function (a) { return a.sum().div(a.length) }
T.norm = function (a) { return a.map1((x) => x * x).sum().sqrt() }
// +-*/%^
T.add = function (a, b) { return map2(a, b, (x, y) => x + y) }
T.sub = function (a, b) { return map2(a, b, (x, y) => x - y) }
T.mul = function (a, b) { return map2(a, b, (x, y) => x * y) }
T.div = function (a, b) { return map2(a, b, (x, y) => x / y) }
T.mod = function (a, b) { return map2(a, b, (x, y) => x % y) }
T.power = function (a, b) { return map2(a, b, (x, y) => Math.pow(x, y)) }
T.neg = function (a) { return map1(a, (x) => -x) }
T.inv = function (a) { return map1(a, (x) => 1 / x) }
// logical
T.not = function (a) { return map1(a, (x) => !x) }
T.and = function (a, b) { return map2(a, (x, y) => x && y) }
T.or = function (a, b) { return map2(a, (x, y) => x || y) }
// j6.xor=function(x,y) { return x^y }
T.bnot = function (x) { return map1(a, (x) => ~x) }
T.band = function (a, b) { return map2(a, b, (x, y) => x & y) }
T.bor = function (a, b) { return map2(a, b, (x, y) => x | y) }
T.bxor = function (a, b) { return map2(a, b, (x, y) => x ^ y) }
T.lshift = function (a, b) { return map2(a, b, (x) => x << b) }
T.rshift = function (a, b) { return map2(a, b, (x) => x >> b) }
// compare
T.eq = function (a, b) { return map2(a, b, (x, y) => x === y) }
T.neq = function (a, b) { return map2(a, b, (x, y) => x !== y) }
T.geq = function (a, b) { return map2(a, b, (x, y) => x >= y) }
T.leq = function (a, b) { return map2(a, b, (x, y) => x <= y) }
T.gt = function (a, b) { return map2(a, b, (x, y) => x > y) }
T.lt = function (a, b) { return map2(a, b, (x, y) => x < y) }
T.near = function (a, b) { return a.sub(b).abs().sum() < 0.001 }
// number function
T.sqrt = function (a) { return map1(a, Math.sqrt) }
T.log = function (a) { return map1(a, Math.log) }
T.exp = function (a) { return map1(a, Math.exp) }
T.abs = function (a) { return map1(a, Math.abs) }
T.sin = function (a) { return map1(a, Math.sin) }
T.cos = function (a) { return map1(a, Math.cos) }
T.tan = function (a) { return map1(a, Math.tan) }
T.asin = function (a) { return map1(a, Math.asin) }
T.acos = function (a) { return map1(a, Math.acos) }
T.atan = function (a) { return map1(a, Math.atan) }
T.atan2 = function (a) { return map1(a, Math.atan2) }
T.ceil = function (a) { return map1(a, Math.ceil) }
T.floor = function (a) { return map1(a, Math.floor) }
T.round = function (a) { return map1(a, Math.round) }
T.sin = function (a) { return map1(a, Math.sin) }
T.sqrt = function (a) { return map1(a, Math.sqrt) }
T.toComplex = function (a) { return map1(a, (x) => j6.Complex.toComplex(x)) }
// Operation (Object version)
T.oadd = function (a, b) { return map2(a, b, (x, y) => x.add(y)) }
T.osub = function (a, b) { return map2(a, b, (x, y) => x.sub(y)) }
T.omul = function (a, b) { return map2(a, b, (x, y) => x.mul(y)) }
T.odiv = function (a, b) { return map2(a, b, (x, y) => x.div(y)) }
// j6.omod = function(a,b) { return map2(a,b,(x,y)=>x.mod(y)) }
T.osqrt = function (a) { return map1(a, (x) => x.sqrt()) }
T.osum = function (a) { return reduce(a, function (x, y) { return x.add(y) }, 0) }
T.product = function (a) { return reduce(a, (x, y) => x.mul(y), 1) }

// ===================== Tensor Operation ===========================
T.prod = function (a, b) {
  var c = []
  if (!j6.isArray(a)) return a.mul(b)
  for (var i = 0; i < a.length; i++) {
    c.push(j6.tprod(a[i], b))
  }
  return c
}

function contract2 (b, j, ai, k) {
  if (k === j) {
    return b[ai]
  } else {
    var c = []
    for (var bi = 0; bi < b.length; bi++) {
      c.push(contract2(b, j, ai, k + 1))
    }
    return c
  }
}

// b = [[1,2],[3,4]];
// a = [[1,0],[0,1]];
// ab=[[b,0],      ab[0=1] = [b+b] = [2b] = [[2,4],[6,8]]
//     [0,b]]
function contract (a, i, j, k) { // merge a[..i..j..]
  var c = []
  if (k === i) {
    for (let ai = 0; ai < a.length; ai++) {
      c.push(contract2(a[ai], j, ai, k + 1))
    }
    return j6.colSum(c)
  } else {
    for (let ai = 0; ai < a.length; ai++) {
      c.push(contract(a[ai], i, j, k + 1))
    }
  }
  return c
}

j6.tcontract = function (a, i, j) {
  return contract(a, i, j, 0)
}
}