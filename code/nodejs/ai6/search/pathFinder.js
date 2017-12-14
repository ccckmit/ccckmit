var log = console.log;

function matrixPrint(m) {
  for(var i=0;i<m.length;i++)
    log(m[i]);
}

function strset(s, i, c) {
  return s.substr(0, i) + c + s.substr(i+1);
}

function findPath(m, x, y) {
  log("=========================");
  log("x="+x+" y="+y);
  matrixPrint(m);
  if (x>=6||y>=8) return false;
  if (m[x][y] == '*') return false;
  if (m[x][y] == '+') return false;
  if (m[x][y] == ' ') m[x] = strset(m[x], y, '.');
  if (m[x][y] == '.' && (x == 5 || y==7)) 
    return true;
  if (y<7&&m[x][y+1]==' ') //向右
    if (findPath(m, x,y+1)) return true;
  if(x<5&&m[x+1][y]==' ') //向下
    if (findPath(m, x+1,y)) return true;
  if(y>0&&m[x][y-1]==' ') //向左
    if (findPath(m, x,y-1)) return true;
  if(x>0&&m[x-1][y]==' ') //向上
    if (findPath(m, x-1,y)) return true;
  m[x][y]='+';
  return false;
}

var m =["********", 
        "** * ***",
        "     ***",
        "* ******",
        "*     **",
        "***** **"];
	
findPath(m, 2, 0);
log("=========================");
matrixPrint(m);
