var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')

handlebars.registerHelper({
  eq: function (v1, v2) {
    return v1 === v2
  }
})

var V = module.exports = {}

V.init = function (root) {
  V.viewPath = path.join(root, 'view')
  V.render = {
    view: V.newTemplate('view.html'),
    smsView: V.newTemplate('smsView.html')
//    smsReply: V.newTemplate('smsReply.html')
  }
}

V.newTemplate = function (file) {
  return handlebars.compile(fs.readFileSync(path.join(V.viewPath, file), 'utf8'))
}

V.viewRender = function (bookObj, fileObj, useLocal, user) {
  if (fileObj.file.endsWith('.md')) {
    var title = /^#+([^\n]*)\n/.exec(fileObj.text)
    title = (title === null) ? '' : title[1]
    var ctitle = /chinese:.*\n#+([^\n]*)\n/.exec(fileObj.text)
    ctitle = (ctitle === null) ? '' : '=' + ctitle[1]
    fileObj.title = title + ctitle
  } else {
    fileObj.html = '```\n' + fileObj.text + '\n```'
    fileObj.title = ''
  }
  bookObj.json = JSON.stringify(bookObj, null, 1)
  return V.render.view({book: bookObj, file: fileObj, useLocal: useLocal, user: user})
}

/*

V.replyRender = function (reply, user, postId) {
  console.log('reply=%j', reply)
  return `
<!--replyHtml-->
<div id="reply${reply._id}" class="reply">
  <div class="replyBox">
    <i class="fa fa-user" aria-hidden="true" title="Author"></i>
    <a href="/view/${reply.user}">${reply.user}</a>
    <div id="replyMsg${reply._id}" hidden contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('${postId}', '${reply._id}', this.innerText, this)" onblur="SMS.replyEditBlur('${postId}', '${reply._id}')">${reply.msg}</div>
    <div id="replyMt${reply._id}" class="replyMt" onclick="SMS.replyEditClick('${postId}', '${reply._id}')">${reply.msgMt}</div>
  </div>
  <div style="float:right">
    ${(user === reply.user) ? `<i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deleteReply('${postId}','${reply._id}')"></i> &nbsp;` : ''}
<!--  <i class="fa fa-clock-o" aria-hidden="true" title="${reply.date}"></i> -->
  </div>
</div>
`
}

V.postRender = function (post, user) {
  console.log('post=%j', post)
  return `
    <!--postHtml-->
    <div id="post${post._id}" class="postDiv">
      <label>Post</label> : 
      <div style="float:right">
        <i class="fa fa-user" aria-hidden="true" title="Author"></i> <a href="/view/${post.user}">${post.user}</a> &nbsp;
        <i class="fa fa-pencil-square-o" aria-hidden="true" title="edit" onclick="SMS.editPostToggle('${post._id}')"></i> &nbsp;
        <i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deletePost('${post._id}')"></i> &nbsp;
        <i class="fa fa-clock-o" aria-hidden="true" title="${post.date}"></i>
      </div>
      <div hidden>
        <textarea id="postMd${post._id}" oninput="SMS.postMdOnInput(this)">${post.msg}</textarea>
        <button type="button" class="pure-button" onclick="SMS.editPostSubmit('${post._id}')">Submit</button>
      </div>
      <div id="postMt${post._id}" hidden>${post.msgMt}</div>
      <div id="postHtml${post._id}" class="postHtml"></div>
      <div id="replyList${post._id}">
        ${(post.replys == null) ? '' : post.replys.map(reply => `${V.replyRender(reply, user, post._id)}`).join('\n') }
      </div>
      <div>
        <textarea id="replyArea${post._id}" class="replyArea" onkeyup="SMS.replyAddKeyup('${post._id}', this.value)" placeholder="Reply"></textarea>
      </div>
    </div>
    `
}

V.smsRender = function (posts, user) {
//  console.log('smsRender:')
  return `
<!-- <div id="smsBox" class="content" style="height:80vh; overflow: auto"> -->
  <textarea id="newPost" placeholder="Post new message !"></textarea>
  <button type="button" class="pure-button pure-button-primary mt" data-mt="Post=留言" onclick="SMS.post(window.id('newPost').value)"></button>
  <div id="posts">
    ${posts.map(post => V.postRender(post, user)).join('\n')}
  </div>
<!-- </div> -->
`
}
*/
