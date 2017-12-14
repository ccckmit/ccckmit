var fs = require('fs'); // 引用檔案物件
var kb = require('./kb');

var kb1 = new kb();
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 讀取檔案
kb1.load(code);
kb1.forwardChaining();

var r = require('readline').createInterface(process.stdin, process.stdout);
r.setPrompt('?- ');
r.prompt();

r.on('line', function(line) {
  var term = line.trim();
  kb1.addFact(term);
  kb1.forwardChaining();
  r.prompt();
}).on('close', function() {
  process.exit(0);
});


