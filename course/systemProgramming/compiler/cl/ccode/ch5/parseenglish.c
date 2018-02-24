#include "parselib.c"
// === BNF Grammar =====
// S = NP VP
// NP = D N
// VP = V NP
int main(int argc, char * argv[]) {
	init("a dog eat a cat ");
	S();
}

int S() { printf("<S>"); NP(); VP(); printf("</S>"); }

int NP() { printf("<NP>"); D(); N(); printf("</NP>"); }

int VP() { printf("<VP>"); V(); NP(); printf("</VP>"); }

int D() { 
	next("%[a-z] ", "|the|a|");
	printf("D(%s)", token); 
	scan("%[ ]");
}

int N() { 
	next("%[a-z] ", "|dog|bone|cat|");  
	printf("N(%s)", token); 
	scan("%[ ]");
}

int V() { 
	next("%[a-z] ", "|chase|eat|"); 
	printf("V(%s)", token); 
	scan("%[ ]");
}
