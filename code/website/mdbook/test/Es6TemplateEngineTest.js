var compile = function (template){
  var evalExpr = /<%=(.+?)%>/g;
  var expr = /<%([\s\S]+?)%>/g;

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  var script =
  `(function parse(data){
    var output = "";

    function echo(html){
      output += html;
    }

    ${ template }

    return output;
  })`;

  return script;
}

var template = `
<ul>
  <% for(var i=0; i < data.supplies.length; i++) { %>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`;
var parse = eval(compile(template))
console.log(parse({ supplies: [ "broom", "mop", "cleaner" ] }))


/*
var template = `
<div id="reply<%data.reply._id%>" class="reply">
<div contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup('<%data.postId%>\', \'<%data.reply._id%> this.innerText)"><%data.reply.msg%></div>
<div style="float:right">
 <i class="fa fa-user" title="Author"></i>
 <a href="/view/<%data.reply.user%>"><%data.reply.user%></a>
 <%if(data.reply.user === data.user) {%>
  <i class="fa fa-times" title="delete" onclick="SMS.deleteReply(\'<%data.postId%>\',\'<%data.reply._id%>\')"></i> &nbsp;
 <%}%>
 <i class="fa fa-clock-o" title="<%data.reply.date%>"></i>
 </div>
</div>
`

var parse = eval(compile(template))
console.log(parse(
  { user: 'ccc',
    postId: '1111111',
    reply: {date: '20170315', _id: '2222222', msg: 'aaaaaaa', user: 'ccc'}
  }
))
*/