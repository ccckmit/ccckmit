# 第 6 章 - 物件導向與原型

## 最簡單的物件

範例： people.js

```javascript
var People={ 
  name:"john", 
  age:30,
  print:function() {
    console.log("name=", this.name, "age=", this.age);
  } 
}

People.print();
```

執行結果：

```
$ node people.js 
name= john age= 30

```

範例： circle.js

```javascript
var circle = {
  r:3, 
  area:function() {
    return 3.14*this.r*this.r;
  }
}

console.log("circle.r=%d", circle.r);

console.log("circle.area()=%d", circle.area());

```

執行結果

```
NQU-192-168-60-101:ccc csienqu$ node circle.js
circle.r=3
circle.area()=28.259999999999998

```

## 複數的範例


接著，我們將以複數 (Complex Number) 為範例，用最簡單的方式闡述 JavaScript 的物件導向設計法。

但必須聲明的是，我們不採用傳統的 new 方式進行說明，因為那種方式很詭異，不容易看清楚 JavaScript 物件導向的特性。

相反的、我們採用 Object.create() 的方式作為入門踏板，因為這種方式比較好理解。

要理解 JavaScript 的物件導向之前，先讓我們看看傳統的非物件導向寫法，怎麼樣撰寫一個複數 (Complex Number) 的模組。

## 非物件的寫法

檔案： complex.js

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

var a = { r:1, i:2 }, b={ r:2, i:1 };

var add12 = add(a, b);
var sub12 = sub(a, b);
var mul12 = mul(a, b);

console.log("a=%s", toStr(a));
console.log("b=%s", toStr(b));
console.log("add(a,b)=%s", toStr(add12));
console.log("sub(a,b)=%s", toStr(sub12));
console.log("mul(a,b)=%s", toStr(mul12));
```

執行結果

```
NQU-192-168-60-101:object csienqu$ node complex.js
a=1+2i
b=2+1i
add(a,b)=3+3i
sub(a,b)=-1+1i
mul(a,b)=0+5i
```

您可以看到這種寫法也很模組化，看起來相當不錯，只是函數是函數，資料是資料，函數只是用來處理資料的程式，此種寫法還沒有用到物件導向的技術。

接著、讓我們來看一個簡化後的物件導向版本，這個簡化後的版本只有一種運算函數，那就是加法 add 。

## 物件寫法 1 : ocomplex1.js

檔案： ocomplex1.js

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

var a=createComplex(1,2), b=createComplex(2,1);

var x = a.add(b).add(b).add(b);

console.log("a=%j", a);
console.log("b=%j", b);
console.log("a.add(b)=%j", a.add(b));
console.log("x=%j", x);
```

執行結果

```
$ node ocomplex1.js
a={"r":1,"i":2}
b={"r":2,"i":1}
a.add(b)={"r":3,"i":3}
x={"r":7,"i":5}
```

在上述程式中，我們透過 Object.create(Complex) 創造一個物件之後，立刻在其中塞入 r, i 等欄位，此時雖然物件看來只有兩個欄位，但事實上還有一些隱藏的物件資訊沒有被印出來，其中的一個隱藏物件資訊就是原型，在 JavaScript 中的物件都有一個原型 prototype 的欄位，這個欄位在執行完 Object.create(Complex) 後，會指向 Complex 物件。

```javascript
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

## 物件寫法 2 : ocomplex2.js

在物件的原型 prototype 裏通常還有些其他未顯示出來的函數，像是 toString() 就是一個很好用的函數，假如我們為物件加上 toString() 函數的話，那麼在該物件需要被轉換成字串的時候，就會自動呼叫 toString() ，以下是我們為上述 ocomplex1.js 程式加上 toString() 函數之後的結果，這個版本稱為 ocomplex2.js 。

檔案： ocomplex2.js

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

var a=createComplex(1,2), b=createComplex(2,1);

var x = a.add(b).add(b).add(b).add(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("x=%s", x);

```

執行結果

```
$ node ocomplex2.js 
a=1+2i
b=2+1i
a.add(b)=3+3i
x=9+6i

```

您可以看到由於我們加入了 toString() 函數，而且在印出來的語法上採用了 %s 這個字串式印法，於是在印到螢幕前 console.log 會先呼叫這些複數物件的 toString() 函數，結果印出來的格式就好看很多了。

## 物件寫法 3 : ocomplex3.js

當然、我們也可以把減法 sub() 和乘法 mul() 函數放到這個物件導向版的複數程式中，這樣就和前面的非物件導向版功能相當了，以下是這個比較完整的版本。

檔案： ocomplex3.js

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

