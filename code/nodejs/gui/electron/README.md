# Electron 學習筆記

## 入門範例 01-hello

來自 https://github.com/electron/electron/blob/v1.6.10/docs/tutorial/quick-start.md

## 簡易範例 02-simple-samples

來自 https://github.com/electron/simple-samples

## 更多範例 

https://github.com/hokein/electron-sample-apps

https://github.com/sindresorhus/awesome-electron

## 中文文件

https://github.com/electron/electron/tree/master/docs-translations/zh-TW

中文書： https://wizardforcel.gitbooks.io/electron-doc/

## Bug

在 windows 裏，console.log 印不出來！

https://github.com/electron/electron/issues/3032

Keep in mind that on Windows, calls to console.* won't be printed, but they will be printed on Linux and OS X. The reason is that for Windows, console.* is implemented on top of the logging mechanism (see details here).

## 參考文章

* [用Electron开发桌面应用](http://get.ftqq.com/7870.get)

打包

```
electron-packager ~/Projects/sound-machine SoundMachine --all --version=0.30.2 --out=~/Desktop --overwrite --icon=~/Projects/sound-machine/app/img/app-icon.icns
```