var V = {}

var posts = [{
  _id: '111',
  msg: '# title1',
  date: '20130705',
  user: 'ccc',
  replys: [ { _id: '1aaa', msg: 'Nice!', date: '20130706', user: 'ccc' } ]
}, {
  _id: '222',
  msg: '# 222222',
  date: '20170301',
  user: 'ccc',
  replys: [
    { _id: '2bbb', msg: 'Good!', date: '20170302', user: 'bbb' },
    { _id: '2ddd', msg: 'Excellent!', date: '20170302', user: 'ddd' },
    { _id: '2ccc', msg: 'Thanks!', date: '20170303', user: 'ccc' }
  ]
}]

/*
var eq = function(a,b) { return a===b }
var cif = function(cond, a, b) { return (cond) ? a : b }
*/

V.replyRender = function (reply, user, postId) {
  console.log('reply=%j', reply)
  return `
<!--replyHtml-->
<div id="reply${reply._id}" class="reply">
  <div contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('${postId}', '${reply._id}', this.innerText, this)">${reply.msg}</div>
  <div style="float:right">
    <i class="fa fa-user" aria-hidden="true" title="Author"></i>
    <a href="/view/${reply.user}">${reply.user}</a>
    ${(user === reply.user) ? `<i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deleteReply('${postId}','${reply._id}')"></i> &nbsp;` : ''}
    <i class="fa fa-clock-o" aria-hidden="true" title="${reply.date}"></i>
  </div>
</div>
`
}

V.postRender = function (post, user) {
  console.log('post=%j', post)
  return `
    <!--postHtml-->
    <div id="post${post._id}" class="postDiv">
      <label class="mt" data-mt="Post=訊息"></label> : 
      <div style="float:right">
        <i class="fa fa-user" aria-hidden="true" title="Author"></i> <a href="/view/${post.user}">${post.user}</a> &nbsp;
        <i class="fa fa-pencil-square-o" aria-hidden="true" title="edit" onclick="SMS.editPostToggle('${post._id}')"></i> &nbsp;
        <i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deletePost('${post._id}')"></i> &nbsp;
        <i class="fa fa-clock-o" aria-hidden="true" title="${post.date}"></i>
      </div>
      <div style="display:none">
        <textarea id="postMd${post._id}">${post.msg}</textarea>
        <button type="button" class="pure-button mt" data-mt="Submit=送出修改" onclick="SMS.editPostSubmit('${post._id}')"></button>
      </div>
      <div id="postHtml${post._id}" class="postHtml"><!--MDB.md2html(post.msg)--></div>
      <div id="replyList${post._id}">
        ${post.replys.map(reply => `${V.replyRender(reply, user, post._id)}`).join('\n')}
      </div>
      <div>
        <textarea id="replyArea${post._id}" class="replyArea" onkeyup="SMS.replyAddKeyup('${post._id}', this.value)" placeholder="Reply"></textarea>
      </div>
    </div>
    <!--/postHtml-->
    `
}

V.smsRender = function (posts, user) {
  return `
<div id="smsBox" class="content" style="height:80vh; overflow: auto">  
  <textarea id="newPost" placeholder="Post new message !"></textarea>
  <button type="button" class="pure-button pure-button-primary mt" data-mt="Post=留言" onclick="SMS.post(window.id('newPost').value)"></button>
  <div id="posts">
    ${posts.map(post => V.postRender(post, user)).join('\n')}
  </div>
</div>
`
}

V.smsRender(posts, 'ccc')
console.log(V.smsRender(posts, 'ccc'))

//    ${(user===reply.user) ? '<i class="fa fa-times" aria-hidden="true" title="delete" onclick="SMS.deleteReply('${postId}','${reply._id}')"></i> &nbsp;' : ''
