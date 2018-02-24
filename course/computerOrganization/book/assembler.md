# 組譯器

在前面幾章，我們介紹了開放電腦計畫中的「處理器」 -- 包含 CPU0 的結構、指令集與編碼方式。
在本章中，我們將為 CPU0 設計一個組譯器 AS0，以便能更深入理解 CPU0 的結構，並瞭解
組譯器的設計原理。

## 組譯範例

讓我們先用範例導向的方式，先看看一個 CPU0 的組合語言程式，如下所示：

組合語言：sum.as0

```
        LD     R1, sum      ; R1 = sum = 0
        LD     R2, i        ; R2 = i = 1
        LDI    R3, 10       ; R3 = 10
FOR:    CMP    R2, R3       ; if (R2 > R3)
        JGT    EXIT         ;   goto EXIT
        ADD    R1, R1, R2   ; R1 = R1 + R2 (sum = sum + i)
        ADDI   R2, R2, 1    ; R2 = R2 + 1  ( i  = i + 1)
        JMP    FOR          ; goto FOR
EXIT:   ST     R1, sum      ; sum = R1
        ST     R2, i        ; i = R2
        LD     R9, msgptr   ; R9= pointer(msg) = &msg
        SWI    3            ; SWI 3 : print string &msg
        MOV    R9, R1       ; R9 = R1 = sum
        SWI    2            ; SWI 2 : print number sum
        RET                 ; return to CALLER
i:      RESW    1           ; int i
sum:    WORD    0           ; int sum=0
msg:    BYTE    "sum=", 0   ; char *msg = "sum="
msgptr: WORD    msg         ; char &msgptr = &msg
```

上述程式是一個可以計算 1+2+....+10 之結果的程式，最後會透過軟體中斷 (SWI, Software Interrupt) 的方式，
印出訊息到螢幕畫面上，以下是利用我們寫的組譯器 AS0 對上述程式進行組譯的過程：

```
D:\oc\code>node as0 sum.as0 sum.ob0
Assembler:asmFile=sum.as0 objFile=sum.ob0
===============Assemble=============
[ '        LD     R1, sum      ; R1 = sum = 0',
  '        LD     R2, i        ; R2 = i = 1',
  '        LDI    R3, 10       ; R3 = 10',
  'FOR:    CMP    R2, R3       ; if (R2 > R3)',
  '        JGT    EXIT         ;   goto EXIT',
  '        ADD    R1, R1, R2   ; R1 = R1 + R2 (sum = sum + i)',
  '        ADDI   R2, R2, 1    ; R2 = R2 + 1  ( i  = i + 1)',
  '        JMP    FOR          ; goto FOR',
  'EXIT:   ST     R1, sum      ; sum = R1',
  '        ST     R2, i        ; i = R2',
  '        LD     R9, msgptr   ; R9= pointer(msg) = &msg',
  '        SWI    3            ; SWI 3 : 印出 R9 (=&msg) 中的字串',
  '        MOV    R9, R1       ; R9 = R1 = sum',
  '        SWI    4            ; SWI 2 : 印出 R9 (=R1=sum) 中的整數',
  '        RET                 ; return 返回上一層呼叫函數',
  'i:      RESW   1            ; int i',
  'sum:    WORD   0            ; int sum=0',
  'msg:    BYTE   "1+...+10=", 0   ; char *msg = "sum="',
  'msgptr: WORD   msg          ; char &msgptr = &msg' ]
=================PASS1================
0000          LD       R1,sum           L 00
0004          LD       R2,i             L 00
0008          LDI      R3,10            L 08
000C FOR      CMP      R2,R3            A 10
0010          JGT      EXIT             J 23
0014          ADD      R1,R1,R2         A 13
0018          ADDI     R2,R2,1          A 1B
001C          JMP      FOR              J 26
0020 EXIT     ST       R1,sum           L 01
0024          ST       R2,i             L 01
0028          LD       R9,msgptr        L 00
002C          SWI      3                J 2A
0030          MOV      R9,R1            A 12
0034          SWI      4                J 2A
0038          RET                       J 2C
003C i        RESW     1                D F0
0040 sum      WORD     0                D F2
0044 msg      BYTE     "1+...+10=",0    D F3
004E msgptr   WORD     msg              D F2
===============SYMBOL TABLE=========
FOR      000C
EXIT     0020
i        003C
sum      0040
msg      0044
msgptr   004E
=============PASS2==============
0000          LD       R1,sum           L 00 001F003C
0004          LD       R2,i             L 00 002F0034
0008          LDI      R3,10            L 08 0830000A
000C FOR      CMP      R2,R3            A 10 10230000
0010          JGT      EXIT             J 23 2300000C
0014          ADD      R1,R1,R2         A 13 13112000
0018          ADDI     R2,R2,1          A 1B 1B220001
001C          JMP      FOR              J 26 26FFFFEC
0020 EXIT     ST       R1,sum           L 01 011F001C
0024          ST       R2,i             L 01 012F0014
0028          LD       R9,msgptr        L 00 009F0022
002C          SWI      3                J 2A 2A000003
0030          MOV      R9,R1            A 12 12910000
0034          SWI      4                J 2A 2A000004
0038          RET                       J 2C 2C000000
003C i        RESW     1                D F0 00000000
0040 sum      WORD     0                D F2 00000000
0044 msg      BYTE     "1+...+10=",0    D F3 312B2E2E2E2B31303D00
004E msgptr   WORD     msg              D F2 00000044
=================SAVE OBJ FILE================

00 :  001F003C 002F0034 0830000A 10230000
10 :  2300000C 13112000 1B220001 26FFFFEC
20 :  011F001C 012F0014 009F0022 2A000003
30 :  12910000 2A000004 2C000000 00000000
40 :  00000000 312B2E2E 2E2B3130 3D000000
50 :  0044
```

