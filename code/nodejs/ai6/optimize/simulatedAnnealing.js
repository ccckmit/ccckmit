var SA = module.exports = {} // 爬山演算法的物件模版 (類別)

var P = function (e, enew, T) { // 模擬退火法的機率函數
  return (enew < e) ? 1 : Math.exp((e - enew) / T)
}

SA.run = function (s, maxGens, maxFails) { // 爬山演算法的主體函數
  var sbest = s                              // sbest:到目前為止的最佳解
  var ebest = s.energy()                     // ebest:到目前為止的最低能量
  var T = 100                            // 從 100 度開始降溫
  var fails = 0
  for (var gens = 0; gens < maxGens && fails < maxFails; gens++) {    // 迴圈，最多作 maxGens 這麼多代。
    var snew = s.neighbor()                  // 取得鄰居解
    var e = s.energy()                    // e    : 目前解的能量
    var enew = snew.energy()                 // enew : 鄰居解的能量
    T = T * 0.999                           // 每次降低一些溫度
    if (P(e, enew, T) > Math.random()) { // 根據溫度與能量差擲骰子，若通過
      s = snew                               // 則移動到新的鄰居解
      console.log('%d T=%s %s', gens, T.toFixed(3), s.toString()) // 印出觀察
      fails = 0
    }
    if (enew < ebest) {                       // 如果新解的能量比最佳解好，則更新最佳解。
      sbest = snew
      ebest = enew
      fails = 0
    }
    fails++
  }
  console.log('solution: %s', sbest.toString()) // 印出最佳解
  return sbest                                  // 傳回最          //   然後傳回。
}
