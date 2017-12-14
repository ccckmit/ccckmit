# 虛擬機

在前幾章中，我們介紹了 CPU0 處理器的指令集，以及組譯器的實作方式，文章網址如下：

現在，我們將接焦點轉移到虛擬機 VM0 的實作上，說明一個最簡易的虛擬機是如何設計出來的。

## 組譯範例

首先、讓讀者回顧一下，在上一篇文章中，我們設計了一個組譯器，可以組譯像以下的組合語言程式。

組合語言：[sum.as0](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/oc/sum.as0)

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
        SWI    3            ; SWI 3 : 印出 R9 (=&msg) 中的字串
        MOV    R9, R1       ; R9 = R1 = sum
        SWI    4            ; SWI 2 : 印出 R9 (=R1=sum) 中的整數
        RET                 ; return 返回上一層呼叫函數
i:      RESW   1            ; int i
sum:    WORD   0            ; int sum=0
msg:    BYTE   "1+...+10=", 0   ; char *msg = "sum="
msgptr: WORD   msg          ; char &msgptr = &msg
```

我們可以用 AS0 組譯器對這樣的 CPU0 組合語言進行組譯，以下是組譯過程與結果，會輸出機器碼到目的檔中。

```
D:\Dropbox\Public\oc\code>node as0 sum.as0 sum.ob0
...
...
=================SAVE OBJ FILE================

00 :  001F003C 002F0034 0830000A 10230000
10 :  2300000C 13112000 1B220001 26FFFFEC
20 :  011F001C 012F0014 009F001D 2A000003
30 :  12910000 2A000002 2C000000 00000000
40 :  00000000 73756D3D 00000000 44
```

接著、我們就可以用虛擬機 VM0 來執行這個目的檔，我們可以選擇用預設不傾印的方式，得到以下的簡要執行結果。

虛擬機執行過程 (不傾印)

```
D:\oc\code>node vm0 sum.ob0
1+...+10=55
```

也可以用加上 -d 參數的方式，傾印每一個指令的執行過程，如下所示：

虛擬機執行過程 (詳細傾印)

```
D:\oc\code>node vm0 sum.ob0 -d

00 :  001F003C 002F0034 0830000A 10230000
10 :  2300000C 13112000 1B220001 26FFFFEC
20 :  011F001C 012F0014 009F0022 2A000003
30 :  12910000 2A000004 2C000000 00000000
40 :  00000000 312B2E2E 2E2B3130 3D000000
50 :  0044
PC=0000 IR=001F003C SW=00000000 R[01]=0x00000000=0
PC=0004 IR=002F0034 SW=00000000 R[02]=0x00000000=0
PC=0008 IR=0830000A SW=00000000 R[03]=0x0000000A=10
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000000=0
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000001=1
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000001=1
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000002=2
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000003=3
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000003=3
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000006=6
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000004=4
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x0000000A=10
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000005=5
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x0000000F=15
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000006=6
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000015=21
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000007=7
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x0000001C=28
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000008=8
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x00000024=36
PC=0018 IR=1B220001 SW=80000000 R[02]=0x00000009=9
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=80000000 R[0C]=0x80000000=-2147483648
PC=0010 IR=2300000C SW=80000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=80000000 R[01]=0x0000002D=45
PC=0018 IR=1B220001 SW=80000000 R[02]=0x0000000A=10
PC=001C IR=26FFFFEC SW=80000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=40000000 R[0C]=0x40000000=1073741824
PC=0010 IR=2300000C SW=40000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=40000000 R[01]=0x00000037=55
PC=0018 IR=1B220001 SW=40000000 R[02]=0x0000000B=11
PC=001C IR=26FFFFEC SW=40000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=00000000 R[0C]=0x00000000=0
PC=0010 IR=2300000C SW=00000000 R[00]=0x00000000=0
m[0040]=55
PC=0020 IR=011F001C SW=00000000 R[01]=0x00000037=55
m[003C]=11
PC=0024 IR=012F0014 SW=00000000 R[02]=0x0000000B=11
PC=0028 IR=009F0022 SW=00000000 R[09]=0x00000044=68
1+...+10=PC=002C IR=2A000003 SW=00000000 R[00]=0x00000000=0
PC=0030 IR=12910000 SW=00000000 R[09]=0x00000037=55
55PC=0034 IR=2A000004 SW=00000000 R[00]=0x00000000=0
PC=0038 IR=2C000000 SW=00000000 R[00]=0x00000000=0