當您組譯完成之後，就可以利用開放電腦計畫中的虛擬機 VM0 執行 AS0 所輸出的目的檔 sum.ob0，
其執行過程如下：

```
D:\oc\code>node vm0 sum.ob0
1+...+10=55
```

## AS0 組譯器設計

組譯器的設計，通常採用兩階段的編碼方式，第一階段 (PASS1) 先計算出每個指令的位址，並記住所有標記符號的位址。
然後在第二階段 (PASS2) 才真正將指令轉換為機器碼輸出，在以下 AS0 組譯器的設計當中，我們就採用了這種兩階段的
處理方式。

為了讓組譯器能夠容易修改與移植，我們將一般組譯器都會有的基礎結構 (抽象的組譯器物件) 放在 as.js 這個程式模組當中，
然後將與 CPU0 有關的部分放在 as0.js 這個實作模組當中，以下先列出 as.js 這個抽象物件模組。

檔案：as.js (抽象組譯器物件)

```javascript
var fs = require("fs"); // 引用檔案函式庫
var c = require("./ccc"); // 引用基本函式庫 ccc.js
var Memory = require("./memory"); // 引用記憶體物件 memory.js

var as = function(opTable) { // 抽象組譯器物件
 this.opTable = opTable; // 取得指令表 opTable

 this.assemble = function(asmFile, objFile) { // 組譯器的主要函數
  this.lines = []; this.codes = []; // 設定程式碼行 (lines)，指令陣列 (codes)
  this.symTable = {}; // 建立空的符號表 (symTable)
  c.log("Assembler:asmFile=%s objFile=%s", asmFile, objFile); // 輸入組合語言、輸出目的檔
  c.log("===============Assemble=============");
  var text = fs.readFileSync(asmFile, "utf8"); // 讀取檔案到 text 字串中
  this.lines = text.split(/[\r\n]+/); // 將組合語言分割成一行一行
  c.log(this.lines); // 印出組合語言以便觀察
  this.pass1(); // 第一階段：計算位址
  c.log("===============SYMBOL TABLE=========");
  for (s in this.symTable) { // 印出符號表以便觀察
    c.log("%s %s", c.fill(' ',s,8), c.hex(this.symTable[s].address, 4));
  }
  this.pass2(); // 第二階段：建構目的碼
  this.saveObjFile(objFile); // 輸出目的檔
 }

 this.pass1 = function() { // 第一階段的組譯
  var address = 0;  // 程式計數器 PC 的起始位址為 0
  c.log("=================PASS1================");
  for (var i in this.lines) { // 對於每一行
    try {
      var code = this.parse(this.lines[i]); // 剖析並建立 code 物件
      code.address = address; // 設定該行的位址
      if (code.label.length != 0) { // 如果有標記符號
        this.symTable[code.label] = code; // 加入符號表中
      }
      this.codes.push(code); // 將剖析完成的指令放入陣列中
      c.log("%s", code); // 印出指令物件
      address += this.size(code); //  計算下一個指令位址
    } catch (err) { // 語法有錯，印出錯誤的行號與內容
      c.error(c.format("line %d : %s", i, this.lines[i]), err);
    }
  }
 }

 this.pass2 = function(codes) { // 組譯器的第二階段
  c.log("=============PASS2==============");
  for (var i in this.codes) { // 對每一個指令
    try {
      this.translate(this.codes[i]); // 將組合語言指令翻譯成機器碼
      c.log("%s", this.codes[i]); // 印出指令物件 (含組合語言與機器碼)
    } catch (err) { // 語法有錯，印出錯誤的行號與內容
      c.error(c.format("line %d : %s", i, this.lines[i]), err);
    }
  }
 }
 
 this.saveObjFile = function(objFile) { // 儲存目的檔
  c.log("=================SAVE OBJ FILE================");
  var obj = ""; // obj 為目的檔的 16 進位字串，初始化為空字串
  for (var i in this.codes) // 對於每個指令
    obj += this.codes[i].obj; // 都將目的碼加入 obj 字串中。
  var m = new Memory(1); // Memory 物件，用來將 16 進位目的碼轉為 2 進位儲存。
  m.loadhex(obj); // 將 16 進位目的碼載入記憶體
  m.dump(); // 輸出記憶體內容
  m.save(objFile); // 將記憶體內容除存到目的檔 objFile 中。
 }

 this.size = function(code) { // 計算指令所佔空間大小，在 pass1() 當中會呼叫此函數
    var len = 0, unitSize = 1; // len: 指令大小 , unitSize:每單位大小 (BYTE=1, WORD=4)
    switch (code.op.name) { // 根據運算碼 op
      case "RESW" : return 4 * parseInt(code.args[0]);  // 如果是 RESW, 大小為 4*保留量(參數 0)
      case "RESB" : return 1 * parseInt(code.args[0]);  // 如果是 RESB, 大小為 1*保留量(參數 0)
      case "WORD" : unitSize = 4; // 沒有 break，繼續執行到 BYTE 部分的程式 (共用)
      case "BYTE" : // 如果是BYTE, 大小是 1*參數個數 
        for (i in code.args) { // 對於 BYTE 或 WORD 中的每個元素
          if (code.args[i].match(/^\".*?\"$/)) // 如果是字串，像 "Hello!"
            len += (code.args[i].length - 2) * unitSize; // 則大小為 unitSize*字串長度
          else // 否則 大小就是 unitSize (BYTE=1, WORD=4)
            len += unitSize;
        }
        return len;
      case "" : return 0; // 如果只是標記, 大小為 0
      default : return 4; // 其他情形 (指令), 大小為 4
    }
 }  
}

module.exports = as; // 匯出「抽象組譯器物件 as 」
```

