  **檔案： complex.js**

```javascript
function add(c1, c2) {
  return { r:c1.r+c2.r, i:c1.i+c2.i };
}

function sub(c1, c2) {
  return { r:c1.r-c2.r, i:c1.i-c2.i };
}

function mul(c1, c2) {
  return { r:c1.r*c2.r-c1.i*c2.i, 
           i:c1.r*c2.i+c1.i*c2.r };
}

function toStr(c) { 
  return c.r+"+"+c.i+"i";
}
 
var o1 = { r:1, i:2 }, o2={ r:2, i:1 };

var add12 = add(o1, o2);
var sub12 = sub(o1, o2);
var mul12 = mul(o1, o2);

var c = console;

c.log("o1=%s", toStr(o1));
c.log("o2=%s", toStr(o2));
c.log("add(c1,c2)=%s", toStr(add12));
c.log("sub(c1,c2)=%s", toStr(sub12));
c.log("mul(c1,c2)=%s", toStr(mul12));
```

**執行結果**

    D:\Dropbox\cccwd\db\js\code>node complex.js
    o1=1+2i
    o2=2+1i
    add(c1,c2)=3+3i
    sub(c1,c2)=-1+1i
    mul(c1,c2)=0+5i
您可以看到這種寫法也很模組化，看起來相當不錯，只是函數是函數，資料是資料，函數只是用來處理資料的程式，此種寫法還沒有用到物件導向的技術。

接著、讓我們來看一個簡化後的物件導向版本，這個簡化後的版本只有一種運算函數，那就是加法 add 。

###物件寫法 1 : ocomplex1.js

**檔案： ocomplex1.js**

```javascript
var Complex = {
  add:function(c2) {
    return createComplex(this.r+c2.r, this.i+c2.i);
  }
}

var createComplex=function(r,i) {
  var c = Object.create(Complex);
  c.r = r;
  c.i = i;
  return c;
}

var c = console;

var c1=createComplex(1,2), c2=createComplex(2,1);

var c3 = c1.add(c2).add(c2).add(c2).add(c2);

c.log("c1=%j", c1);
c.log("c2=%j", c2);
c.log("c1.add(c2)=%j", c1.add(c2));
c.log("c3=%j", c3);
```

**執行結果**

    D:\Dropbox\cccwd\db\js\code>node ocomplex1.js
    c1={"r":1,"i":2}
    c2={"r":2,"i":1}
    c1.add(c2)={"r":3,"i":3}
    c3={"r":9,"i":6}
在上述程式中，我們透過 Object.create(Complex) 創造一個物件之後，立刻在其中塞入 r, i 等欄位，此時雖然物件看來只有兩個欄位，但事實上還有一些隱藏的物件資訊沒有被印出來，其中的一個隱藏物件資訊就是原型，在 JavaScript 中的物件都有一個原型 prototype 的欄位，這個欄位在執行完 Object.create(Complex) 後，會指向 Complex 物件。

```c
var createComplex=function(r,i) {
  var c = Object.create(Complex);
  c.r = r;
  c.i = i;
  return c;
}
```
上述程式中我們在 log() 函數中用了 %j 的格式，這代表要將該物件以 json　的方式印出來。

因此當我們後來呼叫 c1.add(c2) 這樣的指令時，JavaScript 的解譯系統才能夠從 c1 這個物件中找到 add 這個欄位，然後將其當成函數使用。

這種用點符號 "." 串起來的寫法可以一直串下去，成為一種串式語法，因此我們可以用 c1.add(c2).add(c2).add(c2).add(c2) 進行連續的加法。

###物件寫法 2 : ocomplex2.js

在物件的原型 prototype 裏通常還有些其他未顯示出來的函數，像是 toString() 就是一個很好用的函數，假如我們為物件加上 toString() 函數的話，那麼在該物件需要被轉換成字串的時候，就會自動呼叫 toString() ，以下是我們為上述 ocomplex1.js 程式加上 toString() 函數之後的結果，這個版本稱為 ocomplex2.js 。

**檔案： ocomplex2.js**

```javascript
var Complex = {
  add:function(c2) {
    return createComplex(this.r+c2.r, this.i+c2.i);
  },
  toString:function() { 
    return this.r+"+"+this.i+"i" 
  }
}

var createComplex=function(r,i) {
  var c = Object.create(Complex);
  c.r = r;
  c.i = i;
  return c;
}

var c = console;

var c1=createComplex(1,2), c2=createComplex(2,1);

var c3 = c1.add(c2).add(c2).add(c2).add(c2);

c.log("c1=%s", c1);
c.log("c2=%s", c2);
c.log("c1.add(c2)=%s", c1.add(c2));
c.log("c3=%s", c3);
```

