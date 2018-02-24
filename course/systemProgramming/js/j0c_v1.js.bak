var fs = require("fs");
var c = require("./ccc");

var isDump = process.argv[3] == "-d";

var tokens = [];
var tokenIdx = 0;
var end = "$END";

var funcName = "main";
var funcStack = [ funcName ];
var symTable = {};
symTable[funcName] = { type:"function", name:"main", pcodes:[] };

var isDump = process.argv[3] == "-d";
var irText = "", asText="";

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
	  if (isDump)
		c.log("token="+token+" type="+type+" lines="+lines);
    }
    lines += token.split(/\n/).length-1;
  }
  tokens.push({ "token": end, "type":end, "lines":lines });
  return tokens;
}

var error=function(expect) {  
  var token = tokens[tokenIdx];
  c.log("Error: line=%d token (%s) do not match expect (%s)!", token.lines, token.token, expect); 
  c.log(new Error().stack);
  process.exit(1);
}

var skip=function(o) { if (isNext(o)) next(o); }

var next=function(o) {
  if (o==null || isNext(o)) {
//    printf("next : %j\n", tokens[tokenIdx]);
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
//    printf("next : %j\n", tokens[tokenIdx]);
    return tokens[tokenIdx++].token;
  }
  error(o);
}

var isNextType=function(pattern) {
  var type = tokens[tokenIdx].type;
  return (("|"+pattern+"|").indexOf("|"+type+"|")>=0);
}

var fix=function(s) {
  if (s == undefined) s = "";
  return c.fill(' ', s, 8);
}

var genAs=function(label, op, p, p1, p2) {
  if (op == "LD" && p1.match(/\d+/)) op = "LDI";
  asText += c.format("%s %s %s %s %s", fix(label), fix(op), fix(p), fix(p1), fix(p2))+"\n";
//  c.log("%s %s %s %s %s", fix(label), fix(op), fix(p), fix(p1), fix(p2));
}

var pcode2as=function(label, op, p, p1, p2) {
  var asmOp = null;
  switch (op) {
	case "" : 
	  genAs(label, "", "", "", ""); 
	  break;
    case "call": 
	  genAs("", "CALL", p1, "", ""); 
	  genAs("", "ST", "R1", p, "");
	  break;
    case "arg": 
	  genAs("", "LD", "R1", p, ""); 
	  genAs("", "PUSH", "R1", "", ""); 
	  break;
    case "function": 
	  genAs(label, "", "", "", ""); 
	  break;
	case "param": 
	  genAs("", "POP", p); 
	  break;
	case "=": 
  	  genAs("", "LD", "R1", p1, "");
	  genAs("", "ST", "R1", p, "");
	  break;
	case "+": case "-": case "*": case "/":
	  genAs("", "LD", "R1", p1, "");
	  genAs("", "LD", "R2", p2, "");
	  switch (op) {
	    case "+": genAs("", "ADD", "R3", "R1", "R2"); break;
	    case "-": genAs("", "SUB", "R3", "R1", "R2"); break;
	    case "*": genAs("", "MUL", "R3", "R1", "R2"); break;
	    case "/": genAs("", "DIV", "R3", "R1", "R2"); break;
	  }
	  genAs("", "ST", "R3", p);
	  break;
	case "<=": case ">=": case "<": case ">": case "==": case "!=":
	  genAs("", "LD", "R1", p1, "");
	  genAs("", "LD", "R2", p2, "");
	  genAs("", "LDI","R3", "0", "");
	  genAs("", "CMP","R1", "R2", "");
	  var elseLabel = nextElse();
	  switch (op) {
	    case "<=": genAs("", "JLE", elseLabel, "", ""); break;
	    case ">=": genAs("", "JGE", elseLabel, "", ""); break;
	    case "<" : genAs("", "JLT", elseLabel, "", "");  break;
	    case ">" : genAs("", "JGT", elseLabel, "", "");  break;
	    case "==": genAs("", "JEQ", elseLabel, "", "");  break;
	    case "!=": genAs("", "JNE", elseLabel, "", "");  break;
	  }
	  genAs("", "LDI","R3", "1");
	  genAs(elseLabel, "", "", "");
	  genAs("", "ST", "R3", p);
	  break;
	case "if0":
	  genAs("", "LDI", "R1", p, "");
	  genAs("", "CMP", "R1", "0", "");
	  genAs("", "JEQ", p1, "", "");
	  break;
	case "goto":
	  genAs("", "JMP", p, "", "");
	  break;
	case "return": 
	  genAs("", "LD", "R1", p, "");	
	  genAs("", "RET", "", "", "");	
	  break;
	case "++": case "--": 
	  genAs("", "LD", "R1", p, "");
	  switch (op) {
	    case "++": genAs("", "ADDI", "R1", "R1", "1"); break;
	    case "--": genAs("", "ADDI", "R1", "R1", "-1"); break;
	  }
	  genAs("", "ST", "R1", p, "");
	  break;
  }
}

var pcode=function(label, op, p, p1, p2) {
  symTable[funcName].pcodes.push({"label":label, "op":op, "p":p, "p1":p1, "p2":p2});
//  c.log("%s %s %s %s %s", fix(label), fix(op), fix(p), fix(p1), fix(p2));
  var irCode = c.format("%s %s %s %s %s", fix(label), fix(op), fix(p), fix(p1), fix(p2))
  c.log(irCode);
  irText += irCode+"\n";
  pcode2as(label, op, p, p1, p2);
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
  if (isDump)
	c.log("text=%s", text);
  scan(text);
  if (isDump)
	c.log("tokens=%j", tokens);
  PROG();
}

// PROG = STMTS
var PROG=function() {
  STMTS();
}

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
c.log("================= AS0 ======================================");
c.log(asText);
for (var name in symTable) {
  var sym = symTable[name];
  if (sym.type == "var")
    pcode(sym.name, "WORD", "0", "", "");
}
