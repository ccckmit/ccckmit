# 用 electron-builder 打包 electron 應用

* [通过electron-builder 将 Electron案例 制作成 Windows程序 以及 安装包](http://java.ctolib.com/hxiaofeng2016-electron-builder-real.html)

注意 package.json 的下列段落

```json
  "scripts": {
    "start": "electron .",
    "test": "echo \"Error: no test specified\" && exit 1",
    "postinstall": "electron-builder install-app-deps",
    "pack": "electron-builder --dir",
    "dist": "electron-builder"
  },
  "build": {
    "appId": "ccckmit.mt",
    "mac": {
      "category": "machine.translate"
    }
  },
  "devDependencies": {
    "electron": "^1.7.9",
    "electron-builder": "^19.37.2"
  }
```

## 測試與打包

```
$ npm install // 安装依赖
$ npm start // 启动 案例
$ npm run dist // electron-builder 打包
```





