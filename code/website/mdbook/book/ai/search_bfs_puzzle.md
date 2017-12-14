
# 實作：以廣度優先搜尋解決拼圖問題

### 前言

以下的「拼圖問題」是將一個已經移動打亂過的拼盤，想辦法移動回原本樣子的問題。

![圖、本文程式中的拼圖問題](puzzle.jpg)

在以下程式中，我們用一個 3*3 的陣列來代表拼盤，並且用數字 0 來代表其中的空格，因此將方塊 2 移動到空格，其實是用將 0 與 2 兩個數字位置交換所達成的。

透過這樣的資料結構，我們就可以用「廣度優先搜尋」(BFS) 來解決拼圖問題了，以下是我們用 JavaScript 實作，並用 node.js 進行測試的結果。

### 程式實作：拼圖問題

檔案：puzzleSearch.js

```javascript
var util = require("util");
var log = console.log;
var up = 1, right=2, down=3, left=4;

function enqueue(a, o) { a.push(o); }
function dequeue(a) { return a.shift(); }
function equal(a, b) { return JSON.stringify(a)===JSON.stringify(b); }
function board2str(b) { return b.join("\n"); }

function findXY(board, value) {
  for (var x=0; x<board.length; x++)
    for (var y=0; y<board[x].length; y++)
      if (board[x][y] === value)
        return {x:x,y:y};
  return null;
}

function boardClone(b) {
  var nb = [];
  for (var x in b)
    nb[x] = b[x].slice(0);
  return nb;
}

function swap(b,x1,y1,x2,y2) {
  x2 = Math.round(x2), y2=Math.round(y2);
  if (x2<0 || x2 > 2 || y2<0 || y2>2) 
    return false;
  var t = b[x1][y1];
  b[x1][y1]=b[x2][y2];
  b[x2][y2]=t;
  return true;
}

function move(board, dir) {
  var xy = findXY(board, 0);
  var x = xy.x, y=xy.y;
  var nboard = boardClone(board);
  var s = false;
  switch (dir) {
    case up:    s=swap(nboard,x,y,x-1,y); break;
    case right: s=swap(nboard,x,y,x,y+1); break;
    case down:  s=swap(nboard,x,y,x+1,y); break;
    case left:  s=swap(nboard,x,y,x,y-1); break;
  }
  if (s)
    return nboard;
  else
    return null;
}

function moveAdd(board, dir, neighbors) {
  var nboard = move(board, dir);
  if (nboard !== null) {
    neighbors.push(nboard);
  }
}

function getNeighbors(board) {
  var neighbors = [];
  moveAdd(board, up,    neighbors);
  moveAdd(board, down,  neighbors);
  moveAdd(board, right, neighbors);
  moveAdd(board, left,  neighbors);
  return neighbors;
}

var goal = [[1,2,3], 
            [8,0,4],
            [7,6,5]];

var start= [[1,3,4], 
            [8,2,5],
            [7,0,6]];

var queue=[start];            // BFS 用的 queue, 起始點為 1。
var visited={};
var parent={};
var level={};

function bfs(q, goal) { // 廣度優先搜尋
  while (q.length > 0) {
    var node = dequeue(q);     // 否則、取出 queue 的第一個節點。
    var nodestr = board2str(node);
//  log("q.length=%d level=%d\n===node===\n%s==parent==\n%s", q.length, level[nodestr], nodestr, parent[nodestr]); // 印出節點
    if (equal(node, goal)) return true;
    if (visited[nodestr]===undefined)        // 如果該節點尚未拜訪過。
      visited[nodestr] = true; //   標示為已拜訪
    else                       // 否則 (已訪問過)
      continue;                //   不繼續搜尋，直接返回。
    var neighbors = getNeighbors(node); // 取出鄰居。
    for (var i in neighbors) { // 對於每個鄰居
      var n = neighbors[i];
      var nstr = board2str(n);
      if (!visited[nstr]) {    // 假如該鄰居還沒被拜訪過
        parent[nstr] = nodestr;
	level[nstr] = level[nodestr] + 1;
        enqueue(q, n);         //   就放入 queue 中
      }
    }
  }
  return false;
}

function backtrace(goal) {
  log("======= backtrace =========");
  var nodestr = board2str(goal);
  while (nodestr !== undefined) {
    log("%s\n", nodestr);
    nodestr = parent[nodestr];
  }
}

level[board2str(start)]=0;
var found = bfs(queue, goal); // 呼叫廣度優先搜尋。
log("bfs:found=%s", found);
if (found)
  backtrace(goal);
```

### 執行結果

```
D:\Dropbox\Public\web\ai\code\search>node puzzleSearch.js
bfs:found=true
======= backtrace =========
1,2,3
8,0,4
7,6,5

1,0,3
8,2,4
7,6,5

1,3,0
8,2,4
7,6,5

1,3,4
8,2,0
7,6,5

1,3,4
8,2,5
7,6,0

1,3,4
8,2,5
7,0,6
```

### 結語

在上述執行結果中，我們是將盤面拼完後，才逆向追蹤印出移動過程，因此整個移動方法應該從最下面的盤面看起。換句話說，真正的順序如下：

```
1,3,4    1,3,4    1,3,4     1,3,0    1,0,3    1,2,3
8,2,5 => 8,2,5 => 8,2,0 =>  8,2,4 => 8,2,4 => 8,0,4
7,0,6    7,6,0    7,6,5     7,6,5    7,6,5    7,6,5
```

從上面過程中，您可以看出我們的程式將打亂的盤面給拼回來了。

【本文由陳鍾誠取材並修改自 [維基百科]，採用創作共用的 [姓名標示、相同方式分享] 授權】

