// Metropolis Hasting 的範例
// 問題：機率式有限狀態機，P(s0)=0.3, P(s1)=0.5
// 目標：尋找「轉移矩陣」的穩態，也就是 Q(x→y)=? 時系統會達到平衡。

function MetropolisHasting () {
  var P = [5.0 / 8, 3.0 / 8] // 初始機率分佈，隨意設定。
  var Q = [[0.5, 0.5], [0.5, 0.5]] // 初始機率分佈，隨意設定。
  var A = [[0, 0], [0, 0]]
  do {
    console.log('Q = %j', Q)
    var Qn = [[0, 0], [0, 0]]
    for (let x in Q) { // 計算 A 矩陣
      for (let y in Q[x]) {
        Qn[x][y] = Q[x][y]
        A[x][y] = (P[y] * Q[y][x]) / (P[x] * Q[x][y]) // 入出比 = 流入/流出
      }
    }
    console.log('A = %j', A)
    var diff = 0
    for (let x in Q) {
      for (let y in Q[x]) { // 計算下一代 Qn 矩陣
        if (A[x][y] < 1) {  // 入出比 < 1 ，代表流入太少，流出太多
          Qn[x][y] = Q[x][y] * A[x][y] // 降低流出量
          Qn[x][x] = Qn[x][x] + Q[x][y] * (1 - A[x][y]) // 『規一化』調整
          diff += Math.abs(Qn[x][y] - Q[x][y]) // 計算新舊矩陣差異
        }
      }
    }
    Q = Qn
    console.log('diff = %d', diff)
  } while (diff > 0.001)  // 假如差異夠小的時候，就可以停止了。
}

MetropolisHasting()
