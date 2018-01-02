var express = require('express')
  , async = require('async')
  , path = require('path')
  , jade = require('jade')
  , fs = require('fs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var loadView = function(name, locals) {
  var template = fs.readFileSync(path.join(__dirname, name + '.jade')).toString();
  return jade.compile(template)(locals);
};

var db = {
  search: function(callback) {
    setTimeout(function() {
      callback({items: ['test', 'test1', 'test2', 'test3']});
    }, 2000);
  },
  slowQuery: function(callback) {
    setTimeout(function() {
      callback();
    }, 5000);
  }
};

var renderLayout = function(req, res, next) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><head><title>Test</title></head><body>');
  res.write(loadView('layout', {}));
  next();
};


var renderSidebar = function (req, res, next) {
  db.search(function(items) {
    var content = loadView('sidebar', items);
    res.write('<script>$(".content-sidebar").html(\'' + content + '\');</script>');
    next();
  });
};

var renderContent = function (req, res, next) {
  var content = loadView('main', {title: 'Bigpipe!'});
  res.write('<script>$(".content-main").html(\'' + content + '\');</script>');
  next();
};

var renderExtra = function (req, res, next) {
  db.slowQuery(function() {
    var extra = loadView('extra', {});
    res.write('<script>$(".content-extra").html(\'' + extra + '\');</script>');
    next();
  });
};

var renderBody = function (req, res, next) {
  async.forEach([renderExtra, renderSidebar, renderContent], function(fn, done) {
    fn(req, res, done);
  }, next);
};

var renderEnd = function (req, res, next) {
  res.write('</body></html>');
  res.end();
};

app.get('/', renderLayout, renderBody, renderEnd );

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port " + app.get('port'));
