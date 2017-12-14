var hillClimbing = require("./hillClimbing");      // 引入爬山演算法類別
var solutionArray = require("./solutionArray");    // 引入多變數解答類別 (x^2+3y^2+z^2-4x-3y-5z+8)

var hc = new hillClimbing();                       // 建立爬山演算法物件
// 執行爬山演算法 (從「解答(x,y,z)=(1,1,1)」開始尋找, 最多十萬代、失敗一千次就跳出。
hc.run(new solutionArray([1,1,1]), 100000, 1000);
