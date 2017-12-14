#範例：陣列 -- array.js

JavaScript 的陣列宣告非常簡單，就是用 [...] 所框起來的一連串資料，或者您也可以用 new Array() 語句來建立一個空的陣列，而且可以用 length 屬性來取得陣列大小。

**檔案：array.js**

```c
var a=[1,6,2,5,3,6,1];

for (i=0;i<a.length;i++) {
  console.log("a[%d]=%d", i, a[i]);
}
```

**執行結果**

    D:\jsbook>node array.js
    a[0]=1
    a[1]=6
    a[2]=2
    a[3]=5
    a[4]=3
    a[5]=6
    a[6]=1