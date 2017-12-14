var util = require("util");
var r = require('readline').createInterface(process.stdin, process.stdout);
var log = console.log;
var format = function() {
  return util.format.apply(null, arguments);
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Board = function() {
  this.turn = 'o';
  this.m = [];
  for (var r=0; r<16; r++) {
    this.m[r] = [];
    for (var c=0; c<16; c++)
      this.m[r][c] = '-';
  }
}

Board.prototype.toString = function() {
  var str = "  0 1 2 3 4 5 6 7 8 9 a b c d e f\n";
  for (var r=0; r<16; r++) {
    str += r.toString(16)+" "+this.m[r].join(" ")+" "+r.toString(16)+"\n";
  }
  str += "  0 1 2 3 4 5 6 7 8 9 a b c d e f\n";
  return str;
}

Board.prototype.show = function() {
  log(this.toString());
}

Board.prototype.prompt = function() {
  var msg = format('put %s at : ', this.turn);
  r.setPrompt(msg);
  r.prompt();
}

Board.prototype.peopleTurn = function(line) {
  var r = parseInt(line[0], 16);
  var c = parseInt(line[1], 16);      
  if (r<0 || r>15 || c<0 || c>15) throw "(row, col) out of range!";
  if (this.m[r][c] != '-')
    throw format("(%s%s) is occupied!", line[0], line[1]);
  this.m[r][c] = 'o';
}

Board.prototype.computerTurn = function() {
  while (true) {
    var r = randomInt(0, 16);
    var c = randomInt(0, 16);
    if (this.m[r][c] == '-')
      break;
  }
  this.m[r][c] = 'x';
}

var zero = [ 0, 0, 0, 0, 0];
var inc  = [-2,-1, 0, 1, 2];
var dec  = [ 2, 1, 0,-1,-2];

Board.prototype.patternCheck=function(turn, r, c, dr, dc) {
  for (var i = 0; i < dr.length; i++) {
	  var tr = Math.round(r+dr[i]);
		var tc = Math.round(c+dc[i]);
		if (tr<0 ||tr > 15 || tc<0 || tc>15)
		  return false;
    var v = this.m[tr][tc];
    if (v != turn) return false;
  }
  return true;
}

Board.prototype.winCheck = function(turn) {
  for (var r=0; r<16; r++) {
    for (var c=0; c<16; c++) {
      if (this.patternCheck(turn, r, c, zero, inc)) // 垂直 | ;
        return true;
      if (this.patternCheck(turn, r, c, inc, zero)) // 水平 - ;
        return true;
			if (this.patternCheck(turn, r, c, inc, inc)) // 上斜 / ;
			  return true;
      if (this.patternCheck(turn, r, c, inc, dec)) // 下斜 \ ;
			  return true;
    }
  }
	return false;
}

var b = new Board();

b.show();
b.prompt();
r.on('line', function(line) {
  try {
    b.peopleTurn(line);
		if (b.winCheck('o')) { 
		  log("恭喜、你贏了！"); 
			process.exit(0);
	  }
    b.computerTurn();
		if (b.winCheck('x')) { 
		  log("可惜、你輸了！"); 
			process.exit(0);
	  }				
    b.show();
	} catch (error) {
	  log(error);
	}
  b.prompt();
}).on('close', function() {
  process.exit(0);
});
