# Docker

* [想理解、会用Docker，这篇文章就够了！](http://www.techug.com/post/understand-docker.html?utm_content=buffer826c6&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer)

## 前身 - chroot

* https://www.facebook.com/fred.chien.9/posts/1926761460670519
  * https://zh.wikipedia.org/wiki/Chroot
  * [理解 chroot](https://www.ibm.com/developerworks/cn/linux/l-cn-chroot/index.html)

## 安裝

* [在 Ubuntu 安裝 Docker 和 Docker Compose](https://yami.io/ubuntu-docker/)
  * apt install docker.io
  * docker version

## 簡介

原則： 一個container只運行一個服務

(註：怕掛掉可以用 restart=always 自動重啟)

整合範例： 使用 docker-compose

* [b00giZm/docker-compose-nodejs-examples](https://github.com/b00giZm/docker-compose-nodejs-examples/blob/master/05-nginx-express-redis-nodemon/docker-compose.yml)

## docker-compose

* https://docs.docker.com/compose/overview/
  * https://docs.docker.com/compose/install/
* [Getting started with Docker Compose and Nodejs](https://github.com/b00giZm/docker-compose-nodejs-examples) (讚！)
* https://github.com/vkomulai/docker-node-mongo-starter

## nginx



## Node.js

* https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
  * 照著這篇做，別看書，最快！

## PM2

* https://segmentfault.com/q/1010000007258157
  * pm2 用在 docker 里面的时候需要把 pm2 命令改成 pm2-docker 命令，这样就可以在前台运行。而且我个人感觉没有必要在 docker 中使用 pm2，如果 node 进程挂掉对应的容器也会停止运行，所以在启动 docker 容器的时候添加 restart=always 参数就可以自动重启了
* 或者按照 PM2 官網說的
  * http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/
* [在docker中使用pm2或forever (2015)](https://blog.xinshangshangxin.com/2015/06/13/%E5%9C%A8docker%E4%B8%AD%E4%BD%BF%E7%94%A8pm2%E6%88%96forever/)


## node.js + nginx

* [Docker with node server & nginx (中文，讚！)](https://hackmd.io/s/SJZq1jr8-)

* https://medium.com/@adriendesbiaux/node-js-pm2-docker-docker-compose-devops-907dedd2b69a
* http://anandmanisankar.com/posts/docker-container-nginx-node-redis-example/
  * 中文版 -- http://dockone.io/article/291