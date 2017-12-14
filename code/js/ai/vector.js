var log = console.log;

var Vector=function(array) {
  this.a = array.slice(0);
}

Vector.prototype.precision = 3;

Vector.prototype.toStr=function(precision) {
  var rzStr = "", a = this.a;
  for (var i=0; i<a.length; i++) {
    if (a[i]>=0)
      rzStr+=a[i].toFixed(precision)+" ";
    else
      rzStr+=a[i].toFixed(precision)+" ";
  }
  return "["+rzStr.trim().replace(/ /gi, ",")+"]";
}

Vector.prototype.toString=function() {
  return this.toStr(this.precision);
}

Vector.prototype.mul=function(v2) {
  var a = this.a;
  var sum = 0;
  for (var i=0; i<a.length; i++) {
    sum += a[i]*v2.a[i];
  }
  return sum;
}

Vector.prototype.add=function(v2) {
  var r = new Vector(this.a);
  for (var i=0; i<r.a.length; i++) {
    r.a[i] = this.a[i]+v2.a[i];
  }
  return r;
}

Vector.prototype.neg=function() {
  for (var i=0; i<r.a.length; i++) {
    this.a[i] *= -1;
  }
  return this;
}

Vector.test=function() {
  var v1=new Vector([1,2,3]);
  var v2=new Vector([3,2,1]);
  Vector.prototype.precision = 0;
  log("v1=%s v2=%s", v1, v2);
  log("v1=%s v2=%s", v1, v2);
  log("v1+v2=%s", v1.add(v2));
  log("v1*v2=%s", v1.mul(v2));
}

Vector.test();

module.exports = Vector;

