var Bot = require('./bot')

var qaList = [
  {Q: "谷哥", A:"我是谷哥，您找我嗎？"},
  {Q: "音樂 | 歌曲", A:"site:youtube.com *"},
  {Q: "電影", A:"電影 線上看 *"},
  {Q: "A片 | 色情 | 情色", A:"site:xvideos.com *"},
  {Q: "戲劇", A:"site:tw.iqiyi.com *"},
  {Q: "歌詞", A:"site:mojim.com *"},
  {Q: "查詢 | 搜尋 | 查", A:"*"},
//  {Q: "", A:"*"},
]

class Googler extends Bot {
  constructor() {
    super('谷哥', qaList)
  }

  answer(say) {
    var qaList = this.qaList
    for (var i in qaList) { // 對於每一個 QA
      var qa = qaList[i];
      var qList = qa.Q.split("|"); // 取出 Q 部分，分割成一個一個的問題字串 q
      var A = qa.A
      var aList = null
      if (typeof A === 'string') aList = qa.A.split("|"); // 取出回答 A 部分，分割成一個一個的回答字串 q
      for (var qi in qList) { // 對於每個問題字串 q
        var q = qList[qi].trim();
        var r = new RegExp("(.*)"+q+"([^?.;]*)", "gi"); // 建立正規表達式 (.*) q ([^?.;]*)
        if (say.indexOf("谷哥")>=0) {
          return this.name + ' : ' + qa.A
/*          
        } else if (q.length === 0) {
          return `${this.name} : 查詢 [${say}](https://www.google.com.tw/search?q=${encodeURIComponent(say)})`;
*/
        } else if (say.match(r)) { // 比對成功的話
          var tail = RegExp.$2; // 就取出句尾，然後將 * 改為句尾進行回答
          var query = A.replace('*', tail)
          return `${this.name} : 搜尋 [${query}](https://www.google.com.tw/search?q=${encodeURIComponent(query)})`;
        }
      }
    }
  }
}

var googler = new Googler()

module.exports = googler