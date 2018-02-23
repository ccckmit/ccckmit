#include "rlib.c"

// === EBNF Grammar =====
// E=T ([+-] T)*
// T=F ([*/] F)?
// T=[0-9] | (E)

int main(int argc, char * argv[]) {
	E();
	int i;
	for (i=0; i<10; i++) {
		E();
		printf("\n");
	}
}

int E() {
    T();
	while (randInt(10) < 3) {
       printf("%c", randChar("+-"));
	   T();
	}
}

int T() {
    F();
	if (randInt(10) < 7) {
		printf("%c", randChar("*/"));
		F();
	}
}

int F() {
    if (randInt(10) < 8) {
		printf("%c", randChar("0123456789"));
	} else {
		printf("(");
		E();
		printf(")");
	}
}