請注意，as.js 模組缺少 parse(), translate() 等函數，由於這兩個函數是與 CPU0 設計有關的部分，因此定義在後續的 
as0.js 當中

註：雖然上述程式中的 size() 函數也可能會與 CPU 的設計有關，但是對於 32 bit 的 CPU 而言，可以通用，因此我們
將此函數放在上層的 as.js 當中，如果要定義非 32 位元 CPU、或者重新定義組合語言的語法時，可以覆寫掉這個 size() 函數。

在上述程式中，我們用到了一個 code 物件，以下是該物件之定義模組 code.js 的原始碼：

檔案：code.js (指令物件)

```javascript
var c = require("./ccc"); // 引用基本函式庫 ccc.js

var code = function(line, opTable) { // 指令物件 code
  this.parseR = function(str) { // 剖析暫存器參數 Ra，例如 parse('R3') = 3
    var rmatch = /R(\d+)/.exec(str); // 比對取出 Ra 中的數字
    if (rmatch == null) // 如果比對失敗，則傳回 NaN
      return NaN;
    return parseInt(rmatch[1]); // 否則傳回暫存器代號 (數字)
  }

  this.toString = function() { // 輸出格式化後的指令
    return c.format("%s %s %s %s %s %s %s", c.hex(this.address, 4), 
      c.fill(' ',this.label,8), c.fill(' ',this.op.name, 8), 
      c.fill(' ',this.args, 16), this.op.type, c.hex(this.op.id,2), this.obj);
  }
  
  var labCmd = /^((\w+):)?\s*([^;]*)/; // 指令的語法
  var parts  = labCmd.exec(line); // 分割出標記與命令
  var tokens = parts[3].trim().split(/[ ,\t\r]+/); // 將命令分割成基本單元
  var opName = tokens[0]; // 取出指令名稱
  
  this.label = c.nonull(parts[2]); // 取出標記 (\w+)
  this.args  = tokens.slice(1); // 取出參數部份
  this.op    = opTable[opName]; // 取得指令表中的 OP 物件
  this.obj   = ""; // 清空目的碼 16 進位字串 obj 
}

module.exports = code; // 匯出指令物件 code
```

