#範例 -- 加總

###使用 while 迴圈

**檔案：wsum.js**

```javascript
sum=0;
i=1;
while (i<=10) {
  sum = sum + i;
  console.log("i=", i, " sum=", sum);
  i = i + 1;
}
```
**執行結果：**

    D:\jsbook>node wsum.js
    i= 1  sum= 1
    i= 2  sum= 3
    i= 3  sum= 6
    i= 4  sum= 10
    i= 5  sum= 15
    i= 6  sum= 21
    i= 7  sum= 28
    i= 8  sum= 36
    i= 9  sum= 45
    i= 10  sum= 55
###使用 for 迴圈

**檔案：sum.js**

```javascript
 sum=0;
 for (i=1;i<=10;i++) {
   sum = sum + i;
   console.log("i=", i, " sum=", sum);
 }
 ```
**執行結果：**

    D:\jsbook>node sum.js
    i= 1  sum= 1
    i= 2  sum= 3
    i= 3  sum= 6
    i= 4  sum= 10
    i= 5  sum= 15
    i= 6  sum= 21
    i= 7  sum= 28
    i= 8  sum= 36
    i= 9  sum= 45
    i= 10  sum= 55