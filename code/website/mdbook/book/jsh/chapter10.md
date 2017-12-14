# 第 10 章 - 資料庫

## MongoDB 文件型 JSON 資料庫

### MongoDB -- 安裝與啟動

下載點: <https://www.mongodb.org/downloads>

下載完成後使用『下一步』大法即可完成安裝。

安裝完成之後，在 windows 下必須設定系統路徑，我的路徑在： 『C:\Program Files\MongoDB\Server\3.0\bin』 當中。

接著請啟動命令列，然後建立資料庫路徑 /db/mongodb/ ，接著輸入下列指令。

```
D:\db>mongod --dbpath /db/mongodb
```

此時 mongodb 伺服器就會啟動完成。

```
D:\db>mongo
MongoDB shell version: 3.0.2
connecting to: test
```

接著您就可以使用指令進行『新增/修改/刪除/查詢』了。

### 新增操作

參考： <http://www.w3cschool.cc/mongodb/mongodb-insert.html>

```javascript
> db.user.insert({user:"CCC", password:"123"})
WriteResult({ "nInserted" : 1 })
> db.user.find()
{ "_id" : ObjectId("55486b1327403e89a3cc397a"), "user" : "ccc", "password" : "123" }
> db.user.insert({user:"snoopy", password:"321"})
WriteResult({ "nInserted" : 1 })
> db.user.find()
{ "_id" : ObjectId("55486b1327403e89a3cc397a"), "user" : "ccc", "password" : "123" }
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" : "321" }
```

### 修改操作

參考： <http://www.w3cschool.cc/mongodb/mongodb-update.html>


```javascript
> db.user.update({"user":"snoopy"}, {"user":"snoopy", "password":"snoopy321"})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
> db.user.find()
{ "_id" : ObjectId("55486b1327403e89a3cc397a"), "user" : "ccc", "password" : "123" }
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" : "snoopy321" }
```

### 刪除操作

參考： <http://www.w3cschool.cc/mongodb/mongodb-remove.html>


```javascript
> db.user.find()
{ "_id" : ObjectId("55486b1327403e89a3cc397a"), "user" : "ccc", "password" : "123" }
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" : "snoopy321" }
> db.user.remove({user:"ccc"})
WriteResult({ "nRemoved" : 1 })
> db.user.find()
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" : "snoopy321" }
```

### 查詢操作

參考： <http://www.w3cschool.cc/mongodb/mongodb-update.html>


```javascript
> db.user.insert({user:"garfield", password:"cookie"})
WriteResult({ "nInserted" : 1 })
> db.user.find()
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" : "snoopy321" }
{ "_id" : ObjectId("55487d09434ed6d677f8454e"), "user" : "garfield", "password": "cookie" }
> db.user.find({user:"garfield"})
{ "_id" : ObjectId("55487d09434ed6d677f8454e"), "user" : "garfield", "password": "cookie" }
> db.user.find({user:"snoopy"})
{ "_id" : ObjectId("55487073434ed6d677f8454d"), "user" : "snoopy", "password" :"snoopy321" }
```

### 條件式查詢

參考： <http://www.w3cschool.cc/mongodb/mongodb-operators.html>

```javascript
> db.users.find({age :{$gt : 8}})
{ "_id" : ObjectId("55487ecd3c69cbdeba209fb3"), "name" : "ccc", "age" : 45, "password" : "321" }
{ "_id" : ObjectId("55487eed3c69cbdeba209fb5"), "name" : "garfield", "age" : 9,"password" : "garfield123" }
> db.users.find()
{ "_id" : ObjectId("55487ecd3c69cbdeba209fb3"), "name" : "ccc", "age" : 45, "password" : "321" }
{ "_id" : ObjectId("55487ede3c69cbdeba209fb4"), "name" : "snoopy", "age" : 5, "password" : "snoopy123" }
{ "_id" : ObjectId("55487eed3c69cbdeba209fb5"), "name" : "garfield", "age" : 9, "password" : "garfield123" }
> db.users.find().limit(2)
{ "_id" : ObjectId("55487ecd3c69cbdeba209fb3"), "name" : "ccc", "age" : 45, "password" : "321" }
{ "_id" : ObjectId("55487ede3c69cbdeba209fb4"), "name" : "snoopy", "age" : 5, "password" : "snoopy123" }
> db.users.find().limit(2).skip(1)
{ "_id" : ObjectId("55487ede3c69cbdeba209fb4"), "name" : "snoopy", "age" : 5, "password" : "snoopy123" }
{ "_id" : ObjectId("55487eed3c69cbdeba209fb5"), "name" : "garfield", "age" : 9,"password" : "garfield123" }
```

