var ai6 = require('../../source/ai6')
var o = ai6.Optimize

class SolutionFunction extends o.SolutionVector {
  energy () { // 能量函數 : x^2+3y^2+z^2-4x-3y-5z+8
    var x, y, z
    x = this.v[0]; y = this.v[1]; z = this.v[2]
    return x * x + 3 * y * y + z * z - 4 * x - 3 * y - 5 * z + 8
  }
}

var optimizer = (process.argv[2] === 'simulatedAnnealing') ? o.simulatedAnnealing : o.hillClimbing

// 執行優化算法 (從「解答(x,y,z)=(1,1,1)」開始尋找, 最多十萬代、失敗一千次就跳出。
optimizer.run(new SolutionFunction([1, 1, 1]), 100000, 1000)
