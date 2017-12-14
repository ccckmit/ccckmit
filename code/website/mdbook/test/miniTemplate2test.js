var templateEngine = function(html, options) {
  html = html.replace(/\n/g, '¡õ').replace(/\t/g, '¡÷').replace(/\r/g, '');
	var re = /<%(.+?)%>/g, 
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g, 
		code = 'with(obj) { var r=[];\n', 
		cursor = 0, 
		result,
	  match;
	var add = function(line, js) {
		js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
			(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
		return add;
	}
	while(match = re.exec(html)) {
		add(html.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(html.substr(cursor, html.length - cursor));
	code = (code + 'return r.join(""); }');
	try { 
    console.log('code='+code)
    result = new Function('obj', code).apply(options, [options]); 
    result = result.replace(/¡õ/g, '\n').replace(/¡÷/g, '\t');
  } catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
}
/*
var template = '<p>Hello, my name is <%this.name%>. I\'m <%this.profile.age%> years old.</p>';

console.log(templateEngine(template, {
    name: "ccc",
    profile: { age: 43 }
}));
*/
var replyTemplate = 
    '<div id="reply<%this.reply._id%>" class="reply">\n' +
    ' <div contenteditable="true" class="replyMsg" onkeyup="SMS.replyEditKeyup(\'<%this.postId%>\', \'<%this.reply._id%>\', this.innerText)"><%this.reply.msg%></div>\n' +
    ' <div style="float:right">\n' +
    '  <i class="fa fa-user" title="Author"></i>\n' +
    '  <a href="/view/<%this.reply.user%>"><%this.reply.user%></a>\n' +
    ' <%if(this.reply.user === this.user) {%>' +
    '  <i class="fa fa-times" title="delete" onclick="SMS.deleteReply(\'<%this.postId%>\',\'<%this.reply._id%>\')"></i> &nbsp;\n' +
    ' <%}%>' +
    '  <i class="fa fa-clock-o" title="<%this.reply.date%>"></i>\n' +
    ' </div>\n' +
    '</div>\n'

console.log(templateEngine(replyTemplate, 
  {user: 'ccc', 
   postId: '1111111', 
   reply:{ date:'20170315', _id: '2222222', msg:'aaaaaaa', user:'ddd'}
  }
))
 