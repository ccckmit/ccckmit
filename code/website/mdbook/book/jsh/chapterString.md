# 字串

## 簡介

javascript 語言中的字串，基本上您可以想像為一個《字元陣列》，但必須注意的是，字串和陣列還是有少許不同的，例如字串裏就沒有 push 這個函數，但是卻有 substr 這樣的字串函數。

接著、還是讓我們用交談的方式，先練習一下字串的操作方式！

### 字串操作

```
$ node
> x = "hello"
'hello'
> x.length
5
> x[3]
'l'
> x[2]
'l'
> x[1]
'e'
> x[0]
'h'
> x[5]
undefined
> x[4]
'o'
> x=x+" world" // 字串可以用 + 號進行連接 (請注意 + 號對字串和數值有不同的意義，如果您將 "3"+"4" 會得到 "34"，而不是 7)。
'hello world'
> x
'hello world'
>
```

### 字串函數

javascript 的字串有兩個函數可以用來取出子字串，一個是 substr, 另一個是 substring, 這兩個函數的第二個參數意義不同，其函數規格如下所示：

```
str.substr(start[, length]) : 第二個參數是長度
str.substring(indexStart[, indexEnd]) : 第二個參數是結尾的位置
```

字串操作：

```
> x = "0123456789"
'0123456789'
> x.substr(3,2) // 從第 3 個開始取出長度為 2 的子字串。
'34'
> x.substr(4,5) // 從第 4 個開始取出長度為 5 的子字串。
'45678'
> x.substring(3,7) // 取出從第 3 個開始到第 7 個之前的子字串。(不包含第 7 個)
'3456'
> x.substring(3,9)) // 取出從第 3 個開始到第 9 個之前的子字串。(不包含第 9 個)
'345678'
> x.length  // 取出字串 x 的長度
10
> s = "abCDEfg" // 設定 s 字串
'abCDEfg'
> s.toUpperCase() // 把 s 轉大寫後傳回
'ABCDEFG'
> s.toLowerCase() // 把 s 轉小寫後傳回
'abcdefg'
> y = "     abc      " // y 是一個有前後空白的字串
'     abc      '
> y.trim() // trim() 會把前後的空白去掉
'abc'
> s            // 雖然做了轉大小寫的動作，但是不會改變 s 的值。
'abCDEfg'
> s.concat(y) // 將 s 和 y 進行連接
'abCDEfg     abc      '
> s.charAt(5) // 取出第 5 個字元
'f'
> s.charCodeAt(5) // 取出第 5 個字元的 unicode 代碼
102
> s.charCodeAt(0) // 取出第 0 個字元的 unicode 代碼
97
> s.charAt(0) // 取出第 0 個字元
'a'
> s.slice(3) // 切出第 3 個之後的內容
'DEfg'
```

## 模板字符串

檔案：Es6ReplyHtml.js

```javascript
var reply = {_id: '111reply1', user: 'ccc', msg: 'aaaaaaa', date: '20170305'}
var postId = '111'
var user = 'ccc'

var replyHtml = function (user, poseId, reply) {
  var replyOp = (reply.user === user) ? `<i class="fa fa-times" title="delete" onclick="SMS.deleteReply('${postId}','${reply._id}')"></i>` : ``

  return `
<div id="reply${reply._id}" class="reply">
  <div contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('${postId}', '${reply._id}', this.innerText)">${reply.msg}</div>
  <div style="float:right">
    <i class="fa fa-user" title="Author"></i>
    <a href="/view/${reply.user}">${reply.user}</a>
    ${replyOp}
    <i class="fa fa-clock-o" title="${reply.date}"></i>
  </div>
</div>
`
}

console.log(replyHtml(user, postId, reply))
```

執行結果：

```
D:\Dropbox\DigitalOcean\mdbook\test>node Es6ReplyHtml.js

<div id="reply111reply1" class="reply">
  <div contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('111', '111reply1', t
his.innerText)">aaaaaaa</div>
  <div style="float:right">
    <i class="fa fa-user" title="Author"></i>
    <a href="/view/ccc">ccc</a>
    <i class="fa fa-times" title="delete" onclick="SMS.deleteReply('111','111reply1')"></i>
    <i class="fa fa-clock-o" title="20170305"></i>
  </div>
</div>
```

* 參考 -- <http://es6.ruanyifeng.com/#docs/string#模板字符串>

領悟到ES6 的模板字符串的妙用之後，開始可以理解為何所有的 node.js 樣板引擎都可以丟掉了。
關鍵是，要改用 javascript 的角度寫程式，不要再用 HTML + <%=... %> 或 {{ ... }} 的想法寫程式了。

甚至、我有點懷疑，ES6 的模板字符串出現之後，那個原本 React.js 常用的 JSX 應該也可以不要了，關鍵是要採用 javascript 程式的角度去思考模板的用法，而不是用 HTML 的角度！


## 字串處理習題
1. 請判斷一個字串是否是一個迴文？ 
    * 範例： palindrome("abcba") => true
2. 請將輸入的字串翻轉？ 
    * 範例 reverse("abcde") => "edcba"
3. 請輸出某二進位字串的偶校驗位元 (parity bit) 
    * 範例： evenParity("1010001") => 1
4. 請輸出某二進位字串的1補數
    * 範例： complement1("10101010") => "01010101"
5. 請寫一個程式檢查數學是中的括號是否合法？ 
    * 範例： `isPaired("(a+3)*5/7)))*8") => false`
