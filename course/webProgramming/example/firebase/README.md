# Firebase

* https://firebase.google.com/docs/
* https://www.facebook.com/ccckmit/posts/10155888853266893

```
對於現在的資工系大學生來說，由於很多人都還沒有信用卡(或可線上刷的金融卡)，因此要使用 DigitalOcean, Linode, Amazon EC2 等平台會有困難。

目前我所知道的是，使用 firebase 不需要刷卡，有免費的基本額度。

這讓我決定在《網頁設計與視窗程式》課程中以 firebase 作為主要的後端，因為學生們都可以輕易的免費使用，而且也的確是非常方便，不需要架 server, 申請 Domain Name, SSL 證書、以及寫一大堆和認證有關的程式等等。

另外、也免去了自架 database 的問題，這對《前端工程師》而言，實在是幫助很大的一件事 ...

奇怪的是，現在好像沒有中文書專門講 web + firebase 開發，可能台灣市場太小了吧 ....
```

*  網友回應： AWS 用 education starter account 不用信用卡 還有$50
  * https://aws.amazon.com/tw/premiumsupport/knowledge-center/educate-starter-account/

## 認證與帳戶

* [将 Firebase 添加至您的 JavaScript 项目](https://firebase.google.com/docs/web/setup)

## 資料庫

* https://firebase.google.com/docs/database/ (請拉到左下角選簡體中文)

## 文件儲存

* [Cloud Storage 簡體中文](https://firebase.google.com/docs/storage/?utm_campaign=Firebase_announcement_education_general_en_05-18-16_&utm_medium=yt-annt&utm_source=Firebase)
  * https://firebase.google.com/docs/storage/web/upload-files


```js
storageRef.child('images/stars.jpg').getDownloadURL().then(function(url) {
  // `url` is the download URL for 'images/stars.jpg'

  // This can be downloaded directly:
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function(event) {
    var blob = xhr.response;
  };
  xhr.open('GET', url);
  xhr.send();

  // Or inserted into an <img> element:
  var img = document.getElementById('myimg');
  img.src = url;
}).catch(function(error) {
  // Handle any errors
});
```

## node.js

* https://firebase.google.com/docs/database/admin/start


## 託管 -- Hosting

* https://firebase.google.com/docs/hosting/
* https://firebase.google.com/docs/cli/
* https://firebase.google.com/docs/hosting/functions

## 動態鏈接

* https://firebase.google.com/docs/dynamic-links/
  * 通过动态链接，您的用户可以在他们打开您的链接的平台上获得最佳体验。如果用户在 iOS 或 Android 上打开一个动态链接，则可以直接转到您的原生应用中的链接内容。如果用户在桌面浏览器中打开相同的动态链接，则可以转到您网站上的同等内容。