現在、我們以經完成組譯器抽象架構的設計了，可以開始進入與 CPU0 有關的實作部分，也就是 as0.js 的組譯器實作，
補完 as.js 當中所沒有的 parse(), translate() 等函數了，以下是其原始程式碼。

檔案：as0.js (具體的 CPU0 組譯器 AS0)

```javascript
var c = require("./ccc"); // 引用基本函式庫 ccc.js
var as = require("./as"); // 引用抽象組譯器物件 as.js
var code = require("./code"); // 引用指令物件 code.js
var cpu0 = require("./cpu0"); // 引用處理器物件 cpu0.js

var as0 = new as(cpu0.opTable); // 建立 as0 組譯器物件

as0.parse = function(line) { // 剖析組合語言指令，建立 code 物件
    return new code(line, this.opTable);
}

as0.translate = function(code) { // 指令的編碼函數
  var ra=0, rb=0, rc=0, cx=0;
  var pc = code.address + 4; // 提取後PC為位址+4
  var args = code.args, parseR = code.parseR; // 取得 code 物件的函數
  var labelCode = null; // JMP label 中 label 所對應行的物件，稱為 labelCode
  if (code.op == undefined) { // 如果沒有指令碼 (只有標記)，則清空目的碼
    code.obj = ""; 
    return;
  }
  switch (code.op.type) { // 根據指令型態
    case 'J' : // 處理 J 型指令，編出目的碼 OP Ra+cx
      switch (code.op.name) {
        case "RET": case "IRET" : // 如果式返回或中斷返回，則只要輸出 op 碼
            break;
        case "SWI" : // 如果是軟體中斷指令，則只有 cx 參數有常數值
            cx = parseInt(args[0]);
            break;
        default : // 其他跳躍指令，例如 JMP label, JLE label 等
            labelCode = this.symTable[args[0]]; // 取得 label 符號位址
            cx = labelCode.address - pc; // 計算 cx 欄位
            break;
      }
      code.obj = c.hex(code.op.id,2)+c.hex(cx, 6); // 編出目的碼 OP Ra+cx
      break;
    case 'L' : // 處理 L 型指令，編出目的碼 OP Ra, Rb, cx
      ra = parseR(args[0]); // 取得 Ra 欄位
      switch (code.op.name) {
        case "LDI" :  // 處理  LDI 指令
            cx = parseInt(args[1]); // 取得 cx 欄位
            break;
        default : // 處理 LD, ST, LDB, STB 指令
            if (args[1].match(/^[a-zA-Z]/)){ // 如果是 LD LABEL 這類情況
              labelCode = this.symTable[args[1]]; // 取得標記的 code 物件
              rb = 15; // R[15] is PC
              cx = labelCode.address - pc; // 計算標記與 PC 之間的差值
            } else { // 否則，若是像 LD Ra, Rb+100 這樣的指令
              rb = parseR(args[2]); // 取得 rb 欄位
              cx = parseInt(args[3]); // 取得 cx 欄位 (例如 100)
            }
            break;
      }
      code.obj = c.hex(code.op.id, 2)+c.hex(ra, 1)+c.hex(rb, 1)+c.hex(cx, 4); // 編出目的碼 OP Ra, Rb, cx
      break;
    case 'A' : // 處理 A 型指令，編出目的碼 OP Ra, Rb, Rc, cx
      ra = parseR(args[0]); // 取得 Ra 欄位
      switch (code.op.name) {
        case "LDR": case "LBR": case "STR": case "SBR":  // 處理  LDR, LBR, STR, SBR 指令，例如 LDR Ra, Rb+Rc
            rb = parseR(args[1]); // 取得 Rb 欄位
            rc = parseR(args[2]); // 取得 Rc 欄位
            break;
        case "CMP": case "MOV" : // 處理 CMP 與 MOV 指令，CMP Ra, Rb; MOV Ra, Rb
            rb = parseR(args[1]); // 取得 Rb
            break;
        case "SHL": case "SHR": case "ADDI": // 處理 SHL, SHR, ADDI 指令，例如 SHL Ra, Rb, Cx
            rb = parseR(args[1]); // 取得 Rb 欄位
            cx = parseInt(args[2]); // 取得 cx 欄位 (例如 3)
            break;
        case "PUSH": case "POP": case "PUSHB": case "POPB" :  // 處理 PUSH, POP, PUSHB, POPB
            break; // 例如 PUSH Ra, 只要處理 Ra 就好，A 型一進入就已經處理 Ra 了。
        default :  // 其他情況，像是 ADD, SUB, MUL, DIV, AND, OR, XOR 等，例如 ADD Ra, Rb, Rc
            rb = parseR(args[1]);  // 取得 Rb 欄位
            rc = parseR(args[2]);  // 取得 Rc 欄位
            break;
      }
      code.obj = c.hex(code.op.id, 2)+c.hex(ra, 1)+c.hex(rb, 1)+c.hex(rc,1)+c.hex(cx, 3); // 編出目的碼 OP Ra, Rb, Rc, cx
      break;
    case 'D' : { // 我們將資料宣告  RESW, RESB, WORD, BYTE 也視為一種指令，其形態為 D
      var unitSize = 1; // 預設的型態為 BYTE，資料大小 = 1
      switch (code.op.name) {                    
        case "RESW":  case "RESB": // 如果是 RESW 或 RESB，例如 a:RESB 2
          code.obj = c.dup('0', this.size(code)*2); // 1 個 byte 的空間要用兩個16進位的 00 去填充
          break;                                    // 例如：a RESB 2 會編為 '0000'
        case "WORD": // 如果是 WORD ，佔 4 個 byte
          unitSize = 4;
        case "BYTE": { // 如果是 BYTE ，佔 1 個 byte
          code.obj = ""; // 一開始目的碼為空的
          for (var i in args) { // 對於每個參數，都要編為目的碼
            if (args[i].match(/^\".*?\"$/)) {  // 該參數為字串，例如： "Hello!" 轉為 68656C6C6F21
              var str = args[i].substring(1, args[i].length-1); // 取得 "..." 中間的字串內容
              code.obj += c.str2hex(str); // 將字串內容 (例如 Hello!) 轉為 16 進位 (例如 68656C6C6F21)
            } else if (args[i].match(/^\d+$/)) {  // 該參數為常數，例如 26
              code.obj += c.hex(parseInt(args[i]), unitSize*2); // 將常數轉為 16 進位目的碼 (例如 26 轉為 1A)
            } else { // 該參數為標記，將標記轉為記憶體位址，例如 msgptr: WORD msg 中的 msg 轉為位址 (例如：00000044)
              labelCode = this.symTable[args[i]]; // 取得符號表內的物件
              code.obj += c.hex(labelCode.address, unitSize*2); // 取得位址並轉為 16 進位，塞入目的碼中。
            }
          }
          break;
        } // case BYTE:
      } // switch
      break;
    } // case 'D'
  }
} 

// 使用範例 node as0 sum.as0 sum.ob0
// 其中 argv[2] 為組合語言檔, argv[3] 為目的檔
as0.assemble(process.argv[2], process.argv[3]); 

```

