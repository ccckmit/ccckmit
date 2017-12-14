```
D:\git\matplotnode>node-gyp build
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@7.7.3 | win32 | x64
gyp info spawn C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe
gyp info spawn args [ 'build/binding.sln',
gyp info spawn args   '/clp:Verbosity=minimal',
gyp info spawn args   '/nologo',
gyp info spawn args   '/p:Configuration=Release;Platform=x64' ]
在這個方案中一次建置一個專案。若要啟用平行組建，請加入 "/m" 參數。
  matplotlib.cc
  win_delay_load_hook.cc
d:\git\matplotnode\src\matplotlib.h(6): fatal error C1083: Cannot open include
file: 'python2.7/Python.h': No such file or directory (compiling source file ..
\src\matplotlib.cc) [D:\git\matplotnode\build\matplotlib.vcxproj]
gyp ERR! build error
gyp ERR! stack Error: `C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe` fail
ed with exit code: 1
gyp ERR! stack     at ChildProcess.onExit (C:\Users\user\AppData\Roaming\npm\nod
e_modules\node-gyp\lib\build.js:258:23)
gyp ERR! stack     at emitTwo (events.js:106:13)
gyp ERR! stack     at ChildProcess.emit (events.js:194:7)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_proces
s.js:215:12)
gyp ERR! System Windows_NT 6.3.9600
gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\user\\AppData
\\Roaming\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js" "build"
gyp ERR! cwd D:\git\matplotnode
gyp ERR! node -v v7.7.3
gyp ERR! node-gyp -v v3.6.2
gyp ERR! not ok
```

因為找不到 python.h 而失敗，

試著參考下文解決：

https://docs.microsoft.com/en-us/visualstudio/python/python-environments

https://stackoverflow.com/questions/2676417/how-do-include-paths-work-in-visual-studio