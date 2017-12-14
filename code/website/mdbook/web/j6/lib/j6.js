/* eslint-disable no-undef */
var j6 = module.exports = {}
require('./util')(j6)
require('./function')(j6)
require('./set')(j6)
require('./algebra')(j6)
require('./tensor')(j6)
require('./vector')(j6)
require('./matrix')(j6)
require('./probability')(j6)
require('./statistics')(j6)
require('./test')(j6)
require('./entropy')(j6)
require('./geometry')(j6)
require('./distance')(j6)
// j6.Symbol = require('algebrite')
/*
require('./optimize')(j6)
require('./nn/nn')(j6)
require('./ml/ml')(j6)
// j6.NN = require('./neural')
j6.Image = require('./image')
j6.Kb = require('./kb')
*/
var J = require('jStat').jStat

j6._ = require('lodash')

j6.dot = function (a, b, isComplex = false) {
  return (j6.M.isMatrix(a)) ? j6.M.dot(a, b, isComplex) : j6.V.dot(a, b, isComplex)
}

j6.mapFunctions(j6, J, {
//  C: 'combination', // C(n,m)
  choose: 'combination', // C(n,m)
  lchoose: 'combinationln', // log C(n,m)
//  P: 'permutation', // P(n,m)
  sd: 'stdev',
  cov: 'covariance',
  cor: 'corrcoeff'
})

j6.mixThis(Array.prototype, j6, [
  'samples',
  'range',
  'median',
  'variance',
  'deviation',
  'sd',
  'cov',
  'cor',
  'normalize',
  'curve',
  'hist',
  'ihist',
  'eval'
])

j6.mixThisMap(Array.prototype, j6.T, {
  dim: 'dim',
  sum: 'sum',
  near: 'near',
  max: 'max',
  min: 'min',
  product: 'product',
  norm: 'norm',
  mean: 'mean',
  map1: 'map1',
  map2: 'map2',
  // slow map version
  // logical
  all: 'all',
  // compare
  eq: 'eq',
  neq: 'neq',
  geq: 'geq',
  leq: 'leq',
  gt: 'gt',
  lt: 'lt',
  // *+-/%
  add: 'add',
  sub: 'sub',
  mul: 'mul',
  div: 'div',
  mod: 'mod',
  neg: 'neg',
  and: 'and',
  or: 'or',
  xor: 'xor',
  not: 'not',
  // bits operation
  bnot: 'bnot',
  band: 'band',
  bor: 'bor',
  bxor: 'bxor',
  // function
  power: 'power',
  // 'dot', 和矩陣相衝
  sqrt: 'sqrt',
  log: 'log',
  exp: 'exp',
  abs: 'abs',
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  asin: 'asin',
  acos: 'acos',
  atan: 'atan',
  ceil: 'ceil',
  floor: 'floor',
  round: 'round',
  toComplex: 'toComplex',
  // Object version
  oadd: 'oadd',
  osub: 'osub',
  omul: 'omul',
  odiv: 'odiv',
  osqrt: 'osqrt',
  osum: 'osum',
  oproduct: 'oproduct'
})

j6.mixThisMap(Array.prototype, j6.V, {
  // fast vector op
  vdot: 'dot',
  vadd: 'add',
  vsub: 'sub',
  vmul: 'mul',
  vdiv: 'div'
})

j6.mixThisMap(Number.prototype, j6, {
  add: 'add',
  sub: 'sub',
  mul: 'mul',
  div: 'div',
  sqrt: 'sqrt',
  mod: 'mod',
  neg: 'neg',
  inv: 'inv',
  power: 'power',
  eval: 'eval',
  toComplex: 'toComplex'
})

j6.mixThis(Number.prototype, Math, [
  'log',
  'exp',
  'abs',
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'ceil',
  'floor',
  'round'
])

j6.mixThisMap(String.prototype, j6, {str: 'sstr', print: 'print', json: 'json'})
j6.mixThisMap(Number.prototype, j6, {str: 'nstr', print: 'print', json: 'json'})
j6.mixThisMap(Array.prototype, j6, {
  str: 'vstr',
  print: 'print',
  json: 'json'
})
j6.mixThisMap(Object.prototype, j6, {
  str: 'ostr',
//  print: 'print', 這兩行去掉， c3.js 才能正常繪製圖表，原因不明！
//  json: 'json'
})

j6.mixThisMap(Array.prototype, j6.M, {
  lu: 'lu',
  luSolve: 'luSolve',
  svd: 'svd',
  // 'cdelsq',
  // 'clone',
  rows: 'rows',
  cols: 'cols',
  row: 'row',
  col: 'col',
  tr: 'tr',
  inv: 'inv',
  // 'all',
  // 'any',
  // 'same',
  // 'isFinite',
  // 'isNaN',
  // 'mapreduce',
  // 'complex',
  det: 'det',
  // 'norm2',
  // 'norm2Squared',
  // 'norm2inf',
  madd: 'add',
  msub: 'sub',
  mmul: 'mul',
  mdiv: 'div',
  mdot: 'dot',
  // 'dim',
  eig: 'eig',
  // 'sum',
  rowSum: 'rowSum',
  colSum: 'colSum',
  rowMean: 'rowMean',
  colMean: 'colMean',
  // mapM: 'mmap1',
  // mapMM: 'mmap2',
  // flat: 'flat',
  mfillv: 'fillv',
  maddv: 'addv',
  // fillMM: 'fillMM',
  // getBlock: 'getBlock',
  // setBlock: 'setBlock',
  // getDiag: 'getDiag',
  diag: 'diag',
  // 'parseFloat',
  // 'parseDate',
  // 'parseCSV',
  // 'toCSV',
  // strM: 'strM',
  mstr: 'str',
  // 'sumM',
  isMatrix: 'isMatrix'
})