在 as0.js 組譯器中我們還匯入了 cpu0.js 這個模組，雖然此模組已經於上一期當中介紹過了，不過由於上一期有幾個指令型態
設錯了 (LDR, STR, LBR, SBR 應該是 A 格式，上一期當中誤植為 L 格式)，因此我們再度列出 cpu0.js 的更正後內容如下：

```javascript
var opTable = require("./optable"); // 引用指令表 opTable 物件

// 指令陣列
var opList = [ "LD 00 L", "ST  01 L", "LDB 02 L",  "STB 03 L", "LDR 04 A", 
"STR 05 A", "LBR 06 A",  "SBR 07 A",  "LDI 08 L", "CMP 10 A", "MOV 12 A", 
"ADD 13 A",  "SUB 14 A",  "MUL 15 A", "DIV 16 A",  "AND 18 A", "OR  19 A",  "XOR 1A A",  
"ADDI 1B A", "ROL 1C A",  "ROR 1D A", "SHL 1E A", "SHR 1F A",  
"JEQ 20 J", "JNE 21 J",  "JLT 22 J", "JGT 23 J", "JLE 24 J",  "JGE 25 J", "JMP 26 J", 
"SWI 2A J", "JSUB 2B J","RET 2C J", "PUSH 30 J", "POP 31 J",  "PUSHB 32 J", 
"POPB 33 J", "RESW F0 D", "RESB F1 D", "WORD F2 D", "BYTE F3 D"];

var cpu = { "opTable" : new opTable(opList) }; // cpu0 處理器物件，內含一個指令表 opTable

if (process.argv[3] == "-t") // 如果使用 node cpu0 -t 可以印出指令表
    cpu.opTable.dump();

module.exports = cpu; // 匯出 cpu0 模組。
```

