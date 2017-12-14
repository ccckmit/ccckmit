var fs = require('fs'); // 引用檔案物件
var kb = require('./kb');

var code = "A<=B. B<=C&D. C<=E. D<=F. E. F. Z<=C&D&G.";
var kb1 = new kb();
kb1.load(code);
kb1.forwardChaining();
// kb1.backwardChaining("A");
// kb1.backwardChaining("Z");

