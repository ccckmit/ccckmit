# 有 BNF 的口語翻譯系統

程式： BnfSpokenMt.js

```javascript
// S = Q? NP* (VP)* . 
// VP = VP (c VP)* | (v* V+ v*)+ NP*
// NP = NP (c NP)* | (n* N+)

// 小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
// NP   V  n    NP      V  v  NP   n    NP      Q    NP v  V  n     NP
//      VP              VP                              VP    

var c = console;

var tagMap={
  N : ["小明", "小華", "小莉", "大雄", "爸爸", "魚", "天", "家", "風", "日", "旅人", "人", "衣", "者",
       "他", "你", "我", 
       "蘋果", "橘子", "柳丁", "番茄"],
  V : ["有", "給", "剩", "吃", "去", "捕", "回", "至", "爭", "勝", "吹", "抓", "緊", "敗", "勝", "照", "脫", "狂", "暖"],
  v : ["還", "了", "一起", "不"],
  c : ["又", "和", "且", "或", "與"],
  n : ["幾", "這", "那", "5", "3", "個", "隻", "條", "黑", "大", "的"],
  Q : ["請問", "為甚麼"],
  "." : ["，", "？", "。"]
}

var mtMap = {
  "小明":"ShaoMin", "小華":"ShaoHua", "小莉":"ShaoLi", "大雄":"DaShon", 
  "他":"he", "你":"you", "我":"me", 
  "蘋果":"apple", "橘子":"tangerine", "柳丁":"orange", "番茄":"tomato",
  "有":"have", "給":"give", "剩":"own", "吃":"eat", "一起":"together",
  "還":"still", "又":"again", "和":"and", "了":"_le", "且":"and2", "或":"or", "與":"and3",
  "個":"_ge", "隻":"_ji", "條":"_tio", "的":"_de", 
  "幾":"_gi", "這":"this", "那":"that", 
  "黑":"black", "大":"big", "天":"sky", "風":"wind", "爸爸":"Papa", "去":"go", "捕":"hunt", "魚":"fish", "為甚麼":"why", "不":"not", "回":"back", "家":"home",
  "風":"wind", "日":"sun", "旅人":"travler", "人":"people", "衣":"cloth", "者":"guy",
  "至":"come", "爭":"argue", "勝":"win", "吹":"blow", "抓":"catch", "緊":"tighten", "敗":"lose", "勝":"win", "照":"shine", "脫":"take_off", "狂":"wild", "暖":"warm" , 
  "請問":"Q", "？":"？"
}

var wi = 0;
var words = [], mtWords=[];

function isTag(tag) {
  var tagWords=tagMap[tag];
  if (typeof tagWords === "undefined") 
    return false;
  else
    return (tagWords.indexOf(words[wi])>=0);
}

function mt(w) {
  var wt = mtMap[w];
  if (typeof wt === 'undefined')
    return w;
  else
    return wt;
}

var print = function(s) { process.stdout.write(s) }

function next(tag) {
  var w = words[wi];
  if (isTag(tag)) {
    print(w+':'+tag+" ");
    mtWords.push(mt(w));
    wi++;
    return w;
  } else {
    print(w+':'+tag+":X ");
    throw Error("Error !");    
  }
}

function T() {
  while (wi < words.length) {
    S();
  }
}

// S = Q? NP* (VP)* . 
function S() {
  if (isTag("Q")) 
    next("Q");
  
  while (isTag("n") || isTag("N")) 
    NP();
  
  while (isTag("V") || isTag("v")) {
    VP();
  }
  next(".");
  console.log('');
}

// VP = VP (c VP)* | (v* V+ v*)+ NP*
function VP() {
  while (isTag("v") || isTag("V")) {
    while (isTag("v")) next("v");
    do { next("V") } while (isTag("V"));
    while (isTag("v")) next("v");
  }
  while (isTag("n") || isTag("N"))
    NP();
}

// NP = NP (c NP)* | (n* N+)
function NP() {
  while (isTag("n")) next("n");
  do { next("N") } while (isTag("N"));
  if (isTag("c")) {
    next("c");
    NP();
  }
}

function parse(sentence) {
  words=sentence.split(" ");
  wi = 0, mtWords=[];
  c.log("======= 中文 =============");
  c.log(words.join(" "));
  c.log("======= 剖析 =============");
  T(words);
  c.log("======= 英文 =============");
  c.log(mtWords.join(" "));
}

parse("小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？");
parse("小明 和 小華 一起 吃 蘋果 。");
parse("黑 黑 的 天 ， 大 大 的 風 ， 爸爸 去 捕 魚 ， 為甚麼 還 不 回 家 ？");
// 全文： https://www.facebook.com/photo.php?fbid=1464494203561879&set=p.1464494203561879&type=3&theater
// parse("聽 狂 風 怒 吼 ，  真 叫 我們 害怕 。 爸爸！爸爸！ 我們 心理 多麼 牽掛 ， 只要 您 早點兒 回家，就是 空 船 也罷 ！");
// parse("我 的 好 孩子 ，  爸爸 回來 啦 ！ 你 看 船艙 裡 ， 裝 滿 魚 和 蝦 ， 努力 就 有 好 收穫 ， 大 風 大 浪 不用 怕 ， 快 去 告訴 媽媽 ， 爸爸 已經 回 家 ！");
parse("風 與 日 。 風 日 爭 ， 旅人 至 ， 脫 者 勝 ， 風 狂 吹 ， 人 緊 衣 ， 風 敗 ， 日 暖 照 ， 人 脫 衣 ， 日 勝 。");
```

