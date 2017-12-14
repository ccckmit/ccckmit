var c = console;

var Mt = {
  dictMap : {
      tw: { "Login":"登入", "Logout":"登出", "Sign up":"申請帳號", "Help":"說明", "Language":"語言",
    "Author":"作者", "License":"授權", "Email":"電子郵件", "Password":"密碼", "Remember me":"記住我", "User":"使用者", "Account":"帳號"
    },
    us: {}
  },
  lang:'tw', 
}

Mt.dict=Mt.dictMap['tw'];

Mt.mt = function mt(e) {
  var v = Mt.dict[e];
  return (v===undefined)?e:v;
}

Mt.switchLang = function switchLang(pLang) {
  Mt.lang = pLang;
  Mt.dict = Mt.dictMap[Mt.lang];
  window.localStorage["Mt_lang"]=pLang;
  $( "[data-mt]" ).each(function() {
    var e = $(this).data("mt");
    if ($(this).attr("placeholder") === undefined) {
      $(this).text(Mt.mt(e));
    } else {
      $(this).attr("placeholder", Mt.mt(e));
    }
  });
}

var Account = {};

Account.init = function init() {
  c.log(window.localStorage);
  Mt.lang = window.localStorage['lang'];
  if (Mt.lang === undefined) Mt.lang='tw';
  Mt.switchLang(Mt.lang);
}

Account.login = function login(user, password) {
  window.localStorage["user"]=user;
  location.reload();
}

Account.logout = function logout() {
  delete window.localStorage["user"];
  location.reload();
}

var DB = {};

DB.forget = function DB_forget(name) {
  window.localStorage.removeItem(name);
}

DB.load = function DB_load(name) {
   if (window.localStorage[name] !== undefined) 
     return JSON.parse(window.localStorage[name]);
   else
     return undefined;
}

DB.save = function DB_save(name, obj) {
  window.localStorage[name] = JSON.stringify(obj);
}

var Spa = {};

Spa.switchPanel = function switchPanel(name) {
  $(".panel" ).css( "display", "none" );
  $("#panel"+name).css("display", "block");
  $(".tab" ).removeClass("active");
  $("#tab"+name).addClass("active");
}