## 程式說明

在上述的 as.js 程式中，第一階段 pass1() 的工作是將每個組合語言指令的位址編好，並紀錄下所有符號的位址，
這個過程顯示在組譯報表的 PASS1 部分，您可以看到上述 as0 組譯器的輸出範例中，每個指令的位址都被計算出來了，
如下所示：

```
=================PASS1================
0000          LD       R1,sum           L 00
0004          LD       R2,i             L 00
0008          LDI      R3,10            L 08
000C FOR      CMP      R2,R3            A 10
0010          JGT      EXIT             J 23
0014          ADD      R1,R1,R2         A 13
0018          ADDI     R2,R2,1          A 1B
001C          JMP      FOR              J 26
0020 EXIT     ST       R1,sum           L 01
0024          ST       R2,i             L 01
0028          LD       R9,msgptr        L 00
002C          SWI      3                J 2A
0030          MOV      R9,R1            A 12
0034          SWI      4                J 2A
0038          RET                       J 2C
003C i        RESW     1                D F0
0040 sum      WORD     0                D F2
0044 msg      BYTE     "1+...+10=",0    D F3
004E msgptr   WORD     msg              D F2
```

而且在 PASS1 完成之後，所有符號的位址都會被記錄在符號表當中，如下所示：

```
===============SYMBOL TABLE=========
FOR      000C
EXIT     0020
i        003C
sum      0040
msg      0044
msgptr   004E
```

