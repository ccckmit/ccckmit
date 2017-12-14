var simulatedAnnealing = require("./simulatedAnnealing"); // 引入模擬退火法類別
var solutionNumber = require("./solutionNumber");         // 引入平方根解答類別

var sa = new simulatedAnnealing();                        // 建立模擬退火法物件
// 執行模擬退火法 (從「解答=0.0」開始尋找, 最多執行一萬代。
sa.run(new solutionNumber(0.0), 10000);

