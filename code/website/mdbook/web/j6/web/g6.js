G = glab = {
	tgMap:{}, // (dimension+graph) Map
	canvas:{width:800,height:600},
}

G.show = function(chartName, tg) {
	var g = tg.graph;
	if (tg.type === 'Canvas') {
		G.showCanvas(chartName, g);
	} else if (tg.type === '2D') {
		g.bindto=chartName;
		c3.generate(g);
	} else {
		var box=document.getElementById(chartName.replace('#',''));
		new vis.Graph3d(box, g.dataSet, g.options);		
	}
}

// 2D chart by C3.js
G.new2D=function() {
  return { // c3 graph
    data: {
      xs: {},
      columns: [], 
      type: "line", 
      types : {}
    },
    axis: {
      x: {
        label: 'X',
        tick: { fit: false, format:d3.format(".2f") }
      },
      y: { label: 'Y', 
        tick : { format: d3.format(".2f") }
      }
    }, 
    bar: { width: { ratio: 0.9 } }, 
  }
}

G.chart2D = function(chartName, f) {
	var g = G.new2D();
	f(g);
	var tg = {type:'2D', graph:g};
	G.tgMap[chartName] = tg;
	return G.show(chartName, tg);
}

// type : line, spline, step, area, area-spline, area-step, bar, scatter, pie, donut, gauge
G.draw = function(g, name, x, y, type) {
  g.data.types[name] = type;
  g.data.xs[name] = name+"x";
  g.data.columns.push([name+"x"].concat(x));
  g.data.columns.push([name].concat(y));
}

G.curve = function(g, name, f, from=-10, to=10, step=0.1) {
	var rg  = j6.curve(f, from, to, step);
	console.log('curve:rg = ', rg)
	G.draw(g, name, rg.x, rg.y, 'line');
}

G.hist = function(g, name, x, type, from, to, step=1) {
	var rh = j6.hist(x, from, to, step);
	G.draw(g, name, rh.xc, rh.bins, type || 'bar');
}

G.ihist=function(g, name, x, type) {
//	console.log("x.min()=%d x.max()=%d", x.min(), x.max());	
	G.hist(g, name, x, type, x.min()-0.5, x.max()+0.5, 1);
}

G.plot =(g, name, x, y)=>G.draw(g, name, x, y, 'scatter');

G.pie =function(g, countMap) {
	g.data.type = 'pie';
	for (var name in countMap) {
		var count = countMap[name];
		g.data.columns.push([name, count]);
	}
}

G.timeSeries =function(g, columns) {
	g.data.x = 'x';
	g.axis.x = { type:'timeseries', tick:{format:'%Y-%m-%d'}};
	g.data.columns = columns;
}

// 3D chart by Vis.js
G.new3D = function() {
  return {
		dataSet:new vis.DataSet(),
		options:{
      width:  '95%',
      height: '95%',
      style: 'surface',
      showPerspective: true,
      showGrid: true,
      showShadow: false,
      keepAspectRatio: true,
      verticalRatio: 0.5
    }
	}
}

// style : surface, grid, bar, bar-color, bar-size, dot, dot-line, dot-color, dot-size, line

G.chart3D = function(chartName, style, f) {
	var g = G.new3D();
  // create some nice looking data with sin/cos
  var counter = 0;
  var steps = 50;  // number of datapoints will be steps*steps
  var axisMax = 314;
  var axisStep = axisMax / steps;
  for (var x = 0; x < axisMax; x+=axisStep) {
    for (var y = 0; y < axisMax; y+=axisStep) {
      var value = f(x,y);
      g.dataSet.add({id:counter++,x:x,y:y,z:value,style:value});
    }
  }
	g.options.style=style;
	G.tgMap[chartName] = {type:'3D',graph:g};
	var box=document.getElementById(chartName.replace('#',''));
  new vis.Graph3d(box, g.dataSet, g.options);
}

