# 第 5 章 - 字典與 JSON

## 字典

雖然 JavaScript 的語法很像 C 語言，但是 JavaScript 本質上仍然是個動態語言，其特性比較像 Python、 Ruby 等語言，因此預設就有提供更高階的資料結構，其中最重要的一個就是字典 (dictonary)，字典中的基本元素是 (key, value) 的配對，我們只要將 key 傳入就可以取得 value 的値，以下是一個 JavaScript 的字典範例。

檔案：dict.js

```javascript
var dict={ name:"john", age:30 };

dict["email"] = "john@gmail.com";
dict.tel = "02-12345678";

for (var key in dict) {
  console.log("key=", key, " value=", dict[key]);
}

console.log("age=", dict.age);
console.log("birthday=", dict["birthday"]);
```

執行結果

```
D:\js\code>node dict.js
key= name  value= john
key= age  value= 30
key= email  value= john@gmail.com
key= tel  value= 02-12345678
age= 30
birthday= undefined
```

### 單層結構

```
nqu-192-168-61-142:code mac020$ node
> d={ dog:"狗", cat:"貓", a: "一隻", chase:"追", eat:"吃" };
{ dog: '狗', cat: '貓', a: '一隻', chase: '追', eat: '吃' }
> d.dog
'狗'
> d.eat
'吃'
> d.x
undefined
> d.snoopy
undefined
> d["dog"]
'狗'
> d["x"]
undefined
> d
{ dog: '狗', cat: '貓', a: '一隻', chase: '追', eat: '吃' }
> d["狗"]
undefined
> 

```

### 多層結構

```
> t={ dog:{ name:"Snoopy", age:3}, 
... cat:{ name:"Garfield", age:5}
... }
{ dog: { name: 'Snoopy', age: 3 },
  cat: { name: 'Garfield', age: 5 } }
> t
{ dog: { name: 'Snoopy', age: 3 },
  cat: { name: 'Garfield', age: 5 } }
> t.dog
{ name: 'Snoopy', age: 3 }
> t.cat
{ name: 'Garfield', age: 5 }
> t.dog.name
'Snoopy'
> t.dog.age
3
> t.cat.name
'Garfield'
> t.cat.age
5
> t.cat.tel
undefined
> 
```

接著新增 t.man 這個欄位

```
> t.man={name:"ccc", friends:[ t.dog, t.cat]}
{ name: 'ccc',
  friends: [ { name: 'Snoopy', age: 3 }, { name: 'Garfield', age: 5 } ] }
> t
{ dog: { name: 'Snoopy', age: 3 },
  cat: { name: 'Garfield', age: 5 },
  man: { name: 'ccc', friends: [ [Object], [Object] ] } }
> t.man.friends[0]
{ name: 'Snoopy', age: 3 }
> t.man.friends[1]
{ name: 'Garfield', age: 5 }
> t.man.friends[2]
undefined
> 
```


### 查字典程式

檔案： dlook.js

```
var e2c = { dog:"狗", cat:"貓", a: "一隻", chase:"追", eat:"吃" };

function look(e) {
  return e2c[e];
}

e = process.argv[2]; // 從 process.argv 這個陣列取出第二個元素
c = look(e);
console.log(e+"="+c); 
```

執行結果

```
nqu-192-168-61-142:code mac020$ node dlook.js cat
cat=貓
nqu-192-168-61-142:code mac020$ node dlook.js snoopy
snoopy=undefined
```

### 翻譯系統 (簡易英翻中)

執行結果

```
$ node e2c a dog chase a cat
[ '一隻', '狗', '追', '一隻', '貓' ]
```

程式碼

```javascript
var e2c = { dog:"狗", cat:"貓", a: "一隻", chase:"追", eat:"吃" };

function mt(e) {
  var c = [];
  for (i in e) {
    var eword = e[i];
    var cword = e2c[eword];
    c.push(cword);
  }
  return c;
}

var c = mt(process.argv.slice(2));
console.log(c);
```

執行結果：

```
$ node e2c.js a dog
[ '一隻', '狗' ]
$ node e2c.js a dog chase a cat
[ '一隻', '狗', '追', '一隻', '貓' ]
$ node e2c.js a dog chase a car
[ '一隻', '狗', '追', '一隻', undefined ]
```

補充說明：請注意上面的 e2c[eword] 這一行不能改用 e2c.eword, 原因是 e2c.eword 是在查詢 eword 這個詞，也就是 e2c['eword'] 的意思，上面範例中e2c['eword']  會是 undefined。

e2c[eword] 才是在查詢像 e2c['dog'] 這樣的內容。

請看下列的示範：

