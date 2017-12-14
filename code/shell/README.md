# Shell (bash)

export PS1="--> " 可以讓顯示路徑變短，例如：

```
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/linuxc/process$ export PS1="--> "
--> ls
fork  fork.c  pid  pid.c  signal  signal.c  wait  wait.c
```

使用 chsh -s /bin/bash 將 sh 預設為 bash

使用 dos2unix 將 CR LF 轉為 LF

```
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ chsh -s /bin/bash
Password:
chsh: PAM: Authentication failure
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ chsh -s /bin/bash
Password:
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./hello.sh
Hello Linux!!!
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./func.sh
./func.sh: 2: ./func.sh: Syntax error: "(" unexpected
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./func.sh
./func.sh: line 2: syntax error near unexpected token `$'\r''
'/func.sh: line 2: `function printName()
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ dos2unix *.sh
dos2unix: converting file array.sh to Unix format ...
dos2unix: converting file env.sh to Unix format ...
dos2unix: converting file func.sh to Unix format ...
dos2unix: converting file hello.sh to Unix format ...
dos2unix: converting file if.sh to Unix format ...
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./func.sh
./func.sh
jim
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./if.sh
please input name:
ccc
./if.sh: line 6: syntax error near unexpected token `else'
./if.sh: line 6: `else'
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$ ./if.sh
please input name:
ccc
name is :ccc
ccckmit@DESKTOP-96FRN6B:/mnt/d/Dropbox/course/sp106b/shell$
```