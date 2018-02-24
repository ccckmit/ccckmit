## 編譯器：高階語言轉中間碼 - j0c

在前面的文章中，我們首先介紹了整體架構，接著設計出了 CPU0 的指令集，然後寫出了 AS0 組譯器與 VM0 虛擬機：

但是、直到目前為止，我們都還沒有為開放電腦計畫打造出「高階語言」，因此本文將設計出一個 名為 J0 的高階語言 (代表JavaScript 的精簡版)，並採用 JavaScript 去實作，然後在 node.js 平台中執行。

有了 J0 語言與 J0C 編譯器之後，我們就可以創建出以下的工具鏈：

> J0 語言 ( j0c 編譯器) => IR0 中間碼 (ir2as 轉換器) => CPU0 組合語言 (AS0 組譯器) => CPU0 機器碼 (VM0 虛擬機執行或 CPU0 FPGA 執行)

### JavaScript 簡化版 -- J0 語言

以下是一個 J0 語言的程式範例，支援了 function, while, if, for 等語句，並且支援了「陣列與字典」等資料結構。

檔案：test.j0

```javascript
s = sum(10);

function sum(n) {
  s = 0;
  i=1;
  while (i<=10) {
    s = s + i;
    i++;
  }
  return s;
}

m = max(3,5);

function max(a, b) {
  if (a > b)
    return a;
  else
    return b;
}

function total(a) {
  s = 0;
  for (i in a) {
    s = s + a[i];
  }
  return s;
}

a = [ 1, 3, 7, 2, 6];
t = total(a);
word = { e:"dog", c:"狗" };
```

### 原始碼

接著我們用 node.js + javascript 實作出 j0c 編譯器，該編譯器可以將 J0 語言的程式，編譯成一種平坦化的中間碼格式，我們稱這種格式為 IR0，也就是 Intermediate Representation 0 的意思，以下是 j0c 編譯器的完整程式碼。

檔案：j0c.js

