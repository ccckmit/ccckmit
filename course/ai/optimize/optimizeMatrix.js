var ai6 = require('../../source/ai6')
var o = ai6.Optimize

var A = [[1, 1], [1, -1]]
var B = [[5, 1]].tr()

class Solution extends o.SolutionVector {
  energy () { // 能量函數 : x^2+3y^2+z^2-4x-3y-5z+8
    var X = [ this.v ]
    var Y = A.mdot(X.tr())
    console.log('X=%j Y=%j', X, Y)
    return Y.sub(B).norm()
  }
}

var optimizer = (process.argv[2] === 'simulatedAnnealing') ? o.simulatedAnnealing : o.hillClimbing

// 執行優化算法 (從「解答(x,y,z)=(1,1,1)」開始尋找, 最多十萬代、失敗一千次就跳出。
optimizer.run(new Solution([0, 0]), 100000, 1000)
