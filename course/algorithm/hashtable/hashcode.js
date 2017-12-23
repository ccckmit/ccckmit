var hashCode = function(str) {
  var hash = 0, i, c;
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    c     = str.charCodeAt(i)
    hash  = ((hash << 5) - hash) + c // hash = hash*31 + chr = (hash*32-hash) + c
    hash |= 0 // Convert to 32bit integer, 原因： Bitwise operators treat their operands as a sequence of 32 bits (zeroes and ones), rather than as decimal, hexadecimal, or octal numbers
  }
  return hash
}

console.log('hashCode(hello)=', hashCode('hello'))
