# 第 1 章. 簡介 -- 網站設計概論

## Network、Internet 與 Web

在英文當中、Network、Internet 與 Web 這些名詞是區分得很清楚的，但是對於中文使用者而言，這三個名詞卻很難釐清，不過對於程式人員而言，區分這幾個名詞是很重要的是，特別是 Internet 與 Web 這兩個名詞，首先讓我們來看看這些名詞的差異。

英文中的 Network 泛指任何的網路，包含像公路也叫做 Traffic Network，因此即使在電腦領域，Network 仍然泛指任何網路，包含區域網路、廣域網路、Internet、Ethernet 等等都是 Network。

Internet 是指 1960 年代美國國防部 (Department of Defense, DoD) 所發展出來的那個網路，原本稱為 ARPANET，後來延伸到全世界之後，就稱為 Internet 了。

1990 年 Tim Burner Lee 創造了 HTML 、URL、與全世界第一個 WebServer，從此開始創造出一個基於 Internet 的網路架構，這個網路架構被稱為 World Wide Web (簡稱為 Web 或 WWW)，後來在 1992 年當時 Marc Andreessen 招聘了一些程式員開發出一個稱為 Mosaic 的瀏覽器 (Browser, 也就是 Web 的 Client 介面) 之後，推動了 Web 的急速發展。

所以，凡是透過瀏覽器接觸到的網路，通常就是 Web 。而不是透過瀏覽器接觸到網路的軟體，則通常是基於 Internet 的應用程式。所以您用 Internet Explorer, Firefox, Chrome, Safari 等瀏覽器所看到的網站，其實都是一個一個的 Web 程式所組成的，而那些不經過瀏覽器，而是要另外安裝的應用程式，像是 Skype、MSN 等，則是 Internet 應用程式。

本書的焦點是 Web 程式設計，也就是網站的設計，而非像 Skype、MSN 這樣的 Internet 應用程式。


## Web 的相關技術

HTTP 是 Web 全球資訊網 (萬維網) 的基礎協定，該協定架構在 TCP/IP 架構之上，屬於應用層的協定。構成 HTTP 的主要兩個應用程式是瀏覽器 (Browser) 與網站 (Web Server)。HTTP 是一個典型的 Client-Server (客戶端-伺服端) 架構的協定，使用者透過 Client 端的瀏覽器連結到 Server 的伺服器，然後由伺服端將結果以 HTML 的網頁格式傳回。 HTML 的網頁當中包含了許多超連結 (Hyperlink)，這些超連結連接到某些網址 (URL)，於是使用者可以透過瀏覽器中的超連結，進一步點選其他的網頁，進行網路瀏覽的行為。

絕大部分的使用者，現在都是使用 Internet Explorer, Firefox, Chrome, Safari 等瀏覽器在上網，因此所使用到的就是 Web 程式，本書的焦點也正是這種基於 Web 的程式技術。

Web 相關的技術非常的多，其中最核心的部分是 HTTP/HTML/URL/CSS/JavaScript 等技術，而圍繞著這些核心技術上所發展出來的技術則難以數計，像是 PHP、ASP/ASP.NET、JSP、Ruby on Rail、Python/Dejango、Node.js、XML、JSON、XMLHTTP、AJAX、jQuery 等等，本書後面的章節將採用一個最少語言的架構，以 JavaScript 為核心，採用 HTML + CSS + JavaScript 為主要技術，並搭配 JavaScript 所衍生出的 jQuery 與 Node.js 等技術，以建構出完整的 Web 程式設計概念。

	本書 = HTTP + HTML + CSS + JavaScript + jQuery + Node.js 所組成的 Web Programming 技術
	
其中、HTTP 是所有技術的起點，讓我們先來看看 HTTP 到底做了甚麼事。

## HTML 與 HTTP

當您用 Browser 看網站的時候，到底 Browser 傳遞什麼訊息給 Server，而 Server 又回傳神麼訊息給 Browser 呢？

粗略的說、一個最簡單的 Web Server 之功能包含下列三個步驟：

* 步驟一 : 接收瀏覽器所傳來的網址。
* 步驟二 : 取出相對應的檔案。
* 步驟三 : 將檔案內容傳回給瀏覽器。

然而、在這個接收與傳回的過程中，所有的資訊都必須遵照固定的格式，規範這個接收/傳送格式的協定，稱為超文字傳送協定 
(Hyper Text Transfer Protocol)，簡稱為 HTTP 協定。

HTTP 協定格式的基礎，乃是建構在網址 URL 上的傳輸方式，早期只能用來傳送簡單的 HTML 檔案，後來經擴充後也可以傳送
其他類型的檔案，包含 影像、動畫、簡報、Word 文件等。

在本文中，我們將先簡介 HTTP 協定的訊息內容，然後在介紹如何以 Java 語言實作 HTTP 協定，以建立一個簡單的 Web Server。

### HTTP 協定

