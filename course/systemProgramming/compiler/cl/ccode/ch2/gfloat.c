#include "rlib.c"
// === BNF Grammar =====
// F = [0-9] F | [0-9] H | [0-9]
// H = . T
// T = [0-9] T | [0-9] 
int main(int argc, char * argv[]) {
	int i;
	for (i=0; i<10; i++) {
		F();
		printf("\n");
	}
}

int F() {
	printf("%c", randChar("0123456789")); 
	if (randInt(10) < 7)
		F();
	else if (randInt(10) < 8)
		H();
}

int H() { printf("."); T(); }

int T() { 
	printf("%c", randChar("0123456789")); 
	if (randInt(10) < 7)
		T();
}
