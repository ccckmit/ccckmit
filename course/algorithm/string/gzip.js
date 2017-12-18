var zlib = require('zlib');
var gzip = zlib.createGzip();
var fs = require('fs');
var inp = fs.createReadStream('gzip.js');
var out = fs.createWriteStream('gzip.js.gz');

inp.pipe(gzip).pipe(out);