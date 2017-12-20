x=3.14159;

Number.prototype.toString = function() {
  return this.toFixed(3);
}

console.log("x=%d", x);