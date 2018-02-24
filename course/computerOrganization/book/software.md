# 電腦軟體架構

## CPU0 指令表的定義: JavaScript 版

雖然 CPU0 處理器按理講應該直接以硬體實作，但是我們恐怕不容易直接請「台積電」或「聯電」幫我們燒一顆，因此在實作上我們使用了
FPGA + Verilog + Altera DE2-70 進行 CPU 設計。

但是電腦光是有硬體的話，仍然是不能使用的，否則您可以試試在 PC 上不要安裝作業系統，然後想辦法使用那台電腦，您肯定是會望著電腦興嘆的。

因此、就算 CPU 已經設計好了，我們仍然需要「組譯器、編譯器、作業系統」等系統軟體 (System Software)，才能成為一台真正可以用的電腦。

另外、如果我們能夠設計出「虛擬機」，那麼在這台電腦的硬體還沒有被生產出來之前，我們也能將程式放到「虛擬機」上去執行，因此
我們將會在本書的後半部描述這些「系統軟體」的結構，並且用 JavaScript 與 C 語言各自實作一組軟體系統。

我們將在下兩章中詳細說明組譯器「AS0.js 」與虛擬機「VM0.js」的實作方法，並詳細的列出原始碼。

現在、我們將先列出「虛擬機 AS0」與「組譯器 VM0」都會用到的共同部分，也就是「處理器 CPU0.js」與「指令表 opTable.js」
兩個程式的原始碼，並講解程式內容與執行結果。

在 JavaScript 當中要設計出指令表 opTable.js 非常的簡單，因為 JavaScript 的物件本身就是個符號表，
因此我們只要用 `this[op.name] = op` 這行指令就能在 opTable 這個建構函數當中，將指令物件插入到表格內。

檔案：opTable.js

```javascript
var c = require("./ccc");

var Op = function(line) {
    var tokens = line.split(/\s+/);
    this.name = tokens[0];
    this.id   = parseInt(tokens[1], 16);
    this.type = tokens[2];
}

var opTable = function(opList) {
  for (i in  opList) {
    var op = new Op(opList[i]);
    this[op.name] = op;
  }  
}

opTable.prototype.ID = function(op) { 
  return this[op].id; 
}

opTable.prototype.dump=function() {
    for (key in this) {
      var op = this[key];
      if (typeof(op)!="function")
        c.log("%s %s %s", c.fill(' ', op.name, 8), c.hex(op.id, 2), op.type);
    }
}

module.exports = opTable;

```

在上述程式碼中，每個指令包含了「指令名稱 (name), 指令代碼 (id) 與指令型態 (type)」等三個欄位，舉例而言，當
一個載入指令的字串定義為 `"LD 00 L"` 時，就會被函數 `Op = function(line)` 拆解為 { name="LD", id=0x00, type="L" } 
這樣的物件，然後新增到指令表當中。

利用上述的 opTable.js，我們可以輕易的建構出 CPU0 處理器的指令表，以下是 cpu0.js 程式的原始碼，該程式建構出了
CPU0 的完整指令表，包含 「LD, ST, ....., PUSHB, POPB」等真實的指令。

另外、以下表格當中還包含了「RESW, RESB, WORD, BYTE」等資料定義假指令，其中 RESW 用來保留 n 個 Word，RESB 用來保留 n 個 BYTE，
WORD 則用來定義有初始值的整數變數，BYTE 則用來定義有初始值的位元組變數，像是 8 位元整數或字串等。

檔案：cpu0.js

```javascript
var opTable = require("./optable");
var opList = [ "LD 00 L", "ST  01 L", "LDB 02 L",  "STB 03 L", "LDR 04 L", 
"STR 05 L", "LBR 06 L",  "SBR 07 L",  "LDI 08 L", "CMP 10 A", "MOV 12 A", 
"ADD 13 A",  "SUB 14 A",  "MUL 15 A", "DIV 16 A",  "AND 18 A", "OR  19 A",  "XOR 1A A",  
"ADDI 1B A", "ROL 1C A",  "ROR 1D A", "SHL 1E A", "SHR 1F A",  
"JEQ 20 J", "JNE 21 J",  "JLT 22 J", "JGT 23 J", "JLE 24 J",  "JGE 25 J", "JMP 26 J", 
"SWI 2A J", "JSUB 2B J","RET 2C J", "PUSH 30 J", "POP 31 J",  "PUSHB 32 J", 
"POPB 33 J", "RESW F0 D", "RESB F1 D", "WORD F2 D", "BYTE F3 D"];

var cpu = { "opTable" : new opTable(opList) };

cpu.opTable.dump();

module.exports = cpu;

```