接著在 PASS2 當中，我們就可以利用這些符號表中的位址，編制出每個指令中的符號的「定址方式、相對位址」等等，如下表所示：

```
=============PASS2==============
0000          LD       R1,sum           L 00 001F003C
0004          LD       R2,i             L 00 002F0034
0008          LDI      R3,10            L 08 0830000A
000C FOR      CMP      R2,R3            A 10 10230000
0010          JGT      EXIT             J 23 2300000C
0014          ADD      R1,R1,R2         A 13 13112000
0018          ADDI     R2,R2,1          A 1B 1B220001
001C          JMP      FOR              J 26 26FFFFEC
0020 EXIT     ST       R1,sum           L 01 011F001C
0024          ST       R2,i             L 01 012F0014
0028          LD       R9,msgptr        L 00 009F0022
002C          SWI      3                J 2A 2A000003
0030          MOV      R9,R1            A 12 12910000
0034          SWI      4                J 2A 2A000004
0038          RET                       J 2C 2C000000
003C i        RESW     1                D F0 00000000
0040 sum      WORD     0                D F2 00000000
0044 msg      BYTE     "1+...+10=",0    D F3 312B2E2E2E2B31303D00
004E msgptr   WORD     msg              D F2 00000044
```

由於 CPU0 設計得很簡單，因此對於一般的指令而言(像是 ADD, MOV, RET 等)，編制出機器碼是很容易的，例如
RET 指令不包含任何參數，因此其機器碼就是在指令碼 OP=2C 後面補 0，直到填滿 32bit (8 個 16 進位數字) 為止，
而 ADD R1,R1,R2 的編碼也很容易，就是將指令碼 OP=13 補上暫存器代號 1, 1, 2 之後再補 0，形成 13112000 
的編碼。

最難處理的是有標記的指令，舉例而言，像是 JGT EXIT 的機器碼 2300000C 與 JMP FOR 的機器碼 26FFFFEC 是怎麼來的呢？

關於這點，我們必須用較長的篇幅解釋一下：

在上述 AS0 程式的設計當中，我們一律用「相對於程式計數器 PC 的定址法」來進行標記的編碼 (cx = label.address-PC)，
例如在 JGT EXIT 這個指令中，由於標記 EXIT 的位址是 0020 ，而 JGT EXIT 指令的位址為 0010，因此兩者之差距為 
0010，但是由於 JGT EXIT 指令執行時其程式計數器 PC 已經進到下一個位址 (0014) 了(在指令擷取階段完成後就會進到下一個位址)，
所以 PC 與 FOR 標記之間的位址差距為 (cx = label.address-PC= 0020-0014 = 000C) (請注意這是用 16 進位的減法)，
因此整個 JGT EXIT 指令就被組譯為 JGT EXIT = JGT R15+cx = 23 F 000C。 
(其中 R15 是 CPU0 的程式計數器 PC，所以暫存器 Ra 部分編為 15 的十六進位值 F)。

但是、有時候相對定址若是負值，也就是標記在指令的前面，像是 JMP FOR 的情況時，最後 cx = label.address-PC 計算出來會是
負值，此時就必須採用 2 補數表示法，例如 JMP FOR 的情況 (cx = label.address-PC = 000C-0020 = -0014) (請注意這是用 16 進位的減法)，
採用 2 補數之後就會變成 FFFFEC，因此 JMP FOR 被編為 26 F FFFEC。

## 結語

現在、我們已經完成了組譯器 AS0 的設計，並解析了整個組譯器的原始碼，希望透過這種方式，可以讓讀者瞭解
整個組譯器的設計過程。在後續的文章之中，我們還會介紹開放電腦計畫中「虛擬機、編譯器」的 JavaScript 原始碼，
以及實作 CPU0 處理器的 Verilog 原始碼。然後再進入作業系統的設計部分，希望透過這種方式，可以讓讀者瞭解
如何「自己動手設計一台電腦」，完成「開放電腦計畫」的主要目標。

