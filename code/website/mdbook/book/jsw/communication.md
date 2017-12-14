# 第 7 章 -- 前後端通訊

設計網站時，前後端通訊的方法，主要有三種技術。

1. 採用傳統的表單，用 Get/Post 的方式傳遞。
2. 採用 AJAX 的方式，用 Get/Post/Add/Remove 的方式傳遞 (其中一種很有系統化的方式稱為 REST)。
3. 採用 WebSocket 的方式，連線後雙方都可以隨時互傳訊息。

## 採用表單方式的通訊範例

採用表單傳遞訊息的範例請參考 Koa 當中的 Blog 範例，其中的 new 功能就有用表單：

* <https://github.com/ccckmit/f6/tree/master/web/ex4-blogInServer>

程式碼：前端發送部分 -- <https://github.com/koajs/examples/blob/master/blog/views/new.html>

```js
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="Title" name="title"></p>
    <p><textarea placeholder="Contents" name="body"><` + `/textarea></p>
    <p><input type="submit" value="Create"></p>
  </form>
```

程式碼：後端接收部分 -- <https://github.com/koajs/examples/blob/master/blog/app.js>

```js
router
  .get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .post('/post', create)
...

async function create (ctx) {
  var post = ctx.request.body
  var id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
  ctx.redirect('/')
}
```

由於 koa 已經更新到 2.0 並支持 async/await 的語法，因此我為 koa 做了一些新的範例，請參考 f6 專案。

* <https://github.com/ccckmit/f6>

以下是另外幾篇相關的文章僅供參考！

* [A Simple CRUD Demo with Koa.js](https://weblogs.asp.net/shijuvarghese/a-simple-crud-demo-with-koa-js)

* [Creating and Handling Forms in Node.js](https://www.sitepoint.com/creating-and-handling-forms-in-node-js/)

## 採用 AJAX 方式的通訊範例

和上面使用表單的 post/get 方式類似，我們可以透過 JavaScript 來送出訊息給 Server 端並接收回應，這種《傳送/接收》方式，稱為 [AJAX](https://zh.wikipedia.org/wiki/AJAX) (Asynchronous JavaScript and XML, 非同步的JavaScript與XML技術)。

前端工程師常用兩種方法來《傳送/接收》 AJAX post/get 訊息，一種是使用 jQuery 套件，另一種是不依賴 jQuery，而是直接採用原生的瀏覽器 JavaScript API (被戲稱為 Vanilla.js) 。

使用 jQuery 的 post 程式碼：

```js
<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script>
$.ajax({
  type: 'POST',
  url: "path/to/api",
  data: "banana=yellow",
  success: function (data) {
    alert("Success: " + data);
  },
});
</script>
```

使用原生的 JavaScript API 的 post 程式碼：

```js
var r = new XMLHttpRequest();
r.open("POST", "path/to/api", true);
r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  alert("Success: " + r.responseText);
};
r.send("banana=yellow");
```

如果您想了解完整的 AJAX 範例，可以參考 f6 當中的程式碼

* 前端 -- <https://github.com/ccckmit/f6/blob/master/web/ex5-blogInAjax/main.js>
* 後端 -- <https://github.com/ccckmit/f6/blob/master/web/ex5-blogInAjax/server.js>

重要程式碼：

前端: https://github.com/ccckmit/f6/blob/master/web/ex5-blogInAjax/server.js

```
var Koa = require('koa')
var Router = require('koa-router')
var logger = require('koa-logger')
var koaStatic = require('koa-static')
var bodyParser = require('koa-bodyparser')

var app = new Koa()
var router = new Router()

app.use(bodyParser())

var posts = []

app.use(logger())

router
  .get('/', listPosts)
  .get('/post/:id', getPost)
  .post('/post', createPost)

async function listPosts (ctx) {
  ctx.body = JSON.stringify(posts)
}

async function getPost (ctx) {
  var id = parseInt(ctx.params.id)
  console.log('getpost: id=%d posts=%j', id, posts)
  var post = posts[id]
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await JSON.stringify(post)
}

async function createPost (ctx) {
  console.log('createPost:rawBody=%s', ctx.request.rawBody)
  console.log('createPost:body=%j', ctx.request.body)
  var post = ctx.request.body
  var id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
  ctx.body = JSON.stringify(post)
}

app.use(router.routes()).use(koaStatic('../')).listen(3000)
```

client : <https://github.com/ccckmit/f6/blob/master/web/ex5-blogInAjax/main.js>

```js
var content, title
// var posts = []

async function main () {
  f6.route(/^$/, list)
    .route(/^post\/new/, add)
    .route(/^post\/(\w+?)/, show)
    .route(/^post/, create)
  await f6.onload(init)
}

function init() {
  title = f6.one('title')
  content = f6.one('#content')
}

async function add () {
  title.innerHTML = 'New Post'
  content.innerHTML = `
  <h1>New Post</h1>
  <p>Create a new post.</p>
  <form>
    <p><input id="addTitle" type="text" placeholder="Title" name="title"></p>
    <p><textarea id="addBody" placeholder="Contents" name="body"></textarea></p>
    <p><input type="button" value="Create" onclick="create()"></p>
  </form>
  `
}

async function create () {
  var post = {
    title: f6.one('#addTitle').value,
    body: f6.one('#addBody').value,
    created_at: new Date()
  }
  console.log(`create:post=${JSON.stringify(post)}`)
  await f6.ojax({method: 'POST', url: '/post'}, post)
//  posts.push(post)
  f6.go('') // list #
}

async function show (m) {
  var id = parseInt(m[1])
  var post = await f6.ojax({method: 'GET', url: `/post/${id}`})
//  var post = posts[id]
  content.innerHTML = `
  <h1>${post.title}</h1>
  <p>${post.body}</p>
  `
}

async function list () {
  var posts = await f6.ojax({method: 'GET', url: '/'})
  title.innerHTML = 'Posts'
  content.innerHTML =
  `<h1>Posts</h1>
  <p>You have <strong>${posts.length}</strong> posts!</p>
  <p><a href="#post/new">Create a Post</a></p>
  <ul id="posts">
    ${posts.map(post => `
      <li>
        <h2>${post.title}</h2>
        <p><a href="#post/${post.id}">Read post</a></p>
      </li>
    `).join('\n')}
  </ul>
  `
}

main()
```


## 採用 WebSocket 方式的通訊範例

Node.js 的 socket.io 套件是對 WebSocket 通訊方式的一個易學易用包裝。

Socket.io 最簡單的入門範例是一個聊天室，請參考下列文章瞭解如何寫一個聊天室。

* <http://socket.io/get-started/chat/>

重要程式碼片段：

前端：

```
<script src="/socket.io/socket.io.js"></script>
<script src="https://code.jquery.com/jquery-1.11.1.js"></script>
<script>
  $(function () {
    var socket = io();
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });
  });
</script>
```

後端：

```
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});
```

執行結果：

* 影片 -- <https://i.cloudup.com/transcoded/zboNrGSsai.mp4>

Socket.io 的官網裡有更多的應用範例，請用 git clone 下載 Socket.io 後執行其中的以下範例：

* <https://github.com/socketio/socket.io/tree/master/examples>

我建議大家仔細看其中兩個範例，一個是聊天室 chat (更完整版)，另一個是畫板 whiteboard 。

* <https://github.com/socketio/socket.io/tree/master/examples/chat>
* <https://github.com/socketio/socket.io/tree/master/examples/whiteboard>

然後透過這些範例進一步學習更多的 socket.io 使用方式。

# reference

* [Depricated Version](communicationOld.md)
