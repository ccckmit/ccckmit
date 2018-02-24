# Hello WebAssembly

參考: http://webassembly.org/getting-started/developers-guide/

執行：

```
$  emcc hello.c -s WASM=1 -s "BINARYEN_METHOD='interpret-s-expr'" -o hello.html
$  emrun --no_emrun_detect --no_browser --port 8080
.
Web server root directory: D:\Dropbox\ccckmit\course\systemProgramming\webassembly\hello
Now listening at http://localhost:8080/
```

瀏覽器上顯示 Hello World ! 成功