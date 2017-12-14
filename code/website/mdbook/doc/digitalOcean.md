# 網站上線的方法

## 關於架站：

1. DigitalOcean 申請 一個虛擬主機 (最低 $5/month, 我用 ubuntu linux)
2. 用 putty 連上去 server 之後，安裝相關軟體
3. 在 server 安裝 sftpd 以便將檔案上傳
4. 若你用 windows, 在 Client 裝 WinSCP 以便連上 server 並上傳檔案。(用 git/github/gitbucket 也行)
5. 將檔案上傳後，啟動 server 程式
6. 直接打 ip (我的站為  http://139.59.108.105 ) 測試看看網站是否正常運作。
7. 去 GoDaddy 申請網域綁定，我的網域為 http://mdbookspace.com/
8. 申請 LetsEncrypt 證書


DigitalOcean 上的資料寫得很完整，有興趣的人可以試試看！

https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04 

最後用自動排程更新證書

```
sudo crontab -e
Add the following lines:
crontab entry30 2 * * 1 /usr/local/sbin/certbot-auto renew >> /var/log/le-renew.log
35 2 * * 1 /etc/init.d/nginx reload
```

最後用 https://www.ssllabs.com/ssltest/analyze.html?d=mdbookspace.com 檢查網站的 SSL 品質如何，發現我的網站和早期的 IE6, Android 2.2, 與 Java6 不相容。

關於 node.js/linux：

1. 使用 pm2 去啟動伺服器，這樣 putty 退出時才不會 server 被關掉 (或用 nohup  也行)
    pm2 建議使用他的pm2 startup 來設定開機啟動，會自動註冊成systemd服務 是一個比較好的方式 
2. 可以使用 crontab 在開機時就啟動 server

重新申請證書的方法

```
sudo service nginx  stop
certbot-auto renew
sudo service nginx start
```