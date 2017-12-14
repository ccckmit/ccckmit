## 實作：專家系統 - 前向推論程式

以下是一個代表鴕鳥的動物世界規則庫。

規則庫：animal_ostrich.kb

```
哺乳類 <= 有毛. 
哺乳類 <= 泌乳. 
鳥類   <= 有羽毛. 
鳥類   <= 會飛 & 生蛋. 
食肉類 <= 哺乳類 & 吃肉.
食肉類 <= 有爪 & 利齒 & 兩眼前視.
有蹄類 <= 哺乳類 & 有蹄.
偶蹄類 <= 哺乳類 & 反芻.
獵豹   <= 哺乳類 & 吃肉 & 斑點.
老虎   <= 哺乳類 & 吃肉 & 條紋.
長頸鹿 <= 有蹄類 & 長腿 & 斑點.
斑馬   <= 有蹄類 & 條紋.
鴕鳥   <= 鳥類 & 長腿.

會飛. 
生蛋. 
長腿. 
```

接著我們採用前述的「布林邏輯推論引擎 kb.js」，透過讀入規則檔並進行推論的方式，設計出「前向推論」的程式。

檔案：kbReason.js

```javascript
var fs = require('fs'); // 引用檔案物件
var kb = require('./kb');

var kb1 = new kb();
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 讀取檔案

kb1.load(code);
kb1.forwardChaining();
```

以下是上述「隱含鴕鳥前提」的規則庫經過「前向布林引擎」推論後得到的執行結果。

```
C:\Dropbox\Public\web\ai\code\KB>node kbReason animal_ostrich.kb
["哺乳類 <= 有毛","哺乳類 <= 泌乳","鳥類   <= 有羽毛","鳥類   <= 會飛 & 生蛋","
食肉類 <= 哺乳類 & 吃肉","食肉類 <= 有爪 & 利齒 & 兩眼前視","有蹄類 <= 哺乳類 &
有蹄","偶蹄類 <= 哺乳類 & 反芻","獵豹   <= 哺乳類 & 吃肉 & 斑點","老虎   <= 哺乳
類 & 吃肉 & 條紋","長頸鹿 <= 有蹄類 & 長腿 & 斑點","斑馬   <= 有蹄類 & 條紋","鴕
鳥   <= 鳥類 & 長腿","會飛","生蛋","長腿",""]
rule:head=哺乳類 terms=["有毛"]
rule:head=哺乳類 terms=["泌乳"]
rule:head=鳥類 terms=["有羽毛"]
rule:head=鳥類 terms=["會飛 "," 生蛋"]
rule:head=食肉類 terms=["哺乳類 "," 吃肉"]
rule:head=食肉類 terms=["有爪 "," 利齒 "," 兩眼前視"]
rule:head=有蹄類 terms=["哺乳類 "," 有蹄"]
rule:head=偶蹄類 terms=["哺乳類 "," 反芻"]
rule:head=獵豹 terms=["哺乳類 "," 吃肉 "," 斑點"]
rule:head=老虎 terms=["哺乳類 "," 吃肉 "," 條紋"]
rule:head=長頸鹿 terms=["有蹄類 "," 長腿 "," 斑點"]
rule:head=斑馬 terms=["有蹄類 "," 條紋"]
rule:head=鴕鳥 terms=["鳥類 "," 長腿"]
rule:head=會飛 terms=""
rule:head=生蛋 terms=""
rule:head=長腿 terms=""
addFact(會飛)
addFact(生蛋)
addFact(長腿)
addFact(鳥類)
addFact(鴕鳥)
facts=["會飛","生蛋","長腿","鳥類","鴕鳥"]
```

您可以看到上述系統利用「會飛. 生蛋. 長腿. 」等三個屬性，推論出了「鳥類、鴕鳥」這兩個結論。

這個結果符合我們的預期，因此該程式的運作是正常的。



