module.exports = function (j6) {
/* eslint-disable no-undef */
/* eslint-disable no-extend-native */
// ========= Set ===================
Set.prototype.union = function (setB) {
  var union = new Set(this)
  for (var elem of setB) {
    union.add(elem)
  }
  return union
}

Set.prototype.intersection = function (setB) {
  var intersection = new Set()
  for (var elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem)
    }
  }
  return intersection
}

Set.prototype.difference = function (setB) {
  var difference = new Set(this)
  for (var elem of setB) {
    difference.delete(elem)
  }
  return difference
}

Set.prototype.enumerate = function (n) {
  let array = []
  let values = this.values()
  for (var i = 0; i < n; i++) {
    array.push(values.next().value)
  }
  return array
}
/* eslint-enable no-extend-native */

j6.intersection = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) && y.has(e) }
  return xy
}

j6.union = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) || y.has(e) }
  return xy
}

j6.difference = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) && !y.has(e) }
  return xy
}

j6.symmetricDifference = function (x, y) {
  return x.union(y).difference(x.intersection(y))
}

j6.cartesianProduct = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e[0]) && y.has(e[1]) }
  return xy
}

class EnumSet {
  constructor (enumHead, has) {
    this.set = new Set(enumHead)
    this.enumHead = j6.isUndefined(enumHead) ? [] : enumHead
    if (typeof has !== 'undefined') this.has = has
  }
  add (e) { this.set.add(e) }
  has (e) { return this.set.has(e) }
  sample (n) {
    if (j6.isUndefined(n)) {
      return j6.sample(this.enumHead)
    } else {
      var a = []
      for (var i = 0; i < n; i++) a.push(this.sample())
      return a
    }
  }
  enumerate () { return this.enumHead }
  intersection (y) { return j6.intersection(this, y) }
  union (y) { return j6.union(this, y) }
  difference (y) { return j6.difference(this, y) }
  symmetricDifference (y) { return j6.symmetricDifference(this, y) }
  cartesianProduct (y) { return j6.cartesianProduct(this, y) }
}

j6.create = function (enumHead, has) { return new EnumSet(enumHead, has) }

var enumFloat = [-3.2, -1, 0, 1, 2.3, 4.7]
var enumInt = [-10, -5, -1, 0, 1, 3, 5, 6]
var enumN0 = j6.steps(0, 10, 1)
var enumN1 = j6.steps(1, 10, 1)
var enumOdd = j6.steps(1, 15, 2)
var enumEven = j6.steps(2, 15, 2)
var enumPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
var enumAll = [ 'hi', 5, Math.PI, EnumSet, j6.isBool, enumPrime, new Set() ]

j6.All = new EnumSet(enumAll, j6.yes) // 全體集合
j6.Empty = new EnumSet([], j6.no) // 空集合
j6.Float = new EnumSet(enumFloat, j6.isFloat) // 浮點數集合
j6.Z = j6.Integer = new EnumSet(enumInt, j6.isInteger) // 整數集合
j6.N0 = new EnumSet(enumN0, (e) => j6.isInteger(e) && e >= 0)// 自然數集合 N0
j6.N1 = new EnumSet(enumN1, (e) => j6.isInteger(e) && e >= 1) // 自然數集合 N1
j6.Even = new EnumSet(enumEven, j6.isEven)// 偶數集合
j6.Odd = new EnumSet(enumOdd, j6.isOdd) // 奇數集合
j6.Prime = new EnumSet(enumPrime, j6.isPrime) // 質數集合
j6.Finite = (n) => new EnumSet(j6.steps(0, n - 1, 1)) // 有限集合 0...n-1
j6.Russel = j6.NoSelf = new EnumSet(enumAll, function (e) { return !e.has(e) }) // 羅素集合悖論
j6.Set = EnumSet
// =========== 集合的相關數學性質 ==================

// 測度（Measure）: https://en.wikipedia.org/wiki/Measure_(mathematics)
// 請注意不要和幾何的《度量 Metric》搞混，度量是距離函數，但測度是集合的函數
// Measure(Set)=>j6
j6.Measure = {
  // Non-negativity: For all E in Σ: μ(E) ≥ 0.
  // Null empty set: μ({}) = 0.
  // Countable additivity (or σ-additivity): μ(E1+E2+...) = μ(E1)+μ(E2)+...
}

// Counting measure : is defined by μ(j6) = number of elements in j6.
// Lebesgue measure : μ([0, 1]) = 1; https://en.wikipedia.org/wiki/Lebesgue_measure
// Circular angle measure :
// Haar measure : https://en.wikipedia.org/wiki/Haar_measure

/* eslint-enable no-undef  no-extend-native */
}