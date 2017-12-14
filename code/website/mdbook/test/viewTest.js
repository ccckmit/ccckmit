var V = require('../lib/view')

var posts = [
  {_id: '111', msg: '# title1', date: '20130705', user: 'ccc'},
  {_id: '222', msg: '# 222222', date: '20170301', user: 'ccc'}
]

V.init('../')
console.log(V.smsRender(posts, 'ccc'))
