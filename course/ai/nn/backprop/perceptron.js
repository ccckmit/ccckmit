var log = console.log;

var Perceptron = function() { // 感知器物件
  this.step=function(x, w) { // 步階函數：計算目前權重 w 的情況下，網路的輸出值為 0 或 1
    var result = w[0]*x[0]+w[1]*x[1]+w[2]*x[2]; // y=w0*x0+x1*w1+x2*w2=-theta+x1*w1+x2*w2
    if (result >= 0) // 如果結果大於零
      return 1;      //   就輸出 1
    else             // 否則
      return 0;      //   就輸出 0
  }
  
  this.training=function(truthTable) { // 訓練函數 training(truthTable), 其中 truthTable 是目標真值表
    var rate = 0.01; // 學習調整速率，也就是 alpha
    var w = [ 1, 0, 0 ]; 
    for (var loop=0; loop<1000; loop++) { // 最多訓練一千輪
      var eSum = 0.0;
      for (var i=0; i<truthTable.length; i++) { // 每輪對於真值表中的每個輸入輸出配對，都訓練一次。
        var x = [ -1, truthTable[i][0], truthTable[i][1] ]; // 輸入： x
        var yd = truthTable[i][2];       // 期望的輸出 yd
        var y = this.step(x, w);  // 目前的輸出 y
        var e = yd - y;                  // 差距 e = 期望的輸出 yd - 目前的輸出 y
        eSum += e*e;                     // 計算差距總和
        var dw = [ 0, 0, 0 ];            // 權重調整的幅度 dw
        dw[0] = rate * x[0] * e; w[0] += dw[0]; // w[0] 的調整幅度為 dw[0]
        dw[1] = rate * x[1] * e; w[1] += dw[1]; // w[1] 的調整幅度為 dw[1]
        dw[2] = rate * x[2] * e; w[2] += dw[2]; // w[2] 的調整幅度為 dw[2]
        if (loop % 10 == 0)
          log("%d:x=(%s,%s,%s) w=(%s,%s,%s) y=%s yd=%s e=%s", loop, 
	           x[0].toFixed(3), x[1].toFixed(3), x[2].toFixed(3), 
	           w[0].toFixed(3), w[1].toFixed(3), w[2].toFixed(3), 
	           y.toFixed(3), yd.toFixed(3), e.toFixed(3));
      }
      if (Math.abs(eSum) < 0.0001) return w; // 當訓練結果誤差夠小時，就完成訓練了。
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

