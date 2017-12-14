#計算總和的函數

**檔案： fsum.js**

```javascript
function sum(n) {
  s=0;
  for (i=1; i<=n; i++) {
    s = s+i;
  }
  return s;
}


sum10 = sum(10);
console.log("1+...+10="+sum10);
```

**執行結果：**

    nqu-192-168-61-142:code mac020$ node fsum.js
    1+...+10=55
