# CamanJs

有用到 node-gyp ，非原生！

http://camanjs.com/guides/#BasicUsage

node.js 中的用法

```
var Caman = require('caman').Caman;

Caman("/path/to/file.png", function () {
  this.brightness(5);
  this.render(function () {
    this.save("/path/to/output.png");
  });
});
```