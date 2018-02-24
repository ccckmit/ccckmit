## 編譯器：中間碼轉組合語言 - ir2as

### 前言

在上文中我們介紹了 j0c 這個編譯器的設計方式，並且設計了一種稱為 ir0 的中間碼格式，用來做為 j0c 編譯器的輸出格式。

在本文中，我們將介紹一個可以將中間碼 ir0 格式轉換成 CPU0 組合語言 (as0) 的程式，該程式稱為 ir2as0 ，這樣才能接上先前的 as0 組譯器，成為一套完整的工具鏈。

### 轉換程式

以下是這個轉換程式的原始碼，該程式會將 ir0 格式的中間碼，轉換成 as0 格式的組合語言。

檔案：ir2as.js

```javascript
// ir2as0 中間碼轉換為組合語言，用法範例： node ir2as0 test.ir0 > test.as0
var fs = require("fs");
var util = require("util");
var format = util.format;  // 字串格式化
var log = console.log;     // 將 console.log 名稱縮短一點

// 讀入中間檔，並分割成一行一行的字串
var lines = fs.readFileSync(process.argv[2], "utf8").split("\n"); 

// 輸出組合語言
var asm=function(label, op, p, p1, p2) {
  var asCode = format("%s\t%s\t%s\t%s\t%s", label, op, p, p1, p2);
  log(asCode);
}

var cmpCount = 0; // 比較運算的標記不可重複，故加上一個 counter 以玆區分

// 將一行中間碼 line 轉換為組合語言
function ir2as(line) {
  var tokens = line.split("\t"); // 將中間碼分割成一個一個的欄位
  var label = tokens[0];         // 取出標記 label
  var iop = tokens[1], aop="";   // 取出運算 iop
  var p = tokens.slice(2);       // 取出參數部份
  if (label !== "")              // 若有標記，直接輸出一行只含標記的組合語言
    asm(label, "", "", "", "");
  switch (iop) {                 // 根據運算 iop 的內容，決定要轉成甚麼組合語言
    case "=":                    // 範例：= X Y 改為 LD R1, Y; ST R1, X
	asm("", "LD", "R1", p[1], "");
	asm("", "ST", "R1", p[0], "");
	break;
    // 範例： + X A B 改為 LD R1, A;  LD R2, B; ADD R3, R1, R2; ST R3, X;
    case "+": case "-": case "*": case "/": case "<<":
	asm("", "LD", "R1", p[1], "");
	asm("", "LD", "R2", p[2], "");
	aop = {"+":"ADD", "-":"SUB", "*":"MUL", "/":"DIV"}[iop];
	asm("", aop, "R3", "R1", "R2");
	asm("", "ST", "R3", p[0], "");
	break;
    // 範例： ++ X 改為 LDI R1, 1; LD R2, X; ADD R2, R1, R2; ST R2, X; 
    case "++": case "--":
	asm("", "LDI", "R1", "1", "");
	asm("", "LD",  "R2", p[0], "");
	aop = {"++":"ADD", "--":"SUB" }[iop];
	asm("", aop, "R2", "R1", "R2");
	asm("", "ST",  "R2", p[0]);
	break;
    // 範例： < X, A, B 改為 LD R1, A; LD R2, B; CMP R1, R2; JLT CSET0; LDI R1, 1; JMP EXIT0; CSET0: LDI R1, 0; CEXIT0: ST R1, X
    case "<": case "<=": case ">": case ">=": case "==": case "!=": 
	asm("", "LD", "R1", p[1], "");
	asm("", "LD", "R2", p[2], "");
	asm("", "CMP", "R1", "R2", "");
	aop = {"<":"JLT", "<=":"JLE", ">":"JGT", ">=":"JGE", "==":"JEQ", "!=":"JNE"}[iop];
	asm("", aop, "CSET"+cmpCounter, "", "");
	asm("", "LDI", "R1", "1", "");
	asm("",  "JMP", "CEXIT"+cmpCounter, "", "");
	asm("CSET"+cmpCount, "LDI", "R1", "0", "");
	asm("CEXIT"+cmpCount, "ST", "R1", p[0], "");
	break;
    // 範例： call X, F 改為 CALL F; ST R1, X;
    case "call":
	asm("",  "CALL", p[1], "",   "");
	asm("",  "ST",   "R1", p[0], "");
	break;
    // 範例： arg X 改為 LD R1, X; PUSH R1;
    case "arg":
	asm("",  "LD",  "R1", p[0], "");
	asm("",  "PUSH","R1", "", "");
	break;
    case "function": // 範例： sum function 只生成標記 sum，沒有生成組合語言指令
	break;
    case "endf": // 函數結束，沒有生成組合語言指令
	break;
    case "param": // 範例： param X 改為 POP R1; ST R1, X; 
	asm("",  "POP", "R1", "", "");
	asm("",  "ST",  "R1", p[0], "");
	break;
    case "return":  // 範例： return X 改為 LD R1, X; RET;
	asm("",  "LD","R1", p[0], "");
	asm("",  "RET","", "", "");
	break;
    case "if0":  // 範例： if0 X Label 改為 CMP R0, X; JEQ Label;
	asm("",  "CMP","R0", p[0], "");
	asm("",  "JEQ",p[1], "", "");
	break;
    case "goto":  // 範例： goto Label 改為 JMP label
	asm("",  "JMP", p[0], "", "");
	break;
    case "array":  // 範例： X array 改為 LD R1, X; CALL ARRAY; (註： X=new array())
	asm("",  "LD", "R1", p[0], "");
	asm("",  "CALL", "ARRAY", "", "");
	break;
    case "[]":  // 範例： [] X A i  改為 LD R1, A; LD R2, i; CALL AGET; ST R1, X (註： X=A[i])
	asm("",  "LD", "R1", p[1], "");
	asm("",  "LD", "R2", p[2], "");
	asm("",  "CALL", "AGET", "", "");
	asm("",  "ST", "R1", p[0], "");
	break;
    case "length": // 範例： length len, A 改為 LD R1, A; CALL ALEN; ST R1, len;
	asm("",  "LD", "R1", p[1], "");
	asm("",  "CALL", "ALEN", "", "");
	asm("",  "ST", "R1", p[0], "");
	break;
    case "apush": // 範例： apush A, X 改為 LD R1,A; LD R2, X; CALL APUSH
	asm("",  "LD", "R1", p[0], "");
	asm("",  "LD", "R2", p[1], "");
	asm("",  "CALL", "APUSH", "", "");
	break;
    case "table": // 範例： table T 改為 LD R1,T; CALL TABLE
	asm("",  "LD", "R1", p[0], "");
	asm("",  "CALL", "TABLE", "", "");
	break;
    case "map": // 範例： map table field value 改為 LD R1, table; LD R2, field; LD R3, value; CALL TMAP
	asm("",  "LD", "R1", p[0], "");
	asm("",  "LD", "R2", p[1], "");
	asm("",  "LD", "R3", p[2], "");
	asm("",  "CALL", "TMAP", "", "");
	break;
    case "":
	break;
    default: 
      log("Error : %s not found!", iop);
  }
}

// 將所有中間碼都轉換為組合語言
for (var i in lines) {
  if (lines[i].trim().length > 0) {
    log("// %s", lines[i]);
    ir2as(lines[i]);
  }
}
```

