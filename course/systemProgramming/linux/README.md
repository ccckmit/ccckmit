# ubuntu 1604 server

## nodejs

Linux

```
$ sudo apt update
$ sudo apt install nodejs
$ sudo apt install npm

```

## node 不是 node.js 

使用下列方式修正：

https://github.com/animetosho/Nyuu/issues/14



```
$ sudo ln -s /usr/bin/nodejs /usr/bin/node
```

## 更新 node.js

https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version

```
Use n module from npm in order to upgrade node

sudo npm cache clean -f
sudo npm install -g n
sudo n stable

sudo ln -sf /usr/local/n/versions/node/<VERSION>/bin/node /usr/bin/node 
To upgrade to latest version (and not current stable) version, you can use

sudo n latest
```

## node-gyp

```
$ sudo npm install -g node-gyp
```

## 安裝 node-canvas

```
$ npm install canvas 
```

失敗，提示沒有裝 pkg-config

```
For Ubuntu/Debian OS,

apt-get install -y pkg-config
```

裝完後再執行一次 npm i canvas

結果發現缺少： cairo


```
$ sudo apt-get install libcairo2-dev libjpeg-dev libgif-dev
```

參考：https://stackoverflow.com/questions/22100213/package-cairo-was-not-found-in-the-pkg-config-search-path-node-j-s-install-canv


## 縮短 BASH 提示


https://askubuntu.com/questions/145618/how-can-i-shorten-my-command-line-bash-prompt


To change it for the current terminal instance only

Just enter PS1='\u:\W\$ ' and press enter.

To change it "permanently"

In your ~/.bashrc, find the following section:

```
if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
```

Remove the @\h, and replace the \w with an uppercase \W, so that it becomes:

```
if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u:\W\$ '
fi
```

Save, exit, close terminal and start another to see the result.

## Proxy

我的 mcool 方案必須設定 /etc/apt/apt.conf 檔案，

```
Acquire::http::proxy "http://10.1.1.1:8080/";
Acquire::ftp::proxy "ftp://10.1.1.1:8080/";
Acquire::https::proxy "https://10.1.1.1:8080/";
```

這樣才能讓 sudo apt update 更新成功！

然後下 sudo apt install nodejs 就可以成功了。

https://askubuntu.com/questions/175172/how-do-i-configure-proxies-without-gui

```
System-wide proxies in CLI Ubuntu/Server must be set as environment variables.

Open the /etc/environment file with vi (or your favorite editor). This file stores the system-wide variables initialized upon boot.
Add the following lines, modifying appropriately. You must duplicate in both upper-case and lower-case because (unfortunately) some programs only look for one or the other:
http_proxy="http://myproxy.server.com:8080/"
https_proxy="http://myproxy.server.com:8080/"
ftp_proxy="http://myproxy.server.com:8080/"
no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"
HTTP_PROXY="http://myproxy.server.com:8080/"
HTTPS_PROXY="http://myproxy.server.com:8080/"
FTP_PROXY="http://myproxy.server.com:8080/"
NO_PROXY="localhost,127.0.0.1,localaddress,.localdomain.com"
apt-get, aptitude, etc. will not obey the environment variables when used normally with sudo. So separately configure them; create a file called 95proxies in /etc/apt/apt.conf.d/, and include the following:
Acquire::http::proxy "http://myproxy.server.com:8080/";
Acquire::ftp::proxy "ftp://myproxy.server.com:8080/";
Acquire::https::proxy "https://myproxy.server.com:8080/";
```

