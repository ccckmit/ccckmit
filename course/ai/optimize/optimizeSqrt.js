var ai6 = require('../../source/ai6')
var o = ai6.Optimize

class SolutionSqrt extends o.SolutionNumber {
  energy () {      // 能量函數
    var x = this.v                             // x:解答
    return Math.abs(x * x - 4)                     // 能量函數為 |x^2-4|
  }
}

var s = new SolutionSqrt(0.0)
console.log('main:s.energy=', s.energy)

var optimizer = (process.argv[2] === 'simulatedAnnealing') ? o.simulatedAnnealing : o.hillClimbing

// 執行優化算法 (從「解答=0.0」開始尋找, 最多十萬代、失敗一千次就跳出。
optimizer.run(new SolutionSqrt(0.0), 100000, 1000)
