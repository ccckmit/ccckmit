# 簡易組繹程式 (JavaScript)

檔案： as1.js

```javascript
var c = console;

var dtable = {
  ""   :"000",
  "M"  :"001",
  "D"  :"010",
  "MD" :"011",
  "A"  :"100",
  "AM" :"101",
  "AD" :"110",
  "AMD":"111"
}

var jtable = {
  ""   :"000",
  "JGT":"001",
  "JEQ":"010",
  "JGE":"011",
  "JLT":"100",
  "JNE":"101",
  "JLE":"110",
  "JMP":"111"
}

var ctable = {
  "0"   :"0101010",
  "1"   :"0111111",
  "-1"  :"0111010",
  "D"   :"0001100",
  "A"   :"0110000", 
  "M"   :"1110000",
  "!D"  :"0001101",
  "!A"  :"0110001", 
  "!M"  :"1110001",
  "-D"  :"0001111",
  "-A"  :"0110011",
  "-M"  :"1110011",
  "D+1" :"0011111",
  "A+1" :"0110111",
  "M+1" :"1110111",
  "D-1" :"0001110",
  "A-1" :"0110010",
  "M-1" :"1110010",
  "D+A" :"0000010",
  "D+M" :"1000010",
  "D-A" :"0010011",
  "D-M" :"1010011",
  "A-D" :"0000111",
  "M-D" :"1000111",
  "D&A" :"0000000",
  "D&M" :"1000000",
  "D|A" :"0010101",
  "D|M" :"1010101"
}

function toCode(line) {
    var parts=line.split("=");
    var d = parts[0], comp = parts[1];
    c.log("d=", d, " comp=",  comp);
    var dcode = dtable[d];
    var ccode = ctable[comp];
    c.log("dcode=", dcode, " ccode=",  ccode);
    return "111"+ccode+dcode+"000";
}

var dcode = dtable['AMD'];
c.log("dcode:", dcode, " bin:", dcode.toString(2));

var code = toCode("D=A");
c.log("code=", code);
```

執行

```
NQU-192-168-60-101:js csienqu$ node as1
dcode: 111  bin: 111
d= D  comp= A
dcode= 010  ccode= 0110000
code= 1110110000010000

```

