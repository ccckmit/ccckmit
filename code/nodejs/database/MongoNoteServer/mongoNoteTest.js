// 參考： https://github.com/tj/co-monk
var co = require('co');
var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/test');
var notes = wrap(db.get('notes'));

co(function* () {
    yield notes.remove({}); // 清空 notes collecton

    var docs = [
	 { title:"title1", body:"body1"}, 
	 { title:"title2", body:"body2"}, 
	 { title:"title3", body:"body3"} 
    ];

    yield notes.insert(docs); // 新增三筆記事

    var objs = yield notes.find({}); // 查出所有記事
    console.log("objs=%j", objs);    // 印出所有記事

    var objs = yield notes.update({title:"title2"}, {title:"title2 new", body:"body 2 new"}); // 修改記事

    yield notes.remove({title:"title3"}); // 移除記事
	
    var objs = yield notes.find({}); // 再查出所有記事
    console.log("objs=%j", objs);    // 再印出所有記事

    db.close(); 
}).then(function (value) {
//  console.log(value);
}, function (err) {
  console.error(err.stack);
});