# Nginx 網站伺服器

Nginx 的 reverse proxy 對於用 node.js 設計網站的人很好用，您可以透過修改設定檔，達成很多網站交互使用的任務！ (也可以用來分散流量 ....)

## 多網站和網域的問題

可搭配 nginx 做 reverse proxy 

* [Node.js學習筆記：Nginx作為Node.js伺服器的設置](https://nodejust.com/nginx-nodejs-server-configuration/)
* [Digital Ocean -- How To Set Up a Node.js Application for Production on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04)
* [在 CentOS 中使用 Nginx 來架設 Web 伺服器](http://yenpai.idis.com.tw/archives/336-%E6%95%99%E5%AD%B8-%E5%9C%A8-centos-%E4%B8%AD%E4%BD%BF%E7%94%A8-nginx-%E4%BE%86%E6%9E%B6%E8%A8%AD-web-%E4%BC%BA%E6%9C%8D%E5%99%A8)
* [Nginx Different Domains on Same IP](http://stackoverflow.com/questions/11773544/nginx-different-domains-on-same-ip)
* [Disable HTTPS redirect in NGINX](https://www.digitalocean.com/community/questions/disable-https-redirect-in-nginx)
* [Multiple sites using nginx](https://www.digitalocean.com/community/questions/multiple-sites-using-nginx)
* [How To Install Nginx on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04)
* [What is the best way to uninstall nginx](http://askubuntu.com/questions/235347/what-is-the-best-way-to-uninstall-nginx)

## 我的 Nginx Config

```
# copy to linux : /etc/nginx/sites-enabled/default

server {
        listen 80;
        listen [::]:80 default_server ipv6only=on;
        return 301 https://$host$request_uri;
}

# HTTPS - proxy requests on to local Node.js app:
server {
        listen 443;
        server_name artificialspoken.org;

        ssl on;
        # Use certificate and key provided by Let's Encrypt:
        ssl_certificate /etc/letsencrypt/live/artificialspoken.org/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/artificialspoken.org/privkey.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

        # Pass requests for / to localhost:8081:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8081/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
        
        location /mdbook/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8080/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
        
}

# HTTPS - proxy requests on to local Node.js app:
server {
        listen 443;
        server_name mdbookspace.com;

        ssl on;
        # Use certificate and key provided by Let's Encrypt:
        ssl_certificate /etc/letsencrypt/live/mdbookspace.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/mdbookspace.com/privkey.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

        # Pass requests for / to localhost:8080:
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8080/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
        
        location /asl/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://localhost:8081/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }
}
```

## 單一虛擬主機跑兩個網站的技巧

* [How To Run Multiple Websites Using Nginx Webserver On Ubuntu 15.04](https://www.liberiangeek.net/2015/07/how-to-run-multiple-websites-using-nginx-webserver-on-ubuntu-15-04/)

摘要：

```
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/example.com
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/myexample.com
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/myexample.com /etc/nginx/sites-enabled/

Restart Nginx web server using the commands below.

sudo systemctl reload nginx
```

## Nginx 會自動導到 ssl ，如何解決

答案是：沒辦法！ 這是 SSL 的天性！

* [http://serverfault.com/questions/325485/nginx-how-to-prevent-an-exactly-named-ssl-server-block-from-acting-as-the-catch](http://serverfault.com/questions/720276/disable-ssl-on-an-nginx-server-block-listening-on-port-443)
* [How to disable "redirect http to https"? ](https://github.com/mholt/caddy/issues/504)

## 我在 DigitalOcean 常用指令紀錄

```
  298  cp nginx /etc/nginx/sites-enabled/default
  299  cp nginx.conf /etc/nginx/sites-enabled/default
  300  nginx -t
  301  sudo systemctl restart nginx
  302  nano /etc/nginx/sites-enabled/default
  303  nginx -t
  304  sudo systemctl restart nginx
  305  ls /etc/nginx/sites-enabled
  306  history
  309  sudo nano /etc/nginx/sites-enabled/default
  310  ls
  311  cd github
  312  ls
  313  cd artificialspoken/
  314  ls
  315  cd server
  316  ls
  317  pm2 list
  318  pm2 stop asltServer
  319  pm2 remove asltServer
  320  pm2 delete asltServer
  321  ls
  322  node spokenServer.js
  323  cd ..
  324  npm install
  325  cd server
  326  ls
  327  node spokenServer.js
  328  pm2 start spokenServer.js
  329  history

```

## Ｎginx 加速

＊ [Ｎginx 加速](https://www.nginx.com/blog/10-tips-for-10x-application-performance/)
