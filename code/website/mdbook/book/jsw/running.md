# 網站維護

網站設計完上線之後，通常不是就這樣一直運行下去，設計者會根據人們的使用情況，來決定進行那些功能調整，或者是修改程式。

從我設計 bookdown 在學校上線，直到放上 mdbookspace.com ，也經過了快一年了，有時我還會發現一些功能、流程或程式上的問題，於是會進行修正。

自己設計網站的好處是，可以持續修正到您滿意為止，並且可以不斷開發讓系統更加完善，讓使用更加順暢。

當然、這也得花費一些時間，不過對於一個 Node.js 的程式設計者而言，我想是非常值得的，因為我們會從中學到許多《寫程式與經營網站》的知識，讓自己成為一個真正的 Node.js 程式人與網站經營者。

現在、該你來經營自己的網站了！

## 維護技巧

1 - 使用 pm2 啟動伺服器

* <http://pm2.keymetrics.io/>

2 - 更新 node.js

* <http://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version>

```
Use n module from npm in order to upgrade node

sudo npm cache clean -f
sudo npm install -g n
sudo n stable

sudo ln -sf /usr/local/n/versions/node/<VERSION>/bin/node /usr/bin/node 
To upgrade to latest version (and not current stable) version, you can use

sudo n latest
```

3 - 在 mac 上

安裝 putty 並登入

```
  506  ssh -i privateKey.ppk root@mdbookspace.com
  507  brew install putty
  508  puttygen privatekey.ppk -O private-openssh -o privatekey.pem
  509  ssh -i privatekey.pem root@mdbookspace.com
  510  chmod go-rw privatekey.pem
  511  ssh -i privatekey.pem root@mdbookspace.com
```

ftp 檔案上傳下載

* [Unix / Mac / Linux 下直接用scp傳送檔案](http://blog.riaproject.com/server-setting/1644/unix-mac-linux-%E4%B8%8B%E7%9B%B4%E6%8E%A5%E7%94%A8scp%E5%82%B3%E9%80%81%E6%AA%94%E6%A1%88.html)

## 多台伺服器流量平衡

* [使用 HAProxy 完成 網站分流, 平衡負載](https://blog.longwin.com.tw/2009/03/haproxy-ha-load-balance-2009/)

* [富人用 L4 Switch，窮人用 Linux HAProxy！](https://blog.toright.com/posts/3967/%E5%AF%8C%E4%BA%BA%E7%94%A8-l4-switch%EF%BC%8C%E7%AA%AE%E4%BA%BA%E7%94%A8-linux-haproxy%EF%BC%81.html)

## 更新所有 package.json 中的 npm 套件

```
$ npm install -g npm-check-updates
$ npm-check-updates -u
$ npm install 
```
