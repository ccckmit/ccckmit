var fs = require('mz/fs')
// var co = require('co')
var logger = require('koa-logger')
var koaStatic = require('koa-static')
var cobody = require('co-body')
// var bodyParser = require('koa-bodyparser') // 不能用 ，因為不支援檔案上傳 multipart
var asyncBusboy = require('async-busboy')
var path = require('path')
var session = require('koa-session')
var aslk = require('aslk')
var M = require('./lib/model')
var V = require('./lib/view')
var Koa = require('koa')
var Router = require('koa-router')

var app = new Koa()
var router = new Router()

var response = function (self, code, msg) {
//  var msgMt = msg
//  var res = self.response
//  res.status = code
//  res.set({'Content-Length': '' + msgMt.length, 'Content-Type': 'text/plain'})
  self.body = JSON.stringify(msg)
}

var isPass = function (self) {
  return typeof self.session.user !== 'undefined'
}

var parse = async function (self) {
  var json = await cobody(self)
  return (typeof json === 'string') ? JSON.parse(json) : json
}

var view = async function (ctx, next) { // view(mdFile):convert *.md to html
  console.log('view()')
  var book = ctx.params.book
  var file = ctx.params.file || 'README.md'
  var type = path.extname(file)
  console.log('book=%s file=%s', book, file)
  if (['.md', '.json', '.mdo', '.html'].indexOf(type) >= 0) {
    var bookObj, fileObj
    var isError = false
    try {
      bookObj = await M.getBook(book)
    } catch (error) {
      isError = true
      bookObj = { book: book }
      fileObj = { book: book, file: file, text: '# Error\nBook not found.\nYou may [Create New Book](/view/system/createBook.html) ?' }
    }
    if (!isError) {
      try {
        fileObj = await M.getBookFile(book, file)
      } catch (error) {
        fileObj = { book: book, file: file, text: '# Error\nFile not found.\nYou may edit and save to create a new file !' }
      }
    }
    console.log('user=%s', ctx.session.user)
    var page = V.viewRender(bookObj, fileObj, M.setting.useLocal, ctx.session.user)
    ctx.body = page
  } else {
    ctx.type = path.extname(ctx.path)
    ctx.body = fs.createReadStream(M.getFilePath(book, file))
  }
}

