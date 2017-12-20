var fs = require('fs')
let S = module.exports = {}

S.statistics = function (file) {
  S.map1 = {}
  S.map2 = {}
  let text = fs.readFileSync(file, 'utf-8')
  let lines = text.split(/\r?\n/)
  for (var line of lines) {
    if (line.trim() !== '') S.doLine(line)
  }
}

S.doLine = function (line) {
  line = '^' + line + '$'
  for (let i = 0; i < line.length; i++) {
    let c1 = line[i]
    let c1count = S.map1[c1]
    S.map1[c1] = (c1count != null) ? c1count + 1 : 1
    if (i < 1) continue
    let c0 = line[i - 1]
    let c2 = c0 + c1
    let c2count = S.map2[c2]
    S.map2[c2] = (c2count != null) ? c2count + 1 : 1
  }
}

S.pcond = function (b, a) {
  return S.map2[a + b] / S.map1[a]
}

S.pcond2 = function (b, x, a) {
  return S.map2[a + b] / (S.map2[a + x[0]] + S.map2[a + x[1]])
}

S.print = function () {
  console.log('map1=' + JSON.stringify(S.map1, null, 1))
  console.log('map2=' + JSON.stringify(S.map2, null, 1))
  for (let ab in S.map2) {
    let a = ab[0]
    let b = ab[1]
    console.log('%s=>%s:%d', a, b, S.map2[ab] / S.map1[a])
  }
}

S.statistics(process.argv[2])
S.print()

var learn = function () {
  var P = { NP: 0, VP: 0, VP_NP: 0, NP_A: 0, '藍人': 0, '藍魚': 0, '小人': 0, '小魚': 0 }
  P.NP = (S.map2['^N'] + S.map2['^A']) / S.map1['^']
  P.VP = S.pcond('V', '\'')
  P.VP_NP = (S.map2['/N'] + S.map2['/A']) / S.map1['/']
  P.NP_A = S.map2['AA'] / S.map1['A']
  P['藍人'] = S.pcond2('人', ['人', '魚'], '藍')
  P['藍魚'] = S.pcond2('魚', ['人', '魚'], '藍')
  P['小人'] = S.pcond2('人', ['人', '魚'], '小')
  P['小魚'] = S.pcond2('魚', ['人', '魚'], '小')
  return P
}

console.log(JSON.stringify(learn(), null, 1))
