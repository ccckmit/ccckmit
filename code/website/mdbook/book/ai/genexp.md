* <https://pdos.csail.mit.edu/archive/scigen/>

接著請想想，這種程式該怎麼做呢？

讓我們用一個更簡單的例子示範，那就是自動產生數學運算式。

檔案： @[[genexp]](code/genexp.js)

```
// === BNF Grammar =====
// E = T [+-*/] E | T
// T = [0-9] | (E)

function print(s) {
	process.stdout.write(s);
}

// 用法:randInt(3,7) 會傳回 3,4,5,6,7 其中之一
function randInt(a, b) { // 隨機傳回一個介於 (a,b) 間的整數 (包含 a, b)
	return Math.floor((Math.random() * (b-a+1)) + a);
}

function randChar(str) {
  var len = str.length;
  var i = randInt(0, len-1);
  return str[i];
}

function E() {
	if (randInt(1,10) <= 5) {
		T(); print(randChar("+-*/")); E();
	} else {
		T();
	}
}

function T() {
	if (randInt(1,10) < 7) {
		print(randChar("0123456789"));
	} else {
		print("("); E(); print(")");
	}
}

for (var i=0; i<10; i++) {
	E();
	print("\n");
}
```

執行結果

```
nqu-192-168-61-142:code mac020$ node genexp
4
0/0+(2)*9
4-(9)*((((3*(4))-(8))+(0)+8/(8)+2)+2/6)
3/(((((1*8+6)))))*((6/4/3))/(((2+9))+(((2))+8/((4*(5))*2))/4)
(1+(1))-((7))
(2+(((4))))+(5)
((1/(((3+(7)-(4-1)/9*8/7-6)/(4)-3+3)-6-9*(((2+(((6*4/4)))*(8/3))))-9-0-1+5*8*((5)/(3)-1/(1)-9)+(5+5*5))))*5/2
8
1
(0)*7
```

