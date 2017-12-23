var crypto = require('crypto')

// 加密
function encrypt(algorithm, key, plainText) {
    var list = []
    var encrypter = crypto.createCipher(algorithm, key)
    list.push(encrypter.update(plainText, 'binary', 'hex'))
    list.push(encrypter.final('hex'))
    return list.join('')
}

// 解密
function decrpyt(algorithm, key, cipherText) {
    var list = []
    var decrypter = crypto.createDecipher(algorithm, key)
    list.push(decrypter.update(cipherText, 'hex', 'binary'))
    list.push(decrypter.final('binary'))
    return list.join('')
}

let key = 'adsjfa@#!(Oxxay'
let algorithm = 'aes-128-cbc'
let sendText = 'This is the plain text !'
console.log('sendText   = ', sendText)
let cipherText = encrypt(algorithm, key, sendText)
console.log('cipherText = ', cipherText)
let recvText = decrpyt(algorithm, key, cipherText)
console.log('recvText   = ', recvText)
