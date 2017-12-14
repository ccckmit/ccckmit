// Back-Propagation Neural Networks (JavaScript 版)
// 由陳鍾誠修改自 Neil Schemenauer 的 Python 版
// Python 程式網址為： http://arctrix.com/nas/python/bpnn.py

var log = console.log;

// 建立大小為 n 的陣列並填入初始值 fill
var makeArray=function(n, fill) {
  var a = [];
  for (var i=0; i<n; i++)
    a.push(fill);
  return a;
}

// 建立大小為 I*J 的矩陣並填入初始值 fill
var makeMatrix=function(I, J, fill) {
  var m = [];
  for (var i=0; i<I; i++)
    m.push(makeArray(J, fill));
  return m;
}

// numbersToStr():以精確度為 precision 個小數來輸出陣列 array
var numbersToStr=function(array, precision) {
  var rzStr = "";
  for (var i=0; i<array.length; i++) {
    if (array[i]>=0)
      rzStr+=" "+array[i].toFixed(precision)+" ";
    else
      rzStr+=array[i].toFixed(precision)+" ";
  }
  return rzStr;
}

// rand():取得 a 到 b 之間的一個隨機亂數
var rand=function(a, b) {
  return (b-a)*Math.random() + a;
}

// sigmoid(x)=tanh(x)
function sigmoid(x) {
  var tanh = (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
  return tanh; // 雙曲正切函數
}

// dsigmoid(x)=1-x^2;
// 參考：http://pynopticon.googlecode.com/svn/trunk/src/vlfeat/toolbox/special/dsigmoid.m
// 參考：http://en.wikipedia.org/wiki/Sigmoid_function
function dsigmoid(x) {
  return 1.0 - x*x;
}

function NeuralNet() {

  // init()：設定網路結構與權重的隨機初始值的函數。
  this.init=function(ni, nh, no) {
    // number of input, hidden, and output nodes
    this.ni = ni + 1; // +1 for bias node
    this.nh = nh;
    this.no = no;

    // activations for nodes : 建立各層的節點陣列
    this.ai = makeArray(this.ni, 1.0);
    this.ah = makeArray(this.nh, 1.0);
    this.ao = makeArray(this.no, 1.0);
        
    // create weights : 建立權重矩陣
    this.wi = makeMatrix(this.ni, this.nh, 0.0);
    this.wo = makeMatrix(this.nh, this.no, 0.0);
		
    // set them to random vaules : 隨機設定權重初始值。
    for (var i=0; i<this.ni; i++)
      for (var j=0; j<this.nh; j++)
        this.wi[i][j] = rand(-0.2, 0.2);
    for (var j=0; j<this.nh; j++)
      for (var k=0; k<this.no; k++)
        this.wo[j][k] = rand(-2.0, 2.0);

    // last change in weights for momentum  : 上一次的改變量矩陣，用來當動量以便爬過肩型區域。
    this.ci = makeMatrix(this.ni, this.nh, 0.0);
    this.co = makeMatrix(this.nh, this.no, 0.0);
    return this;
  }
	
  // update() : 計算網路的輸出的函數
  this.update=function(inputs) {
    // input activations : 設定輸入值
    for (var i=0; i<this.ni-1; i++)
      this.ai[i] = inputs[i];

    // hidden activations : 計算隱藏層輸出值 ah[j]
    for (var j=0; j<this.nh; j++) {
      var sum = 0.0;
      for (var i=0; i<this.ni; i++)
        sum = sum + this.ai[i] * this.wi[i][j];
      this.ah[j] = sigmoid(sum);
    }

    // output activations : 計算輸出層輸出值 ao[k]
    for (var k=0; k<this.no; k++) {
      var sum = 0.0;
      for (var j=0; j<this.nh; j++)
        sum = sum + this.ah[j] * this.wo[j][k];
      this.ao[k] = sigmoid(sum);
    }

    return this.ao; // 傳回輸出層輸出值 ao
  }

  // backPropagate()：反傳遞學習的函數 (重要)
  this.backPropagate = function(targets, rate, moment) {
    // calculate error terms for output : 計算輸出層誤差
    var output_deltas = makeArray(this.no, 0.0);
    for (var k=0; k<this.no; k++) {
      var error = targets[k]-this.ao[k];
      output_deltas[k] = dsigmoid(this.ao[k]) * error;
    }

    // calculate error terms for hidden : 計算隱藏層誤差
    var hidden_deltas = makeArray(this.nh, 0.0);
    for (var j=0; j<this.nh; j++) {
      var error = 0.0;
      for (var k=0; k<this.no; k++) {
			  // 注意、在此輸出層誤差 output_deltas 會反傳遞到隱藏層，因此才稱為反傳遞演算法。
        error = error + output_deltas[k]*this.wo[j][k]; 
		  }
      hidden_deltas[j] = dsigmoid(this.ah[j]) * error;
    }

    // update output weights : 更新輸出層權重
    for (var j=0; j<this.nh; j++) {
      for (var k=0; k<this.no; k++) {
        var change = output_deltas[k]*this.ah[j];
        this.wo[j][k] = this.wo[j][k] + rate*change + moment*this.co[j][k];
        this.co[j][k] = change;
        // print N*change, M*this.co[j][k]
      }
    }

    // update input weights : 更新輸入層權重
    for (var i=0; i<this.ni; i++) {
      for (var j=0; j<this.nh; j++) {
        var change = hidden_deltas[j]*this.ai[i];
        this.wi[i][j] = this.wi[i][j] + rate*change + moment*this.ci[i][j];
        this.ci[i][j] = change;
      }
    }

    // calculate error : 計算輸出層誤差總合
    var error = 0.0;
    for (var k=0; k<targets.length; k++)
      error = error + 0.5*Math.pow(targets[k]-this.ao[k],2);
    return error;
  }

	// test() : 對真值表 (訓練樣本) 中的每個輸入都印出「網路輸出」與「期望輸出」，以便觀察學習結果是否都正確。
  this.test = function(patterns) {
    for (var p in patterns) {
      var inputs = patterns[p][0];
      var outputs= patterns[p][1];
      log("%j -> [%s] [%s]", inputs, numbersToStr(this.update(inputs), 0), numbersToStr(outputs, 0));
      // this.dump();
    }
  }

	// train(): 主要學習函數，反覆呼叫反傳遞算法
	// 參數：rate: learning rate (學習速率), moment: momentum factor (動量常數)
  this.train=function(patterns, iterations, rate, moment) {
    for (var i=0; i<iterations; i++) {
      var error = 0.0;
      for (var p in patterns) {
        var pat=patterns[p];
        var inputs = pat[0];
        var targets = pat[1];
        var outputs = this.update(inputs);
        error = error + this.backPropagate(targets, rate, moment);
      }
      if (i % 100 == 0)
        log('%d:error %j', i, error);
    }
  }
}

module.exports = NeuralNet; // 匯出 NeuralNet 物件。

/*
	// dump() : 印出此神經網路以便觀察的函數。
  this.dump = function() {
    log("  ai=%s", numbersToStr(this.ai, 2));
    for (var i=0; i<this.wi.length; i++)
      log("    %s", numbersToStr(this.wi[i], 2));
    log("  ah=%s", numbersToStr(this.ah, 2));
    for (var i=0; i<this.wo.length; i++)
      log("    %s", numbersToStr(this.wo[i], 2));
    log("  ao=%s", numbersToStr(this.ao, 2));
  }

	// sigmoid(x)=tanh(x)
function sigmoid(x) {
  return tanh(x); // 雙曲正切函數 (表現較好)
//  return 1.0/(1.0+Math.pow(Math.E, -x)); // or sigmoid(x)=1/(1+e^-x) (表現不夠好)
}
// dsigmoid(x)=1-x^2;
// 參考：http://pynopticon.googlecode.com/svn/trunk/src/vlfeat/toolbox/special/dsigmoid.m
// 參考：http://en.wikipedia.org/wiki/Sigmoid_function
function dsigmoid(x) {
  return 1.0 - x*x;
//  return x*(1.0-x); // or dsigmoid=x*(1-x)
}

*/