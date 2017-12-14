var Solution = require("./solution");         // 引入抽象的解答類別

Solution.prototype.neighbor = function() {    // 單變數解答的鄰居函數。
  var x = this.v, dx=this.step;               // x:解答 , dx : 移動步伐大小
  var xnew = (Math.random() > 0.5)?x+dx:x-dx; // 用亂數決定向左或向右移動
  return new Solution(xnew);                  // 建立新解答並傳回。
}

Solution.prototype.energy = function() {      // 能量函數
  var x = this.v;                             // x:解答
  return Math.abs(x*x-4);                     // 能量函數為 |x^2-4|
}

Solution.prototype.toString = function() {    // 將解答轉為字串，以供印出觀察。
  return "energy("+this.v.toFixed(3)+")="+this.energy().toFixed(3);
}

module.exports = Solution;                    // 將解答類別匯出。