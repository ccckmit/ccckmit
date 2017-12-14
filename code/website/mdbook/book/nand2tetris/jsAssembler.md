# 完整組譯器程式 (JavaScript)

專案： <https://github.com/ccckmit/nand2tetris_projects/tree/master/06>

檔案： ash.js
```javascript
var fs = require("fs");
var c  = console;
var file = process.argv[2];

var dtable = {
  ""   :0b000,
  "M"  :0b001,
  "D"  :0b010,
  "MD" :0b011,
  "A"  :0b100,
  "AM" :0b101,
  "AD" :0b110,
  "AMD":0b111
}

var jtable = {
  ""   :0b000,
  "JGT":0b001,
  "JEQ":0b010,
  "JGE":0b011,
  "JLT":0b100,
  "JNE":0b101,
  "JLE":0b110,
  "JMP":0b111
}

var ctable = {
  "0"   :0b0101010,
  "1"   :0b0111111,
  "-1"  :0b0111010,
  "D"   :0b0001100,
  "A"   :0b0110000, 
  "M"   :0b1110000,
  "!D"  :0b0001101,
  "!A"  :0b0110001, 
  "!M"  :0b1110001,
  "-D"  :0b0001111,
  "-A"  :0b0110011,
  "-M"  :0b1110011,
  "D+1" :0b0011111,
  "A+1" :0b0110111,
  "M+1" :0b1110111,
  "D-1" :0b0001110,
  "A-1" :0b0110010,
  "M-1" :0b1110010,
  "D+A" :0b0000010,
  "D+M" :0b1000010,
  "D-A" :0b0010011,
  "D-M" :0b1010011,
  "A-D" :0b0000111,
  "M-D" :0b1000111,
  "D&A" :0b0000000,
  "D&M" :0b1000000,
  "D|A" :0b0010101,
  "D|M" :0b1010101
}

var symTable = {
  "R0"  :0,
  "R1"  :1,
  "R2"  :2,
  "R3"  :3,
  "R4"  :4,
  "R5"  :5,
  "R6"  :6,
  "R7"  :7,
  "R8"  :8,
  "R9"  :9,
  "R10" :10,
  "R11" :11,
  "R12" :12,
  "R13" :13,
  "R14" :14,
  "R15" :15,
  "SP"  :0,
  "LCL" :1,
  "ARG" :2,
  "THIS":3, 
  "THAT":4,
  "KBD" :24576,
  "SCREEN":16384
};

var symTop = 16;

function addSymbol(symbol) {
  symTable[symbol] = symTop;
  return symTop ++;
}

assemble(file+'.asm', file+'.hack');

function assemble(asmFile, objFile) {
  var asmText = fs.readFileSync(asmFile, "utf8"); // 讀取檔案到 text 字串中
  var lines   = asmText.split(/\r?\n/); // 將組合語言分割成一行一行
  c.log(JSON.stringify(lines, null, 2));
  pass1(lines);
  pass2(lines, objFile);
} 

function parse(line, i) {
  line.match(/^([^\/]*)(\/.*)?$/);
  line = RegExp.$1.trim();
  if (line.length===0)
    return null;
  if (line.startsWith("@")) {
    return { type:"A", arg:line.substring(1).trim() }
  } else if (line.match(/^\(([^\)]+)\)$/)) {
    return { type:"S", symbol:RegExp.$1 }
  } else if (line.match(/^((([AMD]*)=)?([AMD01\+\-\&\|\!]*))(;(\w*))?$/)) {
    return { type:"C", c:RegExp.$4, d:RegExp.$3, j:RegExp.$6 }
  } else {
    throw "Error: line "+(i+1);
  }
}

function pass1(lines) {
  c.log("============== pass1 ================");
  var address = 0;
  for (var i=0; i<lines.length; i++) {
    var p = parse(lines[i], i);
    if (p===null) continue;
    if (p.type === "S") {
      c.log(" symbol: %s %s", p.symbol, intToStr(address, 4, 10));
      symTable[p.symbol] = address;
      continue;
    } else {
      c.log(" p: %j", p);
    }
    c.log("%s:%s %s", intToStr(i+1, 3, 10), intToStr(address, 4, 10),  lines[i]);
    address++;
  }
}

function pass2(lines, objFile) {
  c.log("============== pass2 ================");
  var ws = fs.createWriteStream(objFile);
  ws.once('open', function(fd) {
    var address = 0;
    for (var i=0; i<lines.length; i++) {
      var p = parse(lines[i], i);
      if (p===null || p.type === "S") continue;
      var code = toCode(p);
      c.log("%s:%s %s", intToStr(i+1, 3, 10), intToStr(code, 16, 2),  lines[i]);
      ws.write(intToStr(code, 16, 2)+"\n");
      address++;
    }
    ws.end();
  });
}

function intToStr(num, size, radix) {
//  c.log(" num="+num);
  var s = num.toString(radix)+"";
  while (s.length < size) s = "0" + s;
  return s;
}

function toCode(p) {
  var address; 
  if (p.type === "A") {
    if (p.arg.match(/^\d+$/)) {
      address = parseInt(p.arg);
    } else {
      address = symTable[p.arg]; 
      if (typeof address === 'undefined') {      
        address = addSymbol(p.arg);        
      }
    }
    return address; 
  } else { // if (p.type === "C")
    var d = dtable[p.d];
    var cx = ctable[p.c];
    var j = jtable[p.j];
    return 0b111<<13|cx<<6|d<<3|j;
  }
}
```

