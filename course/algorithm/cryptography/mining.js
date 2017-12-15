const crypto = require('crypto')

function coin(id, nonce) {
  var cert =
`<coin id="${id}" nonce="${nonce}">
  <value>$1</value>
</coin>`
  return cert
}

function digest(str) {
  const secret = ''
  const hash = crypto.createHmac('sha256', secret)
                     .update(str)
                     .digest('hex')
  return hash
}

function mining(id, zeros) {
  let zeroStr = '00000000000000000000000'
  for (let nonce = 0; nonce < Number.MAX_SAFE_INTEGER; nonce++) {
    var co = coin(id, nonce)
    var dig = digest(co)
    if (dig.startsWith(zeroStr.substr(0, zeros))) return {nonce: nonce, digest: dig, coin: co}
  }
}

let t0 = Date.now()
console.log(mining('0003979', 4))
let t1 = Date.now()
console.log('t1-t0=%d', t1 - t0)
console.log(mining('0003979', 5))
let t2 = Date.now()
console.log('t2-t1=%d', t2 - t1)
console.log(mining('0003979', 6))
let t3 = Date.now()
console.log('t3-t2=%d', t3 - t2)
