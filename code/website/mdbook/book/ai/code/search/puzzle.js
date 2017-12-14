var log = console.log;

var goal = [[1,2,3], 
            [8,0,4],
            [7,6,5]];

var start= [[1,3,0], 
            [8,2,4],
            [7,6,5]];

var history = {};
var up = 1, right=2, down=3, left=4;

function board2str(b) {
  var rzStr = "";
  for (var i in b)
    rzStr += b[i].toString()+"\n";
  return rzStr;
}

function findXY(board, value) {
  for (var x in board)
    for (var y in board[x])
      if (board[x][y] === value)
        return {x:x,y:y};
  return null;
}

function boardClone(b) {
  var nb = [];
  for (var x in b) {
    nb[x] = [];
    for (var y in b[x])
      nb[x][y] = b[x][y];
  }
  return nb;
}

function swap(b,x1,y1,x2,y2) {
  x2 = Math.round(x2), y2=Math.round(y2);
  if (x2<0 || x2 > 2 || y2<0 || y2>2) 
    return false;
//  log("x1=%d, y1=%d, x2=%d, y2=%d", x1, y1, x2, y2);
//  log("b=", b);
  var t = b[x1][y1];
//  log("b[x2]=", b[x2], "b[1]=", b[1]);
  b[x1][y1]=b[x2][y2];
  b[x2][y2]=t;
  return true;
}

function move(board, dir) {
  var xy = findXY(board, 0);
  var x = xy.x, y=xy.y;
//  log("xy", xy);
  var nboard = boardClone(board);
//  log("nboard", nboard);
  var s = false;
  switch (dir) {
    case up:    s=swap(nboard,x,y,x-1,y); break;
    case right: s=swap(nboard,x,y,x,y+1); break;
    case down:  s=swap(nboard,x,y,x+1,y); break;
    case left:  s=swap(nboard,x,y,x,y-1); break;
  }
//  log("s=", s);
  if (s)
    return nboard;
  else
    return null;
}

var visited = {};

function dfs(from, to) {
  var fs = board2str(from), ts = board2str(to);
//  log("=========================");
//  log(fs);
  if (from === null) return false;
  if (fs === ts) return true;
  if (visited[fs] === undefined) {
    visited[fs] = true;
    log("=========================");
    log(fs);
    dfs(move(from, up), to);
    dfs(move(from, right), to);
    dfs(move(from, down), to);
    dfs(move(from, left), to);
  }
}

var queue = [];

function bfs(from, to) {
  var fs = board2str(from), ts = board2str(to);
//  log("=========================");
//  log(fs);
  if (from === null) return false;
  if (fs === ts) return true;
  if (visited[fs] === undefined) {
    visited[fs] = true;
    log("=========================");
    log(fs);
    bfs(move(from, up), to);
    bfs(move(from, right), to);
    bfs(move(from, down), to);
    bfs(move(from, left), to);
  }
}

// log(board2str(start));
dfs(start, goal);
// log(visited["x"]);