執行：

```
git clone https://github.com/ccckmit/nand2tetris_projects.git
cd nand2tetris_projects/
cd 06

NQU-192-168-60-101:06 csienqu$ node ash Max
[
  "// This file is part of www.nand2tetris.org",
  "// and the book \"The Elements of Computing Systems\"",
  "// by Nisan and Schocken, MIT Press.",
  "// File name: projects/06/max/Max.asm",
  "",
  "// Computes R2 = max(R0, R1)  (R0,R1,R2 refer to  RAM[0],RAM[1],RAM[2])",
  "",
  "   @R0",
  "   D=M              // D = first number",
  "   @R1",
  "   D=D-M            // D = first number - second number",
  "   @OUTPUT_FIRST",
  "   D;JGT            // if D>0 (first is greater) goto output_first",
  "   @R1",
  "   D=M              // D = second number",
  "   @OUTPUT_D",
  "   0;JMP            // goto output_d",
  "(OUTPUT_FIRST)",
  "   @R0             ",
  "   D=M              // D = first number",
  "(OUTPUT_D)",
  "   @R2",
  "   M=D              // M[2] = D (greatest number)",
  "(INFINITE_LOOP)",
  "   @INFINITE_LOOP",
  "   0;JMP            // infinite loop",
  ""
]
============== pass1 ================
 p: {"type":"A","arg":"R0"}
008:0000    @R0
 p: {"type":"C","c":"M","d":"D","j":""}
009:0001    D=M              // D = first number
 p: {"type":"A","arg":"R1"}
010:0002    @R1
 p: {"type":"C","c":"D-M","d":"D","j":""}
011:0003    D=D-M            // D = first number - second number
 p: {"type":"A","arg":"OUTPUT_FIRST"}
012:0004    @OUTPUT_FIRST
 p: {"type":"C","c":"D","d":"","j":"JGT"}
013:0005    D;JGT            // if D>0 (first is greater) goto output_first
 p: {"type":"A","arg":"R1"}
014:0006    @R1
 p: {"type":"C","c":"M","d":"D","j":""}
015:0007    D=M              // D = second number
 p: {"type":"A","arg":"OUTPUT_D"}
016:0008    @OUTPUT_D
 p: {"type":"C","c":"0","d":"","j":"JMP"}
017:0009    0;JMP            // goto output_d
 symbol: OUTPUT_FIRST 0010
 p: {"type":"A","arg":"R0"}
019:0010    @R0             
 p: {"type":"C","c":"M","d":"D","j":""}
020:0011    D=M              // D = first number
 symbol: OUTPUT_D 0012
 p: {"type":"A","arg":"R2"}
022:0012    @R2
 p: {"type":"C","c":"D","d":"M","j":""}
023:0013    M=D              // M[2] = D (greatest number)
 symbol: INFINITE_LOOP 0014
 p: {"type":"A","arg":"INFINITE_LOOP"}
025:0014    @INFINITE_LOOP
 p: {"type":"C","c":"0","d":"","j":"JMP"}
026:0015    0;JMP            // infinite loop
============== pass2 ================
008:0000000000000000    @R0
009:1111110000010000    D=M              // D = first number
010:0000000000000001    @R1
011:1111010011010000    D=D-M            // D = first number - second number
012:0000000000001010    @OUTPUT_FIRST
013:1110001100000001    D;JGT            // if D>0 (first is greater) goto output_first
014:0000000000000001    @R1
015:1111110000010000    D=M              // D = second number
016:0000000000001100    @OUTPUT_D
017:1110101010000111    0;JMP            // goto output_d
019:0000000000000000    @R0             
020:1111110000010000    D=M              // D = first number
022:0000000000000010    @R2
023:1110001100001000    M=D              // M[2] = D (greatest number)
025:0000000000001110    @INFINITE_LOOP
026:1110101010000111    0;JMP            // infinite loop

```