當你在 Browser 上打上網址(URL)後， Browser 會傳出一個HTTP訊息給對應的 Web Server，Web Server 再接收到這個訊息後，
根據網址取出對應的檔案，並將該檔案以 HTTP 格式的訊息傳回給瀏覽器，以下是這個過程的一個範例。

豬小弟上網，在瀏覽器中打上 http://ccc.kmit.edu.tw/index.htm，於是、瀏覽器傳送下列訊息給 ccc.kmit.edu.tw 這台電腦。

```
GET /index.htm HTTP/1.0
Accept: image/gif, image/jpeg, application/msword, */*
Accept-Language: zh-tw
User-Agent: Mozilla/4.0
Content-Length: 
Host: ccc.kmit.edu.tw
Cache-Control: max-age=259200
Connection: keep-alive

```

當 ccc.kmit.edu.tw 電腦上的 Web Server 程式收到上述訊息後，會取出指定的路徑 /index.htm ，然後根據預設的網頁根目錄 
(假設為 c:\web\)，合成一個 c:\web\index.htm 的絕對路徑，接著從磁碟機中取出該檔案，並傳回下列訊息給豬小弟的瀏覽器。

```
HTTP/1.0 200 OK
Content-Type: text/html
Content-Length: 438
<html>
  ....
</html>
```

其中第一行 HTTP/1.0 200 OK 代表該網頁被成功傳回，第二行 Content-Type: text/html 代表傳回文件為 HTML 檔案，
Content-Length: 438 代表該 HTML 檔案的大小為 438 位元組。

換言之、 Browser 會傳遞一個包含網頁路徑的表頭資訊給 Server，而 Server 則會回傳一個 HTML 檔案給 Browser，這樣的傳送格式與規則，就稱為 HTTP 協定。

在 Web 開始成長之後，這樣的模式就顯得有點不足了，因為很多網頁需要使用者填入一些欄位，像是帳號密碼等資訊，但是上述的表頭並沒有欄位資訊預留空間，於是為了回傳這些使用者填入的訊息，有人想到了可以在網址的後面補上參數，這種方式就稱為 GET 的參數傳送方式，以下是一個傳送帳號密碼的表頭訊息，其中的 ?user=ccc&password=1234567 是 Browser 傳送給 Server 的參數。

```
GET /login?user=ccc&password=1234567 HTTP/1.0
Accept: image/gif, image/jpeg, application/msword, */*
Accept-Language: zh-tw
User-Agent: Mozilla/4.0
Content-Length: 
Host: ccc.kmit.edu.tw
Cache-Control: max-age=259200
Connection: keep-alive

```

但是後來，這些填入的欄位越來越多，傳送的參數訊息也越來越長，而這些訊息有些也不希望被顯示在網址列上讓大家看到，因此又發展出了另外一種參數傳遞方式，這種方式就稱為 POST，以下是POST訊息的一個範例。

```
POST /msg.php HTTP/1.0
Accept: image/gif, image/jpeg, application/msword, */*
Accept-Language: zh-tw
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/4.0
Content-Length: 66
Host: ccc.kmit.edu.tw
Cache-Control: max-age=259200
Connection: keep-alive

user=ccc&password=1234&msg=Hello+%21+%0D%0AHow+are+you+%21%0D%0A++
```

上述表頭中的最後一句「user=ccc&password=1234&msg=Hello+%21+%0D%0AHow+are+you+%21%0D%0A++」是三個欄位參數被編碼後的結果，其中的 user 欄位值是 ccc，password 欄位值是 1234，而 msg 的值則是下列文章。

```
Hello !
How are you !
```

POST 訊息與 GET 訊息不同的地方，除了在 HTTP 的訊息開頭改以 POST 取代 GET 之外，並且多了一個 Content-Length:66 的欄位，該欄位指示了訊息結尾會有 66 個位元組的填表資料，這些資料會被編碼後以文字模式在網路上傳遞。

一但 Server 取得了 Browser 傳來的 GET 或 POST 訊息後，就可以根據其訊息以進行對應的動作，像是檢查帳號密碼是否正確、將某些訊息存入資料庫、然後在透過 HTML 的方式傳送回應畫面給 Browser，這種透過 HTTP 與 HTML 的簡單互動方式，正是由 World Wide Web 所帶來的核心技術，也讓全世界都捲入了這個影響深遠的網路革命當中。

若您對 WebServer 的運作方式有興趣，可以參考筆者的三個程式與文章，這三個程式分別以 Java、C# 與 JavaScript/Node.js 寫成，這會讓您能夠更深入的體會 WebServer 與 HTTP 的運作原理。

* 如何設計簡單的 WebServer? (Java 版) -- <http://ccckmit.wikidot.com/code:webserver>
* 如何設計簡單的 WebServer? (C# 版) -- <http://cs0.wikidot.com/webserver>
* 如何設計簡單的 WebServer? (JavaScript/Node.js 版) -- <http://ccckmit.wikidot.com/js:nodewebserver>

