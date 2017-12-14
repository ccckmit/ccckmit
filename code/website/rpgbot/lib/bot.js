let random = function(n) { // 從 0 到 n-1 中選一個亂數
  return Math.floor(Math.random()*n);
}

module.exports = class Bot {
  constructor(name, qaList) {
    this.name = name
    this.qaList = qaList
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
        if (q === "") // 如果是最後一個「空字串」的話，那就不用比對，直接任選一個回答。
          return this.name + ':' + aList[random(aList.length)]; // 那就從答案中任選一個回答
        var r = new RegExp("(.*)"+q+"([^?.;]*)", "gi"); // 建立正規表達式 (.*) q ([^?.;]*)
        if (say.match(r)) { // 比對成功的話
          var tail = RegExp.$2; // 就取出句尾
          // 將問句句尾的「我」改成「你」，「你」改成「我」。
          tail = tail.replace("我", "#").replace("你", "我").replace("#", "你");
          if (A instanceof Function)
            return this.name + ' : ' + A(say, tail)
          else if (aList != null)
            return this.name + ' : ' + aList[random(aList.length)].replace(/\*/, tail); // 然後將 * 改為句尾進行回答
        }
      }
    }
  }
}
