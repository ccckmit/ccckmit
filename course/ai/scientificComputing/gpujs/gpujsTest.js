const gpu = new GPU()
var N = 512
// Create the GPU accelerated function from a kernel
// function that computes a single element in the
// 512 x 512 matrix (2D array). The kernel function
// is run in a parallel manner in the GPU resulting
// in very fast computations! (...sometimes)
const matMult = gpu.createKernel(function (a, b) {
  var sum = 0
  for (var i = 0; i < N; i++) {
    sum += a[this.thread.y][i] * b[i][this.thread.x]
  }
  return sum
}).setOutput([N, N])

function newMatrix (m, n, v) {
  var mat = new Array(m)
  for (let i = 0; i < m; i++) {
    mat[i] = Array(N * N).fill(v)
  }
  return mat
}

// Perform matrix multiplication on 2 matrices of size 512 x 512
var a = newMatrix(N, N, 1)
var b = newMatrix(N, N, 1)
const c = matMult(a, b)
console.log('c=', c)
