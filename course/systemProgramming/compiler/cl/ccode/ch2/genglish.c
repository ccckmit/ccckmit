#include "rlib.c"

// === BNF Grammar =====
// S = NP VP
// NP = D N
// VP = V NP

int main(int argc, char * argv[]) {
	int i;
	for (i=0; i<10; i++) {
		S();
		printf("\n");
	}
}

int S() { NP(); VP(); }

int NP() { D(); N(); }

int VP() { V(); NP(); }

char *d[] = {"a", "the"};
int D() { printf("%s ", randStr(d, 2)); }

char *n[] = {"dog", "bone", "cat"};
int N() { printf("%s ", randStr(n, 3)); }

char *v[] = {"chase", "eat"};
int V() { printf("%s ", randStr(v, 2)); }