var smsList = async function (ctx, next) {
  try {
    console.log('smsList:query=%j', ctx.query)
    var posts = await M.smsListPosts(ctx.query.url)
    var s2t = ctx.query.s2t
    if (s2t) {
      for (var i in posts) {
        posts[i].msgMt = aslk.textMt(posts[i].msg, s2t)
      }
    }
    response(ctx, 200, posts)
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

/*
var smsView = async function (ctx, next) { // view(mdFile):convert *.md to html
  try {
//    console.log('smsView:query=%j', ctx.query)
//    console.log('user=%s', ctx.session.user)
    var posts = await M.smsListPosts(ctx.query.url)
//    console.log('posts=%j', posts)
    var s2t = ctx.query.s2t || ''
    for (var i = 0; i < posts.length; i++) {
      var post = posts[i]
      post.msgMt = (s2t === '') ? post.msg : aslk.textMt(post.msg, s2t)
      var replys = post.replys || []
//      console.log('post.replys.length=%d', replys.length)
      for (var ri = 0; ri < replys.length; ri++) {
        var reply = replys[ri]
        if (reply == null) continue
//        console.log('reply=%j', reply)
        reply.msgMt = (s2t === '') ? reply.msg : aslk.textMt(reply.msg, s2t)
      }
    }
    var page = V.smsRender(posts, ctx.session.user)
//    console.log('after smsRender')
    response(ctx, 200, page)
  } catch (e) {
    console.log(e.stack)
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}
*/
var mt = async function (ctx, next) {
  try {
    var post = await parse(ctx)
    var s2t = ctx.params.s2t
    var format = ctx.params.format
//    console.log('mt:params=%j post=%j', ctx.params, post)
    switch (format) {
      case 'obj' : result = aslk.objMt(post.source, s2t); break
      case 'text': result = aslk.textMt(post.source, s2t); break
      case 'ruby': result = aslk.rubyMt(post.source, s2t); break
      case 'parse': result = JSON.stringify({s: p.s, t: p.t, cuts: p.cuts, tags: p.tags}); break
      default: throw 'Error format!'
    }
    response(ctx, 200, result)
  } catch (e) {
//    response(ctx, 403, e.stack)
  }
}

/*
var mt = async function (ctx, next) {
  try {
    var post = await parse(ctx)
    var p = aslk.analyze(post.source, ctx.params.s2t)
    response(ctx, 200, JSON.stringify({s: p.s, t: p.t, cuts: p.cuts, tags: p.tags}))
  } catch (e) {
    response(ctx, 403, e.stack)
  }
}
*/
var save = async function (ctx, next) { // save markdown file.
  console.log('save()')
  var book = ctx.params.book
  var file = ctx.params.file
  console.log('=> book=%s file=%s', book, file)
  if (!isPass(ctx)) {
//    response(ctx, 401, 'Please login to save!')
    console.log('=> !pass')
    return
  }
  var bookObj = await M.getBook(book)
  if (bookObj.editor !== ctx.session.user) {
    console.log('=> editor != user')
//    response(ctx, 403, 'Save fail: You are not editor of the book !')
    return
  }
  try {
    var post = await parse(ctx)
    console.log('=> post != %j', post)
    await M.saveBookFile(book, file, post.text)
    console.log('=> save success')
    response(ctx, 200, 'Save Success!')
  } catch (e) {
//    response(ctx, 403, 'Save Fail!') // 403: Forbidden
  }
}

var signup = async function (ctx, next) {
  if (!M.setting.signup) {
//    response(ctx, 403, 'Error: Signup=false in Setting.mdo !')
    return
  }
  var post = await parse(ctx)
  var user = post.user
  var password = post.password
  var isSuccess = await M.addUser(user, password)
  if (isSuccess) {
    response(ctx, 200, 'Signup success!')
  } else {
//    response(ctx, 403, 'Signup Fail: User name already taken by some others!')
  }
}

var search = async function (ctx, next) {
  try {
    console.log('search:ctx.query=%j', ctx.query)
    var key = ctx.query.key || ''
    var q = JSON.parse(ctx.query.q || '{"type":"md"}')
    console.log('search:key=%s q=%j', key, q)
    var results = await M.search(key, q)
    response(ctx, 200, JSON.stringify(results))
  } catch (e) {
//    response(ctx, 403, JSON.stringify(e.stack))
  }
}

var login = async function (ctx, next) {
  console.log('login()')
  var post = await parse(ctx) // console.log('login:user=%s', post.user)
  console.log('  post=%j', post)
  var user = M.users[post.user] // console.log('ctx.session=%j', ctx.session)
  if (user.password === post.password) {
//    ctx.body = {msg:'Success!'}
    response(ctx, 200, 'Login Success!')
    ctx.session.user = post.user
  } else {
//    response(ctx, 403, 'Login Fail!') // 403: Forbidden
  }
}

var logout = async function (ctx, next) {
  delete ctx.session.user
  response(ctx, 200, 'Logout Success!')
}

var createBook = async function (ctx, next) {
  if (!isPass(ctx)) {
//    response(ctx, 401, 'Please login at first !')
  } else {
    try {
      await M.createBook(ctx.params.book, ctx.session.user)
      response(ctx, 200, 'Create Book Success!')
    } catch (err) {
//      response(ctx, 403, 'Fail: Book already exist!')
    }
  }
}

// koa1 更方便的使用方式 https://www.tutorialspoint.com/koajs/koajs_file_uploading.htm
// koa2 要試試！ 結果，下面還是用 koa-busboy, 這樣還是和 koa-bodyparser 不能相容。
// 參考： https://chenshenhai.github.io/koa2-note/note/upload/pic-async.html
// 另一個可能性是 https://github.com/dlau/koa-body/tree/koa2
// 原始碼看來並沒有支援 multipart : https://github.com/koajs/bodyparser/blob/master/index.js
var upload = async function (ctx, next) {
  var book = ctx.params.book
  console.log('upload: book=%s', book)
//  var body = ctx.request.body
//  console.log('upload: book=%s body=%j', book, body)
  const {files} = await asyncBusboy(ctx.req)
  console.log('files=%j', files)
  for (var i in files) {
    var file = files[i].filename
    console.log('upload file=%s', file)
    var stream = fs.createWriteStream(path.join(M.bookRoot, book, file))
    files[i].pipe(stream)
  }
  ctx.body = JSON.stringify(files, null, 2)
}

var smsPost = async function (ctx, next) {
  try {
    var post = await parse(ctx)
    post.user = ctx.session.user    
    console.log('smsPost:post=%j', post)
/*    
    var s2t = ctx.query.s2t || ''
    post.msgMt = (s2t === '') ? post.msg : aslk.textMt(post.msg, s2t)
*/    
    await M.smsSavePost(post)
    response(ctx, 200, post) // V.postRender(post, post.user)
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

var smsUpdatePost = async function (ctx, next) {
  try {
    var post = await parse(ctx)
    post.user = ctx.session.user
    console.log('smsUpdatePost:post=%j', post)
    await M.smsUpdatePost(post)
    response(ctx, 200, 'Success!')
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

var smsDeletePost = async function (ctx, next) {
  try {
    console.log('smsDeletePost:query=%j', ctx.query)
    await M.smsDeletePost(ctx.query.id)
    response(ctx, 200, 'Success!')
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

var smsDeleteReply = async function (ctx, next) {
  try {
    console.log('smsDeleteReply:query=%j', ctx.query)
    await M.smsDeleteReply(ctx.query.postId, ctx.query.replyId)
    response(ctx, 200, 'Success!')
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

var smsReply = async function (ctx, next) {
  try {
    var obj = await parse(ctx)
    console.log('smsReply:obj=%j', obj)
    var reply = obj.reply
    var postId = obj.postId
//    var user = ctx.session.user
    console.log('ctx.query=%j', ctx.query)
//    console.log('smsReply:reply=%j', reply)
    var s2t = ctx.query.s2t || ''
    reply.msgMt = (s2t === '') ? reply.msg : aslk.textMt(reply.msg, s2t)
    console.log('smsReply:reply=%j', reply)
    await M.smsReply(reply, postId)
    response(ctx, 200, reply) // V.replyRender(reply, ctx.session.user, postId)
//    response(ctx, 200, V.replyRender(reply, ctx.session.user, postId))
  } catch (e) {
//    response(ctx, 403, 'Fail!') // 403: Forbidden
  }
}

app.keys = ['#*$*#$)_)*&&^^']

var CONFIG = {
  key: 'koa:sess', // (string) cookie key (default is koa:sess)
  maxAge: 86400000, // (number) maxAge in ms (default is 1 days)
  overwrite: true, // (boolean) can overwrite or not (default true)
  httpOnly: true, // (boolean) httpOnly or not (default true)
  signed: true // (boolean) signed or not (default true)
}

app.use(logger())
app.use(session(CONFIG, app))
app.use(koaStatic(path.join(__dirname, 'web')))
app.use(koaStatic(path.join(__dirname, 'user')))
// app.use(bodyParser())

router
  .get('/', function (ctx, next) {
    console.log('ctx=%j', ctx)
    ctx.redirect(M.setting.home)
  })
  .get('/search', search)
  .get('/view/:book/:file?', view)
  .post('/createbook/:book', createBook)
  .post('/save/:book/:file', save)
  .post('/login', login)
  .post('/logout', logout)
  .post('/signup', signup)
  .post('/upload/:book', upload)
  .post('/mt/:s2t/:format', mt)
  .post('/sms/post', smsPost) // post CURD
  .patch('/sms/post', smsUpdatePost)
  .delete('/sms/post', smsDeletePost)
  .get('/sms/list', smsList)
  .post('/sms/reply', smsReply) // reply CURD
  .patch('/sms/reply', smsReply)
  .delete('/sms/reply', smsDeleteReply)
//  .get('/plugin/sms/view', smsView)

async function main() {
  await M.init(__dirname)
  V.init(__dirname)
  var port = M.setting.port || 8080
  app.use(router.routes()).listen(port)
  console.log('http server started: http://localhost:' + port)
}

main()

/*
co(async function () {
  await M.init(__dirname)
  V.init(__dirname)
  var port = M.setting.port || 8080
  app.use(router.routes()).listen(port)
  console.log('http server started: http://localhost:' + port)
})
*/