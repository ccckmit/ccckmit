#遞迴範例 1

###範例： recursive.js

```javascript
function sum(n) {
    var s=0;
    for (var i=1; i<=n; i++)
        s += i;
    return s;
}

function s(n) {
    if (n==1) return 1;
    return s(n-1)+n;
}

function f(n) {
    if (n==0) return 1;
    if (n==1) return 1;
    return f(n-1)+f(n-2);
}

var log = console.log;
log("f(5)=%d", f(5));
log("sum(10)=%d", sum(10));
log("s(10)=%d", s(10));
```

###簡化後的版本

**檔案： s10.js**

```javascript
function s(n) {
    if (n==1) return 1;
    var sn = s(n-1)+n;
    return sn;
}

console.log("s(10)=%d", s(10));
```

**執行結果：**

    nqu-192-168-61-142:code mac020$ node s10
    s(10)=55
###追蹤遞迴過程

將函數 s(n) 修改如下以印出中間結果，並觀察執行過程：

**檔案： sum_recursive.js**

```c
function s(n) {
    if (n==1) return 1;
    var sn = s(n-1)+n;
    console.log("s(%d)=%d", n, sn);
    return sn;
}

console.log("s(10)=%d", s(10));
```

**執行結果：**

    $ node sum_recursive
    s(2)=3
    s(3)=6
    s(4)=10
    s(5)=15
    s(6)=21
    s(7)=28
    s(8)=36
    s(9)=45
    s(10)=55
    s(10)=55