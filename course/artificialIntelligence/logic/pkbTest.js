var fs = require('fs'); // まノ郎ン
var kb = require('./pkb');
var kb1 = new kb();
var log = console.log;


kb1.test();

/*
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 弄郎

kb1.load(code);
kb1.forwardChaining();
*/