module.exports = function (j6) {
/* eslint-disable one-var */
var N = require('numeric')
var M = j6.M = {}

M.sparse = N.ccsSparse // Matrix => Sparse
M.sparse2full = N.ccsFull // Sparse => Matrix
// j6.complex=N.t
// matrix
M.svd = N.svd
// j6.det = N.det
// j6.inv = N.inv
M.lu = N.cLU
M.luSolve = N.cLUsolve
// j6.dot = N.dot
// j6.rep = N.rep
// j6.tr = N.transpose
// j6.diag = N.diag
// j6.sumM = N.sum

M.str = N.prettyPrint
M.rows = function (m) { return m.length }
M.cols = function (m) { return m[0].length }
M.row = function (m, i) { return m[i] }
M.col = function (m, j) {
  var rows = m.length
  var c = new Array(rows)
  for (var i = 0; i < rows; i++) {
    c[i] = m[i][j]
  }
  return c
}

M.new = function (rows, cols, value = 0) {
  return j6.T.repeat([rows, cols], value)
}

M.random = function (rows, cols, a, b) {
  return j6.T.random([rows, cols], a, b)
}

M.rowSum = function (m) {
  var rows = m.length
  var s = new Array(rows)
  for (var i = 0; i < rows; i++) {
    s[i] = j6.T.sum(m[i])
  }
  return s
}

M.colSum = function (m) {
  var rows = m.length
  if (rows === 0) return []
  var s = m[0]
  for (var i = 1; i < rows; i++) {
    s = j6.V.add(s, m[i])
  }
  return s
}

M.rowMean = function (m) {
  return M.rowSum(m).div(m.cols())
}

M.colMean = function (m) {
  return M.colSum(m).div(m.rows())
}

M.addv = function (m, v) {
  var rows = m.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.V.add(m[i], v)  // 這行比較快 (使用多型速度會變慢)
  }
  return r
}

M.add = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.V.add(m1[i], m2[i])
  }
  return r
}

M.sub = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.V.sub(m1[i], m2[i])
  }
  return r
}

M.mul = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.V.mul(m1[i], m2[i])
  }
  return r
}

M.div = function (m1, m2) {
  var rows = m1.length
  var r = new Array(rows)
  for (var i = 0; i < rows; i++) {
    r[i] = j6.V.div(m1[i], m2[i])
  }
  return r
}

M.fillv = function (v, rows, cols) {
  var m = new Array(rows)
  for (var r = 0; r < rows; r++) {
    var mr = m[r] = new Array(cols)
    for (var c = 0; c < cols; c++) {
      mr[c] = v[(r * cols) + c]
    }
  }
  return m
}

M.eig = function (m) {
  var E = N.eig(m)
  return {lambda: E.lambda.x, E: E.E.x}
}

M.tr = M.transpose = function (m) {
  var r = []
  var rows = m.length
  var cols = m[0].length
  for (var j = 0; j < cols; j++) {
    var rj = r[j] = []
    for (var i = 0; i < rows; i++) {
      rj[i] = m[i][j]
    }
  }
  return r
}

M.dot = function (a, b, isComplex = false) {
  var arows = a.length
  var bcols = b[0].length
  var r = []
  var bt = M.tr(b)
  for (var i = 0; i < arows; i++) {
    var ri = r[i] = []
    for (var j = 0; j < bcols; j++) {
      ri.push(j6.V.dot(a[i], bt[j], isComplex))
    }
  }
  return r
}

M.isMatrix = function (m) {
  return (m instanceof Array && m[0] instanceof Array)
}

M.diag = function (v) {
  var rows = v.length
  var r = M.new(rows, rows)
  for (var i = 0; i < rows; i++) {
    r[i][i] = v[i]
  }
  return r
}

M.identity = function (n) {
  return M.diag(j6.T.repeat([n], () => 1))
}

M.inv = function (m0) {
  var s = j6.T.dim(m0), abs = Math.abs, m = s[0], n = s[1]
  var A = j6.clone(m0), Ai, Aj
  var I = M.identity(m), Ii, Ij
  var i, j, k, x
  for (j = 0; j < n; ++j) {
    var i0 = -1
    var v0 = -1
    for (i = j; i !== m; ++i) {
      k = abs(A[i][j])
      if (k > v0) { i0 = i; v0 = k }
    }
    Aj = A[i0]; A[i0] = A[j]; A[j] = Aj
    Ij = I[i0]; I[i0] = I[j]; I[j] = Ij
    x = Aj[j]
    for (k = j; k !== n; ++k) Aj[k] /= x
    for (k = n - 1; k !== -1; --k) Ij[k] /= x
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i]
        Ii = I[i]
        x = Ai[j]
        for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x
        for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x }
        if (k === 0) Ii[0] -= Ij[0] * x
      }
    }
  }
  return I
}

M.det = function (x) {
  var s = j6.dim(x)
  if (s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices') }
  var n = s[0], ret = 1, i, j, k, A = j6.clone(x), Aj, Ai, alpha, temp, k1
  for (j = 0; j < n - 1; j++) {
    k = j
    for (i = j + 1; i < n; i++) { if (Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i } }
    if (k !== j) {
      temp = A[k]; A[k] = A[j]; A[j] = temp
      ret *= -1
    }
    Aj = A[j]
    for (i = j + 1; i < n; i++) {
      Ai = A[i]
      alpha = Ai[j] / Aj[j]
      for (k = j + 1; k < n - 1; k += 2) {
        k1 = k + 1
        Ai[k] -= Aj[k] * alpha
        Ai[k1] -= Aj[k1] * alpha
      }
      if (k !== n) { Ai[k] -= Aj[k] * alpha }
    }
    if (Aj[j] === 0) { return 0 }
    ret *= Aj[j]
  }
  return ret * A[j][j]
}
}