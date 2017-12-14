var PLUGIN = {}
var MT = {cn2tw: {}, tw2cn: {}}
var SMT = {}
var SE = {}
var SMS = {}

PLUGIN.load = function () {
  MT.load()
  SMT.load()
  SE.load()
  SMS.load()
  window.onhashchange()
}

function uuid () { // uuid: Licensed in Public Domain/MIT
  var d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + (Math.random() * 16)) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

window.onhashchange = function () {
  var hash = window.location.hash.trim()
  if (hash === '#search') {
    MDB.plugin('search.html')
  } else if (hash === '#sms') {
    SMS.render()
  } else {
    MDB.showBox('viewBox')
  }
}

MDB.mt = function (msg) {
  var tmsg = msg
  if (msg.indexOf('=') >= 0) {
    var tokens = msg.split('=')
    var locale = MT.locale()
    msg = (locale === 'Global') ? msg
        : (locale === 'English') ? tokens[0]
        : MT.chineseMt(tokens[1])
  }
  return msg
}

MT.getS2t = function () {
  var bookLocale = MDB.setting.locale || ''
  if (MT.locale() === 'Global' || bookLocale === '' ||
     (MT.localeChinese() && ['繁體中文', '简体中文'].indexOf(bookLocale) >= 0) || // 想看的是中文，設定也是中文
     (MT.locale() === 'English' && bookLocale === 'English')) {
     return ''
  } else {
    return (MT.localeChinese()) ? 'e2c' : 'c2e'
  }
}

var mdRewrite0 = MDB.mdRewrite
MDB.mdRewrite = async function (md) {
  var isLocalVersion = false
  if (MT.locale() !== 'Global') {
    var mdParts = md.split(/\nchinese:\n/mi) // 英文文章 \chinese:\ 中文文章
    if (mdParts.length >= 2) {
      md = (MT.localeChinese()) ? mdParts[1] : mdParts[0]
      isLocalVersion = true
    }
  }
  var s2t = MT.getS2t()
  if (isLocalVersion || s2t === '') {
    if (MT.localeChinese()) md = MT.chineseMt(md)
    return mdRewrite0(md)
  } else {
    var mdt = await SMT.serverMt(md, s2t, 'text')
    if (MT.localeChinese()) mdt = MT.chineseMt(mdt)
    return mdRewrite0(mdt)
  }
}

var render0 = MDB.render
MDB.render = function (locale) {
  if (locale != null) window.localStorage.locale = locale
  one('#locale').innerHTML = MT.locale()
  render0()
//  if (window.location.hash === '#sms' && SMS != null) SMS.render() // 會遞迴，因為 plugin => render => SMS.render => plugin
}

// 機器翻譯： Client 端
MT.load = function () {
  MT.loadChinese() // 簡繁轉換字典
  show('#languageMenu')
}

MT.localeChinese = function () {
  return ['繁體中文', '简体中文'].indexOf(MT.locale()) >= 0
}

MT.locale = function () {
  return window.localStorage.locale || MDB.setting.locale || 'English'
}

// ============================= e2c 翻譯中文 ==============================
MT.loadChinese = function () {
  if (window.localStorage.chineseDictionary != null) {
    var chineseDictionary = JSON.parse(window.localStorage.chineseDictionary)
    MT.cn2tw = chineseDictionary.cn2tw
    MT.tw2cn = chineseDictionary.tw2cn
    MDB.bookRender()
    MDB.render()
  } else {
    f6.scriptLoad('../../chinese.js').then(function () {
      window.localStorage.chineseDictionary = JSON.stringify({cn2tw: cn2tw, tw2cn: tw2cn})
      MT.cn2tw = cn2tw
      MT.tw2cn = tw2cn
      MDB.bookRender()
      MDB.render()
    })
  }
}

MT.map = function (s, s2t) {
  return s2t[s] || s
}

MT.chineseMt = function (text) {
  var toText = []
  var s2t = (MT.locale() === '繁體中文') ? MT.cn2tw
          : (MT.locale() === '简体中文') ? MT.tw2cn : {}
  for (var i = 0; i < text.length; i++) {
    toText[i] = MT.map(text[i], s2t)
  }
  return toText.join('')
}

