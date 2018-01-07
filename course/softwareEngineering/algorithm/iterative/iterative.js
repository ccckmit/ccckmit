// https://ccckmit.gitbooks.io/rlab/content/solveEquation.html

function f(x) { return x*x-4*x+1; }

function g(x) { return x-f(x)/4; }

function isolve(g, x) {
  console.log("x=", x);
  for (var i=0; i<100000; i++) {
    if (Math.abs(x-g(x)) < 0.001)
      return x;
    x = g(x);
    console.log("x=", x);
  }
  return x;
}

var x = isolve(g, 1)
console.log("x=", x, "f(x)=", f(x))