```

如果您詳細追蹤上述過程，就能更清楚的看出每個指令執行時，所造成的暫存器變化，舉例而言，您可以看到程式
在 PC=000C 到 PC=001C 之間循環了很多次，最後一次的循環印出下列內容。

```
PC=000C IR=10230000 SW=40000000 R[0C]=0x40000000=1073741824
PC=0010 IR=2300000C SW=40000000 R[00]=0x00000000=0
PC=0014 IR=13112000 SW=40000000 R[01]=0x00000037=55
PC=0018 IR=1B220001 SW=40000000 R[02]=0x0000000B=11
PC=001C IR=26FFFFEC SW=40000000 R[0F]=0x0000000C=12
PC=000C IR=10230000 SW=00000000 R[0C]=0x00000000=0
PC=0010 IR=2300000C SW=00000000 R[00]=0x00000000=0
m[0040]=55
```

其中得到 R[01]=0x00000037=55 的計算結果，正是整個程式計算 1+2+...+10=55 的結果。

## VM0 虛擬機設計

接著、我們要來看看虛擬機 VM0 是如何設計的，但是在這之前，先讓我們看看虛擬機當中一個重要的資料結構，
OpTable 指令表這個物件，其程式碼如下：

檔案：[opTable.js](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/oc/opTable.js)

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

然後、我們利用上述的 OpTable 模組，加入了 CPU0 的指令集之後，建出了 CPU0 這個代表處理器的模組，
程式碼如下。

檔案：[cpu0.js](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/oc/cpu0.js)

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

if (process.argv[2] == "-d")
    cpu.opTable.dump();

module.exports = cpu;
```

有了上述的兩個模組作為基礎，我們就可以開始撰寫虛擬機 VM0 了，以下是其原始程式碼。

