var hillClimbing = require("./hillClimbing");      // 引入爬山演算法類別
var solutionEquations = require("./solutionEquations");    // 引入線性聯立方程組解答類別

var hc = new hillClimbing();                       // 建立爬山演算法物件
// 執行爬山演算法 (從「解答 x=(0,0)」開始尋找, 最多十萬代、失敗一千次就跳出。
hc.run(solutionEquations.zero(), 100000, 1000);
