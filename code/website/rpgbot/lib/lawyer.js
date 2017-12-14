var Bot = require('./bot')

var qaList = [
  { Q:"契約", A:"民法 第 153 條:當事人互相表示意思一致者，無論其為明示或默示，契約即為成立。"},
];  

module.exports = new Bot('律師', qaList)