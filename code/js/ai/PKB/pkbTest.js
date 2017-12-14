var fs = require('fs'); // 引用檔案物件
var kb = require('./pkb');
var kb1 = new kb();
var log = console.log;


kb1.test();

/*
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 讀取檔案

kb1.load(code);
kb1.forwardChaining();
*/