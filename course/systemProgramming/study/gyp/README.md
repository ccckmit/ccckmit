# 連結 C 要使用 node-gyp

## 注意

試成功了，hello-world 範例必須直接在 clone https://github.com/nodejs/node 的資料夾中執行就可以。(但是其他範例都失敗，只有 hello-world 成功)


```
D:\git\node\test\addons\hello-world>node-gyp configure
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@7.7.3 | win32 | x64
gyp info spawn D:\Python27\python.exe
gyp info spawn args [ 'C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\nod
e-gyp\\gyp\\gyp_main.py',
gyp info spawn args   'binding.gyp',
gyp info spawn args   '-f',
gyp info spawn args   'msvs',
gyp info spawn args   '-G',
gyp info spawn args   'msvs_version=auto',
gyp info spawn args   '-I',
gyp info spawn args   'D:\\git\\node\\test\\addons\\hello-world\\build\\config.g
ypi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\nod
e-gyp\\addon.gypi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\user\\.node-gyp\\7.7.3\\include\\node\\common.
gypi',
gyp info spawn args   '-Dlibrary=shared_library',
gyp info spawn args   '-Dvisibility=default',
gyp info spawn args   '-Dnode_root_dir=C:\\Users\\user\\.node-gyp\\7.7.3',
gyp info spawn args   '-Dnode_gyp_dir=C:\\Users\\user\\AppData\\Roaming\\npm\\no
de_modules\\node-gyp',
gyp info spawn args   '-Dnode_lib_file=C:\\Users\\user\\.node-gyp\\7.7.3\\<(targ
et_arch)\\node.lib',
gyp info spawn args   '-Dmodule_root_dir=D:\\git\\node\\test\\addons\\hello-worl
d',
gyp info spawn args   '-Dnode_engine=v8',
gyp info spawn args   '--depth=.',
gyp info spawn args   '--no-parallel',
gyp info spawn args   '--generator-output',
gyp info spawn args   'D:\\git\\node\\test\\addons\\hello-world\\build',
gyp info spawn args   '-Goutput_dir=.' ]
gyp info ok

D:\git\node\test\addons\hello-world>node-gyp build
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@7.7.3 | win32 | x64
gyp info spawn C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe
gyp info spawn args [ 'build/binding.sln',
gyp info spawn args   '/clp:Verbosity=minimal',
gyp info spawn args   '/nologo',
gyp info spawn args   '/p:Configuration=Release;Platform=x64' ]
在這個方案中一次建置一個專案。若要啟用平行組建，請加入 "/m" 參數。
  binding.vcxproj -> D:\git\node\test\addons\hello-world\build\Release\\binding
  .node
  binding.vcxproj -> D:\git\node\test\addons\hello-world\build\Release\binding.
  pdb (Full PDB)
gyp info ok
```

## 準備環境

在 windows 下使用很容易失敗，浪費很多時間。