j6.mixThisMap(Array.prototype, j6, {
  dot: 'dot'
})

var N = require('numeric')
// Advance mathematics
j6.ode = N.dopri // dopri(x0,x1,y0,f,tol,maxit,event) #Ordinary Diff Eq
j6.minimize = N.uncmin // uncmin(f,x0,tol,gradient,maxit,callback,options) # Unconstrained optimization
j6.solveLP = N.solveLP // dopri(x0,x1,y0,f,tol,maxit,event) #Ordinary Diff Eq
j6.spline = N.spline
j6.linspace = N.linspace

j6.copyFunctions(j6, J, [
  'sumsqrt',
  'sumsqerr',
  'sumrow',
  'meansqerr',
  'geomean',
  'median',
  'cumsum',
  'cumprod',
  'mode',
  'range',
  'variance',
  'stdev',
  'meandev',
  'meddev',
  'skewness',
  'kurtosis',
  'coeffvar',
  'quartiles',
  'quantiles',
  'percentile',
  'percentileOfScore',
  'histogram',
  'covariance',
  'corrcoeff',
  'calcRdx',
  'betafn',
  'betacf',
  'ibetainv',
  'ibeta',
  'gammafn',
  'gammaln',
  'gammap',
  'lowRegGamma',
  'gammapinv',
  'factorialln',
  'factorial',
  'combination',
  'combinationln',
  'permutation',
  'randn',
  'randg'
])

// mix Lodash
j6.mixThisMap(Array.prototype, j6._, {
  _chunk: 'chunk',
  _compact: 'compact',
  _concat: 'concat',
  _difference: 'difference',
  _differenceBy: 'differenceBy',
  _differenceWith: 'differenceWith',
  _drop: 'drop',
  _dropRight: 'dropRight',
  _dropRightWhile: 'dropRightWhile',
  _dropWhile: 'dropWhile',
  _fill: 'fill',
  _findIndex: 'findIndex',
  _findLastIndex: 'findLastIndex',
  _flatten: 'flatten',
  _flattenDeep: 'flattenDeep',
  _flattenDepth: 'flattenDepth',
  _fromPairs: 'flattenPairs',
  _head: 'head',
  _indexOf: 'indexOf',
  _initial: 'initial',
  _intersection: 'intersection',
  _intersectionBy: 'intersectonBy',
  _intersectionWith: 'intersectionWith',
  _join: 'join',
  _last: 'last',
  _lastIndexOf: 'lastIndexOf',
  _nth: 'nth',
  _pull: 'pull',
  _pullAll: 'pullAll',
  _pullAllBy: 'pullAllBy',
  _pullAllWith: 'pullAllWith',
  _pullAt: 'pullAt',
  _remove: 'remove',
  _reverse: 'reverse',
  _slice: 'slice',
  _sortedIndex: 'sortedIndex',
  _sortedIndexBy: 'sortedIndexBy',
  _sortedIndexOf: 'sortedIndexOf',
  _sortedLastIndex: 'sortedLastIndex',
  _sortedLastIndexBy: 'sortedLastIndexBy',
  _sortedLastIndexOf: 'sortedLastIndexOf',
  _sortedUniq: 'sortedUniq',
  _sortedUniqBy: 'sortedUniqBy',
  _tail: 'tail',
  _take: 'take',
  _takeRight: 'takeRight',
  _takeRightWhile: 'takeRightWhile',
  _takeWhile: 'takeWhile',
  _union: 'union',
  _unionBy: 'unionBy',
  _unionWith: 'unionWith',
  _uniq: 'uniq',
  _uniqBy: 'uniqBy',
  _uniqWith: 'uniqWith',
  _unzip: 'unzip',
  _unzipWith: 'unzipWith',
  _without: 'without',
  _xor: 'xor',
  _xorBy: 'xorBy',
  _xorWith: 'xorWith',
  _zip: 'zip',
  _zipObject: 'zipObject',
  _zipObjectDeep: 'zipObjectDeep',
  _zipWith: 'zipWith',
  // Collection
  _countBy: 'countBy',
  // each→ forEach
  // _eachRight → forEachRight
  _every: 'every',
  _filter: 'filter',
  _find: 'find',
  _findLast: 'findLast',
  _flatMap: 'flatMap',
  _flatMapDeep: 'flatMapDeep',
  _flatMapDepth: 'flatMapDepth',
  _forEach: 'forEach',
  _forEachRight: 'forEachRight',
  _groupBy: 'groupBy',
  _includes: 'includes',
  _invokeMap: 'invokeMap',
  _keyBy: 'keyBy',
  _map: 'map',
  _orderBy: 'orderBy',
  _partition: 'partition',
  _reduce: 'reduce',
  _reduceRight: 'reduceRight',
  _reject: 'reject',
  _sample: 'sample',
  _sampleSize: 'sampleSize',
  _shuffle: 'shuffle',
  _size: 'size',
  _some: 'some',
  _sortBy: 'sortBy'
})

