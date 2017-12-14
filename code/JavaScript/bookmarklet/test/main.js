function closeToolbar(){
  document.getElementById("toolbar").style.display = "none";
}

function closeMsg(){
  document.getElementById("msg").style.display = "none";
}

function translate() {
  var selectText=((window.getSelection && window.getSelection())
                ||(document.getSelection && document.getSelection())
                ||(document.selection && document.selection.createRange
                   &&document.selection.createRange().text));
//  var charSet = (document.charset || document.characterSet);
  alert(selectText);
}

/* function mapsLoaded() {
    var gm = google.maps;
    var map = new gm.Map2(document.getElementById("map"));
    map.setCenter(new gm.LatLng(24.448810, 118.321847), 18);
    map.setUIToDefault();
    map.setMapType(G_HYBRID_MAP);
}

function loadMaps() {

    dragfun(document.getElementById('dragmap'));
    google.load("maps", "2", { "callback": mapsLoaded });

}

function dragfun(o) {
    o.onmousedown = function(a) {
        var d = document; if (!a) a = window.event;
        var x = a.layerX ? a.layerX : a.offsetX, y = a.layerY ? a.layerY : a.offsetY;
        if (o.setCapture)
            o.setCapture();
        else if (window.captureEvents)
            window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        d.onmousemove = function(a) {
            if (!a) a = window.event;
            if (!a.pageX) a.pageX = a.clientX;
            if (!a.pageY) a.pageY = a.clientY;
            var tx = a.pageX - x, ty = a.pageY - y;
            o.style.left = tx;
            o.style.top = ty;
        };
        d.onmouseup = function() {
            if (o.releaseCapture)
                o.releaseCapture();
            else if (window.captureEvents)
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            d.onmousemove = null;
            d.onmouseup = null;
        };
    };
}
*/