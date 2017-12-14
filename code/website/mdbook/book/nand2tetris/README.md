# Nand2tetris -- 動手設計電腦的軟硬體

陳鍾誠的《計算機結構》與《系統程式》課程，都採用 Nand2tetris 這門網路課程。

* Nand2tetris = 計算機結構 + 系統程式

## 教材

* 開放課程： [coursera:nand2tetris](https://www.coursera.org/course/nand2tetris1) 。
 * 官方網站： <http://nand2tetris.org/>
 * 課本： [英文版](http://nand2tetris.org/book.php) | [中文版](http://product.dangdang.com/9261236.html)
 * Coursera 課程： [Part I](https://www.coursera.org/course/nand2tetris1) | [PartII](https://www.coursera.org/learn/nand2tetris2/)
 * 講義： <http://nand2tetris.org/course.php>
 * 軟體： <http://nand2tetris.org/software.php>
* 補充課程： [计算机组成 Computer Organization](https://zh-tw.coursera.org/learn/jisuanji-zucheng) , by 陆俊林（Lu Junlin）
* 補充教材： 
 * [少年科技人雜誌/2015年6月/NandToTetris 慕課記 -- 從邏輯閘到方塊遊戲](http://programmermagazine.github.io/mag/ymag201506/home.html)
 * [程式人雜誌/2015年7月/向 Nand2Tetris 學習電腦硬體設計](http://programmermagazine.github.io/mag/pmag201507/home.html)
 * [少年科技人雜誌/2015年6月/NandToTetris Part II 自學記 -- 虛擬機、編譯器與作業系統](http://programmermagazine.github.io/mag/ymag201508/home.html)
 * [程式人雜誌/2015年9月/向 Nand2Tetris 學習系統軟體設計](http://programmermagazine.github.io/mag/pmag201509/home.html)
 * [HackALU 的設計原理](HackALU.md)
 * [計算機組成與嵌入式系統](http://product.dangdang.com/23358872.html)

## 關於 nand2tetris

[Nand2tetris](http://www.nand2tetris.org/course.php) 是一門《專案導向》的網路線上課程。

這門課要求學習者從硬體到軟體完整的實作一台電腦。

學習者必須從《最基礎的 nand 閘開始，經過 ALU、CPU、組譯器、虛擬機、編譯器到作業系統》，完整的完成總共 12 個章節的習題。

我用這門課作為金門大學資訊工程系《計算機結構》與《系統程式》的主要教材。

二年級上學期先學習《計算機結構》，內容是 Nand2tetris 1-5 章。

二年級下學期接著學《系統程式》，內容是 Nand2tetris 6-12 章。

這兩門課的內容安排如下：

## 計算機結構

1 - [布林邏輯](chapter1.md) -- 簡易基本電路

2 - [算術電路](chapter2.md) -- 加法器 與 ALU

3 - [記憶電路](chapter3.md) -- 正反器、暫存器與記憶體

4 - [組合語言](chapter4.md) -- 組合語言與機器指令

5 - [計算機結構](chapter5.md) -- 處理器與整台電腦

## 系統程式

6 - [組譯器](chapter6.md) -- 將組合語言轉為機器語言

7 - [虛擬機 (1)](chapter7.md) -- 將中介語言轉為組合語言

8 - [虛擬機 (2)](chapter8.md) -- 將中介語言轉為組合語言

9 - [高階語言](chapter9.md) -- Hack 語言及語法

10 - [編譯器 (1)](chapter10.md) -- 高階語言剖析

11 - [編譯器 (2)](chapter11.md) -- 程式碼產生

12 - [作業系統](chapter12.md) -- 簡易作業系統

## 修課方法

1. 您可以選擇以 nand2tetris 為主，或者自行設計一顆自己的處理器，或者自行提出其他方案。
2. 以 nand2tetris 為主者，請看 coursera 上的影片並做習題。
3. 自行設計處理器者，可用 VHDL/Verilog 等硬體描述語言。
4. 提出其他方案者，請在《第三週前》將方案提交給老師。

