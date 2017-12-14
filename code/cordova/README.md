# Cordova

安裝 Android SDK (Android Studio0) + Cordova

* You have not accepted the license agreements of the following SDK component
  * 解決方法: $ANDROID_HOME/tools/bin/sdkmanager --licenses
  * https://stackoverflow.com/questions/26739114/android-studio-sdk-location

```
cordova run android

```

https://spring.io/guides/gs/android/

Windows
set ANDROID_HOME=C:\<installation location>\android-sdk-windows
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

No target specified and no devices found, deploying to emulator
Error: No emulator images (avds) found.
1. Download desired System Image by running: "C:\Users\user\AppData\Local\Android\Sdk\tools\android.bat" sdk
2. Create an AVD by running: "C:\Users\user\AppData\Local\Android\Sdk\tools\android.bat" avd
HINT: For a faster emulator, use an Intel System Image and install the HAXM device driver

D:\test\cordovaAndroidApp>android avd
'android' 不是內部或外部命令、可執行的程式或批次檔。

## Configure On-Device Developer Options

手機必須啟用《開發人員模式》

* https://developer.android.com/studio/debug/dev-options.html

1. Open the Settings app.
2. (Only on Android 8.0 or higher) Select System.
3. Scroll to the bottom and select About phone.
4. Scroll to the bottom and tap Build number 7 times.
5. Return to the previous screen to find Developer options near the bottom.

## Run Apps on a Hardware Device

執行 Cordova run android

* https://developer.android.com/studio/run/device.html

我的電腦等級太低，沒有 Hyper-Threading 技術，因此跑 Emulator 很慢，只能在手機上直接測。


## 除錯

* [Cordova Tools Extension](https://marketplace.visualstudio.com/items?itemName=vsmobile.cordova-tools)

可以在 chrome 裡除錯 cordova android 的錯誤，請參考下文與圖：

* http://apolkingg8.logdown.com/posts/2014/05/29/experience-debug-cordova-app-with-android-44-and-chrome

![](CordovaDebug.png)

## API

* 地理定位 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/
* 白名單 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/index.html
* 開啟瀏覽器 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-inappbrowser/index.html
* 檔案存取 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html
* 對話框 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-dialogs/index.html
* 檔案上傳 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/index.html
* 相機 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html
  * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html#take-a-picture-
* 圖示 -- https://cordova.apache.org/docs/en/latest/config_ref/images.html
* 資料庫 -- https://cordova.apache.org/docs/en/latest/cordova/storage/storage.html#plugin-based-options
* 輸出除錯 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-console/index.html
* 載入畫面 -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html
  * https://www.bignerdranch.com/blog/splash-screens-the-right-way/
* Status Bar -- https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-statusbar/index.html
  * [【APP】PhoneGap設定iOS APP全螢幕，但必須顯示狀態列。 ](http://blog.xuite.net/andy19890411/Orz/330893054-%E3%80%90APP%E3%80%91PhoneGap%E8%A8%AD%E5%AE%9AiOS+APP%E5%85%A8%E8%9E%A2%E5%B9%95%EF%BC%8C%E4%BD%86%E5%BF%85%E9%A0%88%E9%A1%AF%E7%A4%BA%E7%8B%80%E6%85%8B%E5%88%97%E3%80%82+(set+iOS+app+fullscreen+but+show+the+status+bar.)
