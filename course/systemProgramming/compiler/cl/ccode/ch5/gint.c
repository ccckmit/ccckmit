#include "rlib.c"
// === BNF Grammar =====
// N = [0-9] N | [0-9]
int main(int argc, char * argv[]) {
	int i;
	for (i=0; i<10; i++) {
		N();
		printf("\n");
	}
}

int N() {
	printf("%c", randChar("0123456789")); 
	if (randInt(10) < 8)
		N();
}
