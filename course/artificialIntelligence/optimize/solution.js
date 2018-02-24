module.exports = function (ai6) {
  var Opt = ai6.Optimize
  Opt.step = 0.01

  Opt.Solution = class Solution {
    constructor (v) { this.v = v } // 參數 v 為解答的資料結構
    height () { return -1 * this.energy() } // 高度 = -1 * 能量
    energy () { throw Error('energy: not defined') }
  }

  Opt.SolutionNumber = class SolutionNumber extends Opt.Solution {
    neighbor () {    // 單變數解答的鄰居函數。
      var x = this.v
      var dx = Opt.step // x:解答 , dx : 移動步伐大小
      var xnew = (Math.random() > 0.5) ? x + dx : x - dx // 用亂數決定向左或向右移動
      var snew = ai6.j6._.cloneDeep(this)
      snew.v = xnew
      return snew
    }

    toString () {    // 將解答轉為字串，以供印出觀察。
      return 'energy(' + this.v.toFixed(3) + ')=' + this.energy().toFixed(3)
    }
  }

  Opt.SolutionVector = class SolutionVector extends Opt.Solution {
    neighbor () {    // 多變數解答的鄰居函數。
      var nv = this.v.slice(0)                   // nv=v.clone()=目前解答的複製品
      var i = ai6.j6.randomInt(0, nv.length - 1)            // 隨機選取一個變數
      nv[i] += (Math.random() > 0.5) ? Opt.step : -Opt.step
      var snew = ai6.j6._.cloneDeep(this)
      snew.v = nv
      return snew // 傳回新建的鄰居解答。
    }

    toString () { // 將解答轉為字串，以供印出觀察。
      return 'energy(' + this.v.str(3) + ')=' + this.energy().toFixed(3)
    }
  }

  return Opt
}
