var Bot = require('./bot')

var qaList = [
  { Q:"血壓", A:"正常範圍是收縮壓 < 120，舒張壓 <80"},
  { Q:"坐骨神經痛", A:"請打健生中醫 0800-090000"},
];  

module.exports = new Bot('醫生', qaList)