/*
G.cloneCanvas=function(oldCanvas) {
	assert(typeof oldCanvas !== 'undefined');
	var newCanvas = document.createElement('canvas');
	var context = newCanvas.getContext('2d');
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;
	context.drawImage(oldCanvas, 0, 0); // 這行OK, drawImage 的第一個參數可以是 canvas, 不一定要是 image。
	return newCanvas;
}
*/

G.loadImage = function(url, callback) {
	var image = new Image();
	image.addEventListener("load", function() { 
	  callback(image);
	}, false);
  image.src = url;
}

function assert(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

G.cloneCanvas = function(width, height, oldCanvas) {
	var newCanvas = document.createElement('canvas');
	var context = newCanvas.getContext('2d');
	newCanvas.width = width;
	newCanvas.height = height;
	context.fillStyle = "black";
	context.fillRect(0,0,newCanvas.width, newCanvas.height);
	context.drawImage(oldCanvas, 0, 0); // 這行OK, drawImage 
	return newCanvas;
}

G.showCanvas = function(chartName, g) {
	var box=document.getElementById(chartName.replace('#',''));		
	var rect = box.getBoundingClientRect();
	var canvas = G.cloneCanvas(rect.width, rect.height, g.canvas);
	box.innerHTML = '';
	box.appendChild(canvas);
}

G.getImageData = function(canvas, x, y, width, height) {
	x=x||0; y=y||0; width=width||canvas.width; height=height||canvas.height;
	return canvas.getContext('2d').getImageData(x,y,width,height);
}

G.gray=function(idata) {
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

G.bright = function(idata, adjustment) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    d[i] += adjustment;
    d[i+1] += adjustment;
    d[i+2] += adjustment;
  }
}

G.threshold = function(idata, threshold) {
  var d = idata.data;
  for (var i=0; i<d.length; i+=4) {
    var r = d[i];
    var g = d[i+1];
    var b = d[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    d[i] = d[i+1] = d[i+2] = v
  }
}

var tmpCanvas = document.createElement('canvas');
var tmpCtx = tmpCanvas.getContext('2d');

G.createImageData = function(w,h) {
  return tmpCtx.createImageData(w,h);
}

G.convolute = function(idata, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);
  var src = idata.data;
  var sw = idata.width;
  var sh = idata.height;
  // pad output by the convolution matrix
  var w = sw;
  var h = sh;
  var output = G.createImageData(w, h);
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

if (!window.Float32Array)
  Float32Array = Array;

G.convoluteFloat32 = function(pixels, weights, opaque) {
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
}

G.sharpen=function(idata) {
	var weights = 
	[  0, -1,  0,  
	  -1,  5, -1, 
		0, -1,  0 ];
	return G.convolute(idata, weights);
}

G.blurC = function(idata) {
  var weights = 
  [ 1/9, 1/9, 1/9,
    1/9, 1/9, 1/9,
    1/9, 1/9, 1/9 ];
	return G.convolute(idata, weights);
}

G.sobel = function(px) {
  G.gray(px);
	var vertical = G.convoluteFloat32(px,
		[-1,-2,-1,
			0, 0, 0,
			1, 2, 1]);
	var horizontal = G.convoluteFloat32(px,
		[-1,0,1,
		 -2,0,2,
		 -1,0,1]);
	var id = G.createImageData(vertical.width, vertical.height);
	for (var i=0; i<id.data.length; i+=4) {
		var v = Math.abs(vertical.data[i]);
		id.data[i] = v;
		var h = Math.abs(horizontal.data[i]);
		id.data[i+1] = h
		id.data[i+2] = (v+h)/4;
		id.data[i+3] = 255;
	}
	return id;
}

// 2D canvas by HTML5
G.newCanvas = function() {
	var canvas = document.createElement('canvas');
	canvas.width = G.canvas.width; canvas.height=G.canvas.height;
	var g = { canvas:canvas };
  return g;
}

G.drawCanvas = function(chartName, f) {
	var g = G.newCanvas();
	f(g.canvas.getContext('2d'), g.canvas);
	var tg = {type:'Canvas', graph:g};
	G.tgMap[chartName] = tg;
	return G.show(chartName, tg);
}