[Windows users are not happy.](https://github.com/nodejs/node-gyp/issues/629)

joeeames commented on May 23 2015
+1 after 8+ hours of trying, still can't use anything that relies on node-gyp.

參考：

1. https://github.com/nodejs/node-gyp
2 https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules
3. https://github.com/felixrieseberg/windows-build-tools

安裝 : Windows

開啟 CMD.exe (run as Administrator 以管理員身分執行)

```
$ npm install --global --production windows-build-tools
``

## 建置

```
D:\Dropbox\github\road2nodejs\linkC\hello-world>node-gyp configure
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@7.7.3 | win32 | x64
gyp info spawn D:\Python27\python.exe
gyp info spawn args [ 'C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\node-gyp\\gyp\\g
yp_main.py',
gyp info spawn args   'binding.gyp',
gyp info spawn args   '-f',
gyp info spawn args   'msvs',
gyp info spawn args   '-G',
gyp info spawn args   'msvs_version=auto',
gyp info spawn args   '-I',
gyp info spawn args   'D:\\Dropbox\\github\\road2nodejs\\linkC\\hello-world\\build\\config.gy
pi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\node-gyp\\addon.
gypi',
gyp info spawn args   '-I',
gyp info spawn args   'C:\\Users\\user\\.node-gyp\\7.7.3\\include\\node\\common.gypi',
gyp info spawn args   '-Dlibrary=shared_library',
gyp info spawn args   '-Dvisibility=default',
gyp info spawn args   '-Dnode_root_dir=C:\\Users\\user\\.node-gyp\\7.7.3',
gyp info spawn args   '-Dnode_gyp_dir=C:\\Users\\user\\AppData\\Roaming\\npm\\node_modules\\n
ode-gyp',
gyp info spawn args   '-Dnode_lib_file=C:\\Users\\user\\.node-gyp\\7.7.3\\<(target_arch)\\nod
e.lib',

gyp info spawn args   '-Dmodule_root_dir=D:\\Dropbox\\github\\road2nodejs\\linkC\\hello-world
',
gyp info spawn args   '-Dnode_engine=v8',
gyp info spawn args   '--depth=.',
gyp info spawn args   '--no-parallel',
gyp info spawn args   '--generator-output',
gyp info spawn args   'D:\\Dropbox\\github\\road2nodejs\\linkC\\hello-world\\build',
gyp info spawn args   '-Goutput_dir=.' ]
gyp info ok

D:\Dropbox\github\road2nodejs\linkC\hello-world>node-gyp build
gyp info it worked if it ends with ok
gyp info using node-gyp@3.6.2
gyp info using node@7.7.3 | win32 | x64
gyp info spawn C:\Program Files (x86)\MSBuild\14.0\bin\msbuild.exe
gyp info spawn args [ 'build/binding.sln',
gyp info spawn args   '/clp:Verbosity=minimal',
gyp info spawn args   '/nologo',
gyp info spawn args   '/p:Configuration=Release;Platform=x64' ]
在這個方案中一次建置一個專案。若要啟用平行組建，請加入 "/m" 參數。
  binding.cc
  win_delay_load_hook.cc
     Creating library D:\Dropbox\github\road2nodejs\linkC\hello-world\build\Release\binding.
  lib and object D:\Dropbox\github\road2nodejs\linkC\hello-world\build\Release\binding.exp
  Generating code
  Finished generating code
  binding.vcxproj -> D:\Dropbox\github\road2nodejs\linkC\hello-world\build\Release\\binding.
  node
  binding.vcxproj -> D:\Dropbox\github\road2nodejs\linkC\hello-world\build\Release\binding.p
  db (Full PDB)
gyp info ok
```

## 主程式

檔案： binding.cc

```
#include <node.h>
#include <v8.h>

void Method(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  v8::HandleScope scope(isolate);
  args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "world"));
}

void init(v8::Local<v8::Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(binding, init)

```

設定檔： binding.gyp

```
{
  'targets': [
    {
      'target_name': 'binding',
      'defines': [ 'V8_DEPRECATION_WARNINGS=1' ],
      'sources': [ 'binding.cc' ]
    }
  ]
}
```

## 範例程式

檔案： hello.js

```js
const binding = require(`./build/Release/binding`)
console.log(binding.hello())
```

執行： 

```
D:\Dropbox\github\road2nodejs\linkC\hello-world>node hello
world
```

## 將 Python.h 加入 include path

對於 matplotlib 之類的專案，有用到 Python.h，建置失敗找不到時，

請參考：
https://stackoverflow.com/questions/2676417/how-do-include-paths-work-in-visual-studio

把 Python.h 的路徑 C:\Users\user\.windows-build-tools\python27\include 加入到下列 XML檔中

C:\Users\User\AppData\Local\Microsoft\MSBuild\v4.0\Microsoft.Cpp.x64.user.props

變成

```xml
<?xml version="1.0" encoding="utf-8"?> 
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <ImportGroup Label="PropertySheets">
  </ImportGroup>
  <PropertyGroup Label="UserMacros" />
  <PropertyGroup>
   <IncludePath>C:\Users\user\.windows-build-tools\python27\include</IncludePath>
  </PropertyGroup>
  <ItemDefinitionGroup />
  <ItemGroup />
</Project>
```

## npm 的 config

```
D:\Dropbox\github\road2nodejs\systemProgramming\gyp\hello-world>npm config -g li
st
; cli configs
global = true
scope = ""
user-agent = "npm/4.1.2 node/v7.7.3 win32 x64"

; userconfig C:\Users\user\.npmrc
init.author.email = "ccckmit@gmail.com"
init.author.name = "ccckmit"
init.author.url = "http://ccc.nqu.edu.tw"
msvs_version = "2015"
python = "C:\\Users\\user\\.windows-build-tools\\python27"

; globalconfig C:\Users\user\AppData\Roaming\npm\etc\npmrc
msvs_version = "2015"

; builtin config undefined
prefix = "C:\\Users\\user\\AppData\\Roaming\\npm"

; node bin location = C:\Program Files\nodejs\node.exe
; cwd = D:\Dropbox\github\road2nodejs\systemProgramming\gyp\hello-world
; HOME = C:\Users\user
; "npm config ls -l" to show all defaults.


```

## 參考文獻

