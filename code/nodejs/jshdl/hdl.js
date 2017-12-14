// Gate : A chip instance.
// GateClass : A factory and information source for gates
// CompositeGateClass : A GateClass for composite gates.
// node : a wire (or a complete bus) in a circuit.
// SubNode : extends Node , A node that represents a sub-bus.
// DirtyGateListener : An interface for objects that want to be notified on a change in the isDirty
// DirtyGateAdapter : extends Node, A node which has a gate, and calls the gate's setDirty() method whenever its (the node's) value changes.
// Connection : Represents an internal gate connection between two pins.
// SubBusListeningAdapter : A Node that receives a target node and low & high bit indice of a sub bus. When the value of this node changes, it only changes the appropriate sub bus of the target node.
// PinInfo : Holds information on a gate's pin.


var c = console;

function parsePins(str) {
	var regex = /(\w+)(\[(\d+)(\.\.(\d+))?\])?/;
	if (str.match(regex)) {
		var name = RegExp.$1;
		var from = RegExp.$3;
		var to   = RegExp.$5;
		return { name:name, from:parseInt(from), to:parseInt(to) };
	}
	return null;
}

function parseAssign(str) {
	var tokens = str.split("=");
	var L      = parsePins(tokens[0]);
	var R      = parsePins(tokens[1]);	
	return {L:L, R:R};
}

function parseAssignMap(str) {
	var assigns = str.split(",");
	var assignMap = {};
	for (var i in assigns) {
		var LR = parseAssign(assigns[i]);
		var name = LR.L.name;
		if (typeof assignMap[name] === "undefined")
			assignMap[name] = [ LR ];
		else
			assignMap[name].push(LR);
	}
	return assignMap;
}

var assigns = parseAssignMap("a=in[3..5], b=in[0..5], out[1..4]=out");
c.log("assigns="+JSON.stringify(assigns, null, 2));

var cChipMap = {};

var cChip=function(json) {
	this.type = json.type;
	this.pins = {};
    this.addPins(json.in, "in");
	this.addPins(json.out, "out");
	this.parts = [];
	for (var i in json.parts) {
		this.addPart(json.parts[i]);
	}
}

cChip.prototype.addPins=function(str, type) {
	var names = str.split(",");
	for (var i in names) {
		var name = names[i];
		this.pins[name] = {type:type};
	}	
}

cChip.prototype.addPart=function(str) {
	var regexp = /(\w+)\((.*)\)/;
	if (str.match(regexp)) {
		var type = RegExp.$1;
		var assigns = parseAssignMap(RegExp.$2);
		this.parts.push({type:type, assigns:assigns});
	}
}

cChip.prototype.toString=function() {
	return JSON.stringify(this, null, 2); 
}

var chip=function(json) {
    var chip = new cChip(json)
    cChipMap[json.type] = chip; 
    return chip;
}

var nand = chip({
    type : "nand",
	in: "a,b",
	out: "out",
	parts:[]
});

c.log("nand="+nand);

var not = chip({
    type : "not",
	in: "in",
	out: "out",
	parts: [
		"nand(a=in, b=in, out=out)"
	]
});

c.log("not="+not);

var oChip = function(type) {
	this.chip  = cChipMap[type];
	this.pins  = {};
	for (var name in this.chip.pins) {
		var pin = this.chip.pins[name];
		this.pins[name] = { type:pin.type, value:null };
	}
	this.parts = [];
	for (var i in this.chip.parts) {
		this.addPart(this.chip.parts[i]);
	}
}

oChip.prototype.addPart=function(cPart) {
	// 沒有加入 assigns 
	var oPart = new oChip(cPart.type);
	for (var i in cPart.assigns) {
		var tokens = cPart.assigns[i].split("=");
		var name   = tokens[0];
		var value  = tokens[1];
		oPart.pins[name].value = value; 
	}
	c.log("oPart=%s", oPart);
	this.parts.push(oPart);
}

oChip.prototype.assign=function(context, name, value) {
	// parts[i].value 已經指定為名稱了，例如 a=in
	// 接下來如何處理呢？ 
/*	
	c.log(" assign(%s=%s)", name, value);
	if (typeof value === "object") {
		var pin = value;
		this.pins[name].value = context[pin.].value;
	} else */ 
		this.pins[name].value = value; 	
}

oChip.prototype.eval=function(context, assigns) {
	for (var name in assigns) {
		var value = assigns[name];
		this.assign(context, name, value); 
	}
	c.log("eval(this)=%s", this);
	for (var i in this.parts) {
		var part = this.parts[i];
		c.log(" eval(part)=%s", part);
		part.eval(this.pins, part.pins);
	}
}

oChip.prototype.toString=function() {
	return this.chip.type+JSON.stringify(this.pins);
}

// c.log("cChipMap=%j", cChipMap);
/*
var not1 = new oChip("not");

c.log("not1=%s", not1);

not1.eval({}, {in:true});
*/


/*
var cPins=function(chip, name, type) {
	this.chip = chip;
	this.name = name;
	this.type = type;
	this.listener = [];
}

var cPart=function(host, str) {
	var regexp = /(\w+)\((.*)\)/;
	if (str.match(regexp)) {
		this.host = host;
		this.type = RegExp.$1;
		this.chip = cChipMap[type];
		var assigns = RegExp.$2.split(",");
		for (var i in assigns) {
			var tokens = assign.split("="); // assign : a=in
			var partPin = this.chip.getPin(tokens[0]);
			var chipPin = this.host.getPin(tokens[1]);
			partPin.listener.push(chipPin);
		}
		c.log("type=%s params=%j", type, params);
	}
}

var cChip=function(json) {
	this.pins = {};
    this.addPins(json.in, "in");
	this.addPins(json.out, "out");
	this.parts = [];
	for (var i in json.parts) {
		var part = new cPart(this, json.parts[i]);
		this.parts.push(part);
	}
	this.isDirty = true;
}

var pChip = cChip.prototype;

// pChip.isClocked = false;

pChip.addPins=function(str, type) {
	var names = str.split(",");
	for (var i in names) {
		var name = names[i];
		this.pins[name] = new cPins(this, name, type);
	}	
}

pChip.addPart=function(str) {
}

pChip.eval = function(oChip) {
	if (this.isDirty) {
	  this.isDirty = false;
	  for (var i in this.partsInfo) {
		  c.log("part=%j", this.partsInfo[i]);		  
		  this.parts[i].chip.eval(ctx);
	  }
	}
}


Nand.eval = function(ctx) {
	ctx.out.o = !(ctx.in.a && ctx.in.b);
}

var Not = chip({
    name : "not",
	in: "i",
	out: "o",
	parts: [
		"nand(a=i, b=i, o=o)"
	]
});
*/
/*
var not1 = Not.create({ i:true });
Not.eval(not1);

c.log("not1=%j", not1);
*/
/*
var Gate = function(chip, iPins) {
	var o = { chip:chip, in:iPins, out:{} };
	for (var i in this.out) {
		var oname = this.out[i];
		o.out[oname] = null;
	}
	return o;
}

var gate = function(chipName, iPins) {
    new Gate(chipMap[chipName], iPins)    
}

var nand1 = new Gate(Nand, { a:true, b:true });
Nand.eval(nand1);
c.log("nand=%j", nand1);
*/
