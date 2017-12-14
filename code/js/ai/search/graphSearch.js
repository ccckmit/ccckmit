var util = require("util");

var printf = function() {
  return process.stdout.write(util.format.apply(null, arguments)); 
}

function enqueue(a, o) { a.push(o); }
function dequeue(a) { return a.shift(); }

var g = {            // graph: 被搜尋的網路
  1: {n:[2,5], v:0}, // n: neighbor (鄰居), v: visited (是否被訪問過)
  2: {n:[3,4], v:0},
  3: {n:[4,5,6], v:0},
  4: {n:[5,6], v:0},
  5: {n:[6], v:0},
  6: {n:[], v:0}
};

function init(g) { // 初始化、設定 visited 為 0
  for (i in g) g[i].v = 0;
}

function dfs(g, node) { // 深度優先搜尋
  if (g[node].v !=0) return;   // 如果已訪問過，就不再訪問
  printf("%d=>", node);       // 否則、印出節點
  g[node].v = 1;              //   並設定為已訪問
  var neighbors = g[node].n;  // 取出鄰居節點
  for (var i in neighbors) {  // 對於每個鄰居
    dfs(g, neighbors[i]);     //   逐一進行訪問
  }
}

var queue=[1];            // BFS 用的 queue, 起始點為 1。

function bfs(g, q) { // 廣度優先搜尋
  if (q.length == 0) return; // 如果 queue 已空，則返回。
  var node = dequeue(q);     // 否則、取出 queue 的第一個節點。
  if (g[node].v == 0)        // 如果該節點尚未拜訪過。
    g[node].v = 1;           //   標示為已拜訪
  else                       // 否則 (已訪問過)
    return;                  //   不繼續搜尋，直接返回。
  printf("%d=>", node);      // 印出節點
  var neighbors = g[node].n; // 取出鄰居。
  for (var i in neighbors) { // 對於每個鄰居
    var n = neighbors[i];
    if (!g[n].visited)       // 假如該鄰居還沒被拜訪過
      q.push(n);             //   就放入 queue 中
  }
  bfs(g, q);
}

printf("dfs:"); init(g); dfs(g, 1); printf("\n");     // 呼叫深度優先搜尋。
printf("bfs:"); init(g); bfs(g, queue); printf("\n"); // 呼叫廣度優先搜尋。

