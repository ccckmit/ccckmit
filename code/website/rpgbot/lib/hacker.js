var Bot = require('./bot')

var qaList = [
  { Q:"linux.*複製", A:"cp <file> <tofile>"},
  { Q:"linux.*移除", A:"rm <file>"},
];  

module.exports = new Bot('駭客', qaList)