執行結果：

```
D:\Dropbox\Public\oc\code>node cpu0.js
LD       00 L
ST       01 L
LDB      02 L
STB      03 L
LDR      04 L
STR      05 L
LBR      06 L
SBR      07 L
LDI      08 L
CMP      10 A
MOV      12 A
ADD      13 A
SUB      14 A
MUL      15 A
DIV      16 A
AND      18 A
OR       19 A
XOR      1A A
ADDI     1B A
ROL      1C A
ROR      1D A
SHL      1E A
SHR      1F A
JEQ      20 J
JNE      21 J
JLT      22 J
JGT      23 J
JLE      24 J
JGE      25 J
JMP      26 J
SWI      2A J
JSUB     2B J
RET      2C J
PUSH     30 J
POP      31 J
PUSHB    32 J
POPB     33 J
RESW     F0 D
RESB     F1 D
WORD     F2 D
BYTE     F3 D

```

細心的讀者可能會注意到，我們在 opTable.js 當中引入了 ccc.js 這個函式庫，這個函式庫是「開放電腦計畫」當中的常用函數集合，
其原始碼如下所示。

```javascript
var util = require("util");
var assert = require("assert");
var fs = require("fs");

var c = {};                 // 本模組的傳回物件
c.log = console.log;        // 將 console.log 名稱縮短一點
c.format = util.format;     // 字串格式化
c.assert = assert.ok;       // assert 函數，若不符合條件則程式會停止
c.bits = function(word, from, to) { return word << (31-to) >>> (31-to+from); }      // 取得 from 到 to 之間的位元
c.signbits = function(word, from, to) { return word << (31-to) >> (31-to+from); }   // 取得 from 到 to 之間的位元
c.nonull = function(o) { if (o == null) return ""; else return o; }                 // 將 null 改為空字串傳回

c.space = "                                                                      "; // 空白字串，dup() 函數中使用到的。
c.dup = function(ch, n) {           // 傳回 ch 重複 n 次的字串；範例：dup('x', 3) = 'xxx'
  assert.ok(n < c.space.length);
  return c.space.substr(0, n).replace(/ /g, ch); 
}

c.fill = function(ch, o, len) {     // 將字串填滿 ch，例如：fill(' ', 35, 5) = '35   '; fill('0', 35, -5) = '00035';
  var str = o.toString();
  if (len >= 0)
    return str+c.dup(ch, len-str.length);
  else
    return c.dup(ch, -len-str.length)+str;
}

c.base = function(n, b, len) {      // 將數字 n 轉換為以 b 為基底的字串；例如：base(31, 16, 5) = '0001F';
  var str = n.toString(b);
  return c.dup('0', len-str.length)+str;
}

c.hex = function(n, len) {          // 將數字 n 轉換 16 進位；例如：hex(31, 5) = '0001F'; hex(-3, 5) = 'FFFFD'
  var str = (n < 0 ? (0xFFFFFFFF + n + 1) : n).toString(16).toUpperCase();
  if (n < 0)
    return c.fill('F', str, -len).substr(-len);
  else
    return c.fill('0', str, -len).substr(-len);
}

c.str2hex = function(str) {         // 將字串轉為 16 進位碼，例如：str2hex('Hello!') = '48656C6C6F21'
  var hex="";
  for (i=0; i<str.length; i++) {
    var code = str.charCodeAt(i);
    hex += c.hex(code, 2);
  }
  return hex;
}

c.error = function(msg, err) {
   c.log(msg);
   c.log("Error : (%s):%s", err.name, err.message);
   c.log(err.stack);
   process.exit(1);
}

c.test = function() {
  c.log("bits(0xF3A4, 4, 7)=%s", c.hex(c.bits(0xF3A4, 4, 7), 4));
  c.log("dup('x', 3)=%s", c.dup('x', 3));
  c.log("fill('0', 35, -5)=%s", c.fill('0', 35, -5));
  c.log("base(100, 16, 5)=%s", c.base(100, 16, 5));
  c.log("hex(-100)=%s", c.hex(-100, 6));
  c.log("str2hex(Hello!)=%s", c.str2hex("Hello!"));
}

c.test();

module.exports = c;

```

以上程式的單元測試 c.test() 執行結果如下

```
D:\Dropbox\Public\oc\code>node ccc
bits(0xF3A4, 4, 7)=000A
dup('x', 3)=xxx
fill('0', 35, -5)=00035
base(100, 16, 5)=00064
hex(-100)=FFFF9C
str2hex(Hello!)=48656C6C6F21
```