### 排序與索引

```javascript
> db.users.find().sort({age:1})
{ "_id" : ObjectId("55487ede3c69cbdeba209fb4"), "name" : "snoopy", "age" : 5, "password" : "snoopy123" }
{ "_id" : ObjectId("55487eed3c69cbdeba209fb5"), "name" : "garfield", "age" : 9,"password" : "garfield123" }
{ "_id" : ObjectId("55487ecd3c69cbdeba209fb3"), "name" : "ccc", "age" : 45, "password" : "321" }
> db.users.find().sort({age:-1})
{ "_id" : ObjectId("55487ecd3c69cbdeba209fb3"), "name" : "ccc", "age" : 45, "password" : "321" }
{ "_id" : ObjectId("55487eed3c69cbdeba209fb5"), "name" : "garfield", "age" : 9,"password" : "garfield123" }
{ "_id" : ObjectId("55487ede3c69cbdeba209fb4"), "name" : "snoopy", "age" : 5, "password" : "snoopy123" }
> db.users.ensureIndex({name:1})
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}
```

### 離開

```javascript
> quit()

D:\db>
```

### 日期與時間操作

```
> db.filelog.insert({path:'wd.html', time:new Date()})
WriteResult({ "nInserted" : 1 })
> db.filelog.find()
{ "_id" : ObjectId("571d78c179eb77457f34a8b5"), "path" : "wd.html", "time" : ISO
Date("2016-04-25T01:54:09.026Z") }
>

```

## 使用程式存取 MongoDB

您若要在 node.js 當中存取 mongoDB 的資料，必須先用 npm 安裝 mongoDB 的套件。

```
npm install mongodb
```

### 程式範例: mongotest.js

參考： <https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html>


```javascript
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/examdb", function(err, db) {
  if(err) { return console.dir(err); }

  var collection = db.collection('Q');
  var docs = [{ type:"word", q:"he=他"}, { type:"word", q:"she=她"}, { type:"word", q:"it=它"} ];

  collection.insert(docs, {w:1}, function(err, result) { // success!

    collection.find().toArray(function(err, items) {
        console.log("items=%j", items);
        db.close();
    });
  });
});
```

執行結果：

```
nqu-192-168-61-142:KoaExam mac020$ node mongotest
items=[{"_id":"5716e82ea6c866eb02ffe700","type":"word","q":"he=他"},{"_id":"5716e82ea6c866eb02ffe701","type":"word","q":"she=她"},{"_id":"5716e82ea6c866eb02ffe702","type":"word","q":"it=它"}]
```

### 採用 yield 的寫法

檔案： comongotest.js

```
var co = require("co");

var MongoClient = require('mongodb').MongoClient;

co(function*() {
  var db = yield MongoClient.connect('mongodb://localhost:27017/examdb');
  var collection = db.collection('Q');
  var result = yield collection.insertMany([{ type:"word", q:"he=他"}, { type:"word", q:"she=她"}, { type:"word", q:"it=它"} ], {w:1});
  var items = yield collection.find().toArray();
  console.log("items=%j", items);
  var result = yield db.close();
});

```

執行結果

```
NQU-192-168-60-101:js csienqu$ node comongotest
items=[{"_id":"57201788d3c8212f034d9479","type":"word","q":"he=他"},{"_id":"57201788d3c8212f034d947a","type":"word","q":"she=她"},{"_id":"57201788d3c8212f034d947b","type":"word","q":"it=它"}]

```

## 習題
1. 請安裝好 mongodb 資料庫，並用 mongod 啟動伺服器之後，用 mongo 指令開始新增資料，並且玩玩資料庫《新增、修改、刪除、查詢》的動作，直到你能熟練地進行這些操作為止。
2. 請建立一個自己想要用的資料庫 (像是通訊錄、字典....)等等，然後用編輯器(像是 notepad++) 編寫一堆資料後，寫程式將資料倒進該資料庫中！

