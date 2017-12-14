# 網頁畫布 Canvas

## 參考文獻

* 重要： [MDN : Canvas 教學文件](https://developer.mozilla.org/zh-TW/docs/Web/Guide/HTML/Canvas_tutorial)
* 讚！ [HTML5 Canvas Image Tutorial](http://www.html5canvastutorials.com/tutorials/html5-canvas-images/)
* <http://www.w3schools.com/tags/canvas_drawimage.asp>
* [淺談Canvas - save/restore](http://blog.ring.idv.tw/comment.ser?i=386)

## [HTML5 Canvas Image Tutorial](http://www.html5canvastutorials.com/tutorials/html5-canvas-images/) 的範例

範例 1 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-line-width/>

範例 2 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-line-caps/>

範例 3 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-circles/>

範例 4 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-rectangles/>

範例 5 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-transform-rotate-tutorial/>

範例 6 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-text-color/>

範例 7 ： <http://www.html5canvastutorials.com/tutorials/html5-canvas-images/>

範例 8 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-invert-image-colors-tutorial/>

範例 9 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-grayscale-image-colors-tutorial/>

範例 10 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-save-drawing-as-an-image/>

範例 11 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-animation-stage/>

範例 12 ： <http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/>

## 我的綜合範例

範例 ：  [canvas.html](code/canvas/canvas.html)

```
<!DOCTYPE html>
<html>
<body>
<img id="ball" width="220" height="277" src="ball.jpg" alt="The Scream" style="display:none">
<p>Canvas:</p>
<canvas id="myCanvas" width="240" height="297" style="border:1px solid #d3d3d3;"/>
<script>
window.onload = function() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var img = document.getElementById("ball");
  ctx.drawImage(img, 10, 100);
  ctx.beginPath();
  ctx.strokeStyle="red";
  ctx.rect(20,20,40,40);
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle="#0000FF";
  ctx.fillRect(80,20,50,50);
  ctx.stroke();   
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.arc(100,75,50,0,2*Math.PI);
  ctx.stroke();   
}
</script>

</body>
</html>

```

## 移動球 1

檔案： [ballmove1.html](code/canvas/ballmove1.html)

```
<!DOCTYPE html>
<html>
<body>
<img id="ball" src="ball.jpg" alt="The Scream">
<p>Canvas:</p>
<canvas id="myCanvas" width="300" height="300" style="border:1px solid #d3d3d3;"/>
<script>
var img, ctx, canvas;
var x=0, y=0;

window.onload = function() {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  img = document.getElementById("ball");
  setTimeout(draw, 100);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y);
	x+=10; y+=10;
  setTimeout(draw, 100);	
}

</script>

</body>
</html>

```

## 移動球 2

檔案： [ballmove2.html](code/canvas/ballmove2.html)

```html
<!DOCTYPE html>
<html>
<body>
<img id="ball" width="220" height="277" src="ball.jpg" alt="The Scream" style="display:none">
<p>Canvas:</p>
<canvas id="myCanvas" width="240" height="297" style="border:1px solid #d3d3d3;"/>
<script>
var img, ctx, canvas;
var x=0, y=0;

window.onload = main;

function update() {
	x+=2; y+=2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y);
}

function main() {
  img = document.getElementById("ball");
  canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	var loop = function() {
		update();
		draw();
		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}

</script>

</body>
</html>

```

## 網頁手繪板

本程式簡化自以下文章中的範例，該範例可選顏色與粗細，但為了讓初學整更容易懂，筆者將顏色固定為黑色，粗細固定為 3，並去除了相關的程式碼。

* [[黑暗執行緒 -- 用100行實現HTML5可存檔塗鴉版]](http://blog.darkthread.net/post-2011-10-30-html5-canvas-sktechpad.aspx)


檔案： [painter.html](http://ccc.nqu.edu.tw/db/jsb/code/painter.html)

```
<!DOCTYPE html>
<html>
<head>
    <title>範例 -- 手寫板</title>
    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.6.4.js">
    </script>
    <script>
        var p_color = "black";
        var p_width = 3;
        $(function () {
            //取得canvas context
            var $canvas = $("#cSketchPad");
            var ctx = $canvas[0].getContext("2d");
            ctx.lineCap = "round";
            ctx.fillStyle = "white"; //整個canvas塗上白色背景避免PNG的透明底色效果
            ctx.fillRect(0, 0, $canvas.width(), $canvas.height());
            var drawMode = false;
            //canvas點選、移動、放開按鍵事件時進行繪圖動作
            $canvas.mousedown(function (e) {
                ctx.beginPath();
                ctx.strokeStyle = p_color;
                ctx.lineWidth = p_width;
                ctx.moveTo(e.pageX - $canvas.position().left, e.pageY - $canvas.position().top);
                drawMode = true;
            })
            .mousemove(function (e) {
                if (drawMode) {
                    ctx.lineTo(e.pageX - $canvas.position().left, e.pageY - $canvas.position().top);
                    ctx.stroke();
                }
            })
            .mouseup(function (e) {
                drawMode = false;
            });
        });
    </script>
</head>
<body>
 <div id="dCanvas">
  <canvas id="cSketchPad" width="300" height="300" style="border: 2px solid gray" />
 </div>
</body>
</html>
```

## 參考文獻
* 進階繪圖套件 -- [2D WebGL 與 PIXI.js](http://blog.infographics.tw/2015/12/pixi-introduction/)