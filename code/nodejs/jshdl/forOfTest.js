"use strict"; 

var a=["a1", "a2", "a3"];
var o={ a:1, b:2, c:3 };
var c = console;
for (let x in a) {
	c.log("x=%s", x);
}

var t;
for (t of o) {
	c.log("t=%s", t);
}