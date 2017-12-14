var http    = require('http');
var url     = require('url');
var koa     = require('koa');
var fs      = require('mz/fs');
var path    = require('path');
var bodyParser = require("koa-bodyparser"); // 參考：http://codeforgeek.com/2014/09/handle-get-post-request-express-4/
var route   = require('koa-route');
var c       = console;

var app = koa();
app.use(bodyParser());

var notes = [ {title:'title1', body:'body1'}, 
              {title:'title2', body:'body2'}, 
              {title:'title3', body:'body3'} ];

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
  c.log("/list req=%s", this.request);
  c.log("/list notes=%j", notes);
  response(this.response, 200, JSON.stringify(notes));
}));

app.use(route.get("/note/:id", function *edit(id) {
  var i = parseInt(id);
  response(this.response, 200, JSON.stringify(notes[i]));
}));

app.use(route.post("/note/:id", function *save(id) {
  var i = parseInt(id);
  var title = this.request.body.title;
  var body = this.request.body.body;
  notes[i] = { title:title, body:body };
  response(this.response, 200, JSON.stringify(notes[i]));
}));

app.use(route.post('/new', function *newNote() {
  var req = this.request, res = this.response;
  var title = this.request.body.title;
  var body = this.request.body.body;
  c.log('post %s:%s', title, body);
  notes.push({title:title, body:body});
  response(res, 200, 'write success!');
}));

http.createServer(app.callback()).listen(3000);

c.log("noteServer started at port : 3000");
