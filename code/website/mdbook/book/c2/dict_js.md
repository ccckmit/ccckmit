#字典 (物件)

雖然上述這些 JavaScript 的語法很像 C 語言，但是 JavaScript 本質上仍然是個動態語言，其特性比較像 Python、 Ruby 等語言，因此預設就有提供更高階的資料結構，其中最重要的一個就是字典 (dictonary)，字典中的基本元素是 (key, value) 的配對，我們只要將 key 傳入就可以取得 value 的値，以下是一個 JavaScript 的字典範例。

**檔案：dict.js**

```javascript
 var dict={ 
   name:"john", 
   age:30 
 };

dict["email"] = "john@gmail.com";
dict.tel = "02-12345678";

for (var key in dict) {
  console.log("key=", key, " value=", dict[key]);
}

console.log("age=", dict.age);
console.log("birthday=", dict["birthday"]);
```

**執行結果**

    D:\js\code>node dict.js
    key= name  value= john
    key= age  value= 30
    key= email  value= john@gmail.com
    key= tel  value= 02-12345678
    age= 30
    birthday= undefined