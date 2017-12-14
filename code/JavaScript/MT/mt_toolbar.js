(
function() {
  if (!document.getElementById("toolbar")) {
    p = document.createElement("div");
    p.id = "toolbar";
    p.style.cssText = "width:100%;background-color:#eee;border:1px solid #333;z-index:9999;position:fixed;top:0px;left:0px;text-align:left;cursor:move;font-size:12px;font-family:細明體";
    p.innerHTML = "<table width='100%'><tr><td width='30'><div id='msgbar' style='display:none'></div></td><td>輸入："+
    "<input id='sourceText' type='text' size='40'/> <input type='button' onclick='javascript:void(translateSelected())' value='翻譯'/>"+
    "</td><td width='100'><a onclick='hideToolbar();'>隱藏 ↑</a></td></tr></table>";
    document.body.appendChild(p);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://1.latest.ccckmit.appspot.com/mt_main.js"
    document.getElementsByTagName("head")[0].appendChild(script);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://www.google.com/jsapi?callback=pageLoaded";
    document.getElementsByTagName("head")[0].appendChild(script);
  } else {
    pageLoaded();
    document.getElementById("toolbar").style.display = "block";
  }
})();