### 執行結果

首先我們要使用 j0c 編譯器將 j0 語言的程式，編譯為 ir0 的中間碼格式。然後再利用 ir2as0 將中間碼轉換成 CPU0 的組合語言，以下是一個將 test.j0 編譯 test.ir0 中間檔，然後再利用 ir2as0 將中間檔轉換為 test.as0 組合語言的過程。

```
C:\Dropbox\Public\web\oc\code\js>node j0c test.j0 > test.ir0

C:\Dropbox\Public\web\oc\code\js>node ir2as0 test.ir0 > test.as0
```

以下是 test.j0 => test.ir0 => test.as0 這個編譯轉換過程當中的檔案內容。

高階語言檔： test.j0

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

中間碼檔案： test.ir0

```
	arg	10		
	call	T1	sum	
	=	s	T1	
sum	function			
	param	n		
	=	s	0	
	=	i	1	
L1				
	<=	T2	i	10
	if0	T2	L2	
	+	T3	s	i
	=	s	T3	
	++	i		
	goto	L1		
L2				
	return	s		
	endf			
	arg	3		
	arg	5		
	call	T4	max	
	=	m	T4	
max	function			
	param	a		
	param	b		
	>	T5	a	b
	if0	T5	L3	
	return	a		
L3				
	return	b		
	endf			
total	function			
	param	a		
	=	s	0	
	=	i	0	
L4	length	T6	a	
	<	T7	i	T6
	if0	T7	L5	
	[]	T8	a	i
	+	T9	s	T8
	=	s	T9	
	goto	L4		
L5				
	return	s		
	endf			
	array	T10		
	apush	T10	1	
	apush	T10	3	
	apush	T10	7	
	apush	T10	2	
	apush	T10	6	
	=	a	T10	
	arg	a		
	call	T11	total	
	=	t	T11	
	table	T12		
	map	T12	e	"dog"
	map	T12	c	"狗"
	=	word	T12	
```