```
> var e2c = { dog:"狗", cat:"貓", a: "一隻", chase:"追", eat:"吃" };
undefined
> e2c
{ dog: '狗', cat: '貓', a: '一隻', chase: '追', eat: '吃' }
> e2c.eword
undefined
> var eword='dog'
undefined
> eword
'dog'
> e2c.eword
undefined
> e2c['dog']
'狗'
> e2c[eword]
'狗'
```


## JSON 物件交換格式

如果我們想直接在程式中宣告一個複雜的物件，可以使用 JavaScript 中的 {...} 與 [...] 的語法組合，用簡單的語法建構出整個物件。這種格式也常被用在網頁程式的資料交換當中，因此有一個很特別的名稱叫 JSON （Javascript Object Notation）。

目前網路上最常使用的資料交換格式是 XML，但是 XML 文件很繁瑣且囉嗦，讓使用者撰寫不方便，而且不容易嵌入網頁中進行處理。為了讓網頁上的共通程式語言 JavaScript 可以輕易的交換資料，網頁程式的設計者也常用 JSON 取代 XML 進行資料交換。

以下是一個採用 JSON 格式的朋友資料範例，該範例中有兩個朋友，一個是 John, 22 歲，另一個是 Mary, 28 歲。

```JavaScript
{
  "friends": [
     {"name": "John", "age": 22 }
     {"name": "Mary", "age": 28 }
  ]
}
```

程式範例：json.js

```javascript
var george = {
  "name": "George",
  "age": 25,
  "friends": [
     {"name": "John", "age": 22 },
     {"name": "Mary", "age": 28 }
  ]
};

console.log("george.age="+george.age);
console.log("george.friends:");
var friends = george.friends;
for (i in friends)
  console.log("    "+friends[i].name+" is "+friends[i].age+"years old!");
```

執行結果

```
nqu-192-168-61-142:code mac020$ node json
george.age=25
george.friends:
    John is 22years old!
    Mary is 28years old!
```

## JSON 的宣告

在 javascript 當中，物件是整個系統的核心結構，幾乎整個javascript語言都是建構在物件之上的。

javascript的物件用大括號表示，所以我們可以用下列語法建立一個名為 person 的空物件,然後放一些欄位進去。

```javascript
var person = {};
person.name = "ccc";
person.email = "ccckmit@gmail.com";
```

我們也可以用更簡潔的方式表達上述的物件,如下所示:

```javascript
var person = { name:"ccc", email:"ccckmit@gmail.com" };
```

由於物件的宣告是這麼的簡單，所以我們可以直接在 node 的交談界面中建立物件並輕易的進行操作。

```javascript
ccc@ccc-CP1130:~$ node
> x={};
{}
> person={};
{}
> person.name="ccc";
'ccc'
> person.email="ccckmit@gmail.com"
'ccckmit@gmail.com'
> person
{ name: 'ccc', email: 'ccckmit@gmail.com' }
> p=person
{ name: 'ccc', email: 'ccckmit@gmail.com' }
> p
{ name: 'ccc', email: 'ccckmit@gmail.com' }
ccc email=ccckmit@gmail.com
undefined
> p.age = 45
45
> p
{ name: 'ccc',
  email: 'ccckmit@gmail.com',
  age: 45 }
> 
```

您可以看到我們在上述操作中建立了person物件,然後設定name與email欄位。

上述的操作是逐步加入欄位，其實我們也可以在建立物件時就將欄位全部放進去，只是要採用 `:` 符號將欄位名稱與內容隔開,這種格式稱為JSON格式,以下是一個範例。

```javascript
> p2 = { name:"john", email:"john@gmail.com", age:20 }
{ name: 'john',
  email: 'john@gmail.com',
  age: 20 }
```

我們也可以將欄位設定為其他物件，

```javascript
> p2.friend = p
{ name: 'ccc',
  email: 'ccckmit@gmail.com',
  print: [Function],
  age: 45 }
> p2
{ name: 'john',
  email: 'john@gmail.com',
  age: 20,
  friend: 
   { name: 'ccc',
     email: 'ccckmit@gmail.com',
     print: [Function],
     age: 45 } }
> 
```

當然、朋友只有一個的話，真的太孤單了，所以我們應該加一個型態為陣列的 friends 欄位，讓john有很多個朋友，而不是只有一個朋友，於是我們進行修正操作如下。

