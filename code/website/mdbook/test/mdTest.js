var fs = require("fs");
var MD = require("../lib/markdown");

var md = fs.readFileSync("test.md", "utf8")
var p = MD.parse(md);
console.log("jsons=%s", JSON.stringify(p.jsons, null, 2));
