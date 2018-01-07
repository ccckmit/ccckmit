class Number {
  power(n) {
    var p = this;
    for (var i=1; i<n; i++) {
        p = p.mul(this);
    }
    return p;
  }
}

var p = precision = 2
module.exports = class Complex extends Number {
  constructor(r,i) {
    super()
    this.r = r; 
    this.i = i;
  }

  static parse(s) {
    var m = s.match(/^([^\+]*)(\+(.*))?$/);
    var a = parseFloat(m[1]);
    var b = typeof m[3]==='undefined'?0:parseFloat(m[3]);
    return new Complex(a, b)
  }

  static expi(x) {
    return new Complex(Math.cos(x), Math.sin(x))
  }

  add(c2) {
    return new Complex(this.r+c2.r, this.i+c2.i)
  }

  sub(c2) {
    return new Complex(this.r-c2.r, this.i-c2.i)
  }

  mul(c2) {
    return new Complex(this.r*c2.r-this.i*c2.i, 
                       this.r*c2.i+this.i*c2.r)
  }

  toString() {
    return this.r.toFixed(p) + (this.i<0?this.i.toFixed(p):'+'+this.i.toFixed(p)) + 'i' 
  }
}