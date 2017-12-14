# Cordova vs. Electron vs. React Native vs. Xamarin 

Electron : 用 JavaScript 寫 web 型桌面程式 (可接 npm)
Cordova : 用 JavaScript 寫 web 型手機程式 (看來不太好接 npm)
Ionic : 在 cordova 上搭 Angular.js 寫 web 型手機程式 (看來不太好接 npm)
React Native : 用 JavaScript 寫《原生手機》程式 (看來不太好接 npm)
Xamarin : 用 C# 寫《原生手機》程式 (含 windows App)
Native Script : 用 JavaScript 寫《原生手機》程式 (可接 npm, 除 native API 以外，其他是共用的，跨平台)
Meteor : 全端 JS 平台，可透過 Electron-Meteor 經(Electron+React-Native)寫桌面+手機程式。

https://github.com/necolas/react-native-web


Native Script 接 npm : http://docs.nativescript.org/tutorial/chapter-5

```
var validator = require("email-validator");
```

Ionic 接 npm : https://github.com/ionic-team/ionic/issues/8274

[9 款極佳的 JavaScript 移動開發框架](https://kknews.cc/tech/g29g2ll.html)

https://www.nativescript.org

[通用Windows平台應用](https://zh.wikipedia.org/wiki/%E9%80%9A%E7%94%A8Windows%E5%B9%B3%E5%8F%B0%E5%BA%94%E7%94%A8)


如何選擇： https://www.quora.com/Which-is-better-React-Native-or-Native-Script

Short Answer : chosing between native script and react native is same as chosing between reactjs and angular.

React js is fast blazing rendering framework which provides tools instead of pattern. on other hand angular is a framework that used for better aplication development

so choice is for you, if your app is focused on more on ui with lot of rendering better to choose react native. if you are focusing on a single code everywhere like web ios and android u should prefer angular2 with nativescript.