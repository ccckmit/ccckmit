var U = module.exports = {}

U.now = function () { return Date.now() }

U.logTime = function (startTime, endTime) {
  console.log(`>>>> exec: ${Math.round(100 * (endTime - startTime)) / 100} ms`)
}

U.stringifyCondensed = function (obj) {
  var newObj = Object.assign({}, obj)
  if (newObj.data.length > 10) {
    newObj.data = Array.from(newObj.data.subarray(0, 10)).concat(['...'])
  } else {
    newObj.data = Array.from(newObj.data)
  }
  return JSON.stringify(newObj, function (key, val) {
    return val.toFixed ? Number(val.toFixed(3)) : val
  })
}
