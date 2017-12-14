var c = console;

var Chip=function(chip) {
	this.in      = chip.in.split(",");
	this.out     = chip.out.split(",");
	this.parts   = chip.parts;
//	this.dirtyListener = chip.parts.concat([]);
	this.isDirty = true;
	c.log("Chip=%j", this);
}

var pChip = Chip.prototype;

pChip.isClocked = false;

pChip.create = function(inPins) {
	var o = { in:inPins, out:{} };
	for (var i in this.out) {
		var oname = this.out[i];
		o.out[oname] = null;
	}
	return o;
}

pChip.eval = function(oChip) {
	if (this.isDirty) {
	  this.isDirty = false;
	  for (var i in this.parts) {
		  c.log("part=%j", this.parts[i]);		  
		  this.parts[i].chip.eval(ctx);
	  }
	}
}

var Nand = new Chip({
	in: "a,b",
	out: "o",
	parts:[]
});

Nand.eval = function(ctx) {
	ctx.out.o = !(ctx.in.a && ctx.in.b);
}

var nand1 = Nand.create({ a:true, b:true });
Nand.eval(nand1);
c.log("nand=%j", nand1);

var Not = new Chip({
	in: "i",
	out: "o",
	parts: [
		{ chip: Nand, a:"i", b:"i", o:"o"}
	]
});

var not1 = Not.create({ i:true });
Not.eval(not1);

c.log("not1=%j", not1);


/*
pChip.reCompute = function() {
	
}


var Pin = function(name, ptype, clocked) {
    
}
*/


/*
pChip.eval = function() {
	if (isDirty)
	  for ()
//    	doEval();
}

// Recomputes the gate's outputs.
pChip.doEval() {
	if (isDirty) {
		isDirty = false;
		// notify listeners
		for (chip of dirtyListener)
			chip.gotClean();
	}
	reCompute();
}

pChip.clockUp=function() {
	if (this.isClocked)
		for (var i in this.parts)
			this.parts[i].tick();
}

pChip.clockDown=function() {
	if (this.isClocked)
		for (var i in this.parts)
			parts[i].tock();
}

pChip.reCompute=function() {
	for (var i in parts)
		parts[i].eval();
}

pChip.setDirty = function() {
	this.isDirty = true;
	for (chip of dirtyListener) {
		chip.gotDirty();
	}
}
*/

/*
var xor = {
	in: "a,b",
	out: "out",
	parts: {
		nand:{a:"a", b:"b", out:"AnandB"},
		or:{a:"a", b:"b", out:"AorB"},
		and:(a:"AnandB", B:"AorB", c:"out")
	}
}
*/

/*

var c = console;

Xor = {}
Xor.eval = function(i) {
	return i.x ^ i.y;
}

var i2 = {x:0,y:1};
c.log("xor(%j)=%j", i2, Xor.eval(i2));

Xor3 = {}
Xor3.eval = function(i) {
	var o1 = Xor.eval({x:i.x, y:i.y});
	return Xor.eval({x:o1, y:i.z});
}

var i3 = {x:0, y:1, z:1};
c.log("xor3(%j)=%j", i3, Xor3.eval(i3));
*/