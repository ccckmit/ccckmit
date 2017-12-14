# JavaScript 的進階概念

## 遞迴呼叫

```javascript
function f(n) {
  console.log(n);
  f(n-1);
}

f(10);
```

執行結果：

```
NQU-192-168-60-101:js1 csienqu$ node recursive
10
9
8
7
6
5
4
3
2
1
0
-1
...
-17923
-17924
util.js:183
  var ctx = {
            ^

RangeError: Maximum call stack size exceeded
    at inspect (util.js:183:13)
    at exports.format (util.js:84:24)
    at Console.log (console.js:43:37)
    at f (/Users/csienqu/Desktop/js1/recursive.js:2:11)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)
    at f (/Users/csienqu/Desktop/js1/recursive.js:3:3)

```