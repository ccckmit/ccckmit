(
function() {
  if (!document.getElementById("toolbar")) {
    p = document.createElement("div");
    p.id = "toolbar";
    p.style.cssText = "width:100%;background-color:#eee;border:1px solid #333;z-index:9999;position:absolute;top:0px;left:0px;text-align:left;cursor:move;";
    p.innerHTML = "<table width=100%><tr><td width='30'></td><td id='toolbar'><a style='cursor: pointer;' onclick='translate();'>中文翻譯</a><a style='cursor: pointer;' onclick='closeToolbar();'>關閉</a></td><td width='100'></td></tr></table>";
    document.body.appendChild(p);
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://ccc.kmit.edu.tw/bookmarklet/test/main.js"
    document.getElementsByTagName("head")[0].appendChild(script);
/*        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?key=ABQIAAAAzr2EBOXUKnm_jVnk0OJI7xSosDVG8KKPE1-m51RBrvYughuyMxQ-i1QfUnH94QxWIa6N4U6MouMmBA&callback=loadMaps";
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script); */
  } else {
    document.getElementById("toolbar").style.display = "block";
  }
})();