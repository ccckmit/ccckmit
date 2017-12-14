
/**
 * Module dependencies.
 */

var MongoClient = require('mongodb').MongoClient;
// http://stackoverflow.com/questions/7825700/convert-string-to-objectid-in-mongodb
var ObjectId = require('mongodb').ObjectID;
var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var app = koa();

var db;
MongoClient.connect("mongodb://localhost:27017/blog", function(err, pDb) {
  if(err) { return console.dir(err); }
  db = pDb;
});

// "database"

// var posts = [];

// middleware

app.use(logger());

// route middleware

app.use(route.get('/', list));
app.use(route.get('/post/new', add));
app.use(route.get('/post/:id', show));
app.use(route.post('/post', create));

// route definitions

/**
 * Post listing.
 */

function *list() {
  var collection = db.collection('post');
  var posts = yield collection.find().toArray();
  this.body = yield render('list', { posts: posts });
}

/**
 * Show creation form.
 */

function *add() {
  this.body = yield render('new');
}

/**
 * Show post :id.
 */

function *show(id) {
//  var post = posts[id];
  var collection = db.collection('post');
  var posts = yield collection.find({_id:ObjectId(id)}).toArray();
  var post = posts[0];
  if (!post) this.throw(404, 'invalid post id');
  this.body = yield render('show', { post: post });
}

/**
 * Create a post.
 */

function *create() {
  var post = yield parse(this);
//  var id = posts.push(post) - 1;
  post.created_at = new Date;
//  post.id = id;
  var collection = db.collection('post');
  var results = yield collection.insertMany([post], {w:1});
  this.redirect('/');
}

// listen

app.listen(3000);
console.log('listening on port 3000');