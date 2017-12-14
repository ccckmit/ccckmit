# regular expression

## useful site 

https://regex101.com/

## Chrome 開發人員工具

```js
'this is a book'.match(/\w+/g)
// (4) ["this", "is", "a", "book"]
'this is a book'.match(/[a-z]+/g)
// (4) ["this", "is", "a", "book"]
'this is a book'.match(/\w+/g)
// (4) ["this", "is", "a", "book"]
'my phone number is 082-313534, call me! '.match(/[0-9]+/)
// ["082", index: 19, input: "my phone number is 082-313534, call me! "]
'my phone number is 082-313534, call me! '.match(/[0-9]+/g)
// (2) ["082", "313534"]
'my phone number is 082-313534, call me! '.match(/\d+/g)
// (2) ["082", "313534"]
'my phone number is 082-313534, call me! '.match(/\w+/g)
// (8) ["my", "phone", "number", "is", "082", "313534", "call", "me"]
```
