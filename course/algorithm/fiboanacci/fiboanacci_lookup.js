var fib = [0, 1]

function fibonacci(n) {
    if (n < 0) throw Error('fibonacci:n < 0')
    if (fib[n] != null) return fib[n]
    fib[n] = fibonacci(n-1) + fibonacci(n-2)
    return fib[n]
  }
  
  var startTime = new Date();
  console.log('fibonacci(40)=', fibonacci(40))
  var endTime   = new Date();
  var milliSeconds = endTime.getTime() - startTime.getTime()
  console.log('spend time=', milliSeconds)