```javascript
// j0c 編譯器，用法範例： node j0c test.j0
var fs = require("fs");
var util = require("util");
var log = console.log;     // 將 console.log 名稱縮短一點
var format = util.format;  // 字串格式化
var tokens = [];
var tokenIdx = 0;
var end = "$END";
var funcName = "main";
var funcStack = [ funcName ];
var irText = "";
var symTable = {};
symTable[funcName] = { type:"function", name:"main", pcodes:[] };

var scan=function(text) { 
  var re = new RegExp(/(\/\*[\s\S]*?\*\/)|(\/\/[^\r\n])|(".*?")|(\d+(\.\d*)?)|([a-zA-Z]\w*)|([>=<!\+\-\*\/&%|]+)|(\s+)|(.)/gm);
  var types = [ "", "COMMENT", "COMMENT", "STRING", "INTEGER", "FLOAT", "ID", "OP2", "SPACE", "CH" ];
  tokens = [];
  tokenIdx = 0;
  var lines = 1, m;
  while((m = re.exec(text)) !== null) {
    var token = m[0], type;
    for (i=1; i<=9; i++) { 
      if (m[i] !== undefined)
        type = types[i];
    }
    if (!token.match(/^[\s\r\n]/) && type!="COMMENT") {
      tokens.push({ "token":token, "type":type, "lines":lines });
    }
    lines += token.split(/\n/).length-1;
  }
  tokens.push({ "token": end, "type":end, "lines":lines });
  return tokens;
}

var error=function(expect) {  
  var token = tokens[tokenIdx];
  log("Error: line=%d token (%s) do not match expect (%s)!", token.lines, token.token, expect); 
  log(new Error().stack);
  process.exit(1);
}

var skip=function(o) { if (isNext(o)) next(o); }

var next=function(o) {
  if (o==null || isNext(o)) {
    return tokens[tokenIdx++].token;
  }
  error(o);
}

var isNext=function(o) {
  if (tokenIdx >= tokens.length) 
    return false;
  var token = tokens[tokenIdx].token;
  if (o instanceof RegExp) {
    return token.match(o);
  } else
    return (token == o);
}

var nextType=function(o) {
  if (o==null || isNextType(o)) {
    return tokens[tokenIdx++].token;
  }
  error(o);
}

var isNextType=function(pattern) {
  var type = tokens[tokenIdx].type;
  return (("|"+pattern+"|").indexOf("|"+type+"|")>=0);
}

var pcode=function(label, op, p, p1, p2) {
  symTable[funcName].pcodes.push({"label":label, "op":op, "p":p, "p1":p1, "p2":p2});
  var irCode = format("%s\t%s\t%s\t%s\t%s", label, op, p, p1, p2);
  log(irCode);
  irText += irCode+"\n";
}

var tempIdx = 1;
var nextTemp=function() { 
  var name="T"+tempIdx++;
  symTable[name] = { type:"var", name:name };
  return name; 
}

var labelIdx = 1;
var nextLabel=function() { return "L"+labelIdx++; }

var elseIdx = 1;
var nextElse=function() { return "else"+elseIdx++; }

var compile=function(text) {
  scan(text);
  PROG();
}

// PROG = STMTS
var PROG=function() {
  STMTS();
}

// STMTS = STMT*
var STMTS=function() {
  while (!isNext("}") && !isNext(end))
    STMT();
}

// BLOCK = { STMTS }
var BLOCK=function() {
  next("{");
  STMTS();
  next("}");
}

// STMT = FOR | WHILE | IF | FUNCTION | return EXP ; | ASSIGN ; | BLOCK
var STMT=function() {
  if (isNext("for")) {
    FOR();
  } else if (isNext("while")) {
    WHILE();
  } else if (isNext("if")) {
    IF();
  } else if (isNext("function")) {
    FUNCTION();
  } else if (isNext("return")) {
    next("return");
    var e = EXP();
    pcode("", "return", e, "", "");
    next(";");
  } else if (isNext("{")) {
    BLOCK();
  } else {
    ASSIGN();
    next(";");
  }
}

// FOR = for (ID in EXP) BLOCK
var FOR=function() {
  var startLabel = nextLabel(), exitLabel = nextLabel();
  next("for"); 
  next("("); 
  var id = nextType("ID");
  pcode("", "=", id, "0", "");
  next("in");
  var e=EXP(); 
  next(")");
  var t = nextTemp();
  pcode(startLabel, "<", t, id, e+".length");
  pcode("", "if0", t, exitLabel, "");
  BLOCK(); 
  pcode("", "goto", startLabel, "", "");
  pcode(exitLabel, "", "", "", "");
}

// WHILE = while (EXP) BLOCK
var WHILE=function() {
  var startLabel = nextLabel(), exitLabel=nextLabel();
  pcode(startLabel, "", "", "", "");
  next("while"); 
  next("("); 
  var e = EXP(); 
  next(")"); 
  pcode("", "if0", e, exitLabel, "");
  BLOCK();
  pcode("", "goto", startLabel, "", "");
  pcode(exitLabel, "", "", "", "");
}

// IF = if (EXP) STMT (else STMT)?
var IF=function() {
  next("if"); 
  next("("); 
  var e = EXP(); 
  next(")"); 
  var elseLabel = nextLabel();
  pcode("", "if0", e, elseLabel, "");
  STMT();
  if (isNext("else")) {
    next("else");
    pcode(elseLabel, "", "", "", "");
    STMT();
  }
}

// ASSIGN = ID[++|--]?(=EXP?)?
var ASSIGN=function() {
  var id, op, hasNext = false;
  if (isNextType("ID")) {
    id = nextType("ID");
    symTable[id] = { type:"var", name:id };
    if (isNext("++") || isNext("--")) {
      var op = next(null);
      pcode("", op, id, "", "");
    }
    hasNext = true;
  }
  if (isNext("=")) {
    next("=");
    var e = EXP();
    if (id != undefined)
      pcode("", "=", id, e, "");
    hasNext = true;
  }
  if (!hasNext)
    return EXP();
}

// EXP=TERM (OP2 TERM)?
var EXP=function() {
  t1 = TERM();
  if (isNextType("OP2")) {
    var op2 = next(null);
    t2 = TERM();
    var t = nextTemp();
    pcode("", op2, t, t1, t2);
    t1 = t;
  }
  return t1;
}

// TERM=STRING | INTEGER | FLOAT | ARRAY | TABLE | ID (TERMS)? | ID [TERMS]?| ( EXP )
var TERM=function() {
  if (isNextType("STRING|INTEGER|FLOAT")) {
    return next(null);
  } else if (isNext("[")) {
    return ARRAY();
  } else if (isNext("{")) {
    return TABLE();
  } else if (isNextType("ID")) { // function call
    var id = next(null);
    if (isNext("(")) { 
      next("("); 
      while (!isNext(")")) {
        // TERM();
        var arg = next(null);
        pcode("", "arg", arg, "", "");
        skip(",");
      }
      next(")");
      var ret = nextTemp();
      pcode("", "call", ret, id, "");
      return ret;
    }
    var array = id;
    if (isNext("[")) { 
      next("["); 
      while (!isNext("]")) {
        var idx = TERM();
        var t = nextTemp();
        pcode("", "[]", t, array, idx);
        skip(",");
        array = t;
      }
      next("]");
      return array;
    }
    return id;
  } else if (isNext("(")) {
    next("(");  
    var e = EXP();  
    next(")");
    return e;
  } else error();
}

// FUNCTION = function ID(ARGS) BLOCK
var FUNCTION = function() {
  next("function");
  funcName = nextType("ID");
  funcStack.push(funcName);
  symTable[funcName] = { type:"function", name:funcName, pcodes: [] };
  pcode(funcName, "function", "", "", "");
  next("(");
  while (!isNext(")")) {
    var arg=nextType("ID");
    pcode("", "param", arg, "", "");
    skip(",");
  }
  next(")"); 
  BLOCK();
  pcode("", "endf", "", "", "");
  funcStack.pop();
  funcName = funcStack[funcStack.length-1];
}

// ARRAY = [ TERMS ];
var ARRAY = function() {
  next("[");
  var array = nextTemp();
  pcode(array, "array", "", "", "");
  while (!isNext("]")) {
    var t = TERM();
    pcode("", "push", array, t, "");
    skip(",");
  }
  next("]");
  return array;
}

// TABLE = { (TERM:TERM)* }
var TABLE = function() {
  next("{"); 
  var table = nextTemp();
  pcode(table, "table", "", "", "");
  while (!isNext("}")) {
    var key = TERM(); 
    next(":"); 
    var value = TERM();
    skip(",");
    pcode("", "map", table, key, value);
  }
  next("}");
  return table;
}

var source = fs.readFileSync(process.argv[2], "utf8");
compile(source);
```