檔案：[vm0.js](https://dl.dropboxusercontent.com/u/101584453/pmag/201309/code/oc/vm0.js)

```javascript
var c = require("./ccc");
var cpu1 = require("./cpu0");
var Memory = require("./memory");

var isDump = process.argv[3] == "-d";

var IR = 16, PC = 15, LR = 14, SP = 13, SW = 12;
var ID = function(op) { return cpu1.opTable[op].id; }

var run = function(objFile) {
    R = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, -1, 0, 16];
    m = new Memory(1);
    m.load(objFile);
    if (isDump) m.dump();
    var stop = false;
    while (!stop) {                                          // 如果尚未結束
      var tpc = R[PC];
      R[0] = 0;                                              // R[0] 永遠為 0
      R[IR] = m.geti(R[PC]);                                 // 指令擷取，IR=[PC..PC+3]
      R[PC] += 4;                                            // 擷取完將 PC 加 4，指向下一個指令
      var op = c.bits(R[IR], 24, 31);                        // 取得 op 欄位，IR[24..31]
      var ra = c.bits(R[IR], 20, 23);                        // 取得 ra 欄位，IR[20..23]
      var rb = c.bits(R[IR], 16, 19);                        // 取得 rb 欄位，IR[16..19]
      var rc = c.bits(R[IR], 12, 15);                        // 取得 rc 欄位，IR[12..15]
      var c24= c.signbits(R[IR], 0,  23);                    // 取得 24 位元的 cx
      var c16= c.signbits(R[IR], 0,  15);                    // 取得 16 位元的 cx
      var c5 = c.bits(R[IR], 0,   4);                        // 取得 16 位元的 cx
      var addr  = R[rb]+c16;
      var raddr = R[rb]+R[rc];                               // 取得位址[Rb+Rc]                          
      var N  = c.bits(R[SW], 31, 31);
      var Z  = c.bits(R[SW], 30, 30);
//      c.log("IR=%s ra=%d rb=%d rc=%d c24=%s c16=%s addr=%s", c.hex(R[IR], 8), ra, rb, rc, c.hex(c24, 6), c.hex(c16, 4), c.hex(addr, 8))
      switch (op) {                                          // 根據op執行動作
        case ID("LD") : R[ra] = m.geti(addr); break;         // 處理 LD 指令
        case ID("ST") :                                      // 處理 ST 指令
          m.seti(addr, R[ra]); 
          if (isDump) c.log("m[%s]=%s", c.hex(addr,4), m.geti(addr)); 
          break;
        case ID("LDB"): R[ra] = m.getb(addr); break;         // 處理 LDB 指令
        case ID("STB"): m.setb(addr, R[ra]); break;          // 處理 STB 指令
        case ID("LDR"): R[ra] = m.geti(raddr); break;        // 處理 LDR 指令
        case ID("STR"): m.seti(raddr, R[ra]); break;         // 處理 STR 指令
        case ID("LBR"): R[ra] = m.getb(raddr); break;        // 處理 LBR 指令
        case ID("SBR"): m.setb(raddr, R[ra]); break;         // 處理 SBR 指令
        case ID("LDI"): R[ra] = c16; break;                  // 處理 LDI 指令
        case ID("CMP"): {                                    // 處理 CMP指令，根據比較結果，設定 N,Z 旗標 
          if (R[ra] > R[rb]) {                               // > : SW(N=0, Z=0)
            R[SW] &= 0x3FFFFFFF;                             // N=0, Z=0
          } else if (R[ra] < R[rb]) {                        // < : SW(N=1, Z=0, ....)                                                
            R[SW] |= 0x80000000;                             // N=1;
            R[SW] &= 0xBFFFFFFF;                             // Z=0;
          } else {                                           // = : SW(N=0, Z=1)                      
            R[SW] &= 0x7FFFFFFF;                             // N=0;
            R[SW] |= 0x40000000;                             // Z=1;
          }
          ra = 12;
          break;                                                                                        
        }
        case ID("MOV"): R[ra] = R[rb]; break;                // 處理MOV指令
        case ID("ADD"): R[ra] = R[rb]+R[rc]; break;          // 處理ADD指令
        case ID("SUB"): R[ra] = R[rb]-R[rc]; break;          // 處理SUB指令
        case ID("MUL"): R[ra] = R[rb]*R[rc]; break;          // 處理MUL指令
        case ID("DIV"): R[ra] = R[rb]/R[rc]; break;          // 處理DIV指令
        case ID("AND"): R[ra] = R[rb]&R[rc]; break;          // 處理AND指令
        case ID("OR") : R[ra] = R[rb]|R[rc]; break;          // 處理OR指令
        case ID("XOR"): R[ra] = R[rb]^R[rc]; break;          // 處理XOR指令
        case ID("SHL"): R[ra] = R[rb]<<c5; break;            // 處理SHL指令
        case ID("SHR"): R[ra] = R[rb]>>c5; break;            // 處理SHR指令
        case ID("ADDI"):R[ra] = R[rb] + c16; break;          // 處理 ADDI 指令
        case ID("JEQ"): if (Z==1) R[PC] += c24; break;       // 處理JEQ指令 Z=1
        case ID("JNE"): if (Z==0) R[PC] += c24; break;       // 處理JNE指令 Z=0 
        case ID("JLT"): if (N==1&&Z==0) R[PC] += c24; break; // 處理JLT指令 NZ=10 
        case ID("JGT"): if (N==0&&Z==0) R[PC] += c24; break; // 處理JGT指令 NZ=00
        case ID("JLE"): if ((N==1&&Z==0)||(N==0&&Z==1)) R[PC]+=c24; break; // 處理JLE指令 NZ=10 or 01
        case ID("JGE"): if ((N==0&&Z==0)||(N==0&&Z==1)) R[PC]+=c24; break; // 處理JGE指令 NZ=00 or 01
        case ID("JMP"): R[PC]+=c24; break;                   // 處理JMP指令                             
        case ID("SWI"):                                      // 處理SWI指令
            switch (c24) {
                case 3: c.printf("%s", m.getstr(R[9])); break;
                case 4: c.printf("%d", R[9]); break;
                default: 
                    var emsg = c.format("SWI cx=%d not found!", c24); 
                    c.error(emsg, null); 
                    break;
            }
            break;
        case ID("JSUB"):R[LR] = R[PC]; R[PC]+=c24; break;    // 處理JSUB指令
        case ID("RET"): if (R[LR]<0) stop=true; else R[PC]=LR; break; // 處理RET指令
        case ID("PUSH"):R[SP]-=4; R[ra]=m.geti(addr); m.seti(R[SP], R[ra]); break; // 處理PUSH指令
        case ID("POP"): R[ra] = m.geti(R[SP]); R[SP]+=4; break;     // 處理POP指令
        case ID("PUSHB"):R[SP]--; R[ra]=m.getb(addr); m.setb(R[SP], R[ra]); break; // 處理PUSH指令
        case ID("POPB"):R[ra] = m.getb(R[SP]); R[SP]++; break;      // 處理POPB指令
        default: c.error("OP not found!", null);
      } // switch
      if (isDump) 
        c.log("PC=%s IR=%s SW=%s R[%s]=0x%s=%d", // 印出 PC, IR, R[ra]暫存器的值，以利觀察
              c.hex(tpc,4), c.hex(R[IR],8), c.hex(R[SW],8), c.hex(ra,2), c.hex(R[ra], 8), R[ra]);
    } // while
}

run(process.argv[2]);
```

從上面的 VM0 虛擬機當中，您可以看到，假如不考慮執行速度的問題，那麼要撰寫一個虛擬機是非常容易的事情。
我們只要去忠實的模擬每一個指令所應該做的動作，就可以完成虛擬機的設計了。

讓我們稍微解釋一下上述 VM0 虛擬機的程式原理，請讀者將焦點先放在以下的程式片段中。

```javascript
    ...
    m = new Memory(1);
    m.load(objFile);
    var stop = false;
    while (!stop) {                                          // 如果尚未結束
      ...
      R[IR] = m.geti(R[PC]);                                 // 指令擷取，IR=[PC..PC+3]
      R[PC] += 4;                                            // 擷取完將 PC 加 4，指向下一個指令
      var op = c.bits(R[IR], 24, 31);                        // 取得 op 欄位，IR[24..31]
      var ra = c.bits(R[IR], 20, 23);                        // 取得 ra 欄位，IR[20..23]
      var rb = c.bits(R[IR], 16, 19);                        // 取得 rb 欄位，IR[16..19]
      var rc = c.bits(R[IR], 12, 15);                        // 取得 rc 欄位，IR[12..15]
      var c24= c.signbits(R[IR], 0,  23);                    // 取得 24 位元的 cx
      var c16= c.signbits(R[IR], 0,  15);                    // 取得 16 位元的 cx
      var c5 = c.bits(R[IR], 0,   4);                        // 取得 16 位元的 cx
      var addr  = R[rb]+c16;
      var raddr = R[rb]+R[rc];                               // 取得位址[Rb+Rc]                          
      var N  = c.bits(R[SW], 31, 31);
      var Z  = c.bits(R[SW], 30, 30);
      switch (op) {                                          // 根據op執行動作
        case ID("LD") : R[ra] = m.geti(addr); break;         // 處理 LD 指令
        ...
        case ID("JMP"): R[PC]+=c24; break;                   // 處理JMP指令                             
        ...
        case ID("JSUB"):R[LR] = R[PC]; R[PC]+=c24; break;    // 處理JSUB指令
        ...
        case ID("RET"): if (R[LR]<0) stop=true; else R[PC]=LR; break; // 處理RET指令
        ...        

```

首先我們用 m = new Memory(1) 建立一個空的記憶體，然後再用 m.load(objFile) 載入目的檔到記憶體中，
接著就開始進入 while (!stop) 起頭的指令解譯迴圈了，然後接著用 R[IR] = m.geti(R[PC]) 這個指令取出
程式計數暫存器 PC 所指到的記憶體內容 m[PC]，然後放到指令暫存器 IR 當中，接著就可以取出指令暫存器 IR 
當中的欄位，像是指令碼 op、暫存器 ra, rb, rc 與常數部分 c24, c16, c5 等欄位。

然後就能對每個指令所應做的動作進行模擬，例如 LD 指令的功能是將記憶體位址 addr  = R[rb]+c16 的內容
取出，放到編號 ra 的暫存器當中，因此只要用 R[ra] = m.geti(addr) 這樣一個函數呼叫，就可以完成模擬的動作了。

當然、有些模擬動作很簡單，可以用一兩個指令做完，像是 LD, ST, JMP 等都是如此，但有些動作就比較複雜，
像是 JSUB, RET, PUSH, POP 等就要好幾個指令，最複雜的大概是 CMP 與 SWI 這兩個指令了，CMP 由於牽涉到比較動作
且需要設定 N, Z 等旗標，所以程式碼較長如下：

```javascript
...
        case ID("CMP"): {                                    // 處理 CMP指令，根據比較結果，設定 N,Z 旗標 
          if (R[ra] > R[rb]) {                               // > : SW(N=0, Z=0)
            R[SW] &= 0x3FFFFFFF;                             // N=0, Z=0
          } else if (R[ra] < R[rb]) {                        // < : SW(N=1, Z=0, ....)                                                
            R[SW] |= 0x80000000;                             // N=1;
            R[SW] &= 0xBFFFFFFF;                             // Z=0;
          } else {                                           // = : SW(N=0, Z=1)                      
            R[SW] &= 0x7FFFFFFF;                             // N=0;
            R[SW] |= 0x40000000;                             // Z=1;
          }
          ra = 12;
          break;                                                                                        
        }
...
```

而 SWI 則是軟體中斷，這個部分也可以不做任何事，不過如果要支援某些中斷函數的話，就可以在這個指令中進行模擬，
目前 SWI 指令處理的原始碼如下：

```javascript
        case ID("SWI"):                                      // 處理SWI指令
            switch (c24) {
                case 3: c.printf("%s", m.getstr(R[9])); break;
                case 4: c.printf("%d", R[9]); break;
                default: 
                    var emsg = c.format("SWI cx=%d not found!", c24); 
                    c.error(emsg, null); 
                    break;
            }
            break;
```

目前我們支援兩個中斷處理呼叫，也就是 SWI 3 與 SWI 4。

其中的 SWI 4 會在螢幕上印出一個儲存在暫存器 R[9] 當中的整數，而 SWI 3 會在螢幕上印出一個記憶體當中的字串，
這個字串的起始位址也是儲存在暫存器 R[9] 當中的。

## 結語

透過 VM0，筆者希望能夠讓讀者清楚的瞭解虛擬機的設計方式，當然、VM0 是一個「跑得很慢」的虛擬機。

如果要讓虛擬機跑得很快，通常要搭配「立即編譯技術」(Just in Time Compiler, JIT) ，像是 Java 虛擬機 JVM 
就是利用 JIT 才能夠讓 Java 程式跑得夠快。

另外、像是 VMWare、VirtualBox 等，則是在相同的 x86 架構下去執行的，因此重點變成「如何有效的繞過作業系統
的控管，讓機器碼在 CPU 上執行」的問題了。

在開放原始碼的領域，QEMU 是一個非常重要的虛擬機，其做法可以參考下列 QEMU 原作者 bellard 的論文：

* <https://www.usenix.org/legacy/event/usenix05/tech/freenix/full_papers/bellard/bellard.pdf>

摘要如下：

> The ﬁrst step is to split each target CPU instruction into fewer simpler instructions called micro operations. Each micro operation is implemented by a small piece of C
code. This small C source code is compiled by GCC to an object ﬁle. The micro operations are chosen so that their number is much smaller (typically a few hundreds) than all the combinations of instructions and operands of the target CPU. The translation from target CPU instructions to micro operations is done entirely with hand coded code. The source code is optimized for readability and compactness because the speed of this stage is less critical than in an interpreter.
> 
> A compile time tool called dyngen uses the object ﬁle containing the micro operations as input to generate a dynamic code generator. This dynamic code generator is invoked at runtime to generate a complete host function which concatenates several micro operations.

筆者先前粗略的看了一下，原本以為「QEMU 則是機器法反編譯為 C 語言基本運算後，再度用 gcc 編譯 為機器碼，才能達到高速執行的目的」，但是仔細看又不是這樣，想想還是不要自己亂解釋好了，不過有高手 J 兄來信說明如下，原文附上：

> QEMU 採取的技術為 portable JIT，本質上是一種 template-based compilation，事先透過 TCG 做 code generation，使得 C-like template 得以在執行時期可對應到不同平台的 machine code，而執行時期沒有 gcc 的介入，我想這點該澄清。

像 bellard 這種高手寫的虛擬機，果然是又快又好啊！

VM0 與 QEMU 相比，速度上致少慢了幾十倍，不過程式碼絕對是簡單很多就是了。

