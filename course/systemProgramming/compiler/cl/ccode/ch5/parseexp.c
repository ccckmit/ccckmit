#include "parselib.c"
// === BNF Grammar =====
// E = T [+-*/] E | T
// T = [0-9]+ | (E)
int main(int argc, char * argv[]) {
	init("3*(5+8)");
	E();
}

int E() { 
	printf("<E>"); 
	T(); 
	if (cmember(ch, "[+-*/]")) {
		cnext();
		E();
	}
	printf("</E>");
}

int T() {
	if (cmember(ch, "(")) {
	    printf("<T>");
		cnext();
		E();
		cnext();
	    printf("</T>");
	} else {
		scan("%[0-9]");
		printf("T(%s)", token);
	}
}
