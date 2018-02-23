#include <stdio.h>
// === EBNF Grammar =====
// E=T + T
// T=F * F
// T=3
int main(int argc, char * argv[]) {
    timeSeed();
    E();
    printf("\n");
}

int E() {
    T();
    printf("+");
	T();
}

int T() {
    F();
    printf("*");
	F();
}

int F() {
    printf("3");
}
