var Matrix   = require("./matrix");
var Solution = require("./solution");         // 引入抽象的解答類別

// A X = B ，求 X 是多少？  
// A=[[1,1],[1,-1]] B=[[5][1]]，也就是求：
//   x1+x2=5
//   x1-x2=1
// 的解答

var A = new Matrix([[1,1],[1,-1]]);
var B = new Matrix([[5,1]]).transpose();

var log = console.log;

Solution.zero = function() {
  return new Solution(Matrix.create(2,1,0));
}

Solution.prototype.neighbor = function() {    // 多變數解答的鄰居函數。
  var nx = new Matrix(this.v.m);              // 複製目前解的矩陣
  var i = Math.floor(Math.random()*nx.rows());// 隨機選取一個變數
  if (Math.random() > 0.5)                    // 擲骰子決定要往左或往右移
    nx.m[i][0] += this.step;
  else
    nx.m[i][0] -= this.step;
  return new Solution(nx);                    // 傳回新建的鄰居解答。
}

Solution.prototype.energy = function() {      // 能量函數:計算 ||AX-B||，也就是 ||Y-B||
  var X = this.v;
  var Y = A.mul(X);
  return Y.sub(B).norm();
}

Solution.prototype.toString = function() {    // 將解答轉為字串的函數，以供列印用。
  return "energy("+this.v.transpose().toString().replace("\n", "")+")="+this.energy().toFixed(3);
}

module.exports = Solution;                    // 將解答類別匯出。
