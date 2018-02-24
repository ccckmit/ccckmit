# TensorFlow in Node.js


* https://github.com/nikhilk/node-tensorflow

這個專案在 Ubuntu 裡可以 sudo npm install 成功！

```
  433  sudo apt-get install nodejs-legacy
  434  npm install node-tensorflow
  435  ls
  436  node tensorflowTest.js
```

但是在 win10 Ubuntu Linux 裏執行失敗

```
ccckmit@DESKTOP-96FRN6B:/mnt/d/test$ node tensorflowTest.js

fs.js:432
  return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
                 ^
Error: ENOENT, no such file or directory '/mnt/d/test/node_modules/tensorflow/src/interop/libtensorflow.so'
    at Object.fs.openSync (fs.js:432:18)
    at fs.readFileSync (fs.js:286:15)
    at new DynamicLibrary (/mnt/d/test/node_modules/tensorflow/node_modules/ffi/lib/dynamic_library.js:67:21)
    at Object.Library (/mnt/d/test/node_modules/tensorflow/node_modules/ffi/lib/library.js:45:12)
    at Library.create (/mnt/d/test/node_modules/tensorflow/src/interop/ffiplus.js:29:17)
    at Object.<anonymous> (/mnt/d/test/node_modules/tensorflow/src/interop/libtensorflow.js:158:7)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
```