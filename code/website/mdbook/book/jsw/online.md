# 第 9 章 -- 上線營運

## 十分鐘投影片

1. [十分鐘讓程式人搞懂雲端平台與技術](http://www.slideshare.net/ccckmit/ss-70782470)
2. [用十分鐘將你的網站送上雲端](https://www.slideshare.net/ccckmit/ss-72398210)

## 上線步驟：
1. 到 DigitalOcean 申請一個站 (DigitalOcean 稱一個站為 Droplet，我使用 $5 美元的 ubuntu linux 虛擬主機方案)。
    * 用 putty 連上去 server 之後，安裝相關軟體
    * 在 server 安裝 sftpd 以便將檔案上傳
    * 若你用 windows, 在 Client 裝 WinSCP 以便連上 server 並上傳檔案。(用 git/github/gitbucket 也行)
    * 將專案上傳後，啟動 server 程式 (最好採用 pm2 之類的方式啟動網站，這樣才不會在 logout 或退出 putty 的時候導致 server 被關掉)
    * 直接打 ip (我的站為  http://139.59.108.105 ) 測試看看網站是否正常運作。
    * 開通帳號時可以設 SSH 或只用密碼，我有用 SSH。
    * 請參考： [How To Use SSH Keys with PuTTY on DigitalOcean Droplets -- Windows users](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-putty-on- digitalocean-droplets-windows-users) 
2. 到 GoDaddy 或 freenom 等網站上購買網域名稱。
    * 申請網域名稱，然後上去設定 domain=>ip 的對應關係 (我的網域 mdbookspace.com 是向 GoDaddy 申請的，第一年很便宜，只要台幣 45 元，但第二年以後就會變貴，好像要五百多元)
3. 取得 LetsEncrypt 的 SSL 證書
    * 如果有需要 https (ssl) ，那麼最好申請合格證書 (自簽證證書會導致瀏覽器有警告的叉叉，要申請免費的合格證書現在最好的方式是用 LetsEncrypt。由於 LetsEncrypt 標準程序主要支援 Nginx/Apache，所以經由網友建議後，我採用 Nginx 反向代理，然後將 80 轉到 443，並由 443 完成認證加密程序後，轉到我自己的 8080 port 去，這樣 node.js 裡也就不需要支援 SSL 就可以得到安全保護了)。
    * DigitalOcean 上的資料寫得很完整，有興趣的人可以參考下列文件！
    * [How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
    * [How To Secure Nginx with Let's Encrypt on Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04)
    * 最後用自動排程更新證書 sudo crontab -e (因為 LetsEncrypt 的證書每三個月都要更新一次)

更新證書的手動作法

```
$  sudo systemctl stop nginx // nginx -s stop
$  sudo certbot renew
$  nginx
$  pm2 start bookServer
```

Nginx 設定檔位於

```
root@ubuntu-512mb-sgp1-01:~# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

但我的 nginx 設定檔位於

```
/etc/nginx/sites-enabled/default
```




## 上線需要注意的調整

* [Express 正式作業最佳作法：效能和可靠性](http://expressjs.com/zh-tw/advanced/best-practice-performance.html)