```javascript
> p2.friends = [ p ]
[ { name: 'ccc',
    email: 'ccckmit@gmail.com',
    print: [Function],
    age: 45 } ]
> p2
{ name: 'john',
  email: 'john@gmail.com',
  age: 20,
  friend: 
   { name: 'ccc',
     email: 'ccckmit@gmail.com',
     age: 45 },
  friends: 
   [ { name: 'ccc',
       email: 'ccckmit@gmail.com',
       age: 45 } ] }
> delete p2.friend
true
> p2
{ name: 'john',
  email: 'john@gmail.com',
  age: 20,
  friends: 
   [ { name: 'ccc',
       email: 'ccckmit@gmail.com',
       age: 45 } ] }
> p3={name:"mary", age:18}
{ name: 'mary', age: 18 }
> p2.friends.push(p3)
2
```

接著，當我們打入 p2 這個變數名稱之後，node交談界面會印出如下結果。

```javascript
> p2
{ name: 'john',
  email: 'john@gmail.com',
  age: 20,
  friends: 
   [ { name: 'ccc',
       email: 'ccckmit@gmail.com',
       age: 45 },
     { name: 'mary', age: 18 } ] }
> 
```

有關 JSON物件的語法格式，請參考下列網站。

* <http://www.json.org/>

我們可以用 JSON 進行資料交換，方法是用 JSON.stringfy 函數將物件轉成字串，對方收到後再用 JSON.parse 將字串轉回物件就可以了。以下是一個範例：

```javascript
> var george = {
...   "name": "George",
...   "age": 25,
...   "friends": [
...      {"name": "John", "age": 22 },
...      {"name": "Mary", "age": 28 }
...   ]
... }
undefined
> george
{ name: 'George',
  age: 25,
  friends: [ { name: 'John', age: 22 }, { name: 'Mary', age: 28 } ] }
> JSON.stringify(george)
'{"name":"George","age":25,"friends":[{"name":"John","age":22},{"name":"Mary","age":28}]}'
> var gstr = JSON.stringify(george)
undefined
> gstr
'{"name":"George","age":25,"friends":[{"name":"John","age":22},{"name":"Mary","age":28}]}'
> var g2 = JSON.parse(gstr)
undefined
> g2
{ name: 'George',
  age: 25,
  friends: [ { name: 'John', age: 22 }, { name: 'Mary', age: 28 } ] }
> 

```

## 結語

在本文中，我們介紹了 JavaScript 中的「物件與JSON格式」等觀念，您可以看到javascript的物件表達非常的簡單。

但有個小問題是，一般物件導向語言裡的類別 (class) 概念，在這裡好像沒有提到，如果您心中泛起了這樣的疑問，代表您對物件導向已經有相當的概念了。不過，javascript的物件導向與 java, C#, C++ 等語言很不相同，因為 javascript 採用了原型 (prototype) 這種物件導向的實作方式，這種方式很有彈性，但對已經學過 java, C#, C++ 等物件導向語言的人來說，可以說是非常的詭異，我們將在下一章當中介紹 javascript 這種基於原型的物件導向設計！

## 習題

1. 請設計一個通訊錄查詢程式 plook.js 可以用來查詢通訊錄，舉例而言：
    * $ node plook 陳鍾誠
    * 姓名： 陳鍾誠
    * 年齡： 46
    * 電話： 082313534
    * email : ccckmit@gmail.com
    * $ node plook 張曉芳
    * 查不到！
2. 請將本章中的《英翻中》系統，改成《中翻英》系統，但輸入的中文詞彙之間可以強制用空白隔開。例如:
    * $ node mt2.js 一隻 狗 追 一隻 貓
    * [ 'a', 'dog', 'chase', 'a', 'cat' ]
3. 接續上一題，同樣寫一個《中翻英系統》，但是中文詞彙之間不再有空白隔開，你必須從用字典去檢查那些是詞彙，並進行斷詞。(方法可以從 4字詞、3字詞、2字詞、1字詞由長到短一路檢查下來，如果發現字典裏有就進行斷詞與翻譯動作)，例如：
    * $ node c2e.js 一隻狗追一隻貓
    * a dog chase a cat

## 教學影片

| 教學 | 主題  | 影片  |
|--------|-------|----|
| 習題 | [字典查詢程式 -- dlook.js](dloo.mdk)  | [影片](https://youtu.be/fOP6tuC5bgs) |
| 習題 | [通訊錄查詢 -- plook.js](plook.md)  | [影片](https://youtu.be/3HEVe0-nq84) |
| 習題 | [英翻中系統 -- mt.js](mt.md)  | [影片](https://youtu.be/6s9tAm7Mnag) |
| 習題 | [英中互翻系統 -- mt2.js](mt2.md)  | [影片](https://youtu.be/5KXUAfSBu6g) |
| 習題 | [中翻英系統 -- c2e.js, c2e2.js](c2e.md) | [影片](https://youtu.be/WE-xZjayVLA) |
