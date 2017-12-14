# 習題解答

## 第 2 章 -- 解答

1: 請寫一個程式計算 10! ，也就是 `10*9*8*....*1` 。

第一版：沒用函數

```javascript
f = 1;
i = 1;
while (i<=10) {
    f = f * i;
    i = i + 1;
}
console.log('f=', f);
```

第二版：有用函數

```javascript
function factorial(n) {
    f = 1;
    i = 1;
    while (i<=n) {
        f = f * i;
        i = i + 1;
    }
    return f;
}

console.log('factorial(10)=', factorial(10));
console.log('factorial(5)=', factorial(5));
console.log('factorial(3)=', factorial(3));
console.log('factorial(100)=', factorial(100));
```


## 第 3 章 -- 解答

1 寫一個程式把矩陣轉置。

檔案： matrix.js

```javascript
function print(a) 
{
    var s = "";
    for (var i=0; i<a.length; i++)
    {
        for (var j=0; j<a[i].length; j++)
        {
            s = s+a[i][j]+'\t';
        }
        s = s + '\n';
    }
    console.log(s);
}


function transpose(a)
{
    var at=[];
    for (var j=0; j<a[0].length; j++)
    {
        at[j] = [];
        for (var i=0; i<a.length; i++)
        {
            at[j][i] = a[i][j];
        }
    }
    return at;
}

var m = [[1,2,3], [3,12,1]];
console.log("====== m =========");
print(m);
console.log("====== mt =========");
print(transpose(m)); // => [[1,3], [2,2], [3,1]]

function add(a,b) 
{
    var c = [];
    for (var i=0; i<a.length; i++)
    {
        c[i] = [];
        for (var j=0; j<a[i].length; j++)
        {
            c[i][j] = a[i][j]+b[i][j];
        }
    }
    return c;
}

function sub(a,b) 
{
    var c = [];
    for (var i=0; i<a.length; i++)
    {
        c[i] = [];
        for (var j=0; j<a[i].length; j++)
        {
            c[i][j] = a[i][j]-b[i][j];
        }
    }
    return c;
}

var a = [[1,2,3], [1,1,1]], b=[[2,2,2],[3,1,1]];

console.log("==========a+b==========")
print(add(a,b));

console.log("==========a-b==========")
print(sub(a,b));

function mul(a,b) // a:m*n, b:n*k, c:m*k 
{
    var c = [];
    for (var i=0; i<a.length; i++)
    {
        c[i] = [];
        for (var k=0; k<b[0].length; k++) 
        {
            c[i][k] = 0;
            for (var j=0; j<a[i].length; j++)
            {
                c[i][k] = c[i][k]+a[i][j]*b[j][k];
            }
        }
    }
    return c;
}

var ma = [[1,2], 
          [1,1]], 
    mb = [[2,2],
          [1,1]];

console.log("=========== c=ma*mb =============");
print(mul(ma,mb));

function neg(a) 
{
    var c=[];
    for (var i=0; i<a.length; i++)
    {
        c[i] = [];
        for (var j=0; j<a[i].length; j++)
        {
            c[i][j] = -a[i][j];
        }
    }
    return c;
}

console.log("============ neg(a) ==========");
print(neg(a));

function isMagic(a) 
{
    var a0sum =0;
    for (var j=0;j<a[0].length; j++)
    {
        a0sum = a0sum + a[0][j];
    }
    for (var i=0; i<a.length; i++)
    {
        var rsum = 0;
        for (var j=0; j<a[i].length; j++)
            rsum = rsum +a[i][j];
        if (a0sum !== rsum)
            return false; 
    }
    for (var j=0; j<a[0].length; j++)
    {
        var csum = 0;
        for (var i=0; i<a.length; i++)
            csum = csum +a[i][j];
        if (a0sum !== csum)
            return false; 
    }
    return true;
}

var magic = [[1,2,3], [2,3,1], [3,1,2]];
console.log('isMagic(magic)=', isMagic(magic)); 

var magic2 = [[1,2,3], [2,3,1], [3,2,1]];
console.log('isMagic(magic2)=', isMagic(magic2)); 
```

執行結果：

```
NQU-192-168-60-101:js1 csienqu$ node matrix.js 
====== m =========
1	2	3	
3	12	1	

====== mt =========
1	3	
2	12	
3	1	

```

## 第 4 章 -- 解答

### 回呼函數實作

2 請寫一個函數可以根據過濾函數f只留下符合的內容？
    * 範例：filter(odd, [1,3,5,4,8,9])= [1,3,5,9] ，其中 odd 為判斷是否為奇數的函數。

檔案： filter.js

```javascirpt
function filter(f, a) {
    var fa = [];
    for (var i=0; i < a.length; i++) {
        if (f(a[i])) 
            fa.push(a[i]);
    }
    return fa;
}

function odd(n) {
    return n%2===1;
}

var b = filter(odd, [2,3,4,5,6,7,8,9]);
console.log('b=', b);
```

執行結果：

```
$ node filter.js 
b= [ 3, 5, 7, 9 ]

```

4 請用遞迴計算 sum(n) = 1+2+...+n ？
     * 範例：sum(10) = 55

檔案： sumRecursive.js

```
function sum(n) {
  if (n===0) {
    return 0;
  } else {
    // console.log(n);
    var fn = sum(n-1)+n;
    // console.log('n=%d fn=%d', n, fn);
    return fn;
  }
}

console.log('sum(10)=', sum(10));
```

執行結果

```
$ node sumRecursive
sum(10)= 55

```

