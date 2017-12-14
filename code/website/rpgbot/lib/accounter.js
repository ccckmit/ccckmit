var Bot = require('./bot')

var qaList = [
  { Q:"收入", A:"記住了！收入*"},
  { Q:"支出", A:"記住了！支出*"},
  { Q:"買", A:"記住了！買*"},
  { Q:"賣", A:"記住了！賣*"},
];

module.exports = new Bot('會計', qaList)