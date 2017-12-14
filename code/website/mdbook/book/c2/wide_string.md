#C 語言中的寬字串 -- 包含 Unicode

要在 C 語言中使用 Unicode 字串，假如您用的是 gcc 編譯器或 Linux，您可以使用寬字元 wchar_t 這個形態，以取代 char，然後用對應的函數取代原本的字串函數，以下是常見字串函數的寬字元版對應表。

| 窄字元    | 寬字元    | 說明                             |
|-----------|-----------|----------------------------------|
| strlen()  | wcslen()  | 字串長度                         |
| strcat()  | wcscat    | 字串連接                         |
| strcmp()  | wcscmp()  | 字串比較                         |
| strcoll() | wcscoll() | 字串比較 (不分大小寫)            |
| strcpy()  | wcscpy()  | 字串複製                         |
| strchr()  | wcschr()  | 尋找字元                         |
| strstr()  | wcswcs()  | 尋找字串                         |
| strtok()  | wcstok()  | 字串分割                         |
| strcspn() | wcscspn() | 傳回字串中第一個符合字元集的位置 |
| strpbrk() | wcspbrk() | 傳回字串中第一個符合字元集的指標 |
| strxfrm() | wcsxfrm() | 根據區域設定 locale() 轉換字元集 |

根據區域設定 locale() 轉換字元集
簡而言之，就是將原本 strXXX() 函數，轉換成 wcsXXX() 函數，然後照著原本的方法使用，只是對象從 char* 改為 wchar_t * 即可，請看下列範例。

####程式範例：Unicode 寬字串處理函數

檔案：unicode.c

```c
#include <stdio.h>
#include <locale.h>

int main(void)
{
    if (!setlocale(LC_CTYPE, "")) {
        fprintf(stderr, "Error:Please check LANG, LC_CTYPE, LC_ALL.\n");
        return 1;
    }
    wchar_t *str1=L"Hi!你好"; // 輸出結果 (範例)
    printf("str1=%ls\n", str1); // str1=Hi!你好
    printf("wcslen(str1)=%d\n", wcslen(str1)); // wcslen(str1)=5
    printf("wcschr(str1,%lc)=%d\n", L'好', wcschr(str1, L'好')); // wcschr(str1,好)=4206648
    printf("wcswcs(str1,%ls)=%d\n", L"你好", wcsstr(str1, L"你好")); // wcswcs(str1,你好)=4206646
    printf("wcsspn(str1,aeiou)=%d\n", wcsspn(str1, L"aeiou")); // wcsspn(str1,aeiou)=0
    printf("wcsspn(str1,EFGH)=%d\n", wcsspn(str1, L"EFGH")); // wcsspn(str1,EFGH)=1
    printf("address(str1)=%p\n", str1); // address(str1)=00403030
    printf("wcssbrk(str1,aeiou)=%p\n", wcspbrk(str1, L"aeiou")); // wcssbrk(str1,aeiou)=00403032
    wchar_t str2[20];
    wcscpy(str2, str1);
    printf("str2=%ls\n", str2); // str2=Hi!你好
    printf("wcscmp(str1,str2)=%d\n", wcscmp(str1, str2)); // wcscmp(str1,str2)=0
    wcscat(str2, L",我是John");
    printf("str2=%ls\n", str2); // str2=Hi!你好,我是John
    return 0;
}
```
####執行結果

    D:\cp>gcc unicode.c -o unicode

    D:\cp>unicode
    str1=Hi!你好
    wcslen(str1)=5
    wcschr(str1,好)=4206648
    wcswcs(str1,你好)=4206646
    wcsspn(str1,aeiou)=0
    wcsspn(str1,EFGH)=1
    address(str1)=00403030
    wcssbrk(str1,aeiou)=00403032
    str2=Hi!你好
    wcscmp(str1,str2)=0
    str2=Hi!你好,我是John
####後記

寬字串的處理函數有很多，並不限於上列的函數，幾乎所有具有字串的標準 C 函數都有寬版，關於更多的寬版函數請參考下列網頁。

> http://www.java2s.com/Tutorial/C/0300__Wide-Character-String/WideCharacterFunctions.htm

####來自 jserv 的建議

    """
    寬字串函數 — 寬字串的處理，在 C 語言中，通常寬字串指的是 Unicode (但不限定於 Unicode)
    """

    wide-character 翻譯為「寬字串」，我覺得有本質的問題。

    以下摘錄 CLDP:
    http://linux.org.tw/CLDP/OLD/doc/i18n-introduction.html

    "wcs" 是 "wide-chararater string" 的縮寫，而 "mbs" 是 "multi-byte string"
    的縮寫，二者分別代表字串的表現方式。所謂的 multi-byte 是指數個 char 組成 一個字 (如全形字或中文字是由兩個 char
    組成)，而 wide-char 是指一個 wchar_t type 就是一個字, 而 sizeof(wchar_t)
    的大小與系統有關，一般而言是 4 bytes。 一般我們可以直接看、輸出輸入等都是 multi-byte, 如:
        char *str = "這是一個句子: abcd";

    但我們會建議在程式內部，用 mbstowcs() 將它轉成 wchar_t 來統一處理，這個 轉換其實是根據 locale 中的
    LC_CTYPE 的機制，它定義了 multi-byte 與 wide- char
    值二者間的對應關係。做這樣轉換的好處是，您不用擔心全形、半形的問題， 因為一個 wchar_t 矩陣元就是一個字。

    wchar_t 有一組與 string.h 中相對應的字串處理函式，就定義在 wchar.h 中，讓我們可以如同處理 (char *) 那樣
    地處理 (wchar_t *), 其部分的對應關係如下，其他的可以直接看 wchar.h 的內容:

        wcscpy()        <====>          strcpy()
        wcsncpy()       <====>          strncpy()
        wcslen()        <====>          strlen()
        wcsdup()        <====>          strdup()
        wcscmp()        <====>          strcmp()
        wcsncmp()       <====>          strncmp()
        ........................................

    由於 mbs 碼與 wcs 碼的對應關係是由該 locale 的 LC_CTYPE 來決定的，也就是不 同的 locale
    寫法其對應關係可能會不一樣。就我們的 glibc2, zh_TW.Big5 locale 而言，由 mbs 轉成的 wcs 即為
    unicode (有關 unicode 的資訊可以在 http://www.unicode.org/
    中找到)，但不能保證在其他的系統或環境下也是如此。 故最保險的做法，是將字串儲存成 multi-byte, 然後在 run-time 時才用
    mbstowcs() 轉成 wide-char 來運作。

    ==> 可以看出重點不在於字串 (C 語言的 string 只是一個寫法，本質上仍是連續記憶體) 的「寬度」，而是 character 與
    character set 的「範圍寬度」
    ==> 建議保留原文 "wide character"，真要翻譯的話，可寫「擴充字元」

####參考文獻

* 简明手册:使你的C/C++代码支持Unicode -- http://www.i18nguy.com/unicode/c-unicode.zh-CN.html
* Programming with wide characters By Leslie P. Polzer on February 11, 2006 (8:00:00 AM) -- http://www.linux.com/archive/feature/51836
* [http://www.open-std.org/JTC1/SC22/WG14/www/docs/n1256.pdf The current Standard (C99 with Technical corrigenda TC1, TC2, and TC3 included) (PDF)], (3.61 MB). Pages 397, 398 and 400.

