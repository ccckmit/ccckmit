// 修改自： https://github.com/transcranial/keras-js/blob/master/test/layers/merge.js
const KerasJS = require('keras-js')
const layers = KerasJS.layers
const U = require('../lib/util')

var DATA = {
  'merge.Add.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2], data: [4.849999, 4.27] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Multiply.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2], data: [-17.885, -0.9408] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Average.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2], data: [2.425, 2.135] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Maximum.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2], data: [7.3, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Concatenate.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [4], data: [7.3, -0.21, -2.45, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Concatenate.1': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [3, 4], data: [7.3, -0.21, -2.45, 4.48, 7.3, -0.21, -2.45, 4.48, 7.3, -0.21, -2.45, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Concatenate.2': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [6, 2], data: [7.3, -0.21, 7.3, -0.21, 7.3, -0.21, -2.45, 4.48, -2.45, 4.48, -2.45, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Concatenate.3': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [6, 2], data: [7.3, -0.21, 7.3, -0.21, 7.3, -0.21, -2.45, 4.48, -2.45, 4.48, -2.45, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Concatenate.4': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [3, 4], data: [7.3, -0.21, -2.45, 4.48, 7.3, -0.21, -2.45, 4.48, 7.3, -0.21, -2.45, 4.48] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Dot.0': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2, 2], data: [-53.654999, 98.112, 1.5435, -2.822401] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Dot.1': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: {
      shape: [3, 3],
      data: [-18.8258, -18.8258, -18.8258, -18.8258, -18.8258, -18.8258, -18.8258, -18.8258, -18.8258]
    },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Dot.2': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: { shape: [2, 2], data: [-1.0, 1.0, 1.0, -1.0] },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Dot.3': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: {
      shape: [3, 3],
      data: [-0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843]
    },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  },
  'merge.Dot.4': {
    weights: [
      { shape: [6, 2], data: [0.1, 0.4, 0.5, 0.1, 1.0, -2.0, 0.0, 0.3, 0.2, 0.1, 3.0, 0.0] },
      { shape: [2], data: [0.5, 0.7] },
      { shape: [6, 2], data: [1.0, 0.0, -0.9, 0.6, -0.7, 0.0, 0.2, 0.4, 0.0, 0.0, -1.0, 2.3] },
      { shape: [2], data: [0.1, -0.2] }
    ],
    expected: {
      shape: [3, 3],
      data: [-0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843, -0.504843]
    },
    input: { shape: [6], data: [0, 0.2, 0.5, -0.1, 1, 2] }
  }
}

var TEST_DATA = Object.assign({}, DATA)

console.log('TEST_DATA=%j', TEST_DATA)

const key = 'merge.Add.0'
// console.log(`\n%c[${key}]`, styles.h3)
let testLayer1a = new layers.Dense({ units: 2 })
let testLayer1b = new layers.Dense({ units: 2 })
let testLayer2 = new layers.Add()
testLayer1a.setWeights(TEST_DATA[key].weights.slice(0, 2).map(w => new KerasJS.Tensor(w.data, w.shape)))
testLayer1b.setWeights(TEST_DATA[key].weights.slice(2, 4).map(w => new KerasJS.Tensor(w.data, w.shape)))
let t1a = new KerasJS.Tensor(TEST_DATA[key].input.data, TEST_DATA[key].input.shape)
let t1b = new KerasJS.Tensor(TEST_DATA[key].input.data, TEST_DATA[key].input.shape)
t1a = testLayer1a.call(t1a)
t1b = testLayer1b.call(t1b)
console.log(U.stringifyCondensed(t1a.tensor))
console.log(U.stringifyCondensed(t1b.tensor))
// const startTime = performance.now()
let t2 = testLayer2.call([t1a, t1b])
// const endTime = performance.now()
console.log(U.stringifyCondensed(t2.tensor))
// logTime(startTime, endTime)
const dataExpected = new Float32Array(TEST_DATA[key].expected.data)
const shapeExpected = TEST_DATA[key].expected.shape
console.log('dataExpected=%j', dataExpected)
console.log('shapeExpected=%j', shapeExpected)
// assert.deepEqual(t2.tensor.shape, shapeExpected)
// assert.isTrue(approxEquals(t2.tensor, dataExpected))
