function add(a, b) {
  var c=[];
  if (a.length == b.length) {
    for (var i=0; i<a.length; i++) {
	  c[i] = a[i] + b[i];
	}
  } else {
    console.log("error");
  }
  return c;
}

var c=add([1,2,3,4], [4,3,2,1]);
console.log("c=", c);
