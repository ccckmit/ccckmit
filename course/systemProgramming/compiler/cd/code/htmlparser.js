var p = require("./phraser");

var tree = p.main(process.argv.slice(1));

console.log("%j", tree);