組合語言檔： test.as0

```
// 	arg	10		
	LD	R1	10	
	PUSH	R1		
// 	call	T1	sum	
	CALL	sum		
	ST	R1	T1	
// 	=	s	T1	
	LD	R1	T1	
	ST	R1	s	
// sum	function			
sum				
// 	param	n		
	POP	R1		
	ST	R1	n	
// 	=	s	0	
	LD	R1	0	
	ST	R1	s	
// 	=	i	1	
	LD	R1	1	
	ST	R1	i	
// L1				
L1				
// 	<=	T2	i	10
	LD	R1	i	
	LD	R2	10	
	CMP	R1	R2	
	JLE	CSET0		
	LDI	R1	1	
	JMP	CEXIT0		
CSET0	LDI	R1	0	
CEXIT0	ST	R1	T2	
// 	if0	T2	L2	
	CMP	R0	T2	
	JEQ	L2		
// 	+	T3	s	i
	LD	R1	s	
	LD	R2	i	
	ADD	R3	R1	R2
	ST	R3	T3	
// 	=	s	T3	
	LD	R1	T3	
	ST	R1	s	
// 	++	i		
	LDI	R1	1	
	LD	R2	i	
	ADD	R2	R1	R2
	ST	R2	i	undefined
// 	goto	L1		
	JMP	L1		
// L2				
L2				
// 	return	s		
	LD	R1	s	
	RET			
// 	endf			
// 	arg	3		
	LD	R1	3	
	PUSH	R1		
// 	arg	5		
	LD	R1	5	
	PUSH	R1		
// 	call	T4	max	
	CALL	max		
	ST	R1	T4	
// 	=	m	T4	
	LD	R1	T4	
	ST	R1	m	
// max	function			
max				
// 	param	a		
	POP	R1		
	ST	R1	a	
// 	param	b		
	POP	R1		
	ST	R1	b	
// 	>	T5	a	b
	LD	R1	a	
	LD	R2	b	
	CMP	R1	R2	
	JGT	CSET0		
	LDI	R1	1	
	JMP	CEXIT0		
CSET0	LDI	R1	0	
CEXIT0	ST	R1	T5	
// 	if0	T5	L3	
	CMP	R0	T5	
	JEQ	L3		
// 	return	a		
	LD	R1	a	
	RET			
// L3				
L3				
// 	return	b		
	LD	R1	b	
	RET			
// 	endf			
// total	function			
total				
// 	param	a		
	POP	R1		
	ST	R1	a	
// 	=	s	0	
	LD	R1	0	
	ST	R1	s	
// 	=	i	0	
	LD	R1	0	
	ST	R1	i	
// L4	length	T6	a	
L4				
	LD	R1	a	
	CALL	ALEN		
	ST	R1	T6	
// 	<	T7	i	T6
	LD	R1	i	
	LD	R2	T6	
	CMP	R1	R2	
	JLT	CSET0		
	LDI	R1	1	
	JMP	CEXIT0		
CSET0	LDI	R1	0	
CEXIT0	ST	R1	T7	
// 	if0	T7	L5	
	CMP	R0	T7	
	JEQ	L5		
// 	[]	T8	a	i
	LD	R1	a	
	LD	R2	i	
	CALL	AGET		
	ST	R1	T8	
// 	+	T9	s	T8
	LD	R1	s	
	LD	R2	T8	
	ADD	R3	R1	R2
	ST	R3	T9	
// 	=	s	T9	
	LD	R1	T9	
	ST	R1	s	
// 	goto	L4		
	JMP	L4		
// L5				
L5				
// 	return	s		
	LD	R1	s	
	RET			
// 	endf			
// 	array	T10		
	LD	R1	T10	
	CALL	ARRAY		
// 	apush	T10	1	
	LD	R1	T10	
	LD	R2	1	
	CALL	APUSH		
// 	apush	T10	3	
	LD	R1	T10	
	LD	R2	3	
	CALL	APUSH		
// 	apush	T10	7	
	LD	R1	T10	
	LD	R2	7	
	CALL	APUSH		
// 	apush	T10	2	
	LD	R1	T10	
	LD	R2	2	
	CALL	APUSH		
// 	apush	T10	6	
	LD	R1	T10	
	LD	R2	6	
	CALL	APUSH		
// 	=	a	T10	
	LD	R1	T10	
	ST	R1	a	
// 	arg	a		
	LD	R1	a	
	PUSH	R1		
// 	call	T11	total	
	CALL	total		
	ST	R1	T11	
// 	=	t	T11	
	LD	R1	T11	
	ST	R1	t	
// 	table	T12		
	LD	R1	T12	
	CALL	TABLE		
// 	map	T12	e	"dog"
	LD	R1	T12	
	LD	R2	e	
	LD	R3	"dog"	
	CALL	TMAP		
// 	map	T12	c	"狗"
	LD	R1	T12	
	LD	R2	c	
	LD	R3	"狗"	
	CALL	TMAP		
// 	=	word	T12	
	LD	R1	T12	
	ST	R1	word	
```

