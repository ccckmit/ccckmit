var j6 = require('../lib/j6')
var assert = require('assert')
var eq = assert.equal

describe('Statistics', function () {
  describe('Graphics', function () {
    it('curve, hist, ihist', function () {
      let g = j6.curve((x) => x * x, -10, 10, 0.1)
      console.log('g=', JSON.stringify(g, null, 2))
      eq(true, g.x.length === g.y.length)
      let h = j6.hist(g.x, -10, 10, 1)
//      console.log('h = ', h)
      eq(true, h.bins[2] === 10)
      let ih = j6.hist(g.x, -10, 10, 1)
//      console.log('ih = ', ih)
      eq(true, ih.bins[2] === 10)
    })
  })
})
