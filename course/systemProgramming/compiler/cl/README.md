### 語言處理技術

本書涵蓋「自然語言、程式語言、標記語言」處理等領域，包含語法、語意、編譯、計算語言學、自然語言理解、交談系統、機器翻譯等主題。

本書為創作共用作品，採用 [創作共用：姓名標示、非商業性、相同方式分享授權] ，包含很多簡易的實作程式，讓您能瞭解如何實作自然語言處理系統，而不僅僅是理論陳述而已，這些程式碼都可以直接在 github 上下載。

### 書籍下載

您可以點選 [SlideShare 預覽] 或者 [docin 預覽] 等連結閱讀本雜誌，或者直接下載整本雜誌的 PDF 檔案，其中 A5 比較適合在電腦或平板上閱讀，而 A4 則比較適合列印出來看。

說明：DOT 檔則是雜誌的 LibreOffice 編輯原稿，可供直接剪貼程式碼，或後續衍生修改之用。

<center>
<table width="95%">
<tr><th>出刊年月</th><th>A5:PDF</th><th>A4:PDF</th><th>A5:ODT</th><th>A4:ODT</th><th>程式下載</th><th>原始碼</th></tr>
<tr><td>2013年1月</td>
<td><a href="https://github.com/programmermagazine/201301/blob/master/201301/ProgrammerMag201301A5.pdf?raw=true">A5.pdf</a></td>
<td><a href="https://github.com/programmermagazine/201301/blob/master/201301/ProgrammerMag201301A4.pdf?raw=true">A4.pdf</a></td>
<td><a href="https://github.com/programmermagazine/201301/blob/master/201301/ProgrammerMag201301A5.odt?raw=true">A5.odt</a></td>
<td><a href="https://github.com/programmermagazine/201301/blob/master/201301/ProgrammerMag201301A4.odt?raw=true">A4.odt</a></td>
<td><a href="https://github.com/programmermagazine/code201301/archive/master.zip">Zip</a></td>
<td><a href="https://github.com/programmermagazine/code201301/">source</a></td>
</tr>
</table>
</center>

### 本書內容
內容目錄
第1章 簡介	11
 1.1.語言的種類	11
 1.1.1.自然語言	13
 1.1.2.標記語言	15
 1.1.3.人造語言	23
 1.2.語言的層次	26
 1.3.語言的處理	27
 1.4.語言的意義	30
第2章 語言生成	33
 2.1.生成語法	33
 2.1.1.產生自然語言	34
 2.1.2.產生程式語言	39
 2.2.語法的層次	40
 2.3.實作：生成語法	45
 2.3.1.基礎函式庫	45
 2.3.2.生成 Type 3 正規語言	46
 2.3.2.1.生成整數	46
 2.3.2.2.生成浮點數	48
 2.3.3.生成 Type 2 上下文無關語言	50
 2.3.3.1.生成程式語言 (運算式)	50
 2.3.3.2.生成自然語言 (英文版)	52
 2.3.3.3.生成自然語言 / 中文版	54
第3章 字元編碼	57
 3.1.英文 – ASCII	57
 3.2.中文 – 繁體 Big5	59
 3.3.多國語言 – Unicode	66
 3.4.實作：簡繁體互轉	76
第4章 詞彙與詞典	81
 4.1.詞彙的處理	81
 4.2.英文詞彙掃描	82
 4.3.詞典 – CC-CEDict	84
 4.4.中文的詞彙掃描 – 斷詞	90
第5章 語法剖析	91
 5.1.剖析器	91
 5.2.剖析程式語言	93
 5.3.剖析自然語言	95
 5.4.剖析標記語言	99
第6章 語意辨識	101
 6.1.何謂語意？	101
 6.2.程式的語意	101
 6.2.1.詞彙	102
 6.2.2.語句	103
 6.2.3.文章層次	104
 6.3.自然語言的語意	105
 6.3.1.語句的意義	105
 6.3.2.格狀語法 (Case Grammar)	106
 6.3.3.欄位填充機制	108
 6.3.4.文章與劇本 (Script)	109
 6.3.5.程式實作	112
 6.3.5.1.格變語法 case.c	112
 6.3.5.2.欄位填充機制	113
 6.3.5.3.劇本比對	119
第7章 語法比對	124
 7.1.字串比對	124
 7.2.正規表達式	128
第8章 自然語言的處理	133
 8.1.自然語言	133
 8.2.規則比對法	134
 8.2.1.Eliza 交談系統 – 理解程度很淺	134
 8.2.2.Baseball 棒球問答系統 – 理解程度較深	139
 8.3.機率統計法	144
 8.3.1.學習未知詞	144
 8.4.研究資源	147
 8.5.習題	148
第9章 機器翻譯	149
 9.1.簡介	149
 9.2.規則式翻譯	153
 9.2.1.解歧義問題 (Word Sense Disambiguation) 	157
 9.2.2.語法剖析的問題 (Parsing)	157
 9.2.3.樹狀結構轉換的問題 (Structure Transformation)	158
 9.2.4.目標語句合成的問題 (Sentence Generation)	158
 9.2.5.採用規則的翻譯程式 (C 語言實作)	158
 9.3.統計式翻譯	168
 9.3.1.雙語文章的建構問題 (Corpus Construction)	169
 9.3.2.雙語語句的對齊問題 (Sentence Alignment)	169
 9.3.3.雙語詞彙的對齊問題 (Word Alignment)	169
 9.3.4.優化問題 (Optimization)	170
 9.4.結語

### 資源下載
如果您想用 git 下載本書程式碼，請使用 git clone 指令如下：

```
$ git clone https://github.com/ccckmit/BookLanguageProcessing.git
```

### 連絡我們
本書作者為「陳鍾誠 (@ccckmit)」，若要聯絡編輯，請寄信到 ccckmit@gmail.com。

[SlideShare 預覽]: http://www.slideshare.net/ccckmit/2013-1-15836437
[docin 預覽]: http://www.docin.com/p1-571105593.html
[創作共用：姓名標示、非商業性、相同方式分享授權]: http://creativecommons.org/licenses/by-nc-sa/3.0/tw/