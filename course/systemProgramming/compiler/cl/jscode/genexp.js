var R=require("./randomLib");

/*
E = N | E [+/-*] E | (E)
N = 0-9
*/

function E() {
    var gen = R.sample(["N", "EE", "E"]);
    if (gen  === "N") {
        return N();
    } else if (gen === "EE") {
        return E() + R.sample(["+", "-", "*", "/"]) + E();
    } else {
        return "("+E()+")";
    }
}

function N() {
    return R.sample(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
}

var e = E();
console.log(e, "=", eval(e));