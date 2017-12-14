// Back-Propagation Neural Networks (JavaScript 版)
// 由陳鍾誠修改自 Neil Schemenauer 的 Python 版
// http://arctrix.com/nas/python/bpnn.py
// calculate a random number where:  a <= rand < b

var ml= require("./myLib");

// sigmoid(x)=tanh(x)
function sigmoid(x) {
  return ml.tanh(x); // 表現較好
//  return 1.0/(1.0+Math.pow(Math.E, -x)); // or sigmoid(x)=1/(1+e^-x) (表現不好)
}

// dsigmoid=1-y^2;
// 參考：http://pynopticon.googlecode.com/svn/trunk/src/vlfeat/toolbox/special/dsigmoid.m
// 參考：http://en.wikipedia.org/wiki/Sigmoid_function
function dsigmoid(y) {
  return 1.0 - y*y;
//  return y*(1.0-y); // or dsigmoid=y*(1-y)
}

function NeuralNet() {
  this.init=function(ni, nh, no) {
    // number of input, hidden, and output nodes
    this.ni = ni + 1; // +1 for bias node
    this.nh = nh;
    this.no = no;

    // activations for nodes
    this.ai = ml.makeArray(this.ni, 1.0);
    this.ah = ml.makeArray(this.nh, 1.0);
    this.ao = ml.makeArray(this.no, 1.0);
        
    // create weights
    this.wi = ml.makeMatrix(this.ni, this.nh, 0.0);
    this.wo = ml.makeMatrix(this.nh, this.no, 0.0);
    // set them to random vaules
    for (var i=0; i<this.ni; i++)
      for (var j=0; j<this.nh; j++)
        this.wi[i][j] = ml.rand(-0.2, 0.2);
    for (var j=0; j<this.nh; j++)
      for (var k=0; k<this.no; k++)
        this.wo[j][k] = ml.rand(-2.0, 2.0);

    // last change in weights for momentum   
    this.ci = ml.makeMatrix(this.ni, this.nh, 0.0);
    this.co = ml.makeMatrix(this.nh, this.no, 0.0);
    return this;
  }
  
  this.update=function(inputs) {
    if (inputs.length != this.ni-1)
      throw format("wrong number of inputs:input=%j ni=%d", inputs, this.ni);

    // input activations
    for (var i=0; i<this.ni-1; i++)
      this.ai[i] = inputs[i];

    // hidden activations
    for (var j=0; j<this.nh; j++) {
      var sum = 0.0;
      for (var i=0; i<this.ni; i++)
        sum = sum + this.ai[i] * this.wi[i][j];
      this.ah[j] = sigmoid(sum);
    }

    // output activations
    for (var k=0; k<this.no; k++) {
      var sum = 0.0;
      for (var j=0; j<this.nh; j++)
        sum = sum + this.ah[j] * this.wo[j][k];
      this.ao[k] = sigmoid(sum);
    }

    return this.ao;
  }


  this.backPropagate = function(targets, rate, moment) {
    if (targets.length != this.no)
      throw "wrong number of target values";

    // calculate error terms for output
    var output_deltas = ml.makeArray(this.no, 0.0);
    for (var k=0; k<this.no; k++) {
      var error = targets[k]-this.ao[k];
      output_deltas[k] = dsigmoid(this.ao[k]) * error;
    }

    // calculate error terms for hidden
    var hidden_deltas = ml.makeArray(this.nh, 0.0);
    for (var j=0; j<this.nh; j++) {
      var error = 0.0;
      for (var k=0; k<this.no; k++)
        error = error + output_deltas[k]*this.wo[j][k];
      hidden_deltas[j] = dsigmoid(this.ah[j]) * error;
    }

    // update output weights
    for (var j=0; j<this.nh; j++) {
      for (var k=0; k<this.no; k++) {
        var change = output_deltas[k]*this.ah[j];
        this.wo[j][k] = this.wo[j][k] + rate*change + moment*this.co[j][k];
        this.co[j][k] = change;
        // print N*change, M*this.co[j][k]
      }
    }

    // update input weights
    for (var i=0; i<this.ni; i++) {
      for (var j=0; j<this.nh; j++) {
        var change = hidden_deltas[j]*this.ai[i];
        this.wi[i][j] = this.wi[i][j] + rate*change + moment*this.ci[i][j];
        this.ci[i][j] = change;
      }
    }

    // calculate error
    var error = 0.0;
    for (var k=0; k<targets.length; k++)
      error = error + 0.5*Math.pow(targets[k]-this.ao[k],2);
    return error;
  }

  this.dump = function() {
    ml.log("  ai=%s", ml.numbersToStr(this.ai, 2));
    for (var i=0; i<this.wi.length; i++)
      ml.log("    %s", ml.numbersToStr(this.wi[i], 2));
    ml.log("  ah=%s", ml.numbersToStr(this.ah, 2));
    for (var i=0; i<this.wo.length; i++)
      ml.log("    %s", ml.numbersToStr(this.wo[i], 2));
    ml.log("  ao=%s", ml.numbersToStr(this.ao, 2));
  }

  this.test = function(patterns) {
    for (var p in patterns) {
      var inputs = patterns[p][0];
      var outputs= patterns[p][1];
      ml.log("%j -> [%s] [%s]", inputs, ml.numbersToStr(this.update(inputs), 0), ml.numbersToStr(outputs, 0));
      // this.dump();
    }
  }

  this.train=function(patterns, iterations, rate, moment) { // rate: learning rate, moment: momentum factor
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
        ml.log('%d:error %j', i, error);
    }
  }
}

module.exports = NeuralNet;