SMT.onWatchChange = function () {
  window.localStorage.watchOption = one('#watchOption').value
  if (one('#watchOption').value === 'no') {
    hide('#watch')
  } else {
    show('#watch')
  }
}

// SMT = Server MT
SMT.load = function () { // 伺服端翻譯
  if (window.localStorage.watchOption != null) {
    one('#watchOption').value = window.localStorage.watchOption
    SMT.onWatchChange()
  }
  one('#watchOption').addEventListener('change', SMT.onWatchChange, false)
  one('#editText').addEventListener('click', SMT.editCursorMove, false)
  one('#editText').addEventListener('keyup', SMT.editCursorMove, false)
  one('#editText').addEventListener('focus', SMT.editCursorMove, false)
}

SMT.serverMt = async function (source, s2t, format) {
  var mtText = await f6.ojax({method: 'POST', url: '../../mt/' + s2t + '/' + format + '/'}, {source: source})
  return mtText.replace(/_/gi, '-')
}

SMT.cursorMove = function (box) {
  var s2t = one('#watchOption').value
  if (s2t === 'no') return
  var pos = box.selectionStart
  var text = ' ' + box.value
  for (var i = pos + 1; i > 0; i--) {
    if (/[，。？,;.!\n]/.test(text[i])) break
  }
  i = Math.max(i, 0)
  var m = text.substring(i + 1).match(/^.*?[，。？,;.!\n]/)
  if (m !== null) {
    var sentence = m[0]
    SMT.serverMt(sentence, s2t, 'ruby').then(function (html) {
      one('#watch').innerHTML = html
    })
  }
  return pos
}

SMT.editCursorMove = function () {
  SMT.cursorMove(one('#editText'))
}

// ===================== SE : Search Engine =============================
SE.load = function () {}

SE.searchKeyup = function (event) {
  event.preventDefault()
  if (event.keyCode === 13) {
    var key = one('#searchQuery').value
    SE.search(key)
  }
}

SE.doSearch = function () {
  var key = one('#searchQuery').value
  SE.search(key)
}

SE.search = async function (key) {
  try {
    var results = await f6.ojax({method: 'GET', url: '../../search?key=' + key})
    var lines = []
    for (var i = 0; i < results.length; i++) {
      lines.push('<h3><a href="../../view/' + results[i].path + '">' + results[i].path + '</a></h3>')
      var robj = results[i].text || results[i].json
      var text = JSON.stringify(robj)
      lines.push('<p>' + text.replace(/\n/gi, '') + '</p>')
    }
    one('#searchBox').innerHTML = lines.join('\n')    
  } catch (error) { window.alert('Fail!') }
}


// ================================ SMS =====================================

