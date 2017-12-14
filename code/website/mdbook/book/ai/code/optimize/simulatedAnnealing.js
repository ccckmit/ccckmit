var simulatedAnnealing = function() {}       // 模擬退火法的物件模版 (類別)

simulatedAnnealing.prototype.P = function(e, enew, T) { // 模擬退火法的機率函數
  if (enew < e) 
    return 1;
  else
    return Math.exp((e-enew)/T);
}

simulatedAnnealing.prototype.run = function(s, maxGens) { // 模擬退火法的主要函數
  var sbest = s;                              // sbest:到目前為止的最佳解
  var ebest = s.energy();                     // ebest:到目前為止的最低能量
  var T     = 100;                            // 從 100 度開始降溫
  for (var gens=0; gens<maxGens; gens++) {    // 迴圈，最多作 maxGens 這麼多代。
    var snew = s.neighbor();                  // 取得鄰居解
    var e    = s.energy();                    // e    : 目前解的能量
    var enew = snew.energy();                 // enew : 鄰居解的能量
    T  = T * 0.999;                           // 每次降低一些溫度
    if (this.P(e, enew, T) > Math.random()) { // 根據溫度與能量差擲骰子，若通過
      s = snew;                               // 則移動到新的鄰居解
      console.log("%d T=%s %s", gens, T.toFixed(3), s.toString()); // 印出觀察
    }
    if (enew < ebest) {                       // 如果新解的能量比最佳解好，則更新最佳解。
      sbest = snew;
      ebest = enew;
    }
  }
  console.log("solution: %s", sbest.toString()); // 印出最佳解
  return sbest;                                  // 傳回最佳解
}

module.exports = simulatedAnnealing;             // 將模擬退火演算法的類別匯出。