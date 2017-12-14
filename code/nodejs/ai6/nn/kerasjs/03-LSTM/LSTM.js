const KerasJS = require('keras-js')
const TEST_DATA = require('./LSTM_data')
const U = require('../lib/util')
const layers = KerasJS.layers

const testParams = [
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: false,
      go_backwards: false,
      stateful: false
    }
  },
  {
    inputShape: [8, 5],
    attrs: {
      units: 5,
      activation: 'sigmoid',
      recurrent_activation: 'sigmoid',
      use_bias: true,
      return_sequences: false,
      go_backwards: false,
      stateful: false
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: true,
      go_backwards: false,
      stateful: false
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: false,
      go_backwards: true,
      stateful: false
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: true,
      go_backwards: true,
      stateful: false
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: false,
      go_backwards: false,
      stateful: true
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: true,
      go_backwards: false,
      stateful: true
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: true,
      return_sequences: false,
      go_backwards: true,
      stateful: true
    }
  },
  {
    inputShape: [3, 6],
    attrs: {
      units: 4,
      activation: 'tanh',
      recurrent_activation: 'hard_sigmoid',
      use_bias: false,
      return_sequences: true,
      go_backwards: true,
      stateful: true
    }
  }
]

console.log('recurrent layer: LSTM')
console.log('\nGPU')
testParams.forEach(({ inputShape, attrs }, i) => {
  const key = `recurrent.LSTM.${i}`
  const title = `[${key}] [GPU] test: ${inputShape} input, activation='${attrs.activation}', recurrent_activation='${attrs.recurrent_activation}', use_bias=${attrs.use_bias}, return_sequences=${attrs.return_sequences}, go_backwards=${attrs.go_backwards}, stateful=${attrs.stateful}`

  console.log(`\n${title}`)
  let testLayer = new layers.LSTM(Object.assign(attrs, { gpu: true }))
  testLayer.setWeights(TEST_DATA[key].weights.map(w => new KerasJS.Tensor(w.data, w.shape)))
  let t = new KerasJS.Tensor(TEST_DATA[key].input.data, TEST_DATA[key].input.shape)
  console.log(U.stringifyCondensed(t.tensor))
  const startTime = U.now()

  // To test statefulness, we run call() twice (see corresponding jupyter notebook)
  t = testLayer.call(t)
  if (attrs.stateful) {
    t = new KerasJS.Tensor(TEST_DATA[key].input.data, TEST_DATA[key].input.shape)
    t = testLayer.call(t)
  }

  const endTime = U.now()
  console.log(U.stringifyCondensed(t.tensor))
  U.logTime(startTime, endTime)
  const dataExpected = new Float32Array(TEST_DATA[key].expected.data)
  const shapeExpected = TEST_DATA[key].expected.shape
  console.log('t.tensor.shaped=%j', t.tensor.shape)
  console.log('t.tensor=%j', t.tensor)
//  assert.deepEqual(t.tensor.shape, shapeExpected)
//  assert.isTrue(approxEquals(t.tensor, dataExpected))
})