執行結果：

```
D:\js>node mtBnfSpoken.js
======= 中文 =============
小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
======= 剖析 =============
小明:N 有:V 5:n 個:n 蘋果:N ，:.
給:V 了:v 小華:N 3:n 個:n 蘋果:N ，:.
請問:Q 他:N 還:v 剩:V 幾:n 個:n 蘋果:N ？:.
======= 英文 =============
ShaoMin have 5 _ge apple ， give _le ShaoHua 3 _ge apple ， Q he still own _gi _
ge apple ？
======= 中文 =============
小明 和 小華 一起 吃 蘋果 。
======= 剖析 =============
小明:N 和:c 小華:N 一起:v 吃:V 蘋果:N 。:.
======= 英文 =============
ShaoMin and ShaoHua together eat apple 。
======= 中文 =============
黑 黑 的 天 ， 大 大 的 風 ， 爸爸 去 捕 魚 ， 為甚麼 還 不 回 家 ？
======= 剖析 =============
黑:n 黑:n 的:n 天:N ，:.
大:n 大:n 的:n 風:N ，:.
爸爸:N 去:V 捕:V 魚:N ，:.
為甚麼:Q 還:v 不:v 回:V 家:N ？:.
======= 英文 =============
black black _de sky ， big big _de wind ， Papa go hunt fish ， why still not ba
ck home ？
======= 中文 =============
風 與 日 。 風 日 爭 ， 旅人 至 ， 脫 者 勝 ， 風 狂 吹 ， 人 緊 衣 ， 風 敗 ，
日 暖 照 ， 人 脫 衣 ， 日 勝 。
======= 剖析 =============
風:N 與:c 日:N 。:.
風:N 日:N 爭:V ，:.
旅人:N 至:V ，:.
脫:V 者:N 勝:V ，:.
風:N 狂:V 吹:V ，:.
人:N 緊:V 衣:N ，:.
風:N 敗:V ，:.
日:N 暖:V 照:V ，:.
人:N 脫:V 衣:N ，:.
日:N 勝:V 。:.
======= 英文 =============
wind and3 sun 。 wind sun argue ， travler come ， take_off guy win ， wind wild
 blow ， people tighten cloth ， wind lose ， sun warm shine ， people take_off
cloth ， sun win 。
```
