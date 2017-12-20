# Electron.js 網頁型桌面程式

## 簡介

《視窗程式》和《Web 程式》基本上是兩條走向不同的技術，雖然 web 《瀏覽器》總是建構在視窗程式之上的。

但是在 web 愈來愈強大之後，人們就會開始想：《為何我不能用瀏覽器來代替一般視窗》呢？

雖然《用瀏覽器代替視窗》會有《殺雞用牛刀》的感覺，但是既然手上那把刀都已經用來殺牛了，為何不順便也把雞給殺了呢？ (幹嘛為了殺雞還要換一把刀呢？)

Electron.js 就是這樣一把用來殺雞的牛刀，而且讓你可以用殺牛的刀法來宰雞！

自從 Apple 透過 iPod, iPhone, iPad 再度崛起之後， iMac 也愈來愈多人使用了， 而在那個基於 Linux 的 Android 作業系統成為手機市場的主導者之後，《視窗程式》就落入了一個很奇怪的境地。

原本《微軟》所主導的視窗環境，開始出現《三國鼎立》的現象，Microsoft/Apple/Google 各自主導著 Windows/iOS/Android 平台，想要以統一的工具開發《視窗程式》則變得愈來愈不可行了！

但是、生在資訊世紀亂世的程式人，自然會出現一些英雄或梟雄，想辦法解決這些問題，於是各路人馬都開始嘗試《統一世界》。

這些人馬有：

1. 採用《瀏覽器》主導的 node-webkit/electron/PhoneGap 等技術。
2. 採用《跨平台編譯》的 Xamarin/Native Script/Unity/Qt 等技術。
3. 採用混合上述兩者的 React Native 等技術。

我們這門課程，將使用 javascript + electron 來教授視窗程式設計，這種做法和傳統上採用 C# + WinForm 的方式截然不同，兩者各有優缺點，以下列出此種方式的優缺點：

優點：

1. Electron 可以輕易跨越 windows/linux/mac 等桌上型電腦的平台。
2. Electron 採用基於 javascript 的瀏覽器與 web 技術，可以一魚兩吃。
    * 例如你可以輕易地使用 npm 模組，或將前端網頁放到 web 上。
3. 如果想要寫成手機 App，可以輕易地將程式移到 PhoneGap 這樣的平台上。

缺點：

1. 瀏覽器介面和該平台的原生介面常常長的不太一樣。
2. 瀏覽器介面的效能和互動性通常比較差。
3. 瀏覽器介面有時較難控制一些原生的系統功能。

這樣看來，雖然 Electron.js 的優點很多，但是缺點也不少！

## 安裝

1. 先安裝 node.js
    * https://nodejs.org/en/
    * 點綠色下載圖示，下載完後啟動，然後一直按下一步即可！
2. 再安裝 [electron.js](https://electron.atom.io/)
    * github : https://github.com/electron/electron
    * npm install -g electron
3. 安裝完後試著開始執行下列的範例
    * https://github.com/cccnqu/wp106a/tree/master/example

安裝執行範例：

```
C:\ccc>npm install -g --save-dev electron
C:\Users\321teacher\AppData\Roaming\npm\electron -> C:\Users\321teacher\AppData\Roaming
\npm\node_modules\electron\cli.js

> electron@1.7.6 postinstall C:\Users\321teacher\AppData\Roaming\npm\node_modules\elect
ron
> node install.js

C:\Users\321teacher\AppData\Roaming\npm
`-- electron@1.7.6
  +-- @types/node@7.0.43
  +-- electron-download@3.3.0
  | +-- debug@2.6.8
  | | `-- ms@2.0.0
...
C:\ccc>git clone https://github.com/cccnqu/wp106a.git
Cloning into 'wp106a'...
remote: Counting objects: 549, done.
remote: Compressing objects: 100% (450/450), done.
Rremote: Total 549 (delta 73), reused 549 (delta 73), pack-reused 0
Receiving objects:  91% (500/549), 1.96 MiB | 1.01 MiB/s
Receiving objects: 100% (549/549), 2.75 MiB | 1.37 MiB/s, done.
Resolving deltas: 100% (73/73), done.

C:\ccc>cd wp106a
C:\ccc\wp106a>cd example

C:\ccc\wp106a\example>electron 01-hello/a

```

## 結語

目前的視窗程式環境有點百家爭鳴（或者說是有點混亂），程式人必須想辦法在這樣的混亂情況下做出選擇！

雖然有很多種解決方案，但沒有任何一種是絕對比其他方案都好的，魚和熊掌基本上不可兼得，到底想要魚還是熊掌，您終究必須要做個選擇。

無法做選擇的人，就只能在門口排迴，而難以進入《視窗程式》的世界了！