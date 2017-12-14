# 馬可夫語言產生器

檔案： @[[genMarkov.js]](jscode/genMarkov.js)

```javascript
/* N    V     P
N  0.3  0.5   0.2
V  0.7  0.1   0.2
P  0.6  0.1   0.3 */

var Q = [
	[0.3, 0.5, 0.2],
	[0.7, 0.1, 0.2],
	[0.6, 0.1, 0.3]
];

var states = ["N", "V", "P"];

function genState(state) {
	var r = Math.random();
	var psum = 0;
	for (var toState=0; toState<Q[state].length; toState++) {
		psum += Q[state][toState];
		if (r < psum) {
			return toState;
		}
	}
}

function markov(state, max) {
	var sequence=[];
	for (var t=0; t<max; t++) {
		sequence.push(states[state]);
        var state = genState(state);
	}
	return sequence;
}

console.log(markov(0, 100).join(''));
```

執行結果

```
nqu-192-168-61-142:jscode mac020$ node genMarkov
NVNVNVPPNVVNNVNNVNNNVNVNNNVNVNVPNVNVNVNNVNVNNVNPNVNVNPVNPVNVNNPNVNNNNVNVNPPNNNVNPNVPNNNNNNNNNVNNVNVP
```