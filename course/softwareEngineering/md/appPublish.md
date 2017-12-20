# 發佈 App 到各家平台

## Node.js 套件發行 -- npm publish

確定 package.json 寫好了之後，執行下列動作：

參考： https://github.com/ccckmit/twcn/blob/master/package.json

```
$ npm version patch
$ git add -A
$ git commit -m "what this version for ..."
$ git push origin master
$ npm publish
```

## electron.js 製作安裝版

參考完整範例： https://github.com/cccnqu/wp106a/tree/master/example/97-electron-builder-mt

```
$ npm run dist // 相當於執行 electron-builder 打包
```

只要指定 "asar": false 似乎就能不要打包成 asar ... 

```
// package.json
"build": {
    "appId": "popcorn-time-desktop",
    "app-category-type": "public.app-category.video",
    "asar": false,
    "win": {
      "iconUrl": "https://cdn.rawgit.com/amilajack/popcorn-time-desktop/master/app/icons/app.ico"
    }
  },
```

用 electron-builder 發行軟體似乎不能不打包，因為像微軟有 signing 的程序，不打包似乎就沒辦法 signing

* https://developer.apple.com/library/mac/documentation/Security/Conceptual/CodeSigningGuide/Introduction/Introduction.html

* [How to disable packing into asar files?](https://github.com/electron-userland/electron-builder/issues/428)