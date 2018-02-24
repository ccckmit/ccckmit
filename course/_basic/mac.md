# Mac 電腦的使用與問題解決

## git push 失敗

* mac 有些電腦會已經安裝 ssh 證書，無法 git push ，解決方法如下:

```
訊息 remote: Permission to wuyichen110510434/co106a.git denied to nyy403213
$ git credential-osxkeychain erase
host=github.com
protocol=https
參考：https://stackoverflow.com/questions/11067818/how-do-you-reset-the-stored-credentials-in-git-credential-osxkeychain
```