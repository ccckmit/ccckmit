#include <stdio.h>

int main(int argc, char * argv[]) {
    printf("=== EBNF Grammar =====\n");
    printf("E=T [+-] T\n");
    printf("T=N\n");
	E();
    printf("\n");
}

int E() {
    T();
    printf("+");
	T();
}

int T() {
    printf("3");
}