SMS.replyRender = function (reply, postId, user) {
//  console.log('reply=%j', reply)
  return `
<!--replyHtml-->
<div id="reply${reply._id}" class="reply">
  <div class="replyBox">
    <i class="fa fa-user" aria-hidden="true" title="Author"></i>
    <a href="/view/${reply.user}">${reply.user}</a>
    <div id="replyMsg${reply._id}" hidden contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('${postId}', '${reply._id}', this.innerText, this)" onblur="SMS.replyEditBlur('${postId}', '${reply._id}')">${reply.msg}</div>
    <div id="replyMt${reply._id}" class="replyMt" onclick="SMS.replyEditClick('${postId}', '${reply._id}')">${(reply.msgMt) ? reply.msgMt : reply.msg}</div>
  </div>
  <div style="float:right">
    ${(user === reply.user) ? `<i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deleteReply('${postId}','${reply._id}')"></i> &nbsp;` : ''}
<!--  <i class="fa fa-clock-o" aria-hidden="true" title="${reply.date}"></i> -->
  </div>
</div>
`
}

SMS.postRender = function (post, user) {
//  console.log('post=%j', post)
  return `
    <!--postHtml-->
    <div id="post${post._id}" class="postDiv">
      <label>Post</label> : 
      <div style="float:right">
        <i class="fa fa-user" aria-hidden="true" title="Author"></i> <a href="/view/${post.user}">${post.user}</a> &nbsp;
        ${(post.user === user) ?
          '<i class="fa fa-pencil-square-o" aria-hidden="true" title="edit" onclick="SMS.editPostToggle(\'' + post._id + '\')"></i> &nbsp;' +
          '<i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deletePost(\'' + post._id + '\')"></i> &nbsp;'
          : ''}
        <i class="fa fa-clock-o" aria-hidden="true" title="${post.date}"></i>
      </div>
      <div hidden>
        <textarea id="postMd${post._id}" oninput="SMS.postMdOnInput(this)">${post.msg}</textarea>
        <button type="button" class="pure-button" onclick="SMS.editPostSubmit('${post._id}')">Submit</button>
      </div>
      <div id="postMt${post._id}" hidden>${(post.msgMt) ? post.msgMt : post.msg}</div>
      <div id="postHtml${post._id}" class="postHtml"> ${MDB.mdRender(post.msg)} </div>
      <div id="replyList${post._id}">
        ${(post.replys == null) ? '' : post.replys.map(reply => `${SMS.replyRender(reply, post._id, user)}`).join('\n') }
      </div>
      <div>
        <textarea id="replyArea${post._id}" class="replyArea" onkeyup="SMS.replyAddKeyup('${post._id}', this.value)" placeholder="Reply"></textarea>
      </div>
    </div>
    `
}

SMS.smsRender = function (posts, user) {
//  console.log('smsRender:')
  return `
<!-- <div id="smsBox" class="content" style="height:80vh; overflow: auto"> -->
  <textarea id="newPost" placeholder="Post new message !"></textarea>
  <button type="button" class="pure-button pure-button-primary mt" data-mt="Post=留言" onclick="SMS.post(window.id('newPost').value)"></button>
  <div id="posts">
    ${posts.map(post => SMS.postRender(post, user)).join('\n')}
  </div>
<!-- </div> -->
`
}

// ================= SMS Client =============================

SMS.load = function () {}

SMS.getS2t = function () {
  return (MT.localeChinese()) ? 'e2c' : (MT.locale() === 'English') ? 'c2e' : ''
}

SMS.render = async function () {
//  console.log('================SMS.render ====================')
//  MDB.plugin('sms/view?url=' + window.location.pathname + '&s2t=' + SMS.getS2t(), SMS.view)
  var posts = await f6.ojax({method: 'GET', url: '../../sms/list?url=' + window.location.pathname + '&s2t=' + SMS.getS2t()}, {})
//  console.log('user=' + MDB.setting.user + ' posts=' + JSON.stringify(posts))
  var html = `
  <div id="smsBox" class="content">
    <textarea id="newPost" placeholder="Post new message !"></textarea>
    <button type="button" class="pure-button pure-button-primary mt" data-mt="Post=留言" onclick="SMS.post(f6.one('#newPost').value)"></button>
    <div id="posts">
      ${posts.map(post => SMS.postRender(post, MDB.setting.user)).join('\n')}
    </div>
  </div>
  `
  one('#pluginBox').show().innerHTML = html
  MDB.mtRender()
}

SMS.view = function () {
  var nodes = document.getElementsByClassName('postHtml')
  for (var i = 0; i < nodes.length; i++) {
    var htmlNode = nodes[i]
    var postId = htmlNode.id.substr('postHtml'.length)
    var mtNode = one('#postMt' + postId)
    htmlNode.innerHTML = MDB.md2html(MT.chineseMt(mtNode.innerHTML))
  }
  show('#viewBox')
  one('#newPost').focus()
}

SMS.post = async function (msg) {
  var post = {url: window.location.pathname, _id: uuid(), msg: msg, user: MDB.setting.user }
  await f6.ojax({method: 'POST', url: '../../sms/post?s2t=' + SMS.getS2t(), alert: true}, post)
//  one('#posts').html(SMS.postRender(post, MDB.setting.user) + one('#posts').innerHTML)
  one('#posts').prepend(SMS.postRender(post, MDB.setting.user))
/*  
  var postDiv = document.createElement('div')
  // postDiv.innerHTML = r.responseText
  postDiv.innerHTML = SMS.postRender(post, MDB.setting.user)
  console.log('postDiv.innerHTML = '+ postDiv.innerHTML)
  one('#posts').insertBefore(postDiv, one('#posts').firstChild)
*/
//  console.log('')
//  var mtNode = one('#postMt' + post._id)
//  var htmlNode = one('#postHtml' + post._id)
//  htmlNode.innerHTML = MDB.md2html(MT.chineseMt(mtNode.innerHTML))
//  htmlNode.innerHTML = MDB.md2html(MT.chineseMt(msg))
}

SMS.showReply = function (postId) {
  show('#replyArea' + postId)
  one('#replyArea' + postId).focus()
}

SMS.replyAddKeyup = function (postId, msg) {
  window.event.preventDefault()
  if (window.event.keyCode === 13) {
    SMS.replyAdd(postId, msg)
  }
}

SMS.replyEditKeyup = function (postId, replyId, msg, self) {
  window.event.preventDefault()
  if (window.event.keyCode === 13) {
    if (!window.event.ctrlKey) {
      SMS.replyUpdate(postId, {_id: replyId, msg: msg.trim()})
      self.innerHTML = self.innerText.trim()
    }
  }
}

SMS.replyEditClick = function (postId, replyId) {
  hide('#replyMt' + replyId)
  show('#replyMsg' + replyId)
  one('#replyMsg' + replyId).focus()
}

SMS.replyEditBlur = function (postId, replyId) {
  hide('#replyMsg' + replyId)
  show('#replyMt' + replyId)
}

SMS.replyUpdate = async function (postId, reply) {
  try {
//    reply.postId = postId
    var reply0 = await f6.ojax({method: 'PATCH', url: '../../sms/reply?s2t=' + SMS.getS2t(), alert: true}, 
                               {reply: reply, postId: postId})
    one('#replyMt' + postId).innerHTML += reply0.msgMt
  } catch (error) {}
}

SMS.replyAdd = async function (postId, msg) {
  try {
    var reply = { msg: msg, _id: uuid(), date: new Date(), user: MDB.setting.user } // {postId: postId, _id: uuid(), msg: msg}
    await f6.ojax({method: 'POST', url: '../../sms/reply?s2t=' + SMS.getS2t(), alert: true}, 
                  {reply: reply, postId: postId}) // var replyHtml = 
    one('#replyList' + postId).innerHTML += SMS.replyRender(reply, postId, MDB.setting.user) // r.responseText
    one('#replyArea' + postId).value = ''
  } catch (error) {}
}

SMS.postMdOnInput = function (self) {
  self.style.height = '100px'
  self.style.height = self.scrollHeight + 12 + 'px'
}

SMS.editPostToggle = function (postId) {
  var editBox = one('#postMd' + postId)
  var editParent = editBox.parentNode
  editParent.hidden = (editParent.hidden === true) ? undefined : true
  SMS.postMdOnInput(editBox)
}

SMS.editPostSubmit = async function (postId) {
  try {
    var post = { _id: postId, msg: one('#postMd' + postId).value }
    await f6.ojax({method: 'PATCH', url: '../../sms/post?id=' + postId}, post)
    var pstyle = one('#postMd' + postId).parentNode.style
    pstyle.display = 'none'
    one('#postHtml' + postId).innerHTML = MDB.md2html(post.msg)
  } catch (error) {}
}

SMS.deletePost = async function (postId) {
  try {
    await f6.ojax({method: 'DELETE', url: '../../sms/post?id=' + postId, alert: true}, {})
    one('#post' + postId).style.display = 'none'
  } catch (error) {}
}

SMS.deleteReply = async function (postId, replyId) {
  try {
    await f6.ojax({method: 'DELETE', url: '../../sms/reply?postId=' + postId + '&replyId=' + replyId, alert: true}, {})
    hide('#reply' + replyId)
  } catch (error) {}
}

