# 自動產生運算式2

```javascript
function rand(a,b) { 
	return a+Math.random()*(b-a); 
}

function randInt(a,b) { 
	return Math.floor(rand(a,b)); 
}

function randSelect(array) { 
	return array[randInt(0,array.length)]; 
}

/*
E = N | E [+/-*] E
N = 0-9
*/

function E() {
    var gen = randSelect(["N", "EE"]);
    if (gen  === "N") {
        return N();
    } else {
        return E() + randSelect(["+", "-", "*", "/"]) + E();
    } 
}

function N() {
    return randSelect(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
}

var e = E();
console.log(e, "=", eval(e));
```

執行結果

```
NQU-192-168-60-101:ccc csienqu$ node genexp.js
7 = 7
NQU-192-168-60-101:ccc csienqu$ node genexp.js
6*4-6+8/3 = 20.666666666666668
NQU-192-168-60-101:ccc csienqu$ 

```
