var crypto = require('crypto')
console.log('============== Hash ====================\n', crypto.getHashes()) // 印出所有 hash 算法
console.log('============== Ciphers ====================\n', crypto.getCiphers())// 印出所有 cipher 算法