var a=createComplex(1,2), b=createComplex(2,1);
var x = a.add(b).sub(b).mul(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("x=%s", x);

```

執行結果

```
$ node ocomplex3.js 
a=1+2i
b=2+1i
a.add(b)=3+3i
x=0+5i

```

上述程式雖然很完整了，但是在語法上 createComplex() 沒有和 Complex 物件直接綁釘在一起，感覺怪怪的。為了讓語法更漂亮，我們乾脆將該函數直接塞回 Complex 物件內，成為 Complex.create() 函數，這樣感覺就更「物件化」了一些。請看以下的版本！

## 物件寫法 4 : ocomplex4.js

檔案： ocomplex4.js

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

var a=Complex.create(1,2), b=Complex.create(2,1);

var x = a.add(b).sub(b).mul(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("a.sub(b)=%s", a.sub(b));
console.log("a.mul(b)=%s", a.mul(b));
console.log("x=%s", x);

```

執行結果

```
$ node ocomplex4.js 
a=1+2i
b=2+1i
a.add(b)=3+3i
a.sub(b)=-1+1i
a.mul(b)=0+5i
x=0+5i

```

必須注意的是，這種寫法仍然必須把 Complex.create 提出來到外面寫，否則在 Complex 都尚未創建完成時就要用 Object.create(Complex) 創建 Complex 物件的話，就會產生錯誤了。

## 物件寫法 5 : pcomplex.js (採用建構函數)


上述幾種寫法都使採用 Object.create 的方式，根據某物件創造出新物件。

但是、 JavaScript 的典型物件寫法，是採用《建構函數+原型鏈》的方式進行物件導向設計的，以下我們將介紹這種典型做法。

首先讓我們看看 javascript 當中的建構函數怎麼寫，以下同樣用《複數物件》當作範例。

檔案： pcomplex1.js

```javascript
var Complex=function(r,i) {
  this.r = r; 
  this.i = i;
  this.add=function(c2) {
    return new Complex(this.r+c2.r, this.i+c2.i);		
  }
  this.sub=function(c2) {
    return new Complex(this.r-c2.r, this.i-c2.i);
  }
  this.mul=function(c2) {
    return new Complex(this.r*c2.r-this.i*c2.i, 
                       this.r*c2.i+this.i*c2.r);
  }	
  this.toString=function() { 
    return this.r+"+"+this.i+"i"
  }
}

var a=new Complex(1,2), b=new Complex(2,1);

var x = a.add(b).sub(b).mul(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("a.sub(b)=%s", a.sub(b));
console.log("a.mul(b)=%s", a.mul(b));
console.log("x=%s", x);
```

執行結果

```
$ node pcomplex1.js 
a=1+2i
b=2+1i
a.add(b)=3+3i
a.sub(b)=-1+1i
a.mul(b)=0+5i
x=0+5i

```

您可以看到這個版本的 Complex 並不是個物件，而是一個函數，我們用 new Complex(1,2) 這樣的語句呼叫這個建構函數，創建出新物件。

```
var Complex=function(r,i) {
	this.r = r; 
  ...
}
...
var a=new Complex(1,2), b=new Complex(2,1);
```

然後在建構函數當中，我們仍然可以使用 this 代表這個物件，將內容放到物件裡面。

## 物件寫法 6 : pcomplex2.js (採用建構函數)


雖然上一個範例採用了建構函數，但是這種寫法的每個物件裡面，都會儲存一份 add, sub, mul 等函數，如果有 100 個複數物件，就會儲存 100 份這種函數，這顯然是很浪費空間的做法。

還好、javascript 提供了一個稱為《原型》的機制，讓我們可以《共用》這些《應該共用且只有一份》的欄位與函數，以下就是一個採用《原型寫法》的複數物件程式。


檔案： pcomplex2.js

```javascript
var Complex=function(r,i) {
	this.r = r; 
	this.i = i;
}

Complex.prototype.add=function(c2) {
  return new Complex(this.r+c2.r, this.i+c2.i);
}

Complex.prototype.sub=function(c2) {
  return new Complex(this.r-c2.r, this.i-c2.i);
}

Complex.prototype.mul=function(c2) {
  return new Complex(this.r*c2.r-this.i*c2.i, 
                     this.r*c2.i+this.i*c2.r);
}

Complex.prototype.toString=function() { 
  return this.r+"+"+this.i+"i" 
}

var a=new Complex(1,2), b=new Complex(2,1);

var x = a.add(b).sub(b).mul(b);

console.log("c1=%s", a);
console.log("c2=%s", b);
console.log("c1.add(c2)=%s", a.add(b));
console.log("c1.sub(c2)=%s", a.sub(b));
console.log("c1.mul(c2)=%s", a.mul(b));
console.log("x=%s", x);
```

執行結果

```
$ node pcomplex2.js 
c1=1+2i
c2=2+1i
c1.add(c2)=3+3i
c1.sub(c2)=-1+1i
c1.mul(c2)=0+5i
x=0+5i

```

其中採用 prototype 關鍵字的語句，就是所謂的原型。

```javascrpt
Complex.prototype.add=function(c2) {
  return new Complex(this.r+c2.r, this.i+c2.i);
}
```

## ES6 新版的類別寫法

檔案： ComplexClass.js

```javascript
 class Complex {
    constructor(r,i) {
        this.r = r; 
        this.i = i;
    }

    add(c2) {
        return new Complex(this.r+c2.r, this.i+c2.i);
    }
    
    sub(c2) {
        return new Complex(this.r-c2.r, this.i-c2.i);
    }
    
    mul(c2) {
        return new Complex(this.r*c2.r-this.i*c2.i, 
                           this.r*c2.i+this.i*c2.r);
    }
    toString() { 
        return this.r+"+"+this.i+"i" 
    }
}

var a=new Complex(1,2), b=new Complex(2,1);

var x = a.add(b).sub(b).mul(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("a.sub(b)=%s", a.sub(b));
console.log("a.mul(b)=%s", a.mul(b));
console.log("x=%s", x);
```


執行結果：

```
$ node ComplexClass.js 
a=1+2i
b=2+1i
a.add(b)=3+3i
a.sub(b)=-1+1i
a.mul(b)=0+5i
x=0+5i
```

不管你總共建立了多少 Complex 物件， Complex 的 prototype 都只會有一份，因此這種寫法會比前一種寫法更省記憶體。

而這種寫法，也是最經典的 javascript 物件導向寫法。

在一般的物件導向語言裡，會有《繼承》的機制，但是在 javascript 的早期版本 (ES6 之前) 裡面，並沒有《繼承》的機制。

但是、javascript 仍然可以做到類似《繼承》的功能，方法是在原型裏再塞入原型，這種原型裡面還可以有原型的做法，真的是非常美妙的一種設計阿！


## 習題
1 請寫出一個具有加減乘除運算的複數物件？ (Complex, add, sub, mul, div) (除法可以不寫，算加分題)

提示：第一題請參考本章內文

2 請寫出一個具有『加、減、內積、負』的向量物件？ (Vector, add, sub, dot, neg)

提示：第二題架構如下：

```javascript
class Vector {
  add(v2) { ... }
  sub(v2) { ... }
  dot(v2) { ... }
  neg() { ... }
}
```

3 請寫一組物件，包含《矩形、圓形》與抽象的形狀，每個物件都具有 area() 函數可以計算其面積？ (Shape.area(), Rectangle, Circle) 

提示：第三題架構如下：

```javascript
class Shape {
}

class Circle {
  constructor(radius) {...}
  area() { ... }
}

class Rectangle {
  constructor(width, height) {...}
  area() { ... }
}
```

4 請寫一組物件，包含『浮點數，有理數，複數』，這三個都繼承『數』這個物件，而且每個都具有 add, sub, mul, div, power 等成員函數！

提示：第四題的架構如下：

```javascript
class Number {
  power(n) {
    var p = this;
    for (var i=1; i<n; i++) {
      p = p.mul(this);
    }
    return p;
  }
}

class Float extends Number {
  add(o2) { ...}
  sub(o2) { ...}
  mul(o2) { ...}
  div(o2) { ...}
  toString() {... }
}

class Rational extends Number {
  add(o2) { ...}
  sub(o2) { ...}
  mul(o2) { ...}
  div(o2) { ...}
  toString() {... }
}

class Complex extends Number {
  add(o2) { ...}
  sub(o2) { ...}
  mul(o2) { ...}
  div(o2) { ...}
  toString() {... }
}
```

第四題不含有理數與浮點數，只有 Number 和 Complex 的版本如下：

```javascript
class Number {
    power(n) {
        var p = this;
        for (var i=1; i<n; i++) {
            p = p.mul(this);
        }
        return p;
    }
 }
 
 class Complex extends Number {
    constructor(r,i) {
        super(r,i);
        this.r = r; 
        this.i = i;
    }

    add(c2) {
        return new Complex(this.r+c2.r, this.i+c2.i);
    }
    
    sub(c2) {
        return new Complex(this.r-c2.r, this.i-c2.i);
    }
    
    mul(c2) {
        return new Complex(this.r*c2.r-this.i*c2.i, 
                           this.r*c2.i+this.i*c2.r);
    }
    toString() { 
        return this.r+"+"+this.i+"i" 
    }
}

var a=new Complex(1,2), b=new Complex(2,1);

var x = a.add(b).sub(b).mul(b);

console.log("a=%s", a);
console.log("b=%s", b);
console.log("a.add(b)=%s", a.add(b));
console.log("a.sub(b)=%s", a.sub(b));
console.log("a.mul(b)=%s", a.mul(b));
console.log("x=%s", x);

console.log("a.power(3)=%s", a.power(3));
```
