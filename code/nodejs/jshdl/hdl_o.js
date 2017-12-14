var c = console;

var Chip = function(i, o) {
	this.i = i;
	this.o = o;
}

Chip.prototype.eval=function() {}

var Xor = function(i, o) {
	this.prototype = Chip;
	this.prototype(i,o)
}

Xor.prototype.eval=function() {
	c.log("this.i=%j", this.i);
	this.o.v = (this.i.x ^ this.i.y);
}

var i = {x:0,y:1}, o={};
var xor = new Xor(i, o);

xor.eval();

c.log("xor(%j)=%j", i, o);