### 執行結果

然後、我們可以用 node.js 來執行上述程式，並且編譯指定的 J0 程式檔，例如以下指令就用 j0c 編譯器去編譯了 test.j0 這個輸入檔，接著畫面上所輸出的就是 IR0 的中間碼。

```
D:\Dropbox\Public\web\oc\code\js>node j0c test.j0
        arg     10
        call    T1      sum
        =       s       T1
sum     function
        param   n
        =       s       0
        =       i       1
L1
        <=      T2      i       10
        if0     T2      L2
        +       T3      s       i
        =       s       T3
        ++      i
        goto    L1
L2
        return  s
        endf
        arg     3
        arg     5
        call    T4      max
        =       m       T4
max     function
        param   a
        param   b
        >       T5      a       b
        if0     T5      L3
        return  a
L3
        return  b
        endf
total   function
        param   a
        =       s       0
        =       i       0
L4      <       T6      i       a.length
        if0     T6      L5
        []      T7      a       i
        +       T8      s       T7
        =       s       T8
        goto    L4
L5
        return  s
        endf
T9      array
        push    T9      1
        push    T9      3
        push    T9      7
        push    T9      2
        push    T9      6
        =       a       T9
        arg     a
        call    T10     total
        =       t       T10
T11     table
        map     T11     e       "dog"
        map     T11     c       "狗"
        =       word    T11

```

### 結語

在開放電腦計劃中，我們希望透過 J0 語言，以及 j0c 編譯器，用簡易的程式揭露「高階語言與編譯器」的設計原理。

在下期中，我們將撰寫程式去將上述 IR0 中間碼轉換為 CPU0 的組合語言，這樣就可以接上先前所作的組譯器 AS0 與虛擬機 VM0，以形成一套簡易但完整的工具鏈。

透過這樣的工具鏈，我們希望能讓程式人輕易的學會「電腦軟硬體的設計原理」。

