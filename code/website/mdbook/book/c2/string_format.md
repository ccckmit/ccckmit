# 字串的格式化

在 C 語言當中，輸出格式化依賴 printf() 類的指令，而輸入的格式化則仰賴 scanf 類的指令。這兩個函數都用到的 format 字串，這是 C 語言字串輸出入的核心。

事實上，這兩類指令當中最重要的函數是 sscanf() 與 sprintf()，sprintf() 可以將複雜的參數格式化成字串，而 sscanf() 函數則是 C 語言版本的正規表達式，幾乎可以做到大部分 Regular Expression 能做到的功能。

在這些函數當中，都會有一個 char *format 這樣的格式化參數，其中以 % 開頭的稱為格式描述區 (Format specifiers)，格式描述區有複雜的參數型態，稱為描述元 (specifier)，下表說明了描述元當中符號的意義，並列出其使用範例。

| 符號 | 說明                           | 範例      |
|------|--------------------------------|-----------|
| c    | 字元 (char)                    | a         |
| d    | 整數 (Decimal integer)         | 372       |
| i    | 整數 (Decimal integer) (同 d)  | 372       |
| f    | 浮點數 (Floating Point)        | 372.56    |
| e    | 科學記號 (Scientific notation) | 3.7256e+2 |
| E    | 科學記號 (Scientific notation) | 3.7256E+2 |
| g    | 取浮點數或科學記號當中短的那個 | 372.56    |
| G    | 取浮點數或科學記號當中短的那個 | 372.56    |
| o    | 八進位 (Octal Integer)         | 735       |
| s    | 字串 (String)                  | 372       |
| u    | 無號數 (unsigned integer)      | 372       |
| x    | 十六進位 (Hexadecimal integer) | 3fb       |
| X    | 十六進位 (Hexadecimal integer) | 3FB       |
| p    | 指標位址                       | B800:0000 |
| n    | 不列印, 用來取得目前輸出長度   | %n        |
| %    | 印出 % 符號                    | %%        |

另外，有時在格式描述區當中還會指定變數長度欄位，說明取出後的變數長度，數字類型的欄位才會需要這樣指定，欄位的內容可能為 h, l 或 L，其意義如下所示。

| 長度符號 | 說明                                                |
|----------|-----------------------------------------------------|
| h        | 2 byte 短整數 short int (針對 i, d, o, u, x and X)  |
| l        | 4 byte 長整數 int , long (針對 i, d, o, u, x and X) |
| L        | 8 byte 浮點數 double (e, E, f, g and G)             |