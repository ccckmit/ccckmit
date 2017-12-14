var fs = require('fs'); // 引用檔案物件
var kb = require('../lib/kb');
var kb1 = new kb();
kb1.loadFile(process.argv[2]).forwardChaining().query();
