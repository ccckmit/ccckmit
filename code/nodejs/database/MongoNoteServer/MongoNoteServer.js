var http    = require('http');
var koa     = require('koa');
var bodyParser = require("koa-bodyparser"); // 參考：http://codeforgeek.com/2014/09/handle-get-post-request-express-4/
var fs      = require('mz/fs');
var route   = require('koa-route');
var co      = require('co');
var monk    = require('monk');
var comonk  = require('co-monk');
var db      = monk('localhost/test');
var notes   = comonk(db.get('notes'));
var c       = console;

var app = koa();
app.use(bodyParser());


function response(res, code, msg) {
  res.status = code;
  res.set({'Content-Length':''+msg.length,'Content-Type':'text/plain'});
  res.body = msg;
  c.log("response: code="+code+"\n"+msg+"\n");
}

app.use(route.get('/', function*() {
  this.redirect('/web/note.html');
}));

var mime = { ".css":"text/css", ".html": "text/html", ".htm":"text/html", ".jpg":"image/jpg", ".png":"image/png", ".gif":"image/gif", ".pdf":"application/pdf"};

function fileMimeType(path) {
  for (var tail in mime) {
    if (path.endsWith(tail))
      return mime[tail];
  }
}

app.use(route.get(/\/web\/.*/, function *toStatic() {
  var req = this.request, res = this.response;
  c.log('get %s', this.path);
  var mimetype = fileMimeType(this.path)
  if (mimetype) this.type = mimetype+";";
  this.body = fs.createReadStream(__dirname+this.path);
}));

app.use(route.get("/list", function *list() {
  c.log("/list path=%s", this.path);
  var objs = yield notes.find({}); // 查出所有記事
  c.log("objs=%j", objs);
  response(this.response, 200, JSON.stringify(objs));
}));

app.use(route.get("/note/:id", function *edit(id) {
  var obj = yield notes.findOne({_id:id}); // 查出所有記事
  response(this.response, 200, JSON.stringify(obj));
}));

app.use(route.post("/note/:id", function *save(id) {
  var title = this.request.body.title;
  var body = this.request.body.body;
  var obj = { title:title, body:body };
  yield notes.update({_id:id}, obj);
  response(this.response, 200, JSON.stringify(obj));
}));

app.use(route.post('/new', function *newNote() {
  var title = this.request.body.title;
  var body = this.request.body.body;
  c.log('post %s:%s', title, body);
  yield notes.insert({title:title, body:body});
  response(this.response, 200, 'write success!');
}));

http.createServer(app.callback()).listen(3000);

c.log("noteServer started at port : 3000");
