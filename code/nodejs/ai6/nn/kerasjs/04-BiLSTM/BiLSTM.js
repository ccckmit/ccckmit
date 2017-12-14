const KerasJS = require('keras-js')
const TEST_DATA = require('./BiLSTM_data')
const U = require('../lib/util')
const layers = KerasJS.layers

const testParams = [
  {
    wrappedLayer: 'SimpleRNN',
    inputShape: [3, 6],
    attrs: { merge_mode: 'sum' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', return_sequences: false }
  },
  {
    wrappedLayer: 'SimpleRNN',
    inputShape: [3, 6],
    attrs: { merge_mode: 'mul' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', return_sequences: false }
  },
  {
    wrappedLayer: 'SimpleRNN',
    inputShape: [3, 6],
    attrs: { merge_mode: 'concat' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', return_sequences: false }
  },
  {
    wrappedLayer: 'SimpleRNN',
    inputShape: [3, 6],
    attrs: { merge_mode: 'ave' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', return_sequences: false }
  },
  {
    wrappedLayer: 'SimpleRNN',
    inputShape: [3, 6],
    attrs: { merge_mode: 'concat' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', return_sequences: true }
  },
  {
    wrappedLayer: 'GRU',
    inputShape: [3, 6],
    attrs: { merge_mode: 'concat' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', recurrent_activation: 'hard_sigmoid', return_sequences: true }
  },
  {
    wrappedLayer: 'LSTM',
    inputShape: [3, 6],
    attrs: { merge_mode: 'concat' },
    wrappedLayerAttrs: { units: 4, activation: 'tanh', recurrent_activation: 'hard_sigmoid', return_sequences: true }
  }
]

console.log('\n%cwrappers layer: Bidirectional')
console.log('\n%cGPU')

testParams.forEach(({ wrappedLayer, inputShape, attrs, wrappedLayerAttrs }, i) => {
  const key = `wrappers.Bidirectional.${i}`
  const title = `[${key}] [GPU] test: ${inputShape} input, merge_mode: ${attrs.merge_mode}, wrapped layer: ${wrappedLayer}, wrapped layer attrs: ${JSON.stringify(wrappedLayerAttrs)}`
  console.log(`\n${title}`)
  let testLayer = new layers.Bidirectional(
    Object.assign(attrs, { layer: new layers[wrappedLayer](wrappedLayerAttrs), gpu: true })
  )
  testLayer.setWeights(TEST_DATA[key].weights.map(w => new KerasJS.Tensor(w.data, w.shape)))
  let t = new KerasJS.Tensor(TEST_DATA[key].input.data, TEST_DATA[key].input.shape)
  console.log(U.stringifyCondensed(t.tensor))
  const startTime = U.now()
  t = testLayer.call(t)
  const endTime = U.now()
  console.log(U.stringifyCondensed(t.tensor))
  U.logTime(startTime, endTime)
//  const dataExpected = new Float32Array(TEST_DATA[key].expected.data)
//  const shapeExpected = TEST_DATA[key].expected.shape
  console.log('t.tensor.shaped=%j', t.tensor.shape)
  console.log('t.tensor=%j', t.tensor)  
//  assert.deepEqual(t.tensor.shape, shapeExpected)
//  assert.isTrue(approxEquals(t.tensor, dataExpected))
})
