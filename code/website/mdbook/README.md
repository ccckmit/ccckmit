# MdBook

Book Editing System for Markdown

## Install

```
$ git clone https://github.com/ccckmit/mdbook.git
$ cd mdbook
$ npm install
$ node bookServer // if you would like to store data in mongodb, start mongod before this command
```

Visiting https://localhost:8080/ for a demo site.

The default user/password is user=ccc, password=ccc1234. 

You should modify the user/password data in setting/setting.mdo for security.

If you do not start a mongodb server, bookdown will not save data into mongodb, but still can work on the file system.

