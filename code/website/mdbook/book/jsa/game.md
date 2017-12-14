# JavaScript 遊戲設計

## 簡介

* maxwihlborg -- 怎麼用 Canvas 寫遊戲的教學影片！
   * 首頁： <http://maxwihlborg.com/experiments/>
   * 程式專案： <https://github.com/maxwihlborg/youtube-tutorials/>
   * 線上展示： <http://www.maxwihlborg.com/youtube-demos/>
   * 影片： <https://www.youtube.com/playlist?list=PLDu4C7CHISoKbi-do2VKUfS6cv36C57y4>
   * 原始碼： <https://github.com/maxwihlborg/youtube-tutorials>
* 乒乓球遊戲： <http://maxwihlborg.com/2014/02/08/pong/>
   * 程式碼： <https://github.com/maxwihlborg/youtube-tutorials/blob/master/pong/index.html>

## 範例一 : 移動球 (不順暢)

檔案： @[[ballmove1.html]](code/canvas/ballmove1.html)

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

## 範例二 : 移動球 (順暢)

檔案： @[[ballmove2.html]](code/canvas/ballmove2.html)

```
<!DOCTYPE html>
<html>
<body>
<img id="ball" src="ball.jpg" alt="The Scream" style="display:none">
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

## 遊戲設計 -- 碰撞球

檔案： @[[ballgame1.html]](code/canvas/ballgame1.html)

```
<!DOCTYPE html>
<html>
<body>
<img id="ball" src="ball.jpg" alt="The Scream" style="display:none">
<p>Canvas:</p>
<canvas id="myCanvas" width="240" height="297" style="border:1px solid #d3d3d3;"/>
<script>
var img, ctx, canvas;
var x=0, y=0;

window.onload = main;

var dx = 2, dy=2;
function update() {
  x+=dx; y+=dy;
  if (x < 0 && dx < 0)
    dx = -1 * dx;
  else if (x+img.width >= canvas.width && dx > 0)
    dx = -1 * dx;
  if (y < 0 && dy < 0)
    dy = -1 * dy;
  else if (y+img.height >= canvas.height && dy > 0)
    dy = -1 * dy;
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

## 進階參考

課程： [HTML5 Game Development](https://www.udacity.com/course/html5-game-development--cs255)