

https://bretkikehara.wordpress.com/2013/05/02/nodejs-creating-your-first-global-module/


c6 發佈為 -g (global) 會在 C:\Users\user\AppData\Roaming\npm 下面建立一個 c6 shell 檔案

在 linux 為 c6

```
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/node_modules/c6/run.js" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/c6/run.js" "$@"
  ret=$?
fi
exit $ret
```

在 windows 為 c6.cmd

```
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\c6\run.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\c6\run.js" %*
)
```

於是當你執行 c6 chartDemo.js 時，其實是執行

```
"C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\c6\\run.js","github/c6demo/chartDemo.js"
```

