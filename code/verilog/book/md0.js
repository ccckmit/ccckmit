var http = require('http');
var fs = require("fs");
var crypto = require('crypto');
var child_process = require('child_process');
var log = console.log;
var argv = process.argv;

var md0 = fs.readFileSync(argv[2], "utf8");
var md  = tex2md(md0);
fs.writeFileSync(argv[3], md, "utf8");

function hash(o) {
  var hash = crypto.createHash('md5');
  hash.update(o.toString());
  return hash.digest('hex');
}

function tex2md(md0) {
  var md  = "";
  re = new RegExp(/\$(.+?)\$/g); // *?, +? non greedy, m for multiline
  var lastEnd = 0;
//  var imgUrl = "http://chart.apis.google.com/chart?cht=tx&amp;chl=[etex]";
  var texPattern = " ![]([imgpath].jpg) ";
  while((m = re.exec(md0)) !== null) {
    var tex = m[1];
//    var imgpath = "../timg/"+tex.replace(/\W+/g, "_").substr(0,6)+"_"+hash(tex).substr(0,12);
    var imgpath = "../timg/"+hash(tex).substr(0,12);
    tex2file(tex, imgpath);
    md += md0.substring(lastEnd, m.index)+texPattern.replace("[tex]", tex).replace("[imgpath]", imgpath);
    lastEnd = m.index + m[0].length;
  }
  md += md0.substring(lastEnd);
  return md;
}

/* Mimetex 的下載、編譯及用法請參考：http://www.forkosh.com/mimetexmanual.html
執行範例：
D:\201305\mimetex>gcc -DAA mimetex.c gifsave.c -lm -o mimetex.cgi
D:\201305\mimetex>gcc -DAA mimetex.c gifsave.c -lm -o mimetex
D:\201305\mimetex>mimetex -d "x^2+y^2" > exp.gif

影像從 gif 轉為 jpg 的方法，使用 imagemagic (command line)
參考：http://www.imagemagick.org/script/convert.php
例如：convert rose.gif rose.jpg */

function tex2file(tex, filename) {
  var command = 'tex2img.bat " '+tex+'" '+filename;
  child_process.exec(command, function(err, stdout, stderr) {
//      log(command+" finished!\n");
      log("err="+err);
  });
}

