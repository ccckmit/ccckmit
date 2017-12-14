/* eslint-disable no-undef */
// let assert = require('chai').assert
let j6 = require('../lib/j6')
var assert = require('assert')
let eq = assert.equal

describe('Tensor', function () {
  let p = j6.parse
  let c1 = p('5+2i')
  let v1 = [1, 3, 2]
  let v2 = [2, 3, c1]
  let m = [[1, 2], [3, p('1+2i')]]

  describe('operator', function () {
    it('add, sum, sqrt, max, product, min', function () {
      eq(j6.add(3, 5), 8)
      eq(j6.add(3, c1).str(), '8+2i')
      eq(v1.oadd(v2)[2].str(), '7+2i')
      eq(m.osum().str(), '7+2i')
      eq(v1.product(), 6)
      eq(v1.max(), 3)
      eq(v1.min(), 1)
      
    })
  })
  describe('Map Reduce', function () {
  })
  describe('Eval', function () {
  })
})

/*
=========== Operator ===============
add(3,5)=8
oadd(3,5+2i)=8+2i
v1=[1, 3, 2] v2=[2, 3, 5+2i] m=[[1, 2], [3, 1+2i]]
add([1, 3, 2], [2, 3, 5+2i])=[3, 6, 25+2i]
[1, 3, 2].sqrt()=[1, 1.73, 1.41]
[2, 3, 5+2i].osqrt()=[1.41, 1.73, 2.28+0.44i]
v1.sum()=6
v2.osum()=10+2i
v1.product()=6
m.osum()=7+2i
m.oproduct()=6+12i
v1.max()=3
v1.min()=1
=========== Map Reduce===============
map1(v1,x^2)=[1, 9, 4]
map2(v1,v1,x+y)=[2, 6, 4]
reduce(v1,add,0)=6
max(v1)=3
min(v1)=1
add(v1,v2)=[2, 6, 4]
sin(v1)=[0.84, 0.14, 0.91]
=========== Eval ===============
[1, 3, 2].map1((x)=>3*x*x+5)=[8, 32, 17]
norm([1, 3, 2])=3.7416573867739413
=========== repeat ===============
repeat([3,2,2],0)=[[[0, 0], [0, 0]], [[0, 0], [0, 0]], [[0, 0], [0, 0]]]

random([2,2],[0,1])=[[0.58, 0.29], [0.79, 0.28]]
*/
