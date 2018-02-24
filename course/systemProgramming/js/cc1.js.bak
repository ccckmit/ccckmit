var fs = require("fs");
require("./ccc");
var cpu = require("./cpu1");
var Memory = require("./memory");
var cpu1 = new cpu();
var R = cpu1.R;

var bits = function(word, from, to) { return word << (31-to) >>> (31-to+from); } // 取得 from 到 to 之間的位元
var signbits = function(word, from, to) { return word << (31-to) >> (31-to+from); } // 取得 from 到 to 之間的位元
var ID = function(op) { 
//  printf("op=%s\n", op);
  return cpu1.opTable[op].id; 
}

var vm = function() {
  this.memory = new Memory(1);

  this.run = function(objFile) {
    m = this.memory;
    m.load(objFile);
    IR = 16;
    PC = 15;
    LR = 14;
    SP = 13;
    SW = 12;
    stop = false;
    printf("run\n");
    while (!stop) {                                          // 如果尚未結束
      tpc = R[PC];
      R[0] = 0;                                              // R[0] 永遠為 0
      R[IR] = m.geti(R[PC]);                                 // 指令擷取，IR=[PC..PC+3]
      R[PC] += 4;                                            // 擷取完將 PC 加 4，指向下一個指令
      op = bits(R[IR], 24, 31);                                 // 取得 op 欄位，IR[24..31]
      ra = bits(R[IR], 20, 23);                                 // 取得 ra 欄位，IR[20..23]
      rb = bits(R[IR], 16, 19);                                 // 取得 rb 欄位，IR[16..19]
      c16= signbits(R[IR], 0,  15);                             // 取得 16 位元的 cx
      c5 = bits(R[IR], 0,   4);
      addr = R[rb]+c16;
//      printf("IR=%s op=%s ra=%s rb=%s c16=%s N=%d Z=%d\n", hex(R[IR],8), hex(op,2), hex(ra,1), hex(rb,1), hex(c16,4), N, Z);
//      printf("addr=%s\n", hex(R[rb]+c16, 4));

      switch (op) {                                            // 根據op執行動作
        case ID("LD") : R[ra] = m.geti(addr); break;        // 處理 LD 指令
        case ID("ST") : m.seti(addr, R[ra]); printf("m[%s]=%s\n", hex(addr,4), m.geti(addr)); break;       // 處理 ST 指令
        case ID("LDB"): R[ra] = m.getb(addr); break;         // 處理 LDB 指令
        case ID("STB"): m.setb(addr, R[ra]); break;        // 處理 STB 指令
        case ID("ADDI"):R[ra] = R[rb] + c16; break;         // 處理 ADDI 指令
        case ID("ADD"): R[ra] += m.geti(addr); break;             // 處理ADD指令
        case ID("SUB"): R[ra] -= m.geti(addr); break;             // 處理SUB指令
        case ID("MUL"): R[ra] *= m.geti(addr); break;             // 處理MUL指令
        case ID("DIV"): R[ra] /= m.geti(addr); break;             // 處理DIV指令
        case ID("AND"): R[ra] &= m.geti(addr); break;             // 處理AND指令
        case ID("OR") : R[ra] |= m.geti(addr); ; break;             // 處理OR指令
        case ID("XOR"): R[ra] ^= m.geti(addr); ; break;             // 處理XOR指令
//      case ID("ROL"): R[ra] = ROL(R[rb],c5); break;             // 處理ROL指令
//      case ID("ROR"): R[ra] = ROR(R[rb],c5); break;             // 處理ROR指令
        case ID("SHL"): R[ra] = R[rb]<<c5; break;             // 處理SHL指令
        case ID("SHR"): R[ra] = R[rb]>>c5; break;             // 處理SHR指令
        case ID("JZ") : if (R[ra]==0) R[PC] = R[rb]+c16; break;         // 處理JZ指令
        case ID("PUSH"):R[SP]-=4; R[ra]=m.geti(addr); m.seti(R[SP], R[ra]); break;   // 處理PUSH指令
        case ID("POP"): R[ra] = m.geti(R[SP]); R[SP]+=4; break;    // 處理POP指令
        case ID("PUSHB"):R[SP]--; R[ra]=m.getb(addr); m.setb(R[SP], R[ra]); break;    // 處理PUSH指令
        case ID("POPB"):R[ra] = m.getb(R[SP]); R[SP]++; break;      // 處理POPB指令
        case ID("RET"): stop=true; R[PC]=R[LR]; break;   // 處理RET指令
//        default: printf("Error:invalid op (%s)\n", hex(op));
      } // switch
      printf("PC=%s IR=%s SW=%s R[%s]=0x%s=%d\n", // 印出 PC, IR, R[ra]暫存器的值，以利觀察
             hex(tpc,4), hex(R[IR],8), hex(R[SW],8), hex(ra,2), hex(R[ra], 8), R[ra]);
    } // while
  }
}

// #define ROR(i, k) (((UINT32)i>>k)|(bits(i,32-k, 31)<<(32-k)))// 向右旋轉k位元
// #define ROL(i, k) (((UINT32)i<<k)|(bits(i,0,k-1)<<(32-k)))   // 向左旋轉k位元
var v = new vm();
v.run(process.argv[2]);

module.exports = vm;