function fibonacci(n) {
  if (n < 0) throw Error('fibonacci:n<0')
  if (n == 0) return 0
  if (n == 1) return 1
  return fibonacci(n-1) + fibonacci(n-2)
}

var startTime = new Date();
console.log('fibonacci(40)=', fibonacci(40))
var endTime   = new Date();
var milliSeconds = endTime.getTime() - startTime.getTime()
console.log('spend time=', milliSeconds)