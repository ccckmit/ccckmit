# 生成語法＋馬可夫語言產生器

## 人貓魚的世界

名詞："人", "貓", "魚"
動詞："養", "吃", "追", "餵"
量詞："隻", "位", "條"
定詞："這", "那", "一" 

## 生成語法

```
// VN 無法連上的問題

var R=require("./randomLib");

var WordsMap = {
  "N":["人", "貓", "魚"],
  "V":["吃", "追", "餵"],
  "Q":["隻", "個", "條"],
  "D":["這", "那", "一" ]
};

var QMap = {
  "QN":[
  [0.05, 0.90, 0.05],  // 隻
  [0.90, 0.05, 0.05],  // 個
  [0.05, 0.05, 0.90]], // 條
//  人     貓    魚 
  "VN":[
  [0.05, 0.05, 0.90],  // 吃
  [0.40, 0.50, 0.10],  // 追
  [0.20, 0.40, 0.40]], // 餵
//  人     貓    魚 
  "NV":[
  [0.30, 0.30, 0.40],  // 人
  [0.50, 0.45, 0.05],  // 貓
  [0.50, 0.45, 0.05]]  // 魚
//  吃     追    餵
};

function genState(state, Q) {
  var r = Math.random();
  var psum = 0;
  for (var toState=0; toState<Q[state].length; toState++) {
    psum += Q[state][toState];
    if (r < psum) {
      return toState;
    }
  }
}

var _tags  = [ "" ];
var _words = [ "" ];

function S() {
  NP(); VP();
}

function NP() {
  D(); Q(); N();
}

function VP() {
  V(); NP();
}

function genWord(tag) {
  var words     = WordsMap[tag];
  var lastTag   = _tags[_tags.length-1];
  var lastWord  = _words[_words.length-1];
    var tag2      = lastTag+tag;
    var Qt        = QMap[tag2];
//  console.log("tag2=", tag2, "Qt=", Qt);
    var word;
    if (typeof Qt !== 'undefined') {
      var lastWords = WordsMap[lastTag];
      var lastState = lastWords.indexOf(lastWord);
      state = genState(lastState, Qt)
      word = words[state];
//      console.log(tag2, "=>", lastWord, word);
    } else {
        word = R.sample(words);
    }
  _tags.push(tag);
  _words.push(word);
}

function N() { return genWord("N"); }

function V() { return genWord("V"); }

function Q() { return genWord("Q"); }

function D() { return genWord("D"); }

S();

console.log(_words.join(''));
```

執行結果

```
那條魚追那條人
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
那隻貓吃一條魚
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
一條魚吃這條魚
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
一個人餵這條魚
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
一條魚追一條魚
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
一條魚吃這隻貓
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
那條貓吃這條魚
nqu-192-168-61-142:jscode mac020$ node genGrammarMarkov2
一隻貓吃那條魚

```