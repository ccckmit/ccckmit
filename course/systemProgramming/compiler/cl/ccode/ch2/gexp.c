#include "rlib.c"

// === BNF Grammar =====
// E = T [+-*/] E | T
// T = [0-9] | (E)

int main(int argc, char * argv[]) {
	int i;
	for (i=0; i<10; i++) {
		E();
		printf("\n");
	}
}

int E() {
	if (randInt(10) < 5) {
		T(); printf("%c", randChar("+-*/")); E();
	} else {
		T();
	}
}

int T() {
	if (randInt(10) < 7) {
		printf("%c", randChar("0123456789"));
	} else {
		printf("("); E(); printf(")");
	}
}
