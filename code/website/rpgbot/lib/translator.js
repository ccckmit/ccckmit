const translate = require('google-translate-api');

var langMap = {
  "英文": "en",
  "中文": "zh-tw",
  "日文": "ja",
  "韓文": "ko",
  "德文": "de",
}
var translator = module.exports = function (session, q) {
  var r = new RegExp("(.*)((英文)|(日文)|(中文)|(韓文)|(德文))([^?.;]*)", "gi");
  if (q.match(r)) { // 比對成功的話
    var lang = RegExp.$2;
    var tail = RegExp.$8; // 就取出句尾
    console.log('lang=%s tail=%s', lang, tail)
    translate(tail, {to: langMap[lang]}).then(res => {
      console.log(res.text);
      console.log(res.from.language.iso);
      session.send('翻譯 :' + res.text);
    }).catch(err => {
      console.error(err);
    });
    return lang
  }
}