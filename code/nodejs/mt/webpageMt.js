const translate = require('translate-api');
const fs = require('fs')

let transUrl = 'https://nodejs.org/en/';
  translate.getPage(transUrl,{to: 'zh-CN'}).then(function(htmlStr){
//  console.log(htmlStr.length)
  fs.writeFile('nodejs.html', htmlStr, function(err) {
    console.log('write complete!')
  })
});

let transText = 'hello world!';
  translate.getText(transText,{to: 'zh-CN'}).then(function(text){
//  console.log(text)
});