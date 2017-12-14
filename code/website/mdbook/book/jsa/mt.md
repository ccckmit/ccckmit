# 機器翻譯

Google MT 沒有開放原始碼，但是 OpenNMT 有

* <http://opennmt.net/>
* <https://demo-pnmt.systran.net/production#/translation>

文獻： [神经机器翻译（NMT）相关资料整理](https://www.idaima.com/article/5269) 。

## Google : 網頁版翻譯
* <http://translate.hotcn.top/>
* [Wikipedia: Edward III of England 翻為中文](http://translate.hotcn.top/translate/page?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FEdward_III_of_England)

## Google : 文字版翻譯

* [萬磁王的口試 -- 英翻中版](https://translate.google.com.tw/?hl=zh-TW#en/zh-TW/Magneto's%20oral%20defense%20%0A%0AToday%20is%20the%20oral%20defense%20of%20the%20ESP%20department%20in%20X%20university.%0A%0AIn%20the%20beginning%2C%20Magneto%20comes%20in%20and%20cups%20of%20committee%20members%20fly%20to%20salute.%0A%0AAfter%20that%2C%20Magneto%20has%20a%20show.%20He%20sucks%20all%20metal%20object%20to%20the%20door%2C%20and%20then%20blocking%20the%20exit%20of%20the%20classroom.%20%0A%0ASuddenly%2C%20president%20Obama%20fly%20into%20the%20classroom%20from%20windows%2C%20because%20of%20his%20metal%20belt.%0A%0AWhen%20Obama%20was%20dizzy%20and%20can%20not%20figure%20out%20what%20happened.%20We%20saw%20the%20night%20is%20coming%2C%20because%20%20Magneto%20turn%20the%20earth%20upside%20down%E3%80%82%0A%20%0AAfter%20the%20show%2C%20a%20committee%20member%20ask%20the%20first%20question%20.%0A%20%0ACommittee%20member%20A%20said%20%3A%20%0A%0A%3E%20We%20have%20read%20your%20Dr%20Thesis%20in%20title%20%22A%20research%20of%20ESP%20that%20moving%20any%20metal%20objects%22.%20But%20you%20have%20not%20enough%20citation%20and%20reference%20in%20your%20thesis.%20For%20example%2C%20you%20do%20not%20cite%20my%20paper%20with%20title%20%22A%20research%20about%20which%20hair%20moving%20first%20when%20flagellate%20is%20moving%22.%0A%0AAt%20that%20time%2C%20there%20was%20shadows%20show%20on%20Magneto's%20face.%20When%20Mystique%20saw%20it%2C%20her%20hair%20stand%20up.%20%0A%20%0AAnd%20then%2C%20committee%20member%20B%20said%20%3A%0A%20%0A%3E%20Could%20you%20please%20explain%20the%20meaning%20of%20%22the%20equation%20of%20manipulate%20magnetic%20field%20by%20human%20body%22%20%3F%20%0A%20%0ASuddenly%2C%20you%20saw%20the%20Magneto%20explain%20quickly%20and%20write%20on%20the%20blackboard%20without%20moving%20his%20hand.%0AIn%20fact%2C%20he%20manipulate%20a%20chalk%20with%20metal%20ring%20flying%20to%20write%20on%20the%20blackboard%E3%80%82%0A%20%0AFinally%2C%20the%20committee%20member%20C%20said%20%3A%0A%20%0A%3E%20I%20think%20your%20thesis%20has%20some%20weak%20point.%20Because%20you%20can%20move%20metal%20but%20can%20not%20move%20the%20other%20objects.%20Your%20research%20is%20not%20good%20enough.%20So%20you%20should%20have%20another%20research%20about%20the%20topic%20of%20manipulate%20gravity.%20%0A%20%0AAt%20the%20end%20of%20oral%20defense%20%2C%20committee%20members%20have%20the%20conclusion%20that%20Magneto%20should%20stay%20for%20one%20more%20year%20to%20have%20another%20research%20for%20the%20topic%20%22A%20method%20of%20manipulate%20gravity%22.)
* [mdbook 嵌入 Google](mdbookGoogle.html)

Node 版本翻譯： 
* <https://github.com/Localize/node-google-translate> (讚! 搭配 Google Cloud API)
* <https://github.com/yixianle/translate-api> (讚!)
* <https://www.npmjs.com/package/google-translate-api>
* <https://github.com/Localize/node-google-translate>
* <https://github.com/GoogleCloudPlatform/google-cloud-node> (Google Cloud API)

範例： [googleTranslate.html](/googleTranslate.html)

呈現：

![](googleTranslate.png)

原始碼：

```
<!DOCTYPE html>
<html lang="en-US">
<body>

<h1>My Web Page</h1>

<p>Hello everybody!</p>

<p>Translate this page:</p>

<div id="google_translate_element"></div>

<script type="text/javascript">
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}
</script>

<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

<p>
Edward III (13 November 1312 – 21 June 1377) was King of England from 25 January 1327 until his death; he is noted for his military success and for restoring royal authority after the disastrous and unorthodox reign of his father, Edward II. Edward III transformed the Kingdom of England into one of the most formidable military powers in Europe. His long reign of fifty years was the second longest in medieval England and saw vital developments in legislation and government—in particular the evolution of the English parliament—as well as the ravages of the Black Death.
</p>
<p>
Edward was crowned at age fourteen after his father was deposed by his mother, Isabella of France, and her lover Roger Mortimer. At age seventeen he led a successful coup against Mortimer, the de facto ruler of the country, and began his personal reign. After a successful campaign in Scotland he declared himself rightful heir to the French throne in 1337 but his claim was denied. This started what became known as the Hundred Years' War.[1] Following some initial setbacks the war went exceptionally well for England; victories at Crécy and Poitiers led to the highly favourable Treaty of Brétigny. Edward's later years, however, were marked by international failure and domestic strife, largely as a result of his inactivity and poor health.
</p>
<p>
Edward III was a temperamental man but capable of unusual clemency. He was in many ways a conventional king whose main interest was warfare. Admired in his own time and for centuries after, Edward was denounced as an irresponsible adventurer by later Whig historians such as William Stubbs. This view has been challenged recently and modern historians credit him with some significant achievements.[2][3]
</p>

</body>
</html>
```