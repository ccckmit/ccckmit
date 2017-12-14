**模組定義：math.js**

```javascript
var math = {
    PI:3.14,
    square:function(n) {
        return n*n;
    }
}

module.exports = math;
```

接著您可以使用 require 這個指令動態的引入該模組，注意 require 必須採用相對路徑，即使在同一個資料夾底下，也要加上 ./ 的前置符號，代表在目前資料夾之下。以下是一個引用上述模組的範例。

**模組使用：mathTest.js**

```javascript
var m=require("./math");

console.log("PI=%d square(3)=%d", m.PI, m.square(3));
```

**執行結果：**

    D:\Dropbox\Public\pmag\201306\code>node mathTest
    PI=3.14 square(3)=9
    
###動態模組：匯出建構函數

以下是一個定義圓形 circle 的物件。

**模組定義：circle.js**

```javascript
var PI = 3.14;
Circle = function (radius) {
    this.radius = radius
    this.area = function() {
        return PI * this.radius * this.radius;
    }
};

module.exports = Circle;
module.exports.PI = PI;
```

在引用「匯出建構函數」的程式當中，由於取得的是建構函數，因此必須再使用 new 的方式建立物件之後才能使用 (例如以下的 c = new cir(5) 這個指令，就是在透過建構函數 cir() 建立物件。

**模組使用：CircleTest.js**

```javascript
var cir = require('./circle');              // 注意，./ 代表 circle 與此程式放在同一個資料夾底下。
var c = new cir(5);
console.log("cir.PI="+cir.PI);
console.log("c.PI="+c.PI);
console.log("c.area()="+c.area());
```

**執行結果**

    D:\code\node>node circleTest.js
    cir.PI=3.14
    c.PI=undefined
    c.area()=78.5
您現在應該可以理解為何我們要將 Circle 定義為一個函數了吧！這只不過 Circle 類別的建構函數而已， 當他被 module.exports = Circle 這個指令匯出時，就可以在 var cir = require('./circle') 這個指令 接收到建構函數，然後再利用像 var c = new cir(5) 這樣的指令，呼叫該建構函數，以建立出物件。

然後，您也應該可以看懂為何我們要用 module.exports.PI = PI 將 PI 獨立塞到 module.exports 裏了吧！ 因為只有這樣才能讓外面的模組在不執行物件建構函數 (不建立物件) 的情況之下就能存取 PI。

跨平台模組：定義各種平台均能使用的 JavaScript 模組

在很多開放原始碼的 JavaScript 專案模組中，我們會看到模組的最後有一段很複雜的匯出動作。舉例而言， 在 marked.js 這個將 Markdown 語法轉為 HTML 的模組最後，我們看到了下列這段感覺匪夷所思的匯出橋段， 這種寫法其實只是為了要讓這個模組能夠順利的在「瀏覽器、node.js、CommonJS 與其 Asynchronous Module Definition (AMD) 實作版的 RequireJS」等平台當中都能順利的使用這個模組而寫的程式碼而已。

```javascript
/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
```

對這個超複雜匯出程式有興趣的朋友可以看看以下的文章，應該就可以大致理解這種寫法的來龍去脈了。

* http://www.angrycoding.com/2012/10/cross-platform-wrapper-function-for.html
