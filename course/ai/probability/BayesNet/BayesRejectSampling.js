var ml   = require("./myLib");
var prob = require("./prob");
var BayesNet = require("./BayesNet");

function rejectSampling(bn, q, e, N) { // 傳回 P(Q|e) 的機率分布
  
}

function priorSample(bn) { // 隨機取一個樣本
  
}

var bn = require("./BayesSample");
var q  = enumAsk(bn, "B", {"J":"1", "M":"1"}); // 答案應該是 P(B|j,m)={0.284, 0.716}.
ml.log("q=%j", q);