### 結語

截至目前為止，我們已經為開放電腦計畫實作了一組簡單的工具鏈，包含用 node.js + javascript 設計的 j0c 編譯器、ir2as0 中間碼轉換器、 as0 組譯器、vm0 虛擬機、以及用 Verilog 設計的 CPU0, MCU0 處理器等等。

這套工具鏈的設計都是以「簡單易懂」為原則，採用 Keep It Simple and Stupid (KISS) 的原則，希望能透過這樣的方式，揭露電腦的各個設計層面，讓讀者可以透過開放電腦計畫理解電腦從軟體到硬體的設計原理。

不過、我們還沒有完成整個計畫，開放電腦計畫顯然還有些缺憾，像是我們還沒有設計作業系統 (OS)，也沒有用 Verilog 設計開放電腦的週邊裝置電路，另外在 FPGA 實際燒錄也只有很簡單的範例程式，還沒辦法形成一套從軟體到硬體串接的很完整的系統。

因此、我們打算在 2014 年暑假在成大與蘇文鈺老師一起舉辦一個「開放FPGA電腦創世紀黑客松」，我們已經為這個活動建立了一個 facebook 社團，歡迎對「開放電腦計畫」或 FPGA 有興趣的朋友們，一起來參與這個活動，以下是該社團的網址：

* <https://www.facebook.com/groups/OpenFPGAComputerPhone/>

歡迎大家一同來參加！

