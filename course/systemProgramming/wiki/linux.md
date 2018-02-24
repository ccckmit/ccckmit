# Linux

## Win10 底下的 linux

* [Windows Subsystem for Linux Documentation](https://msdn.microsoft.com/en-us/commandline/wsl/about)
* [內建Linux子系統，Windows 10將可執行Ubuntu與Bash工具](http://www.pcdiy.com.tw/detail/3780)

先在搜尋裡找《開發人員專用設定》後，啟動《開發人員模式》，接著以系統管理員身分執行下列指令。

```
C:\Windows\system32>bash
-- 搶鮮版 (Beta) 功能 --
這會在 Windows 上安裝 Ubuntu，它是由 Canonical
散佈，而且根據其下列條款授權使用:
https://aka.ms/uowterms

若要使用此功能，您必須啟用「開發人員模式」。

C:\Windows\system32>bash
-- 搶鮮版 (Beta) 功能 --
這會在 Windows 上安裝 Ubuntu，它是由 Canonical
散佈，而且根據其下列條款授權使用:
https://aka.ms/uowterms

輸入 "Y" 以繼續: y
正在從 Windows 市集下載... 100%
正在解壓縮檔案系統，這只需要幾分鐘的時間...
```

## System Programming

* [The Linux Programming Interface 國際中文版 (上冊 + 下冊) ](https://www.tenlong.com.tw/products/9487001021035)
  * https://github.com/posborne/linux-programming-interface-exercises
* Linux System Programming (Robert Love)
  * https://moodle2.units.it/pluginfile.php/110718/mod_resource/content/2/Linux%20System%20Programming%2C%202nd%20Edition.pdf

* mmap : 將檔案映射到記憶體，於是可以透過記憶體存取檔案。
  * http://www.jollen.org/blog/2007/03/mmap_vma.html
* epoll : event polling
  * https://zh.wikipedia.org/wiki/Epoll
  * https://baike.baidu.com/item/mmap/1322217?fr=ala0_1_1

## Vim

* https://www.facebook.com/fred.chien.9/posts/1032633070083367


Vim 其實沒這麼難呀，新手只要學會幾招，就基本上可以丟掉其他 IDE 了。一開始就把 Vim 講太難，根本只是高手耍帥而已，初學者可以不用鳥呀。

1. 只要沒事就按 Esc，讓他離開編輯模式，就可以輸入指令。若想進入編輯模式就按一下 i ，就可以開始編輯及插入文字。

2. 然後只要學會在非編輯模式下輸入 :w 與 :q 再加上 Enter，就會存檔和離開程式。

3. yy 和 p 超好用，講明白了就是複製一行與貼上，剪下一行則是用 cc。

4. 像要插入一行空白行，並直接進入編輯模式在新的一行開始編輯，就用 o。

5. 刪除一行用 dd。

6. 跳到指定第幾行就這樣用 :100 （到第一百行）

7. 尋找字串用 / ，如： /fred。取代所有字串用 :%s/fred/pig/g 。

基本上，這樣就夠了，等用熟了再來學更多吧。（什麼 Shift+V 之類的東西）

喔，對了，注意指令的大小寫。請確定 Caps Lock 的燈是滅的再來按指令。

* [Vim 圖解鍵盤指令](https://www.facebook.com/photo.php?fbid=1576645182611803&set=gm.1051391024877613&type=3&theater)

## Expect

自動登入後執行 shell script 的工具

* [Expect妙用無窮](https://wirelessr.gitbooks.io/working-life/content/expectmiao_yong_wu_qiong.html)