var log = console.log;

var Perceptron = function() { // 感知器物件
  this.step=function(x, w, theta) { // 步階函數：計算目前權重 w 的情況下，網路的輸出值為 0 或 1
    var result = w[0] * x[0] + w[1] * x[1] - theta; // y=x0*w0+x1*w1-theta
    if (result >= 0) // 如果結果大於零
      return 1;      //   就輸出 1
    else             // 否則
      return 0;      //   就輸出 0
  }
  
  this.training=function(truthTable) { // 訓練函數 training(truthTable), 其中 truthTable 是目標真值表
    var theta = 0.5;  // 閥值
    var alpha = 0.01; // 學習調整速率
    var w = [ 0.0, 0.0 ]; // 權重
    for (var loop=0; loop<100; loop++) { // 總共訓練一百輪
      var eSum = 0.0;
      for (var i=0; i<truthTable.length; i++) { // 每輪對於真值表中的每個輸入輸出配對，都訓練一次。
        var x = [ truthTable[i][0], truthTable[i][1] ]; // 輸入： x
        var yd = truthTable[i][2];       // 期望的輸出 yd
        var y = this.step(x, w, theta);  // 目前的輸出 y
        var e = yd - y;                  // 差距 e = 期望的輸出 yd - 目前的輸出 y
        eSum += e;                       // 計算差距總和
        var dw = [ 0.0, 0.0 ];           // 權重調整的幅度 dw
        dw[0] = alpha * x[0] * e; w[0] += dw[0]; // w[0] 的調整幅度為 dw[0]
        dw[1] = alpha * x[1] * e; w[1] += dw[1]; // w[1] 的調整幅度為 dw[1]
        if (loop % 10 == 0)
          log("loop=%d x=(%d,%d) w=(%d,%d) y=%d yd=%d e=%d", loop, x[0], x[1], w[0], w[1], y, yd, e);
      }
      if (eSum == 0.0) return w; // 當訓練結果毫無誤差時，就完成訓練了。
    }
    return null; // 否則，就傳會 null 代表訓練失敗。
  }
}

function learn(tableName, truthTable) { // 學習主程式：輸入為目標真值表 truthTable 與其名稱 tableName。
  log("================== 學習 %s 函數 ====================", tableName);
  var p = new Perceptron();       // 建立感知器物件
  var w = p.training(truthTable); // 訓練感知器
  if (w != null)                  // 顯示訓練結果
    log("學習成功 !");
  else
    log("學習失敗 !");
  log("w=%j", w);
}

var andTable = [ [ 0, 0, 0 ], [ 0, 1, 0 ], [ 1, 0, 0 ], [ 1, 1, 1 ] ]; // AND 函數的真值表
var orTable  = [ [ 0, 0, 0 ], [ 0, 1, 1 ], [ 1, 0, 1 ], [ 1, 1, 1 ] ]; // OR  函數的真值表
var xorTable = [ [ 0, 0, 0 ], [ 0, 1, 1 ], [ 1, 0, 1 ], [ 1, 1, 0 ] ]; // XOR 函數的真值表

learn("and", andTable); // 學習 AND 函數
learn("or",  orTable);  // 學習 OR  函數
learn("xor", xorTable); // 學習 XOR 函數

