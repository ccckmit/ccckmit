(
function() {
    if (!document.getElementById("toolbar")) {
        p = document.createElement("div");
        p.id = "toolbar";
        p.style.cssText = "width:100%;height:30;background-color:#eee;border:1px solid #333;z-index:9999;position:absolute;top:0px;left:0px;text-align:left;cursor:move;";
        p.innerHTML = "<table width=100%><tr><td id='toolbar'><a href='javascript:translate();'>中文翻譯</a></td><td width='100'><a style='cursor: pointer;' onclick='popupClose();'>關閉</a></td></tr><tr><td id='popupMsg' rolspan='2'></td></tr></table>";
        pheader = document.createElement("div");
        pheader.id = "popup_header";
        pheader.style.cssText = "width:500px;height: 400px;top:0px;left:0px;z-index:99999;";
        var selectText=((window.getSelection&&window.getSelection())||(document.getSelection&&document.getSelection())||(document.selection&&document.selection.createRange&&document.selection.createRange().text));
        var charSet = (document.charset||document.characterSet);
        pbody = document.createElement("div");
        pbody.id = "popup_body";
//        p.style.cssText = "width:100%;height:20px;background-color:#eee;border:1px solid #333;z-index:9999;position:absolute;top:0px;left:0px;text-align:left;cursor:move;";
//        pbody.style.cssText = "width:500px;height: 400px;top:20px;left:0px;z-index:99999;";
        if(selectText == '')
          pbody.innerHTML = "<div>請選取待翻譯的文字</div>";
        else
          pbody.innerHTML = "<div>"+selectText+"</div>";
        p.appendChild(pheader);
        p.appendChild(pbody)
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
      document.getElementById("popup").style.display = "block";
    }


})();