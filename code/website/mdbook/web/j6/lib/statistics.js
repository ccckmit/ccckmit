module.exports = function (j6) {
  // ====================== statistics =================================
  j6.random = function (a = 0, b = 1) {
    let r = a + (Math.random() * (b - a))
    return r
  }

  j6.randomInt = function (a, b) {
    let r = j6.random(a, b + 0.999999999)
    return Math.floor(r)
  }

  j6.sample = function (space, probs) {
    if (probs == null) return space[j6.randomInt(0, space.length - 1)]
    let p = j6.random(0, 1)
    let sump = 0
    for (let i = 0; i < space.length; i++) {
      sump += probs[i]
      if (p <= sump) return space[i]
    }
    throw new Error('j6.sample fail!')
  }

  j6.samples = function (space, size, arg) {
    arg = j6._.defaults(arg, {replace: true})
    if (arg.replace) {
      var results = []
      for (let i = 0; i < size; i++) {
        results.push(j6.sample(space, arg.prob))
      }
      return results
  // return _.times(size, ()=>_.sample(space));
    } else {
      if (space.length < size) throw Error('statistics.samples() : size > space.length')
      return j6._.sampleSize(space, size)
    }
  }

  j6.normalize = function (a) {
    var sum = j6.T.sum(a)
    return a.map(function (x) { return x / sum })
  }

  j6.max = j6.T.max
  j6.min = j6.T.min
  j6.sum = j6.T.sum
  j6.product = j6.T.product

  // graphics
  j6.curve = function (f, from = -10, to = 10, step = 0.1) {
    var x = j6.steps(from, to, step)
    var y = x.map1(f)
    return {type: 'curve', x: x, y: y}
  }

  j6.hist = function (a, from, to, step = 1) {
    from = from || a.min()
    to = to || a.max()
    var n = Math.ceil((to - from + j6.EPSILON) / step)
    var xc = j6.steps(from + step / 2.0, to, step)
    var bins = j6.V.new(n, 0)
    for (var i in a) {
      var slot = Math.floor((a[i] - from) / step)
      if (slot >= 0 && slot < n) {
        bins[slot]++
      }
    }
    return {type: 'histogram', xc: xc, bins: bins, from: from, to: to, step: step}
  }

  j6.ihist = function (a) {
    return j6.hist(a, a.min() - 0.5, a.max() + 0.5, 1)
  }
}
