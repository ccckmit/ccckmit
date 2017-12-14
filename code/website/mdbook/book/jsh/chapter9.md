# 第 9 章 - 檔案與輸出入


由於 JavaScript 語言一開始是內嵌在《網頁》裡面使用的，所以《預設函式庫》裏沒有檔案輸出入的功能，但是 node.js 系統裏提供了很多檔案相關的功能可以使用。

接下來這段解釋我們用了很多專有名詞，如果看不懂也沒關係，看不懂就把它當成《克林貢外星語》直接跳過好了！

> Node.js 的檔案輸出入設計非常的特別，這是因為 node.js 一開始就希望能夠作為有效率的 server 程式框架，因此檔案輸出入通常都採用《非同步》(non synchronize) 的模式，這種方式通常採用《非阻斷》(non blocking) 的執行法，然後大量利用《回呼函數》(callback function) 的方式呼叫，這種方法可以不需要採用《線程》(執行緒, thread) 或《多行程》(multiprocess) 就可以非常有效的扮演好 server 的角色，但是卻付出了對應的代價，那就是程式碼會變得很難看。
> 
> 還好很多技術可以讓你稍微緩解《這種由回乎所造成的程式碼難看問題》，像是 async、promise、yield/generator 等等
> 
> 如果你真的不想用回呼版本的呼叫， node.js 裏也通常提供了《同步》(synchronous) 版本，只是該版本的函數名稱會比較長，而且會因為《阻斷性呼叫》(blocking) 而造成效能上的問題而已，這對初學者而言，有時候是可以接受的。

講了這麼多《克林貢外星語》，還是讓我們真正來看一些程式好了，等看完程式之後，你再回過頭來看這段描述，可能就比較能理解了！

### 檔案讀取

檔案：readfile.js

```javascript
var fs = require('fs'); // 引用檔案物件
var data = fs.readFileSync(process.argv[2], "utf8"); // 讀取檔案
console.log(data); // 顯示在螢幕上
```

### 檔案讀取 (非阻斷回呼型)

檔案： readfileCallback.js

```javascript
var fs = require('fs'); // 引用檔案物件
fs.readFile(process.argv[2], "utf8", function(err, data) {
  console.log("data="+data);
});
console.log("----readFile End-----"); // 顯示在螢幕上
```

### 檔案寫入

檔案：copyfile.js

```javascript
var fs = require('fs');
var data = fs.readFileSync(process.argv[2]);
console.log(data);
fs.writeFileSync(process.argv[3], data);
```

### 檔案寫入 (非阻斷回呼型)


檔案：copyfileCallback.js

```javascript
var fs = require('fs');
fs.readFile("copyfileCallback.js", "utf8", function(err, data) {
  console.log('讀取完成！');
  fs.writeFile("copyfileCallback.js2",  data, function(err) {
    console.log('寫入完成!');
  });
});
```

## 多層回呼

檔案：copyfile2.js

```javascript
var fs = require('fs');
var data = fs.readFileSync('copyfile2.js');
console.log("=======copyfile.js========");
console.log(data.toString());
fs.writeFileSync("copyfile2.js2", data);
var data2 = fs.readFileSync("copyfile2.js2");
console.log("=======copyfile2.js========");
console.log(data.toString());
fs.writeFileSync("copyfile2.js3", data);
```

檔案：copyfileCallback2.js

```javascript
var fs = require('fs');
fs.readFile("copyfileCallback2.js", "utf8", function(err, data) {
  console.log('讀取完成!');
  fs.writeFile("copyfileCallback2.js2",  data, function(err) {
    console.log('寫入完成!');
    fs.readFile("copyfileCallback2.js2", "utf8", function(err, data) {
      console.log('又讀取完成 !');
      fs.writeFile("copyfileCallback2.js3",  data, function(err) {
        console.log('又寫入完成!');
      });
    });
  });
});
```

執行結果

```
D:\Dropbox\cccwd2\file\jsh\code\file>node copyfileCallback2.js
讀取完成!
寫入完成!
又讀取完成 !
又寫入完成!
```

### 使用 yield 避免多層式回呼

檔案： copyfileYield2.js

```
var fs = require('mz/fs');
var co = require('co');

co(function*() {
  var data1=yield fs.readFile("copyfileYield2.js", "utf8");
  console.log('讀取完成!');
  yield fs.writeFile("copyfileYield2.js2", data1);
  console.log('寫入完成!');
  var data2 = yield fs.readFile("copyfileYield2.js2", "utf8");
  console.log('又讀取完成 !');
  yield fs.writeFile("copyfileYield2.js3", data2);
  console.log('又寫入完成!');
});

```


執行本範例前必須先安裝 co 與 mz 套件

執行結果

```
D:\Dropbox\cccwd2\file\jsh\code\file>npm install co
D:\Dropbox\cccwd2\file\jsh\code\file>npm install mz
D:\Dropbox\cccwd2\file\jsh\code\file>node copyfileYield2
讀取完成!
寫入完成!
又讀取完成 !
又寫入完成!
```

## 使用 Async 避免多層回呼

檔案： copyFileAsync2.js

```javascript
var fs = require('fs');
var async = require('async');
var text = null;

async.series([
  function(callback) {
    fs.readFile("copyfileAsync2.js", "utf8", function(err, data) { 
      console.log('讀取完成!!');
			text = data;
      callback();
    })
  },
  function(callback) {
    fs.writeFile("copyfileAsync2.js2",  text, function(err) {
      console.log('寫入完成!');
      callback();
    })
  },
  function(callback) {
    fs.readFile("copyfileAsync2.js2", "utf8", function(err, data) {
      console.log('又讀取完成 !');
			text = data;
      callback();
    })
  },
  function(callback) {
    fs.writeFile("copyfileAsync2.js3",  text, function(err) {
      console.log('又寫入完成!');
      callback();
    })
  }
], function done() {
  console.log('全部完成！');
});
```

執行本範例前必須先安裝 async 套件！

執行結果

```
D:\Dropbox\cccwd2\file\jsh\code\file>npm install async
D:\Dropbox\cccwd2\file\jsh\code\file>node copyfileAsync2.js
讀取完成!!
寫入完成!
又讀取完成 !
又寫入完成!
全部完成！
```

### 從鍵盤讀取輸入

參考 -- <http://nodejs.org/api/readline.html>

檔案：readline.js (讀取一行)

```
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What do you think of node.js? ", function(answer) {
  // TODO: Log the answer in a database
  console.log("Thank you for your valuable feedback:", answer);

  rl.close();
});
```

檔案：readloop.js (讀取很多行)

```
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log('Say what? I might have heard `' + line.trim() + '`');
      break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});
```

## 習題
1. 請設計一個程式，可以印出某資料夾中的所有檔案名稱。例如：
    * $ node listdir.js somedir
    * 這樣就會印出 somedir 中的所有檔案。
2. 請設計一個程式，可以把指定資料夾複製一份，到目標資料夾當中。例如：
    * $ node copydir.js fromdir todir
    * 這樣就會把 fromdir 內的所有內容，複製到 todir 當中
3. 請設計一個像 node shell 的交談環境程式

解答：

```js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  try {
    console.log(eval(line));
  } catch (e) {
    console.error(e.stack);
  }
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
```





