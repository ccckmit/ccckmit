# MarkDown Object (MDO)

Markdown has no object like JSON, so we extend it with an Markdown Object Format (MDO).

Chinese:
# 物件 (MarkDown Object, MDO)

Markdown 當中沒有表達像 JSON 一樣的物件機制，因此不能表達階層性的東西。

雖然 Bookdown 裏允許大家直接撰寫 JSON 檔案，但是 JSON 檔案表達《表格類》物件時，每筆紀錄都要寫欄位名稱，會變得很囉唆！

因此我們對 Markdown 語法進行延伸，加入了 mdo (MarkDown Object) 這種結構，這個結構有點類似 JSON，但是簡化了不少，而且可以加入 markdown 表格在欄位當中，讓您能用精簡的語法輕易地表達物件。

以下是一個 Markdown Object (mdo) 的範例：

```mdo
type:book
title:Markdown 寫作手冊
editor:ccc
coeditor: ["snoopy", "garfield"]
keywords: [
  "markdown",
  "bookdown",
  "電子出版"
]
table_of_contents:
title    | link
---------|---------
前言     | README.md
基本語法 | markdown.md
表格     | table.md
數學式   | math.md
物件     | object.md
```

基本上 mdo 物件都採用《欄位：內容》的方式撰寫，欄位一定是在行首，欄位後面跟的值可以有多行，這些值可以是《JSON 物件、表格或字串》，若不是物件或表格，就會被認為是單純的字串。

