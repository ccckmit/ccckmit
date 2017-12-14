# 語系設定

http://www.arthurtoday.com/2015/02/how-to-make-ubuntu-terminal-speak-your-language.html

```
sudo locale-gen zh_TW 

sudo locale-gen zh_TW.UTF-8 

sudo dpkg-reconfigure locales 

sudo update-locale LANG="zh_TW.UTF-8" LANGUAGE="zh_TW"
```

ref: 

 http://www.arthurtoday.com/2015/02/how-to-make-ubuntu-terminal-speak-your-language.html#ixzz4jmELVx6u


之後，如果需要再改回英文語系的話，就只要執行下面這一行指令，然後，再登出再登入或重新開機之後，就會回到英文語系了哩 ! ...

sudo update-locale LANG="en_US.UTF-8" LANGUAGE="en_US.UTF-8"

## VIM 中文

參考：http://blog.sina.com.cn/s/blog_45bcb4c30100x0lj.html

vim:
打开vim的配置文件，位置在/etc/vim/vimrc
在其中加入
set fileencodings=utf-8,gb2312,gbk,gb18030
set termencoding=utf-8
set encoding=prc
保存退出
source /etc/vim/vimrc
此时vim就能正确显示中文了。
