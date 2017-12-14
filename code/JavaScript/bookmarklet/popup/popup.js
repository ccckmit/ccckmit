(
function() {
    if (!document.getElementById("map")) {
        m = document.createElement("div");
        m.id = "map";
        m.style.cssText = "width:500px;height: 400px;top:20px;left:0px;z-index:99999;position: absolute;";
        d = document.createElement("div");
        d.id = "dragmap";
        d.style.cssText = "width:500px;height:20px;background-color:#eee;border:1px solid #333;z-index:1000;position:absolute;top:100px;left:200px;text-align:center;cursor:move;";
        d.innerHTML = "<div>--------Google Map ------<a style='cursor: pointer;' onclick='mapclose();'>關閉</a></div>";
        d.appendChild(m);
        document.body.appendChild(d);
        
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://ccc.kmit.edu.tw/bookmarklet/popup/ajax_pupup.js"
        document.getElementsByTagName("head")[0].appendChild(script);

        var script = document.createElement("script");
        script.src = "http://www.google.com/jsapi?key=ABQIAAAAzr2EBOXUKnm_jVnk0OJI7xSosDVG8KKPE1-m51RBrvYughuyMxQ-i1QfUnH94QxWIa6N4U6MouMmBA&callback=loadMaps";
        script.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(script);
        
        
    } else {
    document.getElementById("dragmap").style.display = "block";
    }


})();