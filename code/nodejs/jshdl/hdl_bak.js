var c = console;

var Chip = function() {
	
}

Chip.prototype.eval=function() {}

var Xor = function() {
	this.prototype = Chip;
	this.prototype()
}

Xor.prototype.eval = function(i) {
	return i.x ^ i.y;
}

var i = {x:0,y:1};
var xor = new Xor();
var o = xor.eval(i);

c.log("xor(%j)=%j", i, o);

var Xor3 = function() {
	
	this.xor1 = Xor();
	this.xor2 = Xor(); 
	
}

Xor3.prototype.eval = function(i) {
	return i.x ^ i.y ^ i.z;
}
