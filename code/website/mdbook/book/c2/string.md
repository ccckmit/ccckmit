# 字串處理

| 主題             | 說明                                                                     |
|------------------|--------------------------------------------------------------------------|
| [字串大小的問題](string_size.md)   | 如何決定字串的大小，防止緩衝區溢位。                                     |
| [字串的格式化](string_format.md)     | printf 與 scanf 都用到的 format 字串，這是 C 語言字串輸出入的核心        |
| [sprintf 函數](sprintf.md)     | sprintf 是很好用的格式化工具                                             |
| [sscanf 函數](sscanf.md)      | sscanf 是很好用的字串剖析工具，並且支援類似 Regular Expression 的功能    |
| [標準字串函式庫](std_string_library.md)   | 標準 C 語言的字串大都是靜態函數，也就是不會在函數中分配新的記憶體        |
| [字串的誤用](string_bewares.md)       | 無法決定長度的字串，請不要用標準函式庫，要改用動態字串                   |
| [動態字串物件](dynamic_string.md)     | 可以動態增長的字串物件，讓您不用再為字串長度傷腦筋                       |
| [字串函數](wide_string.md)       | 寬字串的處理，在 C 語言中，通常寬字串指的是 Unicode (但不限定於 Unicode) |
| [寬窄字串間的轉換](wide_narrow_transform.md) |Unicode 轉為一般字串，或將一般字串轉為 Unicode                            |
 | [字串的誤用](string_wrong_using.md)     | 無法決定長度的字串，請不要用標準函式庫，要改用動態字串                  |