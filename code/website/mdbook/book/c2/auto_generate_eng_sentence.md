習題：自動產生英文語句

提示：先用簡單的幾個字加上基本語法就行了，不用一下企圖心太大。

簡易語法

    S = NP VP
    NP = DET N
    VP = V NP
    N = dog | cat
    V = chase | eat
    DET = a | the
產生過程的範例

    S = NP VP = (DET N) (V NP) 
      = (a dog) (chase DET N) 
      = a dog chase a cat
      
解答：

```javascript
function rand(a,b) { 
    return a+Math.random()*(b-a); 
}

function randInt(a,b) { 
    return Math.floor(a+Math.random()*(b-a)); 
}

function randSelect(a) { 
    return a[randInt(0,a.length)]; 
}
/*
for (var i=0; i<10; i++) {
    var animal = randSelect(['dog', 'cat']);
    console.log("%s", animal);
}
*/
/*
S = NP VP
NP = DET N
VP = V NP
N = dog | cat
V = chase | eat
DET = a | the
*/

function S() {
    return NP()+" "+VP();
}

function NP() {
    return DET()+" "+N();
}

function VP() {
    return V()+" "+NP();
}

function N() {
    return randSelect(["dog", "cat"]);
}

function V() {
    return randSelect(["chase", "eat"]);
}

function DET() {
    return randSelect(["a", "the"]);
}

console.log(S());
```