## 實作：專家系統 - 互動推論程式

當然、我們不一定要像前述範例那樣，將「隱含前提」直接寫死在規則庫當中。

我們也可以透過互動的方式讓使用者輸入這些「隱含前提」，逐步的讓「推理引擎」推論出結果，以下是這種互動式推論的一個執行範例。

首先、我們只要將以下的動物世界推論規則放在 animal.kb 規則檔中。

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
```

接著撰寫一個通用的推論程式 kbQuery.js，其原始碼如下所示：

檔案：kbQuery.js

```javascript
var fs = require('fs'); // 引用檔案物件
var kb = require('./kb');

var kb1 = new kb();
var code = fs.readFileSync(process.argv[2], "utf8").replace(/\n/gi, ""); // 讀取檔案
kb1.load(code);
kb1.forwardChaining();

var r = require('readline').createInterface(process.stdin, process.stdout);
r.setPrompt('?- ');
r.prompt();

r.on('line', function(line) {
  var term = line.trim();
  kb1.addFact(term);
  kb1.forwardChaining();
  r.prompt();
}).on('close', function() {
  process.exit(0);
});
```

然後、我們就可以透過互動的方式，輸入指定的前提，推理系統將會適時推論出我們想要查詢的動物，以下是一個執行的過程範例。

```
C:\Dropbox\Public\web\ai\code\KB>node kbQuery animal.kb
["哺乳類 <= 有毛","哺乳類 <= 泌乳","鳥類   <= 有羽毛","鳥類   <= 會飛 & 生蛋","
食肉類 <= 哺乳類 & 吃肉","食肉類 <= 有爪 & 利齒 & 兩眼前視","有蹄類 <= 哺乳類 &
有蹄","偶蹄類 <= 哺乳類 & 反芻","獵豹   <= 哺乳類 & 吃肉 & 斑點","老虎   <= 哺乳
類 & 吃肉 & 條紋","長頸鹿 <= 有蹄類 & 長腿 & 斑點","斑馬   <= 有蹄類 & 條紋","鴕
鳥   <= 鳥類 & 長腿",""]
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
facts=[]
?- 有毛
addFact(有毛)
addFact(哺乳類)
facts=["有毛","哺乳類"]
?- 吃肉
addFact(吃肉)
addFact(食肉類)
facts=["有毛","哺乳類","吃肉","食肉類"]
?- 條紋
addFact(條紋)
addFact(老虎)
facts=["有毛","哺乳類","吃肉","食肉類","條紋","老虎"]
?-
```

您可以看到當我們輸入了「有毛、吃肉、條紋」等三個屬性之後，系統推論出了「老虎」這個結論，這正式動物世界專家系統所應該傳回的結果，不是嗎？

