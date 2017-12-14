# JavaScript 影像處理

本文主要參考 Ilmari Heikkinen 的 [Image Filters with Canvas](http://www.html5rocks.com/en/tutorials/canvas/imagefilters/) 這篇文章！

## 簡介

在 HTML5 的 canvas 區塊與相關的 JavaScript 函式庫出現之後，影像處理就成了網頁的新應用，本文將展示用 JavaScript 在網頁中進行影像處理的方法。

## 簡化程式

檔案： [imagefilter0.html](code/imagefilter/imagefilter0.html)

注意：本程式不能在 local 執行，必須放上 server 才行，否則會有下列這種錯誤

* Uncaught SecurityError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.

```
<html>
<head>
  <style>
canvas { display:block; }
figcaption, button { display:block; margin:10; paddikng:10}
#customMatrix input { text-align: center; }
  </style>
</head>
<body>
 <center>
  <figure>
    <img id="orig" src="demo_small.png" width="600" height="337">
    <figcaption>The original test image</figcaption>
  </figure>

  <figure>
    <canvas id="grayscale" width="600" height="337"></canvas>
    <button onclick="grayscale()">Grayscale the image</button>
  </figure>
 </center>	
  <script type="text/javascript">
    Filters = {};
    Filters.getPixels = function(img) {
      var c,ctx;
      if (img.getContext) {
        c = img;
        try { ctx = c.getContext('2d'); } catch(e) {}
      }
      if (!ctx) {
        c = this.getCanvas(img.width, img.height);
        ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
      }
      return ctx.getImageData(0,0,c.width,c.height);
    };

    Filters.getCanvas = function(w,h) {
      var c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    };

    Filters.filterImage = function(filter, image, var_args) {
      var args = [this.getPixels(image)];
      for (var i=2; i<arguments.length; i++) {
        args.push(arguments[i]);
      }
      return filter.apply(null, args);
    };

    Filters.grayscale = function(pixels, args) {
      var d = pixels.data;
      for (var i=0; i<d.length; i+=4) {
        var r = d[i];
        var g = d[i+1];
        var b = d[i+2];
        // CIE luminance for the RGB
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v
      }
      return pixels;
    };
  </script>
  <script>
    var img = document.getElementById('orig');
    img.addEventListener('load', function() {
    
      var canvases = document.getElementsByTagName('canvas');
      for (var i=0; i<canvases.length; i++) {
        var c = canvases[i];
        c.parentNode.insertBefore(img.cloneNode(true), c);
        c.style.display = 'none';
      }

      function runFilter(id, filter, arg1, arg2, arg3) {
        var c = document.getElementById(id);
        var s = c.previousSibling.style;
        var b = c.parentNode.getElementsByTagName('button')[0];
        if (b.originalText == null) {
          b.originalText = b.textContent;
        }
        if (s.display == 'none') {
          s.display = 'inline';
          c.style.display = 'none';
          b.textContent = b.originalText;
        } else {
          var idata = Filters.filterImage(filter, img, arg1, arg2, arg3);
          c.width = idata.width;
          c.height = idata.height;
          var ctx = c.getContext('2d');
          ctx.putImageData(idata, 0, 0);
          s.display = 'none';
          c.style.display = 'inline';
          b.textContent = 'Restore original image';
        }
      }

      grayscale = function() {
        runFilter('grayscale', Filters.grayscale);
      }
    }, false);
  </script>
</body>
</html>
```

## 進階影像處理
接著我們同樣用上文的範例展示 javascript 的影像處理方法，更精確地說應該是影像濾波的方法。

以下是完整的範例。

範例： [imagefilter.html](https://ccc.nqu.edu.tw/file/jsb/code/imagefilter/imagefilter.html)

```html
<html>
<head>
  <style>
canvas { display:block; }
figcaption, button { display:block; margin:10; paddikng:10}
#customMatrix input { text-align: center; }
  </style>
</head>
<body>
<center>
  <figure>
    <img id="orig" src="demo_small.png" width="600" height="337">
    <figcaption>The original test image</figcaption>
  </figure>

  <figure>
    <canvas id="grayscale" width="600" height="337"></canvas>
    <button onclick="grayscale()">Grayscale the image</button>
  </figure>

  <figure>
    <canvas id="brightness" width="600" height="337"></canvas>
    <button onclick="brightness()">Brighten the image</button>
  </figure>

  <figure>
    <canvas id="threshold" width="600" height="337"></canvas>
    <button onclick="threshold()">Threshold the image</button>
  </figure>

  <figure>
    <canvas id="sharpen" width="600" height="337"></canvas>
    <button onclick="sharpen()">Sharpen the image</button>
  </figure>

  <figure>
    <canvas id="blurC" width="600" height="337"></canvas>
    <button onclick="blurC()">Blur the image</button>
  </figure>

  <figure>
    <canvas id="sobel" width="600" height="337"></canvas>
    <button onclick="sobel()">Run a Sobel filter on the image</button>
  </figure>

  <figure>
    <canvas id="custom" width="600" height="337"></canvas>
		<br/><br/>
		<div id="customMatrix">
          <input type="text" value="1" size="3">
          <input type="text" value="1" size="3">
          <input type="text" value="1" size="3">
          <br>
          <input type="text" value="1" size="3">
          <input type="text" value="0.7" size="3">
          <input type="text" value="-1" size="3">
          <br>
          <input type="text" value="-1" size="3">
          <input type="text" value="-1" size="3">
          <input type="text" value="-1" size="3">
          <br>
    </div>
    <button onclick="custom()">Run the above filter on the image</button>
  </figure>
</center>	
  <script type="text/javascript">
        Filters = {};
        Filters.getPixels = function(img) {
          var c,ctx;
          if (img.getContext) {
            c = img;
            try { ctx = c.getContext('2d'); } catch(e) {}
          }
          if (!ctx) {
            c = this.getCanvas(img.width, img.height);
            ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0);
          }
          return ctx.getImageData(0,0,c.width,c.height);
        };

        Filters.getCanvas = function(w,h) {
          var c = document.createElement('canvas');
          c.width = w;
          c.height = h;
          return c;
        };

        Filters.filterImage = function(filter, image, var_args) {
          var args = [this.getPixels(image)];
          for (var i=2; i<arguments.length; i++) {
            args.push(arguments[i]);
          }
          return filter.apply(null, args);
        };

        Filters.grayscale = function(pixels, args) {
          var d = pixels.data;
          for (var i=0; i<d.length; i+=4) {
            var r = d[i];
            var g = d[i+1];
            var b = d[i+2];
            // CIE luminance for the RGB
            var v = 0.2126*r + 0.7152*g + 0.0722*b;
            d[i] = d[i+1] = d[i+2] = v
          }
          return pixels;
        };

        Filters.brightness = function(pixels, adjustment) {
          var d = pixels.data;
          for (var i=0; i<d.length; i+=4) {
            d[i] += adjustment;
            d[i+1] += adjustment;
            d[i+2] += adjustment;
          }
          return pixels;
        };

        Filters.threshold = function(pixels, threshold) {
          var d = pixels.data;
          for (var i=0; i<d.length; i+=4) {
            var r = d[i];
            var g = d[i+1];
            var b = d[i+2];
            var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
            d[i] = d[i+1] = d[i+2] = v
          }
          return pixels;
        };

        Filters.tmpCanvas = document.createElement('canvas');
        Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

        Filters.createImageData = function(w,h) {
          return this.tmpCtx.createImageData(w,h);
        };

        Filters.convolute = function(pixels, weights, opaque) {
          var side = Math.round(Math.sqrt(weights.length));
          var halfSide = Math.floor(side/2);

          var src = pixels.data;
          var sw = pixels.width;
          var sh = pixels.height;

          var w = sw;
          var h = sh;
          var output = Filters.createImageData(w, h);
          var dst = output.data;

          var alphaFac = opaque ? 1 : 0;

          for (var y=0; y<h; y++) {
            for (var x=0; x<w; x++) {
              var sy = y;
              var sx = x;
              var dstOff = (y*w+x)*4;
              var r=0, g=0, b=0, a=0;
              for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                  var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
                  var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
                  var srcOff = (scy*sw+scx)*4;
                  var wt = weights[cy*side+cx];
                  r += src[srcOff] * wt;
                  g += src[srcOff+1] * wt;
                  b += src[srcOff+2] * wt;
                  a += src[srcOff+3] * wt;
                }
              }
              dst[dstOff] = r;
              dst[dstOff+1] = g;
              dst[dstOff+2] = b;
              dst[dstOff+3] = a + alphaFac*(255-a);
            }
          }
          return output;
        };

        if (!window.Float32Array)
          Float32Array = Array;

        Filters.convoluteFloat32 = function(pixels, weights, opaque) {
          var side = Math.round(Math.sqrt(weights.length));
          var halfSide = Math.floor(side/2);

          var src = pixels.data;
          var sw = pixels.width;
          var sh = pixels.height;

          var w = sw;
          var h = sh;
          var output = {
            width: w, height: h, data: new Float32Array(w*h*4)
          };
          var dst = output.data;

          var alphaFac = opaque ? 1 : 0;

          for (var y=0; y<h; y++) {
            for (var x=0; x<w; x++) {
              var sy = y;
              var sx = x;
              var dstOff = (y*w+x)*4;
              var r=0, g=0, b=0, a=0;
              for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                  var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
                  var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
                  var srcOff = (scy*sw+scx)*4;
                  var wt = weights[cy*side+cx];
                  r += src[srcOff] * wt;
                  g += src[srcOff+1] * wt;
                  b += src[srcOff+2] * wt;
                  a += src[srcOff+3] * wt;
                }
              }
              dst[dstOff] = r;
              dst[dstOff+1] = g;
              dst[dstOff+2] = b;
              dst[dstOff+3] = a + alphaFac*(255-a);
            }
          }
          return output;
        };
  </script>
  <script>
    var img = document.getElementById('orig');
    img.addEventListener('load', function() {

      var canvases = document.getElementsByTagName('canvas');
      for (var i=0; i<canvases.length; i++) {
        var c = canvases[i];
        c.parentNode.insertBefore(img.cloneNode(true), c);
        c.style.display = 'none';
      }

      function runFilter(id, filter, arg1, arg2, arg3) {
        var c = document.getElementById(id);
        var s = c.previousSibling.style;
        var b = c.parentNode.getElementsByTagName('button')[0];
        if (b.originalText == null) {
          b.originalText = b.textContent;
        }
        if (s.display == 'none') {
          s.display = 'inline';
          c.style.display = 'none';
          b.textContent = b.originalText;
        } else {
          var idata = Filters.filterImage(filter, img, arg1, arg2, arg3);
          c.width = idata.width;
          c.height = idata.height;
          var ctx = c.getContext('2d');
          ctx.putImageData(idata, 0, 0);
          s.display = 'none';
          c.style.display = 'inline';
          b.textContent = 'Restore original image';
        }
      }

      grayscale = function() {
        runFilter('grayscale', Filters.grayscale);
      }

      brightness = function() {
        runFilter('brightness', Filters.brightness, 40);
      }

      threshold = function() {
        runFilter('threshold', Filters.threshold, 128);
      }

      sharpen = function() {
        runFilter('sharpen', Filters.convolute,
          [ 0, -1,  0,
           -1,  5, -1,
            0, -1,  0]);
      }

      blurC = function() {
        runFilter('blurC', Filters.convolute,
          [ 1/9, 1/9, 1/9,
            1/9, 1/9, 1/9,
            1/9, 1/9, 1/9 ]);
      }

      sobel = function() {
        runFilter('sobel', function(px) {
          px = Filters.grayscale(px);
          var vertical = Filters.convoluteFloat32(px,
            [-1,-2,-1,
              0, 0, 0,
              1, 2, 1]);
          var horizontal = Filters.convoluteFloat32(px,
            [-1,0,1,
             -2,0,2,
             -1,0,1]);
          var id = Filters.createImageData(vertical.width, vertical.height);
          for (var i=0; i<id.data.length; i+=4) {
            var v = Math.abs(vertical.data[i]);
            id.data[i] = v;
            var h = Math.abs(horizontal.data[i]);
            id.data[i+1] = h
            id.data[i+2] = (v+h)/4;
            id.data[i+3] = 255;
          }
          return id;
        });
      }

      custom = function() {
        var inputs = document.getElementById('customMatrix').getElementsByTagName('input');
        var arr = [];
        for (var i=0; i<inputs.length; i++) {
          arr.push(parseFloat(inputs[i].value));
        }
        runFilter('custom', Filters.convolute, arr, true);
      }

    }, false);
  </script>
		
</body>
</html>
```