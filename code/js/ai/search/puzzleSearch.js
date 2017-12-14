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
