// VN 無法連上的問題，因為 V NP = V D Q N , VN 兩者沒有相連

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
  return word;
}

function N() { return genWord("N"); }

function V() { return genWord("V"); }

function Q() { return genWord("Q"); }

function D() { return genWord("D"); }

S();

console.log(_words.join(''));
