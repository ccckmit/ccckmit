var E={};

E.Server = {};

E.isLogin = function() {
  if (localStorage.wd_login !== "true") { 
	  // 注意：sessionStorage 不能跨頁面持續，所以得用 localStorage
    alert('You can not save & edit before login. Please login now !');
    window.location.href="login.html"
    return false;
  }
  return true;
}

E.Server.save=function(path, text) {
	if (!path.startsWith("/")) path="/"+path;
	console.log("save");
  $.ajax({
    type: "POST",
    url: "file"+path,
    timeout: this.timeout,
    data: { text: text },
    statusCode: {
      401: function() { // 401:Unauthorized
        localStorage.wd_login = "false";
        E.isLogin();
      }
    }
  })
  .done(function(data) {
		console.log("save success");
    alert("Save success!");
  })
  .fail(function() {
    alert("Save fail!");
  });
}

E.Server.login=function() {
  $.ajax({
    type: "POST",
    url: "/login",
    timeout: this.timeout,
    data: { user:$('#loginUser').val(), password:$('#loginPassword').val() },
  })
  .done(function(data) {
    localStorage.wd_login = "true";
		$('#loginMessage').html("Login success!");
  })
  .fail(function() {
    localStorage.wd_login = "false";
		$('#loginMessage').html("Login fail! Please try again.");
  });
}

E.Server.logout=function() {
  $.ajax({
    type: "POST",
    url: "/logout",
    timeout: this.timeout,
    data: {},
  })
  .done(function(data) {
    localStorage.wd_login = "false";
    alert( "Logout success!");
		E.switchPanel('panelShow');
  })
  .fail(function() {
    alert( "Logout fail!" );
  });
}

E.loginBoxHtml = '<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel">\
  <div class="modal-dialog modal-sm" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="loginModalLabel">Login</h4>\
      </div>\
      <div id="loginBox" class="modal-body">\
				<form class="form-signin" role="form">\
					<input type="text" id="loginUser" class="form-control" required autofocus data-mt="User" placeholder="Account"/>\
					<input type="password" id="loginPassword" class="form-control" required data-mt="Password" placeholder="Password"/>\
					<br/>\
					<label id="loginMessage"></label>\
				</form>\
      </div>\
      <div class="modal-footer">\
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
        <button type="button" class="btn btn-primary" onclick="E.Server.login()">Login</button>\
      </div>\
    </div>\
  </div>\
</div>';
