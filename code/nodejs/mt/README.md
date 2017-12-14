# MT

## PlainText

* https://github.com/matheuss/google-translate-api
* https://github.com/matheuss/google-translate-token
  * 這套件可以免費無限量使用 google 翻譯。
  * translate.google.com uses a token to authorize the requests. If you are not Google, you do not have this token and will have to pay $20 per 1 million characters of text.
  * This package is the result of reverse engineering on the obfuscated and minified code used by Google to generate such token.

## Web Page

* https://github.com/yixianle/translate-api
  * 這套件可以免費無限量使用 google 翻譯。
  * 線上使用： http://translate.hotcn.top/
  * 方法是偽裝成瀏覽器使用者去呼叫線上翻譯系統，然後用 cheerio 取回結果。
