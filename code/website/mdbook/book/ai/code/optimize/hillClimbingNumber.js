var hillClimbing = require("./hillClimbing");        // 引入爬山演算法類別
var solutionNumber = require("./solutionNumber");    // 引入平方根解答類別

var hc = new hillClimbing();                         // 建立爬山演算法物件
// 執行爬山演算法 (從「解答=0.0」開始尋找, 最多十萬代、失敗一千次就跳出。
hc.run(new solutionNumber(0.0), 100000, 1000);
