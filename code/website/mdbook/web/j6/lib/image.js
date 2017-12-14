module.exports = function (j6) {
// 待整合： https://github.com/oliver-moran/jimp (好像蠻強的!)
// 可取得影像內容：
//   image.bitmap.data;  // a Buffer of the raw bitmap data
//   image.bitmap.width; // the width of the image
//   image.bitmap.height // the height of the image
// 演講: https://pusher.com/sessions/meetup/js-monthly-london/image-processing-and-manipulation-in-nodejs
// binding: node-opencv (綁得蠻完整的！)
// binding: GraphMagic -- http://aheckmann.github.io/gm/
// https://github.com/EyalAr/lwip -- Light Weight Image Processor for NodeJS

var I = j6.I = {}

/*
<img id="img1" src="demo_small.png" width="600" height="337">
<canvas id="canvas1" width="600" height="337"></canvas>

var img = document.getElementById('img1');
var rects = img.getClientRects(); // 很多個，why?
var rect = img.getBoundingClientRect(); // 一個，OK!

var ctx = img.getContext('2d');
var idata = ctx.getImageData(0,0,img.width,img.height); // 取得 rgb 陣列。

ctx.drawImage(img, 0, 0);
ctx.putImageData(idata, 0, 0);

document.getElementById(id);
*/

I.image2idata=function(image) {
	var canvas = document.createElement('canvas');
	canvas.width = image.width, canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0,0,img.width,img.height);
}

I.canvas2idata=function(canvas, x, y, width, height) {
  return canvas.getContext('2d').getImageData(x,y,width,height);
}

I.idata2rgb=function(idata) {
	var d = idata.data, rows=idata.height, cols=idata.width;
	var rgb={r:R.newM(rows,cols),g:R.newM(rows,cols),b:R.newM(rows,cols)};
	for (var r=0; r<rows; r++) {
  	for (var c=0; c<cols; c++) {
			var i = (r*cols+c);
		  rgb.r[i] = d[i];
		  rgb.g[i] = d[i+1];
		  rgb.b[i] = d[i+2];
		}
	}
	return rgb;
}

I.rgb2idata=function(rgb, idata) {
	var d=idata.data, width=rgb.r.cols(), height=rgb.r.rows();
	for (var r=0; r<rows; r++) {
  	for (var c=0; c<cols; c++) {
			var i = (r*cols+c);
		  d[i] = rgb.r[i];
		  d[i+1] = rgb.g[i];
		  d[i+2] = rgb.b[i];
		}
	}
}

I.gray=function(idata) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    // CIE luminance for the RGB
    var v = 0.2126*r + 0.7152*g + 0.0722*b;
    d[i] = d[i+1] = d[i+2] = v;
  }
}

I.bright = function(idata, adjustment) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
}

I.threshold = function(idata, threshold) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v
  }
}

I.convolute = function(idata, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = idata.data;
  var sw = idata.width;
  var sh = idata.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;
  // go through the destination image pixels
  var alphaFac = opaque ? 1 : 0;
  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      // calculate the weighed sum of the source image pixels that
      // fall under the convolution matrix
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = sy + cy - halfSide;
          var scx = sx + cx - halfSide;
          if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
            var srcOff = (scy*sw+scx)*4;
            var wt = weights[cy*side+cx];
            r += src[srcOff] * wt;
            g += src[srcOff+1] * wt;
            b += src[srcOff+2] * wt;
            a += src[srcOff+3] * wt;
          }
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
}
}