**執行結果**

    D:\Dropbox\cccwd\db\js\code>node ocomplex2.js
    c1=1+2i
    c2=2+1i
    c1.add(c2)=3+3i
    c3=9+6i
您可以看到由於我們加入了 toString() 函數，而且在印出來的語法上採用了 %s 這個字串式印法，於是在印到螢幕前 console.log 會先呼叫這些複數物件的 toString() 函數，結果印出來的格式就好看很多了。

###物件寫法 3 : ocomplex3.js

當然、我們也可以把減法 sub() 和乘法 mul() 函數放到這個物件導向版的複數程式中，這樣就和前面的非物件導向版功能相當了，以下是這個比較完整的版本。

**檔案： ocomplex3.js**

```javascript
var Complex = {
  add:function(c2) {
    return createComplex(this.r+c2.r, this.i+c2.i);
  },
  sub:function(c2) {
    return createComplex(this.r-c2.r, this.i-c2.i);
  },
  mul:function(c2) {
    return createComplex(this.r*c2.r-this.i*c2.i, 
                   this.r*c2.i+this.i*c2.r);
  },
  toString:function() { 
    return this.r+"+"+this.i+"i" 
  }
}

var createComplex=function(r,i) {
  var c = Object.create(Complex);
  c.r = r;
  c.i = i;
  return c;
}

var c = console;

var c1=createComplex(1,2), c2=createComplex(2,1);

var c3 = c1.add(c2).sub(c2).add(c2).sub(c2);

c.log("c1=%s", c1);
c.log("c2=%s", c2);
c.log("c1.add(c2)=%s", c1.add(c2));
c.log("c1.sub(c2)=%s", c1.sub(c2));
c.log("c1.mul(c2)=%s", c1.mul(c2));
c.log("c3=%s", c3);
```

**執行結果**

    D:\Dropbox\cccwd\db\js\code>node ocomplex3.js
    c1=1+2i
    c2=2+1i
    c1.add(c2)=3+3i
    c1.sub(c2)=-1+1i
    c1.mul(c2)=0+5i
    c3=1+2i
上述程式雖然很完整了，但是在語法上 createComplex() 沒有和 Complex 物件直接綁釘在一起，感覺怪怪的。為了讓語法更漂亮，我們乾脆將該函數直接塞回 Complex 物件內，成為 Complex.create() 函數，這樣感覺就更「物件化」了一些。請看以下的版本！

###物件寫法 4 : ocomplex4.js

**檔案： ocomplex4.js**

```javascript
var Complex = {
  add:function(c2) {
    return Complex.create(this.r+c2.r, this.i+c2.i);
  },
  sub:function(c2) {
    return Complex.create(this.r-c2.r, this.i-c2.i);
  },
  mul:function(c2) {
    return Complex.create(this.r*c2.r-this.i*c2.i, 
                       this.r*c2.i+this.i*c2.r);
  },
  toString:function() { 
    return this.r+"+"+this.i+"i" 
  }
}

Complex.create=function(r,i) {
  var c = Object.create(Complex);
  c.r = r;
  c.i = i;
  return c;
    }

 var c = console;

var c1=Complex.create(1,2), c2=Complex.create(2,1);

var c3 = c1.add(c2).sub(c2).add(c2).sub(c2);

c.log("c1=%s", c1);
c.log("c2=%s", c2);
c.log("c1.add(c2)=%s", c1.add(c2));
c.log("c1.sub(c2)=%s", c1.sub(c2));
c.log("c1.mul(c2)=%s", c1.mul(c2));
c.log("c3=%s", c3);
```

**執行結果**

    D:\Dropbox\cccwd\db\js\code>node ocomplex4.js
    c1=1+2i
    c2=2+1i
    c1.add(c2)=3+3i
    c1.sub(c2)=-1+1i
    c1.mul(c2)=0+5i
    c3=1+2i
必須注意的是，這種寫法仍然必須把 Complex.create 提出來到外面寫，否則在 Complex 都尚未創建完成時就要用 Object.create(Complex) 創建 Complex 物件的話，就會產生錯誤了。

###結語

以上是我們對 JavaScript 物件導向機制的一個簡單入門，但是並不完整，因為我們還沒有看到更深入的《原型鏈》機制，關於《原型鏈》的概念我們將在後續的文章中再來探討。