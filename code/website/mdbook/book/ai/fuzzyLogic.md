# 模糊邏輯推論

* [維基百科:模糊邏輯](https://zh.wikipedia.org/wiki/%E6%A8%A1%E7%B3%8A%E9%80%BB%E8%BE%91)
* [Wikipedia:Fuzzy logic](https://en.wikipedia.org/wiki/Fuzzy_logic)
* [Wikipedia:Fuzzy control system](https://en.wikipedia.org/wiki/Fuzzy_control_system)
* <https://github.com/sebs/node-fuzzylogic>
* <https://github.com/marcolanaro/JS-Fuzzy>


## fuzzylogic 套件的使用方法

檔案： fuzzyTest.js

```
var fuzzylogic = require("fuzzylogic");
var sys = console;

var threatCalc = function(threat) {
    var probabNoAttack          = fuzzylogic.triangle(threat, 0, 20, 40);
    var probabNormalAttack      = fuzzylogic.trapezoid(threat, 20, 30, 90, 100);
    var probabEnragedAttack     = fuzzylogic.grade(threat, 90, 100);
    sys.log('Threat: ' + threat);
    sys.log('no attack: '       + probabNoAttack);
    sys.log('normal attack: '   + probabNormalAttack);
    sys.log('enraged attack: '  + probabEnragedAttack);
};

threatCalc(10);
threatCalc(20);
threatCalc(30);
```

執行

```
NQU-192-168-60-101:js csienqu$ npm install fuzzylogic
...
NQU-192-168-60-101:js csienqu$ node fuzzyTest
Threat: 10
no attack: 0.5
normal attack: 0
enraged attack: 0
Threat: 20
no attack: 1
normal attack: 0
enraged attack: 0
Threat: 30
no attack: 0.5
normal attack: 1
enraged attack: 0

```

