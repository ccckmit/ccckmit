var path = require('path')
var io = require('./io')
var mongo = require('./mongo')
var MD = require('./markdown')
var M = module.exports = {}

M.init = async function (root) {
  M.bookRoot = path.join(root, 'book')
  M.userListFile = path.join(M.bookRoot, 'system/userlist.md')
  M.bookListFile = path.join(M.bookRoot, 'system/booklist.md')
  M.settingFile = path.join(root, 'setting/setting.mdo')
  var settingMdo = await io.readFile(M.settingFile)
  M.setting = MD.parseMdo(settingMdo)
  M.setting.users = MD.index(M.setting.users, 'user')
//  console.log('M.setting=%j', M.setting)
  M.users = M.setting.users
  try {
    M.db = await mongo.open('mdbook', M.setting.db)
    M.docTable = M.db.collection('doc')
    M.smsTable = M.db.collection('sms')
//    M.fileTable = M.db.collection('file')
  } catch (e) {
    console.log('Mongodb connect fail : no database supported !')
  }
}

M.close = async function () {
  await mongo.close(M.db)
}

M.getBookPath = function (book) {
//  console.log('M.bookRoot=%s book=%s', M.bookRoot, book)
  return path.join(M.bookRoot, book)
}

M.getFilePath = function (book, file) {
  return path.join(M.getBookPath(book), file)
}

M.getBook = async function (book) {
  var bookFile = path.join(M.getBookPath(book), 'book.mdo')
  var bookMdo = await io.readFile(bookFile)
  var bookObj = MD.parseMdo(bookMdo)
  bookObj.book = book
  return bookObj
}

M.getBookFile = async function (book, file) {
  var filePath = M.getFilePath(book, file)
  var hasFile = await io.fileExists(filePath)
  if (hasFile) {
    var fileObj = { book: book, file: file }
    fileObj.text = await io.readFile(filePath)
    return fileObj
  }
}

M.saveBookFile = async function (book, file, text) {
//  console.log('save:%s/%s', book, file)
  var path = book + '/' + file
  var filePath = M.getFilePath(book, file)
  await io.writeFile(filePath, text)
  if (typeof M.db === 'undefined') return
  if (file.endsWith('.md')) {
    await mongo.saveMd(M.docTable, text, path)
  } else if (file.endsWith('.json')) {
    await mongo.saveJson(M.docTable, io.parseJson(text), path)
  } else {
    await mongo.saveText(M.docTable, text, path)
  }
}

M.createBook = async function (book, user) {
  console.log('createBook:%s', book)
  await io.mkdir(M.getBookPath(book))
  await io.writeFile(M.getBookPath(book) + '/book.mdo',
    'title:Book Title\neditor:' + user + '\nchapters:\ntitle        | link\n-------------|---------\nREADME       | README.md\nChapter1     | chapter1.md')
  await io.appendFile(M.bookListFile, '\n[' + book + '](../' + book + '/) | [' + user + '](../' + user + '/)')
}

M.createUser = async function (user) {
  console.log('createUser:%s', user)
  await io.mkdir(M.getBookPath(user))
  await io.appendFile(M.userListFile, '\n[' + user + '](/view/' + user + '/) | ' + user)
  await io.writeFile(M.getBookPath(user) + '/book.mdo',
    'title:' + user + '\neditor:' + user + '\nchapters:\ntitle        | link\n' +
    '-------------|---------\n' + user + ' | README.md')
  await io.writeFile(M.getBookPath(user) + '/README.md',
    '## About Me\n* name:' + user + '\n* email: ???\n\n## My Book\n\n* [MyBook1](../' + user + '/)\n')
}

M.addUser = async function (user, password) {
  var userObj = M.setting.users[user]
  if (typeof userObj === 'undefined') {
    userObj = {user: user, password: password}
    M.setting.users[user] = userObj
    var msg = '\n' + user + ' | ' + password
    console.log('appendFile:M.settingFile=%s text=%s', M.settingFile, msg)
    await io.appendFile(M.settingFile, msg)
    await M.createUser(user)
    return true
  } else {
    return false
  }
}

M.search = async function (keywords, q = {}) {
  var results = await mongo.search(M.docTable, keywords, q)
//  console.log('==========================================')
//  console.log('search(%s,%j)=%j', keywords, q, results)
  return results
}

M.query = async function (q) {
  var results = await mongo.query(M.docTable, q)
  console.log('==========================================')
  console.log('query(%j)=%j', q, results)
  return results
}

M.uploadToDb = async function () {
  var fileList = await io.recursiveList(M.bookRoot)
  console.log('bookRoot=%s', M.bookRoot)
  console.log('fileList=%j', fileList)
  await mongo.importFiles(M.docTable, M.bookRoot, fileList)
}

M.smsSavePost = async function (post) {
  post.date = new Date()
  await M.smsTable.updateOne({_id: post._id}, post, {upsert: true})
}

M.smsUpdatePost = async function (post) {
  post.date = new Date()
  await M.smsTable.updateOne({_id: post._id}, {$set: post}, {upsert: true})
}

M.smsDeletePost = async function (postId) {
  await M.smsTable.remove({_id: postId})
}

M.smsDeleteReply = async function (postId, replyId) {
  var post = await M.smsTable.findOne({_id: postId})
  post.replys = post.replys.filter(function(reply) { 
    return reply._id !== replyId
  })
  await M.smsTable.updateOne({_id: postId}, post, {upsert: true})
}

M.smsListPosts = async function (url) {
  return await M.smsTable.find({url: url}).sort({date: -1}).toArray()
}

M.smsReply = async function (reply, postId) {
//  var postId = reply.postId
  var post = await M.smsTable.findOne({_id: postId})
//  delete reply.postId
  if (post.replys == null) post.replys = []
  for (var i = 0; i < post.replys.length; i++) {
    if (post.replys[i]._id === reply._id) {
      post.replys[i].msg = reply.msg
      console.log('smsReply:modify %j to %j', post.replys[i], reply)
      break
    }
  }
  if (i >= post.replys.length) {
    post.replys.push(reply)
    console.log('smsReply:push', reply)
  }
  await M.smsTable.updateOne({_id: postId}, post, {upsert: true})
}

