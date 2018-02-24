#include "mcu0m.h"

int run(UINT16 *m) {
  UINT16 PC=0, IR, A, SW, op, addr;
  while (1) {
    IR = m[PC];
    op = (IR&0xF000)>>12;
    addr = (IR&0x0FFF);
		printf("PC=%04x IR=%04x ", PC, IR);
		PC = PC + 1;
    switch (op) {
      case LD:
        A = m[addr];
        break;
      case ADD:
        A = A+m[addr];
        break;
      case JMP:
        PC = addr;
        break;
			case ST:
				m[addr] = A;
				break;
			case CMP:
				if (A < m[addr]) SW = 0x8000;
				else if (A == m[addr]) SW = 0x4000;
				else SW = 0x0000;
				break;
			case JEQ:
				if (SW & 0x4000) {
					PC = addr;
				}
				break;
			case RET:
			  return;
			default:
				printf("Error: %1x is not a op!", op);
				exit(1);
		}
		printf(" SW=%04x A=%04x=%4d\n", SW, A, A);
  }
}

#define MSIZE 4096

int main(int argc, char *argv[]) {
  if (argc != 2) { printf("vm0m <objFile>\n"); exit(1); }
	FILE *objFile = fopen(argv[1], "rb");
	UINT16 m[MSIZE];
	int len = fread(m, sizeof(UINT16), MSIZE, objFile);
  run(m);
}
