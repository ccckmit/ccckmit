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

char *d[] = {"一隻", "那隻", "這隻"};
int D() { printf("%s ", randStr(d, 3)); }

char *n[] = {"狗", "骨頭", "貓"};
int N() { printf("%s ", randStr(n, 3)); }

char *v[] = {"追", "吃"};
int V() { printf("%s ", randStr(v, 2)); }
