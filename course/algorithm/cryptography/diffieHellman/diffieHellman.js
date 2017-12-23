// 參考： [維基百科:迪菲-赫爾曼密鑰交換](https://zh.wikipedia.org/wiki/%E8%BF%AA%E8%8F%B2-%E8%B5%AB%E7%88%BE%E6%9B%BC%E5%AF%86%E9%91%B0%E4%BA%A4%E6%8F%9B)
var Alice = { g:5, p:23, a:6 }
var Bob   = { b:15 }

function mpower(a, n, p) {
  let r = a
  for (let i=2; i<=n; i++) {
    r = (r * a) % p
  }
  return r
}

Alice.send = function (receiver) {
  let {g, p, a} = Alice
  let A = mpower(g, a, p)
  receiver.receive(Alice, g, p, A)
}

Alice.receive = function (sender, B) {
  let {g, p, a} = Alice
  this.K = mpower(B, a, p)
}

Bob.receive = function (sender, g, p, A) {
  let b = Bob.b
  let B = mpower(g, b, p)
  this.K = mpower(A, b, p)
  Bob.send(sender, B)
}

Bob.send = function (receiver, B) {
  receiver.receive(Bob, B)
}

Alice.send(Bob)

console.log('Alice.K = %d', Alice.K)
console.log('Bob.K   = %d', Bob.K)
